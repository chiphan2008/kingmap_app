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


export default class ListCheckin extends Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],
      isLogin:false,
      user_profile:{},
    }
    this.refresh();
  }
  refresh(){
    checkLogin().then(e=>{
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true});
        this.getData(e.id);
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
  
  getData(id){
    const url = `${global.url}${'user/list-checkin/'}${id}`;
    getApi(url)
    .then(arrData => {
      //console.log('arrData',arrData);
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }
  confirmDel(id){
    const {lang} = this.props.navigation.state.params;
    Alert.alert(lang.notify,lang.confirm_loc_del,[
      {text: lang.cancel, style: 'cancel'},
      {text: lang.confirm, onPress: () => this.delCheckin(id)},
    ],
   { cancelable: false } );
  }
  delCheckin(id){
    const url = `${global.url}${'user/delete-checkin/'}${id}`;
    getApi(url)
    .then((e)=>{
      this.refresh();
    })
    .catch(err => console.log(err));
  }
  render() {
    const { lang,curLoc } = this.props.navigation.state.params;
    const { navigate,goBack } = this.props.navigation;
    //console.log('curLoc',curLoc);
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
                    <Text style={titleCreate}>{`${'Check in'}`.toUpperCase()} </Text>
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
                   <TouchableOpacity style={{position:'absolute',top:5,right:5,zIndex:99}}
                   onPress={()=>this.confirmDel(item.id)}>
                   <Image source={closeIC} style={{width:20,height:20}} />
                   </TouchableOpacity>
                   <Image source={{uri:`${global.url_media}${item.avatar}`}} style={{width:width,minHeight:width/2,marginBottom:10}} />
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
                     <View></View>
                   </View>
               </View>
               <View style={{height:14}}></View>
             </View>
           )} />


      </View>

    );
  }
}
