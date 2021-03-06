/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,
  Dimensions,FlatList,Alert,
} from 'react-native';
import {connect} from 'react-redux';

import getApi from '../../api/getApi';
import checkLogin from '../../api/checkLogin';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import moreIC from '../../../src/icon/ic-create/ic-more.png';
import favoriteIC from '../../../src/icon/ic-favorite.png';
import favoriteFullIC from '../../../src/icon/ic-favorite-full.png';
import closeIC from '../../../src/icon/ic-create/ic-close.png';
import closingIC from '../../../src/icon/ic-closing.png';
import openingIC from '../../../src/icon/ic-opening.png';
import requestIC from '../../../src/icon/ic-request.png';
import {getIndexById} from '../../libs';
const {width,height} = Dimensions.get('window');


class ListLocPer extends Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],
      isLogin:false,
      user_profile:{},
      showOption:false,
      id_content:'',
      idCat:'',
      nameCat:'',
      moderation:'',
      loading:true,
      isLoad:false,
      page:0,
      index:-1,
    }
    this.refresh();
  }
  refresh(){
    checkLogin().then(e=>{
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true},()=>{
          this.getData();
        });
      }
    });
  }
  componentDidUpdate(){
    const {detailBack} = this.props;
    const {user_profile} = this.state;
    if((detailBack==='UpdateLocation' || detailBack==='DetailScreen') && user_profile.id!==undefined){
      this.props.dispatch({type:'DETAIL_BACK',detailBack:''});
      //const skip = this.state.page>0?this.state.page-20:0;
      this.getData(this.state.page,this.state.index);
      //console.log('componentDidUpdate-UpdateLocation');
    }
  }
  renderFooter = () => {
    if (!this.state.isLoad) return null;
    return (
    this.state.isLoad &&
    <View style={{alignItems:'center'}}>
      <ActivityIndicator color="#d0021b" size="large" />
    </View>)
  }

  getData(page=null,index=null){
    let limit = 20;
    if(page===null) page=0;
    if(index!==null && index<page) {page=0;limit=index+1; }
    let url = `${global.url}${'user/list-location/'}${this.state.user_profile.id}${'?skip='}${page}${'&limit='}${limit}`;
    console.log(url);
    //let arr = this.state.listData;
    getApi(url).then(arrData => {
        if(index!==null){
          let oldId = this.state.listData[index].id;
          const newIndex = getIndexById(arrData.data,oldId);
          this.state.listData[index] = arrData.data[newIndex];
        }else {
          this.state.listData=page>0? this.state.listData.concat(arrData.data):arrData.data;
          this.state.page = page===0 ? 20 : page+20;
          this.state.loading = arrData.data.length<20?false:true;
        }
        this.state.index = -1;
        this.setState(this.state);
    })
    .catch(err => console.log(err));
  }
  deleteLocation(idContent,index){
    const url = `${global.url}${'user/delete-location/'}${idContent}`;
    //console.log('url',url);
    getApi(url).then(e => {
      if(e.code===200){
        //const skip = this.state.page>0?this.state.page-20:0;
        this.getData(this.state.page,index);
      }
    }).catch(err => console.log(err));
  }
  callPause(idContent,index){
    this.setState({showOption:false,index:-1});
    const url = `${global.url}${'user/close-location/'}${idContent}`;
    getApi(url).then(e => {
      if(e.code===200){
        //const skip = this.state.page>0?this.state.page-20:0;
        this.getData(this.state.page,index);
      }
    }).catch(err => console.log(err));

  }
  reOpen(idContent,index){
    this.setState({showOption:false,index:-1});
    const url = `${global.url}${'user/open-location/'}${idContent}`;
    getApi(url).then(e=>{
      if(e.code===200){
        //const skip = this.state.page>0?this.state.page-20:0;
        this.getData(this.state.page,index);
      }
    }).catch(err => console.log(err));
  }

  confirmDel(id,index){
    this.setState({showOption:false,index:-1});
    const {lang} = this.props.navigation.state.params;
    Alert.alert(lang.notify,lang.confirm_loc_del,[
      {text: lang.cancel, style: 'cancel'},
      {text: lang.confirm, onPress: () => this.deleteLocation(id,index)},
    ],
   { cancelable: false } );

  }
  render() {
    const { lang,curLoc } = this.props.navigation.state.params;
    const { goBack,navigate } = this.props.navigation;
    const { showOption,id_content,idCat,nameCat,moderation,loading,page,index } = this.state;
    //console.log('lang',lang);
    const {
      container,headCatStyle,headContent,titleCreate,
      listCreate,show,hide,txt,txtTitleOverCat,marTop10,marTop15,
      actionSheetWrap,actionSheetContent,actionSheetRadius,line,pad15,
      colorTxt
    } = styles;
    return (
      <View style={container}>

        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>{
                  this.props.dispatch({type:'STOP_START_UPDATE_STATE',updateState:true})
                  goBack();
                }}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                  <Text style={titleCreate}>{lang.list_location.toUpperCase()} </Text>
                <View></View>
            </View>
        </View>

        <FlatList
         extraData={this.state}
         data={this.state.listData}
         onEndReachedThreshold={0.5}
         onEndReached={() => {
           if(loading){
             this.setState({loading:false},()=>{
               this.getData(this.state.page);
             });
           }
         }}
         keyExtractor={(item,index) => index.toString()}
         renderItem={({item,index}) =>(
           <View >
             <View style={{height:8}}></View>
             <View style={{backgroundColor:'#fff'}}>
               <TouchableOpacity onPress={()=>{
                 this.setState({index},()=>{
                   navigate('DetailScr',{moderation:item.moderation,idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang,update:true})
                 })
               }}>
                 <Image source={{uri:`${global.url_media}${item.avatar}`}} style={{width:width,minHeight:200,marginBottom:10}} />
               </TouchableOpacity>

                 <View style={listCreate}>
                   <View style={{width:width-80}}>
                     <TouchableOpacity onPress={()=>{
                       //this.props.closeModal()
                       navigate('DetailScr',{moderation:item.moderation,idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang,update:true})
                     }}>
                       <Text numberOfLines={1} style={txtTitleOverCat}>{item.name}</Text>
                     </TouchableOpacity>
                       <Text numberOfLines={1} style={{color:'#6587A8',lineHeight:24}}>{`${item.address}, ${item._district.name}, ${item._city.name}, ${item._country.name}`}</Text>
                       {item.moderation==='request_publish' &&
                         <View style={{flexDirection:'row'}}>
                         <Image source={item.vote?favoriteFullIC:favoriteIC} style={{width:16,height:16,marginTop:4}} />
                         <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> ({item.vote}) | </Text>
                         <Image source={requestIC} style={{width:14,height:14,marginRight:3,marginTop:5}} />
                         <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> {`${lang.pending}`}</Text>
                         </View>

                       }
                       {item.moderation==='publish' &&
                         <View style={{flexDirection:'row'}}>
                         <Image source={item.vote?favoriteFullIC:favoriteIC} style={{width:16,height:16,marginTop:4}} />
                         <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> ({item.vote}) | </Text>
                         <Image source={openingIC} style={{width:14,height:14,marginRight:3,marginTop:5}} />
                         <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> {`${lang.opening}`}</Text>
                         </View>
                       }
                       {item.moderation==='un_publish' &&
                         <View style={{flexDirection:'row'}}>
                         <Image source={item.vote?favoriteFullIC:favoriteIC} style={{width:16,height:16,marginTop:4}} />
                         <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> ({item.vote}) | </Text>
                         <Image source={closingIC} style={{width:14,height:14,marginRight:3,marginTop:5}} />
                         <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> {`${lang.closing}`}</Text>
                         </View>
                       }
                   </View>
                   <TouchableOpacity onPress={()=>this.setState({
                     index,
                     showOption:true,
                     id_content:item.id,
                     idCat:item._category_type.id,
                     nameCat:item._category_type.name,
                     moderation:item.moderation})}
                     hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                     <Image source={moreIC} style={{width:20,height:20}} />
                     </TouchableOpacity>
                 </View>
             </View>
           </View>
         )} />

      {showOption && <View style={actionSheetWrap} >
        <View style={[actionSheetContent,actionSheetRadius]}>
          <TouchableOpacity style={pad15}
          onPress={()=>{this.setState({showOption:false},()=>{
            navigate('FormCreateScr',{idContent:id_content,idCat,nameCat,lang:lang.lang})
          })}}>
          <Text style={colorTxt}>{lang.edit}</Text>
          </TouchableOpacity>
          {moderation==='publish' &&
            <View>
            <View style={line}></View>
            <TouchableOpacity onPress={()=>this.callPause(id_content,index)} style={pad15}>
            <Text style={colorTxt}>{lang.pause}</Text>
            </TouchableOpacity>
            </View>

          }
          {moderation==='un_publish' &&
            <View>
            <View style={line}></View>
            <TouchableOpacity onPress={()=>this.reOpen(id_content,index)} style={pad15}>
            <Text style={colorTxt}>{lang.reopen}</Text>
            </TouchableOpacity>
            </View>
          }
          {/*<View style={line}></View>
          <TouchableOpacity onPress={()=>this.confirmDel(id_content,index)} style={pad15}>
          <Text style={colorTxt}>{lang.delete}</Text>
          </TouchableOpacity>*/}
        </View>
        <View style={[actionSheetContent,actionSheetRadius,marTop10]}>
          <TouchableOpacity onPress={()=>this.setState({showOption:false,index:-1})} style={pad15}>
          <Text style={colorTxt}>{lang.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>}
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    detailBack:state.detailBack,
  }
}

export default connect(mapStateToProps)(ListLocPer);
