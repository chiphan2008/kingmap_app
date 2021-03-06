/* @flow */

import React, { Component } from 'react';
import {
  ScrollView,Platform, View, Text,Keyboard,
  Dimensions, Image, TextInput, TouchableOpacity,
  AsyncStorage,TouchableWithoutFeedback
} from 'react-native';
const {height, width} = Dimensions.get('window');
import {connect} from 'react-redux';
import {GoogleSignin} from 'react-native-google-signin';
import encodeApi from '../../api/encodeApi';
//import UpdateInfo from './UpdateInfo';
//import Setting from './Setting';
//import Collection from './Collection';

import styles from '../../styles';
import global from '../../global';
import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import getLocationByIP from '../../api/getLocationByIP';
import checkLogin from '../../api/checkLogin';
import loginServer from '../../api/loginServer';

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
import aboutIC from '../../../src/icon/ic-white/ic-info.png';
import logoutIC from '../../../src/icon/ic-white/ic-logout.png';
import changeIC from '../../../src/icon/ic-white/ic-change.png';
import {checkUrl} from '../../libs';

let timeoutUser,timeoutUpdateState ;
class PersonalTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang : lang_vn,
      countEntry:{},
    };
    //this.getLoc();
    getLanguage().then((e) =>{
      //console.log('e',e);
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
        }
    });
    this.refresh();
  }

  refresh(){
    const {isLogin,user_profile} = this.props;
    isLogin && user_profile.id!==undefined && this.getUser(user_profile.id);
  }
  getUser(id){
    clearTimeout(timeoutUser);
    timeoutUser = setTimeout(()=>{
        getApi(`${global.url}${'user/get-static/'}${id}`)
        .then(arrData => {
              this.setState({ countEntry: arrData.data });
        }).catch(err => console.log(err));
    },500)
  }
  logoutUser(){
    const {user_profile} = this.props;
    this.props.dispatch({type:'UPDATE_MY_FRIENDS',myFriends:[]});
    this.props.dispatch({type:'USER_LOGINED',isLogin:false,user_profile:{}});
    GoogleSignin.signOut().catch(e=>{});
    encodeApi(`${global.url_node}${'person/offline'}`,'POST',user_profile);
    getApi(`${global.url}${'logout'}`);
    AsyncStorage.removeItem('@MyAccount:key');
    AsyncStorage.setItem('@MyAccount:key', JSON.stringify({
      remember_me:user_profile.remember_me,
      email:user_profile.remember_me ? user_profile.email : '',
      pwd:user_profile.remember_me ? user_profile.pwd : ''}))
    .then(()=>this.props.screenProps(this.props.slLang,'home'));
  }

  componentDidUpdate(){
    if(this.props.updateState){
      this.props.dispatch({type:'STOP_START_UPDATE_STATE',updateState:false})
      this.refresh();
    }
  }

  render() {
    const {
      lang, valSearch, countEntry,
    } = this.state;
    //console.log(lang);
    const {navigate} = this.props.navigation;
    const {yourCurLoc, isLogin, user_profile} = this.props;
    //console.log("this.props.Hometab=",this.props);
    const {
      container, colorNext,btnPress,marTop,rowItem,headPerBG,infoPerBG,
      headStyle, imgLogoTop,imgSocial, imgInfo,wrapIcRight,headContent,
      inputSearch,show,hide,titleHead,colorWhite,borderItemPer,titlePer,
      wrapContent,borderItemInfoPer,imgIconPer,imgIconPerInfo,padPerInfo,
      plusStyle,popover,overLayout,listOver,imgMargin,imgUp,imgUpInfo,imgUpShare
    } = styles;

    return (
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
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
          onSubmitEditing={() => { if (valSearch.trim()!==''){navigate('SearchScr',{keyword:valSearch,lat:yourCurLoc.lat,lng:yourCurLoc.lng,lang})} }}
          onChangeText={(valSearch) => this.setState({valSearch})}
          value={valSearch} />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (valSearch.trim()!=='') {
              navigate('SearchScr',{keyword:valSearch,lat:yourCurLoc.lat,lng:yourCurLoc.lng,lang});
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>
        </View>

        <View style={[wrapContent, isLogin ? hide : show, {width: width}]}>
          <Text style={{color:'#B8B9BD'}}>{lang.request_login}</Text>
          <TouchableOpacity onPress={()=>navigate('LoginScr',{backScr:'MainScr'})} style={[btnPress,marTop]}>
          <Text style={colorNext}> {lang._login}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={this.props.isLogin ? show : hide}>
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


      </View>


          <View style={infoPerBG}>
              <View style={[rowItem]}>
              <Text style={titlePer}>{`${lang.info_general}`.toUpperCase()}</Text>
              </View>
              <View style={[borderItemInfoPer,marTop]}></View>

              <View>
                <View style={[rowItem]}>
                  <Image source={infoIC} style={imgIconPerInfo} />
                  <TouchableOpacity style={padPerInfo} onPress={()=>{navigate('UpdateInfoScr',{lang,userId:user_profile.id})}}>
                  <Text style={titlePer}>{`${lang.info_per}`}</Text>
                  </TouchableOpacity>

                </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={changeIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo} onPress={()=>navigate('ChangeOwnerScr',{lang,userId:user_profile.id})}>
                <Text style={titlePer}>{`${lang.change_owner}`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>


            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={locationIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo} onPress={()=>navigate('ListCheckinScr',{lang,yourCurLoc})}>
                <Text style={titlePer}>{`${'Check in'} (${countEntry.count_checkin ? countEntry.count_checkin : 0})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={starIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo} onPress={()=>navigate('LikeLocationScr',{lang,yourCurLoc})}>
                <Text style={titlePer}>{`${lang.like_location} (${countEntry.count_like ? countEntry.count_like : 0})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>

            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={collectionIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo} onPress={()=>{navigate('CollectionScr',{lang,yourCurLoc})}}>
                <Text style={titlePer}>{`${lang.collection} (${countEntry.count_collection ? countEntry.count_collection : 0})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>
            </View>

            <View>
              <View style={[rowItem]}>
                <Image source={menuIC} style={imgIconPerInfo} />
                <TouchableOpacity style={padPerInfo}
                onPress={()=>{navigate('ListLocPerScr',{lang,yourCurLoc})}}>
                <Text style={titlePer}>{`${lang.list_location} (${countEntry.count_location ? countEntry.count_location :0})`}</Text>
                </TouchableOpacity>
              </View>
              <View style={borderItemInfoPer}></View>

            </View>

              <TouchableWithoutFeedback>
              <View style={[rowItem,marTop]}>
              <Text style={titlePer}>{`${lang.sys_kingmap}`.toUpperCase()}</Text>
              </View>
              </TouchableWithoutFeedback>
              <View style={[borderItemInfoPer,marTop]}></View>

              <View>
                <View style={[rowItem]}>
                  <Image source={settingIC} style={imgIconPerInfo} />
                  <TouchableOpacity style={padPerInfo} onPress={()=>navigate('SettingScr',{lang})}>
                  <Text style={titlePer}>{`${lang.setting_account}`}</Text>
                  </TouchableOpacity>

                </View>
                <View style={borderItemInfoPer}></View>
              </View>

              <View>
                <View style={[rowItem]}>
                  <Image source={aboutIC} style={imgIconPerInfo} />
                  <TouchableOpacity style={padPerInfo} onPress={()=>navigate('AppInfoScr',{lang})}>
                  <Text style={titlePer}>{`${lang.about_app}`}</Text>
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
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    yourCurLoc:state.yourCurLoc,
    isLogin:state.isLogin,
    user_profile:state.user_profile,
    updateState:state.updateState,
    slLang:state.slLang
  }
}

export default connect(mapStateToProps)(PersonalTab);
