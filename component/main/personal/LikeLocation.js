/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,
  Dimensions,ScrollView,Alert,DeviceEventEmitter,
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
    }
    checkLogin().then(e=>{
      //console.log('checkLogin',e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true});
        this.getData(e.id);
      }
    });
  }

  getData(id){
    const url = `${global.url}${'user/list-like/'}${id}`;
    getApi(url)
    .then(arrData => {
      //console.log('arrData',arrData);
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }
  deleteLike(idContent){
    const url = `${global.url}${'user/delete-like/'}${idContent}`;
    console.log('url',url);
    getApi(url).then(e => console.log(e)).catch(err => console.log(err));
    this.getData(this.state.user_profile.id);
  }
  confirmDel(id){
    const {lang} = this.props;
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

        <ScrollView style={container}>
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
          {this.state.listData.length > 0 ?
            this.state.listData.map((e)=>(
              <View key={e.id}>
                <View style={{backgroundColor:'#fff'}}>
                  <TouchableOpacity onPress={()=>{
                    //this.props.closeModal()
                    navigate('DetailScr',{idContent:e.id,lat:e.lat,lng:e.lng,curLoc,lang})
                  }}>
                    <Image source={{uri:`${global.url_media}${e.avatar}`}} style={{width:width,minHeight:width/2,marginBottom:10}} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{position:'absolute',top:7,right:7}}
                    onPress={()=>this.confirmDel(e.id)}>
                    <Image source={closeIC} style={{width:20,height:20}} />
                    </TouchableOpacity>

                    <View style={listCreate}>
                      <View style={{width:width-80}}>
                        <TouchableOpacity onPress={()=>{
                          //this.props.closeModal()
                          navigate('DetailScr',{idContent:e.id,lat:e.lat,lng:e.lng,curLoc,lang})
                        }}>
                          <Text numberOfLines={1} style={txtTitleOverCat}>{e.name}</Text>
                        </TouchableOpacity>
                          <Text numberOfLines={1} style={{color:'#6587A8',lineHeight:24}}>{`${e.address}, ${e._district.name}, ${e._city.name}, ${e._country.name}`}</Text>
                      </View>

                    </View>
                </View>
                <View style={{height:14}}></View>
              </View>
            ))
            :
            <View></View>
          }

      </ScrollView>

    );
  }
}
