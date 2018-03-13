/* @flow */

import React, { Component } from 'react';
import {ScrollView,Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity,AsyncStorage} from 'react-native';
const {height, width} = Dimensions.get('window');

import UpdateInfo from './UpdateInfo';
import Setting from './Setting';
import ListCheckin from './ListCheckin';
import LikeLocation from './LikeLocation';
import styles from '../../styles';
import global from '../../global';
import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import getLocationByIP from '../../api/getLocationByIP';
import checkLogin from '../../api/checkLogin';

import plusWhiteIC from '../../../src/icon/ic-white/ic-plus.png';
import userProfileIC from '../../../src/icon/ic-user-profile.png';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import infoIC from '../../../src/icon/ic-white/ic-analysis.png';
import locationIC from '../../../src/icon/ic-white/ic-marker.png';
import starIC from '../../../src/icon/ic-white/ic-star1.png';
import collectionIC from '../../../src/icon/ic-white/ic-collection.png';
import menuIC from '../../../src/icon/ic-white/ic-menu.png';
import settingIC from '../../../src/icon/ic-white/ic-setting.png';
import logoutIC from '../../../src/icon/ic-white/ic-logout.png';

export default class PersonalTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang : lang_vn,
      isLogin : false,
      curLoc:{},
      countEntry:{},
      user_profile:{},
      showUpdateInfo:false,
      showSetting:false,
      showCheckin:false,
      showLikeLoc:false,

    };
    this.getLoc();
    getLanguage().then((e) =>{
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
        }
    });
    this.reqLogin();
  }
  reqLogin(){
    checkLogin().then(e=>{
      //console.log('checkLogin',e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true});
        this.getUser(e.id);
      }
    });
  }
  getUser(id){
    getApi(`${global.url}${'user/get-static/'}${id}`)
    .then(arrData => {
        //console.log(arrData);
        this.setState({ countEntry: arrData.data });
    })
    .catch(err => console.log(err));
  }
  logoutUser(){
    getApi(`${global.url}${'logout'}`);
    AsyncStorage.removeItem('@MyAccount:key');
    this.props.navigation.navigate('MainScr');
  }

  getLoc(){
    navigator.geolocation.getCurrentPosition(
          (position) => {
            const latlng = `${position.coords.latitude}${','}${position.coords.longitude}`;
            this.setState({
              curLoc : {
                latitude:position.coords.latitude,
                longitude: position.coords.longitude,
                lat:position.coords.latitude,
                lng: position.coords.longitude,
                latitudeDelta:  0.008757,
                longitudeDelta: 0.010066,
                latlng:latlng,
              }
            });
           },
           (error) => {
            getLocationByIP().then((e) => {
                this.setState({
                  curLoc : {
                    latitude:e.latitude,
                    longitude: e.longitude,
                    lat:e.latitude,
                    lng: e.longitude,
                    latitudeDelta:  0.008757,
                    longitudeDelta: 0.010066,
                    latlng:`${e.latitude}${','}${e.longitude}`,
                  }
                });
            });
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    );
  }


  render() {
    console.log(this.state.lang);
    const {navigate} = this.props.navigation;
    //console.log("this.props.Hometab=",this.props);
    const {
      container, colorNext,btnPress,marTop,rowItem,headPerBG,infoPerBG,
      headStyle, imgLogoTop,imgSocial, imgInfo,wrapIcRight,headContent,
      inputSearch,show,hide,titleHead,colorWhite,borderItemPer,titlePer,
      wrapContent,borderItemInfoPer,imgIconPer,imgIconPerInfo,
      plusStyle,popover,overLayout,listOver,imgMargin,imgUp,imgUpInfo,imgUpShare
    } = styles;

    return (
      <View style={container}>

        <View style={headStyle}>
          <View style={headContent}>
          <View></View>
          <Image source={logoTop} style={imgLogoTop} />
          <View></View>
          </View>
          <View style={{height:11}}></View>
          <TextInput underlineColorAndroid='transparent'
          placeholder={this.state.lang.search} style={inputSearch}
          onSubmitEditing={() => { if (this.state.valSearch!==''){navigate('SearchScr',{keyword:this.state.valSearch,lat:this.state.curLoc.lat,lng:this.state.curLoc.lng,lang:this.state.lang})} }}
          onChangeText={(valSearch) => this.setState({valSearch})}
          value={this.state.valSearch} />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (this.state.valSearch!=='') {
              navigate('SearchScr',{keyword:this.state.valSearch,lat:this.state.curLoc.lat,lng:this.state.curLoc.lng,lang:this.state.lang});
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>
        </View>

        <View style={[wrapContent, this.state.isLogin ? hide : show]}>
          <Text style={{color:'#B8B9BD'}}>{this.state.lang.request_login}</Text>
          <TouchableOpacity onPress={()=>navigate('LoginScr',{backScr:''})} style={[btnPress,marTop]}>
          <Text style={colorNext}> {this.state.lang._login}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={this.state.isLogin ? show : hide}>
          <View style={headPerBG}>

            <View style={rowItem}>
              <Image source={{uri:`${global.url_media}/${this.state.user_profile.avatar}`}} style={{width:70,height:70,borderRadius:35,marginRight:15}} />
              <View>
                <Text style={titleHead}>{this.state.user_profile.full_name}</Text>
                <Text style={colorWhite}>{this.state.user_profile.email}</Text>
              </View>
            </View>

            <View>
                <View style={[rowItem,marTop]}>
                  <Image source={plusWhiteIC} style={imgIconPer} />
                  <TouchableOpacity style={marTop}
                  onPress={()=>navigate('ChooseCatScr',{lang:this.state.lang.lang})}>
                  <Text style={titlePer}>{`${'Tạo địa điểm'}`}</Text>
                  </TouchableOpacity>
                </View>
                <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem,marTop]}>
                <Image source={plusWhiteIC} style={imgIconPerInfo} />
                <TouchableOpacity>
                <Text style={titlePer}>{`${'Tạo khuyến mãi'}`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
            </View>


          <View style={[rowItem,marTop]}>
              <Image source={plusWhiteIC} style={imgIconPerInfo} />
              <TouchableOpacity>
              <Text style={titlePer}>{`${'Tạo quảng cáo'}`}</Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={infoPerBG}>
              <View style={[rowItem]}>
              <Text style={titlePer}>{`${'Thông tin'}`.toUpperCase()}</Text>
              </View>
              <View style={borderItemInfoPer}></View>

              <View>
                <View style={[rowItem,marTop]}>
                  <Image source={infoIC} style={imgIconPerInfo} />
                  <TouchableOpacity onPress={()=>this.setState({showUpdateInfo:true})}>
                  <Text style={titlePer}>{`${'Thông tin cá nhân'}`}</Text>
                  </TouchableOpacity>
                  <UpdateInfo
                  //navigation={this.props.navigation}
                  lang={this.state.lang.lang}
                  userId={this.state.user_profile.id}
                  labelTitle={`${'Thông tin cá nhân'}`}
                  visible={this.state.showUpdateInfo}
                  closeModal={()=>{this.setState({showUpdateInfo:false});this.reqLogin()}} />
                </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem,marTop]}>
                <Image source={locationIC} style={imgIconPerInfo} />
                <TouchableOpacity onPress={()=>this.setState({showCheckin:true})}>
                <Text style={titlePer}>{`${'Checkin '}(${this.state.countEntry.count_checkin})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
              <ListCheckin
              labelTitle={'Danh sách checkin'}
              visible={this.state.showCheckin}
              closeModal={()=>this.setState({showCheckin:false})}
              />
            </View>

            <View>
              <View style={[rowItem,marTop]}>
                <Image source={starIC} style={imgIconPerInfo} />
                <TouchableOpacity  onPress={()=>this.setState({showLikeLoc:true})}>
                <Text style={titlePer}>{`${'Địa điểm yêu thích '}(${this.state.countEntry.count_like})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
              <LikeLocation
              labelTitle={'Địa điểm yêu thích'}
              visible={this.state.showLikeLoc}
              closeModal={()=>this.setState({showLikeLoc:false})}
              />
            </View>

            <View>
              <View style={[rowItem,marTop]}>
                <Image source={collectionIC} style={imgIconPerInfo} />
                <TouchableOpacity>
                <Text style={titlePer}>{`${'Bộ sưu tập '}(${this.state.countEntry.count_collection})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem,marTop]}>
                <Image source={menuIC} style={imgIconPerInfo} />
                <TouchableOpacity>
                <Text style={titlePer}>{`${'Danh sách các địa điểm '}(${this.state.countEntry.count_location})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
            </View>

              <View style={[rowItem,marTop]}>
              <Text style={titlePer}>{`${'Hệ thống kingmap'}`.toUpperCase()}</Text>
              </View>
              <View style={borderItemInfoPer}></View>

              <View>
                <View style={[rowItem,marTop]}>
                  <Image source={settingIC} style={imgIconPerInfo} />
                  <TouchableOpacity onPress={()=>this.setState({showSetting:true})}>
                  <Text style={titlePer}>{`${'Cài đặt tài khoản'}`}</Text>
                  </TouchableOpacity>

                </View>
                <View style={borderItemInfoPer}></View>
              </View>

              <View>
                <View style={[rowItem,marTop]}>
                  <Image source={logoutIC} style={imgIconPerInfo} />
                  <TouchableOpacity onPress={()=>this.logoutUser()}>
                  <Text style={titlePer}>{`${'Thoát'}`}</Text>
                  </TouchableOpacity>
                </View>
                <View style={borderItemInfoPer}></View>
              </View>

          </View>

        </ScrollView>

        <Setting
        navigation={this.props.navigation}
        userId={this.state.user_profile.id}
        labelTitle={`${'Cài đặt tài khoản'}`}
        visible={this.state.showSetting}
        closeModal={()=>{this.setState({showSetting:false});this.reqLogin()}} />
      </View>
    );
  }
}
