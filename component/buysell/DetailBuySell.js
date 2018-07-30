/* @flow */

import React, { Component } from 'react';
import {
  View, Text, StyleSheet,TouchableOpacity, Image, Dimensions, Modal,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import Moment from 'moment';
import {format_number} from '../libs';

import checkLogin from '../api/checkLogin';
import loginServer from '../api/loginServer';
import getApi from '../api/getApi';
import global from '../global';
import styles from '../styles';
import closeIC from '../../src/icon/ic-white/ic-close.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import logoTop from '../../src/icon/ic-white/Logo-ngang.png';
const {width,height} = Dimensions.get('window');

export default class DetailBuySell extends Component {
  constructor(props){
    super(props);
    this.state = {
      zoom:false,
      isLogin:false,
      avatar:'',
      user_id:'',
      activeSlide:0,
      listData:{}
    }
    this.getData();
    checkLogin().then(e=>{
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        loginServer(e);
        this.setState({user_id:e.id,avatar:e.avatar,isLogin:true});
      }
    })
  }

  requestLogin(){
    if(this.state.isLogin===false){
      this.props.navigation.navigate('LoginScr',{backScr:'MainScr'});
    }
  }
  getData(){
    const { id_raovat } = this.props.navigation.state.params;
    //console.log(id_raovat);
    const url = `${global.url}${'raovat/get/'}${id_raovat}`;
    //console.log(url);
    getApi(url).then(arrData => {
      //console.log('arrData',arrData);
        this.setState({ listData: arrData.data[0] });
    })
    .catch(err => console.log(err));
  }
  get pagination () {
        const { listData, activeSlide } = this.state;
        return (
          listData._images!==undefined &&
            <Pagination
              dotsLength={listData._images.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'rgba(86, 86, 86, 0.2)',position:'absolute', width, bottom: 0, }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  //marginHorizontal: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }

  render() {
    const {
      container, headCatStyle, headContent, imgLogoTop, txtAddrOverCat,
      show, hide
    } = styles;
    const { navigate,goBack } = this.props.navigation;
    const { listData,activeSlide,zoom,isLogin,user_id } = this.state;
    //console.log('listData',listData);
    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Image source={logoTop} style={imgLogoTop} />
              <View></View>
          </View>
      </View>

      {listData.name!==undefined &&
        <View>
        <View>
            <Carousel
            activeSlideAlignment={'start'}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            data={listData._images}
            renderItem={({item,index}) =>(
              <TouchableOpacity onPress={()=>this.setState({zoom:true})} key={index}>
                  <Image source={{uri : item.url}} style={{width,height:width/2}} />
              </TouchableOpacity>
            )}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            />
            { this.pagination }
      </View>
      <View style={{padding:10,backgroundColor:'#fff'}}>
        <Text style={{fontSize:18,fontWeight:'bold',color:'#000',lineHeight:25}} numberOfLines={2}>{listData.name}</Text>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={{width:width-(width/3)}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#d0021b',lineHeight:23}} numberOfLines={1}>{format_number(listData.price)}đ</Text>
            <Text style={txtAddrOverCat} numberOfLines={1}>Ngày đăng: {Moment(listData.created_at).format('DD/MM/YYYY')}</Text>
          </View>
          <View style={{width:width/3}}>
            {listData._created_by !==null &&
              <View style={[user_id!==listData.created_by ? show : hide]}>
              <TouchableOpacity style={{backgroundColor:'#d0021b',padding:5,borderRadius:10,maxWidth:100,alignItems:'center'}}
              onPress={()=>{
                  this.requestLogin();
                  if(isLogin){
                    const port = user_id<listData.created_by ? `${user_id}_${listData.created_by}` : `${listData.created_by}_${user_id}`;
                    navigate('MessengerScr',{user_id,yf_id:listData.created_by,yf_avatar:`${global.url_media}${listData._created_by.avatar}`,name:listData._created_by.full_name,port_connect:port})
                  }
              }}>
              <Text style={{fontSize:16,color:'#fff',lineHeight:23}} numberOfLines={2}>Chat online</Text>
              </TouchableOpacity>
            </View>}
          </View>
        </View>
        

        <View>
          <Text style={{fontSize:16,color:'#333',lineHeight:25}}>
          {listData.content}
          </Text>
        </View>
      </View>

      </View>}

      <Modal onRequestClose={() => null} visible={zoom} transparent>
        <TouchableOpacity onPress={()=>this.setState({zoom:false})}
        style={{position:'absolute',padding:10,alignSelf:'flex-end',zIndex:9999}}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Image source={closeIC} style={{width:18,height:18}} />
        </TouchableOpacity>
        <ImageViewer imageUrls={listData._images} index={activeSlide}/>
      </Modal>
      </View>
    );
  }
}
