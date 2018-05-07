/* @flow */

import React, { Component } from 'react';
import {
  ScrollView,Platform, View, Text,
  Dimensions, Image, TextInput, TouchableOpacity,
  AsyncStorage,DeviceEventEmitter} from 'react-native';
const {height, width} = Dimensions.get('window');

import UpdateInfo from './UpdateInfo';
import Setting from './Setting';
import ListCheckin from './ListCheckin';
import LikeLocation from './LikeLocation';
import ListLocation from './ListLocation';
import Collection from './Collection';
import ChangeOwner from './ChangeOwner';

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
import changeIC from '../../../src/icon/ic-white/ic-change.png';
import {checkUrl} from '../../libs';

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
      showListLoc:false,
      showCollection:false,
      showOwner:false,
    };
    this.getLoc();
    getLanguage().then((e) =>{
      //console.log('e',e);
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
        }
    });
    this.refresh();
  }
  refresh(){
    checkLogin().then(e=>{
      //console.log('checkLogin',e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true},()=>{
          this.getUser(e.id);
        });
      }
    });
  }
  getUser(id){
    getApi(`${global.url}${'user/get-static/'}${id}`)
    .then(arrData => {
        //console.log(arrData);
        setTimeout(()=>{
          this.setState({ countEntry: arrData.data });
        },2000)
    })
    .catch(err => console.log(err));
  }
  logoutUser(){
    const {user_profile} = this.state;
    getApi(`${global.url}${'logout'}`);
    AsyncStorage.removeItem('@MyAccount:key');
    AsyncStorage.setItem('@MyAccount:key', JSON.stringify({
      remember_me:user_profile.remember_me,
      email:user_profile.remember_me ? user_profile.email : '',
      pwd:user_profile.remember_me ? user_profile.pwd : ''}))
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
          { timeout: 20000, maximumAge: 10000}
    );
  }
  componentWillMount(){
    DeviceEventEmitter.addListener('goback', (e)=>{
      if(e.isLogin) this.refresh();
    })
  }

  render() {
    const {lang, valSearch, curLoc, isLogin, user_profile,
    showUpdateInfo,countEntry,showCheckin,showLikeLoc,
    showListLoc,showCollection,showSetting,showOwner,
  } = this.state;
    //console.log(lang);
    const {navigate} = this.props.navigation;
    //console.log("this.props.Hometab=",this.props);
    const {
      container, colorNext,btnPress,marTop,rowItem,headPerBG,infoPerBG,
      headStyle, imgLogoTop,imgSocial, imgInfo,wrapIcRight,headContent,
      inputSearch,show,hide,titleHead,colorWhite,borderItemPer,titlePer,
      wrapContent,borderItemInfoPer,imgIconPer,imgIconPerInfo,padPerInfo,
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
          placeholder={lang.search} style={inputSearch}
          onSubmitEditing={() => { if (valSearch.trim()!==''){navigate('SearchScr',{keyword:valSearch,lat:curLoc.lat,lng:curLoc.lng,lang})} }}
          onChangeText={(valSearch) => this.setState({valSearch})}
          value={valSearch} />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (valSearch.trim()!=='') {
              navigate('SearchScr',{keyword:valSearch,lat:curLoc.lat,lng:curLoc.lng,lang});
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>
        </View>

        <View style={[wrapContent, isLogin ? hide : show]}>
          <Text style={{color:'#B8B9BD'}}>{lang.request_login}</Text>
          <TouchableOpacity onPress={()=>navigate('LoginScr',{backScr:''})} style={[btnPress,marTop]}>
          <Text style={colorNext}> {lang._login}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={isLogin ? show : hide}>
          <View style={headPerBG}>

            <View style={rowItem}>
              <Image source={{uri: checkUrl(`${user_profile.avatar}`) ? `${user_profile.avatar}` : `${global.url_media}/${user_profile.avatar}`}} style={{width:70,height:70,borderRadius:35,marginRight:15}} />
              <View>
                <Text style={titleHead}>{user_profile.full_name}</Text>
                <Text style={colorWhite}>{user_profile.email}</Text>
              </View>
            </View>

            <View>
                <View style={[rowItem,marTop]}>
                  <Image source={plusWhiteIC} style={imgIconPer} />
                  <TouchableOpacity style={[marTop,padPerInfo]}
                  onPress={()=>navigate('ChooseCatScr',{lang:lang.lang})}>
                  <Text style={titlePer}>{`${lang.create_location}`}</Text>
                  </TouchableOpacity>
                </View>
                <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={plusWhiteIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo}>
                <Text style={titlePer}>{`${lang.create_prom}`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
            <View style={[rowItem]}>
              <Image source={plusWhiteIC} style={imgIconPerInfo} />
              <TouchableOpacity style={padPerInfo}>
              <Text style={titlePer}>{`${lang.create_ads}`}</Text>
              </TouchableOpacity>
            </View>
            <View style={borderItemInfoPer}></View>
          </View>

              <View>
              <View style={[rowItem]}>
                <Image source={plusWhiteIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo}>
                <Text style={titlePer}>Tạo rao vặt</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
            <View style={[rowItem]}>
              <Image source={plusWhiteIC} style={imgIconPerInfo} />
              <TouchableOpacity style={padPerInfo}>
              <Text style={titlePer}>Tạo shop online</Text>
              </TouchableOpacity>
            </View>
            <View style={borderItemInfoPer}></View>
          </View>

          <View>
          <View style={[rowItem]}>
            <Image source={plusWhiteIC} style={imgIconPerInfo} />
            <TouchableOpacity style={padPerInfo}>
            <Text style={titlePer}>Tạo website cá nhân/công ty</Text>
            </TouchableOpacity>
          </View>
          <View style={borderItemInfoPer}></View>
        </View>


        <View style={[rowItem]}>
          <Image source={plusWhiteIC} style={imgIconPerInfo} />
          <TouchableOpacity style={padPerInfo}>
          <Text style={titlePer}>Cung cấp phần mềm quản lý doanh nghiệp</Text>
          </TouchableOpacity>
        </View>


      </View>


          <View style={infoPerBG}>
              <View style={[rowItem]}>
              <Text style={titlePer}>{`${lang.info_general}`.toUpperCase()}</Text>
              </View>
              <View style={[borderItemInfoPer,marTop]}></View>

              <View>
                <View style={[rowItem]}>
                  <Image source={infoIC} style={imgIconPerInfo} />
                  <TouchableOpacity style={padPerInfo} onPress={()=>this.setState({showUpdateInfo:true})}>
                  <Text style={titlePer}>{`${lang.info_per}`}</Text>
                  </TouchableOpacity>
                  <UpdateInfo
                  //navigation={this.props.navigation}
                  lang={lang}
                  userId={user_profile.id}
                  labelTitle={`${lang.info_per}`}
                  visible={showUpdateInfo}
                  closeModal={()=>{this.setState({showUpdateInfo:false});this.refresh()}} />
                </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={changeIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo} onPress={()=>this.setState({showOwner:true})}>
                <Text style={titlePer}>{`${lang.change_owner}`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>

              <ChangeOwner
              lang={lang}
              userId={user_profile.id}
              title={lang.change_owner}
              visible={showOwner}
              closeModal={()=>{this.setState({showOwner:false})}}
              />
            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={locationIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo} onPress={()=>this.setState({showCheckin:true})}>
                <Text style={titlePer}>{`${'Check in'} (${countEntry.count_checkin})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={starIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo} onPress={()=>this.setState({showLikeLoc:true})}>
                <Text style={titlePer}>{`${lang.like_location} (${countEntry.count_like})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>

            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={collectionIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo} onPress={()=>this.setState({showCollection:true})}>
                <Text style={titlePer}>{`${lang.collection} (${countEntry.count_collection})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>

            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={menuIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo}
                onPress={()=>this.setState({showListLoc:true})}>
                <Text style={titlePer}>{`${lang.list_location} (${countEntry.count_location})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>

            </View>

              <View style={[rowItem,marTop]}>
              <Text style={titlePer}>{`${lang.sys_kingmap}`.toUpperCase()}</Text>
              </View>
              <View style={[borderItemInfoPer,marTop]}></View>

              <View>
                <View style={[rowItem]}>
                  <Image source={settingIC} style={imgIconPerInfo} />
                  <TouchableOpacity style={padPerInfo} onPress={()=>this.setState({showSetting:true})}>
                  <Text style={titlePer}>{`${lang.setting_account}`}</Text>
                  </TouchableOpacity>

                </View>
                <View style={borderItemInfoPer}></View>
              </View>

              <View>
                <View style={[rowItem]}>
                  <Image source={logoutIC} style={imgIconPerInfo} />
                  <TouchableOpacity style={padPerInfo} onPress={()=>this.logoutUser()}>
                  <Text style={titlePer}>{`${lang.logout}`}</Text>
                  </TouchableOpacity>
                </View>
                <View style={borderItemInfoPer}></View>
              </View>

          </View>

        </ScrollView>

        <ListLocation
        lang={lang}
        curLoc={curLoc}
        navigation={this.props.navigation}
        labelTitle={lang.list_location}
        visible={showListLoc}
        closeModal={()=>this.setState({showListLoc:false})}
        />
        <LikeLocation
        lang={lang}
        curLoc={curLoc}
        navigation={this.props.navigation}
        labelTitle={lang.like_location}
        visible={showLikeLoc}
        closeModal={()=>this.setState({showLikeLoc:false})}
        />
        <ListCheckin
        lang={lang}
        curLoc={curLoc}
        navigation={this.props.navigation}
        labelTitle={'Check in'}
        visible={showCheckin}
        closeModal={()=>{this.setState({showCheckin:false});this.refresh();}}
        />
        <Collection
        lang={lang}
        curLoc={curLoc}
        navigation={this.props.navigation}
        labelTitle={lang.collection}
        visible={showCollection}
        closeModal={()=>this.setState({showCollection:false})}
        />
        <Setting
        navigation={this.props.navigation}
        userId={user_profile.id}
        labelTitle={`${lang.setting_account}`}
        visible={showSetting}
        closeModal={()=>{this.setState({showSetting:false});this.refresh();}} />
      </View>
    );
  }
}
