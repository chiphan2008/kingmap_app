/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,Platform,
  Dimensions,ScrollView,Alert,FlatList,
  TextInput,DeviceEventEmitter,
} from 'react-native';

import getApi from '../../api/getApi';
import postApi from '../../api/postApi';
import checkLogin from '../../api/checkLogin';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import moreIC from '../../../src/icon/ic-create/ic-more.png';
import removeIC from '../../../src/icon/ic-create/ic-remove.png';
import editIC from '../../../src/icon/ic-create/ic-edit.png';
import editBlueIC from '../../../src/icon/ic-blue/ic-edit.png';
import saveBlueIC from '../../../src/icon/ic-blue/ic-save.png';
import doneIC from '../../../src/icon/ic-create/ic-done.png';
import closeIC from '../../../src/icon/ic-create/ic-close.png';
import * as _ from 'lodash';

const {width,height} = Dimensions.get('window');


export default class Collection extends Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],
      isLogin:false,
      showEdit:false,
      showPopup:{},
      showInput:{},
      user_profile:{},
      name_coll:'',
      isFocus:false,
      loading:true,
      page:0,
    }
    checkLogin().then(e=>{
      //console.log('checkLogin',e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true},()=>{
          //console.log('checkLogin');
          this.getData();
        });
      }
    });
  }

  getData(page=null){
    this.setState({loading:false});
    if(page===null) page=0;
    const url = `${global.url}${'collection/get/user/'}${this.state.user_profile.id}${'?skip='}${page}${'&limit=20'}`;
    //console.log(url);
    getApi(url).then(arrData => {
      this.state.listData = page!==null?this.state.listData.concat(arrData.data):arrData.data;
      this.state.loading = arrData.data.length<20?false:true;
      this.setState(this.state);
    }).catch(err => console.log(err));
  }
  delCollection(idCollection){
    const arr = new FormData();
    const {listData} = this.state;
    arr.append('collection_id',idCollection);
    arr.append('user_id',this.state.user_profile.id);
    const url = `${global.url}${'collection/delete'}`;

    postApi(url,arr).then(e => {
      if(e.code===200) {
        _.remove(listData, function(item) {
          return item.id === idCollection;
        });
        this.setState({listData: listData})
        // this.getData();
      }
    }).catch(err => console.log(err));

  }

  editCollection(idCollection){
    //console.log();
    const arr = new FormData();
    arr.append('collection_id',idCollection);
    arr.append('name',this.state.name_coll);
    arr.append('user_id',this.state.user_profile.id);
    const url = `${global.url}${'collection/edit'}`;
    //console.log(arr);
    postApi(url,arr).then(e => {
      if(e.code===200){
        this.setState({name_coll:'',},()=>{
          this.getData();
        })
      }
    }).catch(err => console.log(err));

  }

  removeContentInCol(id_collection,id_content){
    const arr = new FormData();
    const {listData} = this.state;
    arr.append('collection_id',id_collection);
    arr.append('content_id',id_content);
    const url = `${global.url}${'collection/remove'}`;

    postApi(url,arr).then(e => {
      if(e.code===200) {
        _.forEach(listData, function(item) {
          if(item.id === id_collection){
            _.remove(item._contents, function(el) {
              return el.id === id_content
            })
          }
        });
        this.setState({listData: listData})
        // this.getData();
      }
    }).catch(err => console.log(err));

  }
  confirmDel(id,id_content=null,route){
    //console.log(id);
    const {lang} = this.props.navigation.state.params;
    if(route==='delete'){
      Alert.alert(lang.notify,lang.confirm_collection_del,[
        {text: lang.cancel, style: 'cancel'},
        {text: lang.confirm, onPress: () => this.delCollection(id)},
      ],
     { cancelable: false } )
    }
    if(route==='remove'){
      Alert.alert(lang.notify,lang.confirm_loc_col_del,[
        {text: lang.cancel, style: 'cancel'},
        {text: lang.confirm, onPress: () => this.removeContentInCol(id,id_content)},
      ],
     { cancelable: false } )
    }

  }
  render() {
    const { showPopup,showInput,showEdit,isFocus,name_coll } = this.state;
    const { lang,curLoc } = this.props.navigation.state.params;
    const { goBack,navigate } = this.props.navigation;
    console.log('this.state.listData',this.state.listData);
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,show,hide,popup,
      imgInfo,wrapInputCreImg,marTop,colorTitle,txt,txtTitleOverCat,
      closeCollection,
    } = styles;
    return (

        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    DeviceEventEmitter.emit('goback',  {isLogin:true})
                    goBack();
                  }} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{lang.collection.toUpperCase()} </Text>
                  <View></View>
              </View>
          </View>
          <FlatList
             extraData={this.state}
             keyExtractor={item => item.id.toString()}
             onEndReachedThreshold={0.5}
             onEndReached={() => {
               if(this.state.loading){
                 this.state.page +=20;
                 this.setState(this.state,()=>{
                   //console.log('onEndReached');
                   this.getData(this.state.page);
                 });
               }
             }}
             data={this.state.listData}
             renderItem={({item}) => (
               <View key={item.id}>
                 <View style={{backgroundColor:'#fff'}}>
                     <View style={listCreate}>
                       <View style={{width:width-105,flexDirection:'row',alignItems:'center'}}>
                            <View style={isFocus && showInput[item.id] ? show : hide}>
                              <TextInput underlineColorAndroid='transparent' autoFocus={isFocus}
                                onSubmitEditing={(event) => {}}
                                style={{padding:5,fontSize:18,maxWidth:width-(width/3)}} value={name_coll}
                                onChangeText={(name_coll) => this.setState({name_coll})}
                               />
                            </View>
                            <View style={showInput[item.id] ? hide : show}>
                            <Text numberOfLines={1} style={txtTitleOverCat}>{item.name} ({item._contents.length})</Text>
                            </View>
                           <TouchableOpacity style={{padding:5}} onPress={()=>{
                             if(isFocus){
                               this.editCollection(item.id);
                               this.setState({isFocus:false,showInput:Object.assign(showInput,{[item.id]:!item.id})});
                             }else {
                               this.setState({
                                 isFocus:true,name_coll:item.name,
                                 showInput:Object.assign(showInput,{[item.id]:item.id})})
                             }
                           }}>
                             <Image source={isFocus && showInput[item.id] ? saveBlueIC : editBlueIC} style={{width:15,height:15}} />
                           </TouchableOpacity>
                       </View>
                       <TouchableOpacity onPress={()=>{
                         if(showPopup[item.id]===item.id){
                            this.setState({showPopup: {[item.id]:!item.id} })
                         }else {
                            this.setState({showPopup: {[item.id]:item.id} })
                         }
                       }} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                       <Image source={moreIC} style={{width:20,height:20}} />
                       </TouchableOpacity>
                       <View style={[popup ,showPopup[item.id] ? show : hide]}>
                         <TouchableOpacity onPress={()=>{this.confirmDel(item.id,null,'delete');
                         this.setState({showPopup: {[item.id]:!item.id} }) }}>
                           <Image source={removeIC} style={{width:20,height:20}} />
                         </TouchableOpacity>

                         <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 5, right: 10}} onPress={()=>this.setState({showEdit:!showEdit,})}>
                           <Image source={showPopup[item.id] && showEdit===false ? editIC : doneIC} style={{width:20,height:20}} />
                         </TouchableOpacity>
                       </View>
                     </View>
                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                     {item._contents.length>0 && item._contents.map(el=>{
                       return (<View key={el.id.toString()} style={{marginRight:4,padding:10,width:(width)/2}}>

                         <TouchableOpacity onPress={()=>{
                           console.log(`${global.url_media}${el.avatar}`);
                             navigate('DetailScr',{idContent:el.id,lat:el.lat,lng:el.lng,curLoc,lang:lang.lang})
                         }}>
                         <Image source={{uri:`${global.url_media}${el.avatar}`}} style={{width:width/2,minHeight:width/3,marginBottom:10}} />
                         </TouchableOpacity>
                         <TouchableOpacity onPress={()=>{
                             navigate('DetailScr',{idContent:el.id,lat:el.lat,lng:el.lng,curLoc,lang:lang.lang})
                         }}>
                         <Text style={{color:'#2F353F',fontSize:16}} numberOfLines={2}>{el.name}</Text>
                         </TouchableOpacity>
                         {showPopup[item.id] && showEdit && 
                         <TouchableOpacity
                         onPress={()=>this.confirmDel(item.id,el.id,'remove')}
                         style={[closeCollection, {alignSelf: 'flex-end'}]}>
                         <Image source={closeIC} style={{width:18,height:18}} />
                         </TouchableOpacity>}
                       </View>)
                     })}
                     </ScrollView>

                 </View>
                 <View style={{height:14}}></View>
               </View>
             )}
          />

          </View>

    );
  }
}
