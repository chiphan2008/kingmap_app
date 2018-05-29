/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,
  Dimensions,Alert,DeviceEventEmitter,
  FlatList
} from 'react-native';

import getApi from '../../api/getApi';
import checkLogin from '../../api/checkLogin';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import moreIC from '../../../src/icon/ic-create/ic-more.png';
import closeIC from '../../../src/icon/ic-create/ic-close.png';

const {width,height} = Dimensions.get('window');


export default class LikeLocation extends Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],
      isLogin:false,
      user_profile:{},
      loading:true,
    }
    checkLogin().then(e=>{
      //console.log('checkLogin',e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true},()=>{
          this.getData();
        });

      }
    });
  }

  renderFooter = () => {
    if (!this.state.isLoad) return null;
    return (
    this.state.isLoad &&
    <View style={{alignItems:'center'}}>
      <ActivityIndicator color="#d0021b" size="large" />
    </View>)
  }

  getData(page=null){
    this.setState({loading:false});
    let url = `${global.url}${'user/list-like/'}${this.state.user_profile.id}`;
    if(page!==null) url +=`${'?skip='}${page}${'&limit=20'}`
    //console.log(url);
    getApi(url).then(arrData => {
        this.state.listData=page!==null?this.state.listData.concat(arrData.data):arrData.data;
        this.state.loading=arrData.data.length<20?false:true;
        this.setState(this.state);
    })
    .catch(err => console.log(err));
  }

  deleteLike(idContent){
    const url = `${global.url}${'user/delete-like/'}${idContent}`;
    //console.log('url',url);
    getApi(url).then(e => console.log(e)).catch(err => console.log(err));
    this.getData();
  }
  confirmDel(id){
    const {lang} = this.props.navigation.state.params;
    Alert.alert(lang.notify,lang.confirm_like_del,[
      {text: lang.cancel, style: 'cancel'},
      {text: lang.confirm, onPress: () => this.deleteLike(id)},
    ],
   { cancelable: false } )
  }
  render() {
    const { lang,curLoc } = this.props.navigation.state.params;
    const { goBack,navigate } = this.props.navigation;
    //console.log('lang',lang);
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,show,hide,
      imgInfo,wrapInputCreImg,marTop,colorTitle,txt,txtTitleOverCat
    } = styles;
    return (

        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    DeviceEventEmitter.emit('goback',  {isLogin:true})
                    goBack();
                  }}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{lang.like_location.toUpperCase()} </Text>
                  <View></View>
              </View>
          </View>

          <FlatList
           extraData={this.state}
           data={this.state.listData}
           keyExtractor={(item,index) => index.toString()}
           renderItem={({item,index}) =>(
             <View>
               <View style={{backgroundColor:'#fff'}}>
                 <TouchableOpacity onPress={()=>{
                   navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang})
                 }}>
                   <Image source={{uri:`${global.url_media}${item.avatar}`}} style={{width:width,minHeight:width/2,marginBottom:10}} />
                 </TouchableOpacity>
                 <TouchableOpacity style={{position:'absolute',top:7,right:7}}
                   onPress={()=>this.confirmDel(item.id)}>
                   <Image source={closeIC} style={{width:20,height:20}} />
                   </TouchableOpacity>

                   <View style={listCreate}>
                     <View style={{width:width-80}}>
                       <TouchableOpacity onPress={()=>{
                         navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang})
                       }}>
                         <Text numberOfLines={1} style={txtTitleOverCat}>{item.name}</Text>
                       </TouchableOpacity>
                         <Text numberOfLines={1} style={{color:'#6587A8',lineHeight:24}}>{`${item.address}, ${item._district.name}, ${item._city.name}, ${item._country.name}`}</Text>
                     </View>

                   </View>
               </View>
               <View style={{height:14}}></View>
             </View>
           )} />
      </View>

    );
  }
}
