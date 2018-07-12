/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,Alert,
  TextInput,Dimensions,ScrollView,FlatList,
  DeviceEventEmitter
} from 'react-native';
import Moment from 'moment';
import {format_number,checkUrl} from '../libs';
import styles from '../styles';
import global from '../global';
import ImageViewer from '../main/detail/ImageViewer';

import postApi from '../api/postApi';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import logoTop from '../../src/icon/ic-white/Logo-ngang.png';
const {width,height} = Dimensions.get('window');

export default class CTVApprove extends Component {
  constructor(props){
    super(props);
    this.state={
      showImg:false,
      index:0,
    }
  }

  requestCTV(route,id){
    const { daily_id,lang,el } = this.props.navigation.state.params;
    const arr = new FormData();
    arr.append('daily_id',daily_id);
    arr.append('ctv_id[]',id)
    postApi(`${global.url}${'static/'}${route}${'-ctv'}${'?lang='}${lang.lang}`,arr).then(e => {
        if(e.code===200)
        Alert.alert(lang.notify,e.data,[
          {text: '', style: 'cancel'},
          {text: 'Ok', onPress: () => {
            const obj = route==='accept'?{isLogin:true,ctv:el}:{isLogin:true}
            DeviceEventEmitter.emit('gobackCTV',obj)
            this.props.navigation.goBack()
          }}
        ],{ cancelable: false })
    }).catch(err => console.log(err));
  }

  render() {
    const {
      wrapper,headCatStyle,headContent,titleCreate,
      imgLogoTop,colorlbl,wrapItems,titleCoin,colorTitle
    } = styles;
    const {goBack} = this.props.navigation;
    const {el,lang} = this.props.navigation.state.params;
    const {showImg,index} = this.state;
    return (
      <View style={wrapper}>
          <View style={headCatStyle}>
              <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Image source={logoTop} style={imgLogoTop} />
              <View></View>
              </View>
          </View>
          <ScrollView>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:15}}>
              <View style={{flexDirection:'row',paddingBottom:15}}>
                  <Image source={{uri:checkUrl(el.avatar) ? el.avatar : `${global.url_media}${el.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                  <View style={{width:width-90}}>
                    <Text numberOfLines={1} style={colorlbl}>{el.full_name}</Text>
                    <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${el.email}`}</Text>
                  </View>
              </View>
            </View>


             <View style={{height:5}}></View>

             <View style={wrapItems}>
               <View style={{width:width-30,flexDirection:'row',alignItems:'center'}}>
                 <Text numberOfLines={1} style={colorTitle}>{`${lang.birthday}`}: {`${Moment(el.birthday).format('DD/MM/YYYY')}`}</Text>
               </View>
             </View>

             <View style={wrapItems}>
               <View style={{width:width-30,flexDirection:'row',alignItems:'center'}}>
                 <Text numberOfLines={1} style={colorTitle}>{`${lang.address}`}: {el.address}</Text>
               </View>
             </View>

             <View style={wrapItems}>
               <View style={{width:width-30,flexDirection:'row',alignItems:'center'}}>
                 <Text numberOfLines={1} style={colorTitle}>{`${lang.phone}`}: {el.phone}</Text>
               </View>
             </View>

             <View style={wrapItems}>
               <View style={{width:width-30,flexDirection:'row',alignItems:'center'}}>
                 <Text numberOfLines={1} style={colorTitle}>{`${lang.cmnd}`}: {el.cmnd}</Text>
               </View>
             </View>

             <View style={{height:5}}></View>

             <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>this.setState({showImg:true,index:0})}>
               <Image source={{uri:checkUrl(el.cmnd_image_front) ? el.cmnd_image_front : `${global.url_media}${el.cmnd_image_front}`}}
               style={{width:(width-30)/2,height:width/3}} />
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>this.setState({showImg:true,index:1})}>
               <Image source={{uri:checkUrl(el.cmnd_image_back) ? el.cmnd_image_back : `${global.url_media}${el.cmnd_image_back}`}}
               style={{width:(width-30)/2,height:width/3}} />
               </TouchableOpacity>
             </View>

             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20}}>
                 <TouchableOpacity style={{alignItems:'center',padding:7,borderWidth:1,borderRadius:4,borderColor:'#d0021b',minWidth:width/3}}
                 onPress={()=>{this.requestCTV('decline',el.id)}}>
                   <Text style={{color:'#d0021b',fontSize:16}}>{`${lang.reject}`}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={{alignItems:'center',padding:7,borderRadius:4,backgroundColor:'#d0021b',marginLeft:10,minWidth:width/3}}
                 onPress={()=>{this.requestCTV('accept',el.id)}}>
                   <Text style={{color:'#fff',fontSize:16}}>{`${lang.accept}`}</Text>
                 </TouchableOpacity>
             </View>

             <ImageViewer
             visible={showImg}
             data={[
               {url:checkUrl(el.cmnd_image_front) ? el.cmnd_image_front : `${global.url_media}${el.cmnd_image_front}`},
               {url:checkUrl(el.cmnd_image_back) ? el.cmnd_image_back : `${global.url_media}${el.cmnd_image_back}`}
             ]}
             index={index}
             closeModal={()=>this.setState({showImg:false,index:0})}
             />
          </ScrollView>
        </View>
    );
  }
}
