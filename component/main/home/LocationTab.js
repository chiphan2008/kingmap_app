/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput,ScrollView,Alert,
  TouchableOpacity,PermissionsAndroid, AsyncStorage, Modal,Keyboard,YellowBox,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
//import RNSettings from 'react-native-settings';
import SvgUri from 'react-native-svg-uri';
const {height, width} = Dimensions.get('window');

import loginApi from '../../api/loginApi';
import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';
import accessLocation from '../../api/accessLocation';
import getLocationByIP from '../../api/getLocationByIP';

import global from '../../global';
import loginServer from '../../api/loginServer';
import checkLogin from '../../api/checkLogin';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import styles from '../../styles.js';

import bgMap from '../../../src/icon/bg-map.jpg';
//import test from '../../../src/icon/test.svg';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';

import plusIC from '../../../src/icon/ic-home/ic-plus.png';
import closeIC from '../../../src/icon/ic-home/ic-close.png';

import logoHome from '../../../src/icon/ic-home/Logo-home.png';
import locationDD from '../../../src/icon/ic-gray/ic-location.png';
import onlineDD from '../../../src/icon/ic-gray/ic-online.png';
import checkDD from '../../../src/icon/ic-gray/ic-check-gray.png';
import likeDD from '../../../src/icon/ic-gray/ic-like.png';
import socialDD from '../../../src/icon/ic-gray/ic-social.png';
import userDD from '../../../src/icon/ic-gray/ic-user.png';
import icProfileWhite from '../../../src/icon/ic-profile-white.png';
import icUserProfile from '../../../src/icon/ic-user-profile.png';
import {format_number,checkUrl,checkSVG} from '../../libs';
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

import {Select, Option} from "react-native-chooser";
var timeoutLang;

class LocationTab extends Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(
      ['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'
    ])
    this.state = {
      //permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      Width_Layout:'',
      Height_Layout:'',
      listCategory : [],
      listStatus : [],
      lang : lang_vn,
      showInfo : false,
      showShare : false,
      showCreate : false,
      latitude: null,
      longitude: null,
      error: null,
      code_user:null,
      isLogin:false,
      user_id:0,
      avatar:'',
      user_profile:{},
      valSearch:'',
      slogan:'',
    };
    accessLocation();
    checkLogin().then(e=>{
      //console.log(e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        loginServer(e);
        this.props.dispatch({type:'USER_LOGINED',isLogin:true,user_profile:e});
        const params = {username:e.email,password:e.pwd};
        var _this = this;
        _this.setState({user_profile:e,user_id:e.id,avatar:e.avatar,code_user:e.phone,isLogin:true});
      }
    })
    //console.log(this.props.yourCurLoc);
    this.props.yourCurLoc.latitude==='' && this.findLoc();
    this.getLang();
    Keyboard.dismiss();
    arrLang = [{name:'VIE',v:'vn'},{name:'ENG',v:'en'}];
  }

  findLoc(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude,longitude} = position.coords;
        this.props.dispatch({type:'FIND_CURRENT_LOCATION',yourCurLoc:position.coords,updateState:true});
      },
      (error) => {
        getLocationByIP().then((e) => {
          const {latitude,longitude} = e;
          this.props.dispatch({type:'FIND_CURRENT_LOCATION',yourCurLoc:e,updateState:true});
        });
      },
      { timeout: 5000,maximumAge: 60000 },
    );
   }

  requestLogin(){
    if(this.state.isLogin===false){
      this.props.navigation.navigate('LoginScr',{backScr:'MainScr'});
    }
  }

  getLang(){
    var _this = this;
    getLanguage().then((e) =>{
      if(e!==null){
        const slLang ={
          valueLang:e.valueLang,
          labelLang:e.labelLang
        }
        this.props.dispatch({type:'UPDATE_LANG',slLang});
        _this.getCategory(e.valueLang);
        _this.setState({
          lang : e.valueLang==='vn' ? lang_vn : lang_en,
        });

     }
    });
  }

  onSelectLang(valueLang,labelLang) {
    const slLang={valueLang,labelLang};
    if(this.props.slLang.valueLang!==valueLang){
      this.props.dispatch({type:'UPDATE_LANG',slLang});
      AsyncStorage.setItem('@MyLanguage:key', JSON.stringify(slLang)).then(()=>{
        this.props.screenProps(slLang);
      });
    }
  }

  getCategory(lang){
    //console.log(global.url+'modules?language='+lang+'&limit=100');
    getApi(global.url+'categories?language='+lang+'&limit=100&block_text=slogan_home')
    .then(arrCategory => {
      //console.log('arrCategory',arrCategory);
      if(arrCategory!==undefined){setTimeout(() => {
          this.setState({ listCategory: arrCategory.data,slogan:arrCategory.block_text.slogan_home },()=>{
            this.getListStatus();
          });
      }, 100);}
    }).catch(err => console.log(err));
  }
  getListStatus(){
    getApi(global.url+'get-static')
    .then(arrData => {
      this.setState({ listStatus: arrData.data });
    }).catch(err => console.log(err));
  }

 findNewPoint(x, y, angle, distance) {
      let result = {};angle+=13;
      result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
      result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);
      return result;
  }

  gotoCreate = () => {
    checkLogin().then(e=>{
      //console.log(e);
      //dang cho duyet
      if(e.temp_daily_code!==''){
        Alert.alert(this.state.lang.notify,this.state.lang.approve_ctv);
      }else if(e.count_area===0 && e.api_roles!==null && e.api_roles.cong_tac_vien!==undefined ){
        //chua phan kv
        Alert.alert(this.state.lang.notify,this.state.lang.approve_area_ctv);
      }else if(e.api_roles!==null && e.api_roles.cong_tac_vien!==undefined && e.api_roles.cong_tac_vien.active===0){
        // tk CTV bi khoa
        Alert.alert(this.state.lang.notify,this.state.lang.approve_acc_ctv);
      }else {this.props.navigation.navigate('ChooseCatScr',{lang:this.state.lang.lang}) }
    })
  }

  render() {
    const {yourCurLoc} = this.props;
    const {navigate,state} = this.props.navigation;
    const {listStatus,listCategory,user_profile,slogan} = this.state;
    const {
      container, bgImg,colorlbl,flexRow,
      headStyle, headContent,imgLogoTop,imgSocial, imgWidthGoogle, imgShare,wrapIcRight,
      selectBox,optionListStyle,OptionItem,inputSearch,show,hide,colorTextPP,colorWhite,marRight,itemCreate,
      wrapContent,imgContent,square,wrapCircle,logoCenter,circle1,circle2,circle3,circle4,circle5,circle6,circle7,circle8,labelCat,labelNum,
      plusStyle,imgPlusStyle,popover,overLayout,listOver,popoverShare,popoverCreate,overLayoutShare,listOverShare,imgMargin,imgUpHome,imgUpInfo,imgUpShare
    } = styles;
    let i=0;
    const x=85;const y=70;const distance=(width/10)<60?120:140;
    return (
      <View style={container} >

      <Image source={bgMap} style={bgImg} />
        <View style={headStyle}>
            <View style={headContent}>
            <TouchableOpacity onPress={()=> this.setState({showInfo:false,showShare:false}) } >
                <Image source={logoTop} style={imgLogoTop} />
            </TouchableOpacity>

            <View style={{justifyContent: 'space-between',flexDirection: 'row', width: 90}}>
              <Select
                    onClick={()=> this.setState({showInfo:false,showShare:false}) }
                    onSelect = {this.onSelectLang.bind(this)}
                    defaultText  = {this.props.slLang.labelLang}
                    style = {[selectBox]}
                    textStyle = {{color:'#fff'}}
                    optionListStyle={[optionListStyle, {right:50}]}
                    indicatorColor="#fff"
                    indicator="down"
                    indicatorSize={7}
                    transparent
                  >
                  {arrLang.map((e,i)=>(
                      <Option style={OptionItem} key={i} value ={e.v}>{e.name}</Option>
                  ))}
              </Select>
              <View style={{width:30,borderColor:'transparent',position:'relative'}}>
                {this.props.isLogin ?
                  <Image
                  source={{uri: checkUrl(`${user_profile.avatar}`) ? `${user_profile.avatar}` : `${global.url_media}/${user_profile.avatar}`}}
                  style={{width:30,height:30,borderRadius:15}} />
                  :
                  <TouchableOpacity onPress={()=>{
                    navigate('LoginScr',{backScr:'MainScr'});
                  }}>
                  <Image source={icProfileWhite} style={{width: 30, height: 30}} />
                  </TouchableOpacity>
                }
              </View>
            </View>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder={this.state.lang.search} style={inputSearch}
          onSubmitEditing={() => { if (this.state.valSearch.trim()!==''){
            navigate('SearchScr',{keyword:this.state.valSearch,idCat:'',lat:yourCurLoc.latitude,lng:yourCurLoc.longitude,lang:this.state.lang.lang})}
            this.setState({valSearch:''})
          }}
          onChangeText={(valSearch) => this.setState({valSearch})}
          value={this.state.valSearch} />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (this.state.valSearch.trim()!=='') {
              navigate('SearchScr',{keyword:this.state.valSearch,lat:yourCurLoc.latitude,lng:yourCurLoc.longitude,idCat:'',lang:this.state.lang.lang});
              this.setState({valSearch:''})
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>
        </View>

        <View style={wrapContent}>
        <View style={{alignItems: 'center', justifyContent: 'center', position:'relative',top:(width/10)<60?-60:-(width/10)}}>
            <Text numberOfLines={1} style={{fontSize: 21, fontWeight: 'bold', color: '#2e3c52'}}>{slogan ? slogan : ''}</Text>
        </View>
            <View style={square}>
            {
              listCategory.map((e,index)=>{

                //let angle = (360/(this.state.listCategory.length-1));

                //const x=118;const y=120;const distance=140;
                let items = listCategory.length-1>7 ? 7 : listCategory.length-1;
                let angle = (360/items);
                let pos = this.findNewPoint(x, y, angle, distance);
                if(index<7){
                  switch (e.alias) {

                    default:
                    angle *= index-i;
                    pos = this.findNewPoint(x, y, angle, distance);
                    return (<TouchableOpacity
                        key={e.id}
                        style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,overflow: 'visible'}}
                        onPress={()=>navigate('SearchScr',{idCat:e.id,labelCat:e.name,service_items:e.service_items, keyword:this.state.valSearch,lat:yourCurLoc.latitude,lng:yourCurLoc.longitude,lang:this.state.lang.lang}) }
                        >
                      {checkSVG(e.image)?
                        <SvgUri width="70" height="70" source={{uri:`${global.url_media}${e.image}`}} />
                        :
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      }

                      <Text style={labelCat}>{e.name}</Text>
                    </TouchableOpacity>);
                    break;
                  }
                }
              })
            }
            <TouchableOpacity style={{top:distance*0.55}}
              onPress={() => navigate('OtherCatScr',{name_module:'AAA',lang:this.props.slLang.valueLang,yourCurLoc}) }>
            <Image style={imgContent} source={logoHome} />
            <Text style={labelCat}>{this.state.lang.other}</Text>
            </TouchableOpacity>
            </View>
        </View>

        <TouchableOpacity
        onPress={()=>{
          this.requestLogin();
          if(this.state.isLogin){
            this.setState({showCreate:!this.state.showCreate,showInfo:false,showShare:false});
          }
        }}
        style={plusStyle}>
            <Image source={plusIC} style={[imgPlusStyle, this.state.showCreate===false ? show : hide]} />
        </TouchableOpacity>

        <Modal
        onRequestClose={() => null}
        transparent
        visible={this.state.showCreate}>
        <TouchableOpacity
        onPress={()=>this.setState({showCreate:!this.state.showCreate})}
         style={popoverCreate}>
            <TouchableOpacity
            onPress={()=>{
              this.setState({showCreate:false});
              navigate('ChooseCatScr',{lang:this.state.lang.lang});
            }}
            style={itemCreate}>
              <Text style={colorlbl}>{this.state.lang.create_location}</Text>
            </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>this.setState({showCreate:!this.state.showCreate})}
        >
            <Image source={this.state.showCreate===false ? plusIC : closeIC} style={imgPlusStyle} />
        </TouchableOpacity>
        </TouchableOpacity>
        </Modal>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{width,backgroundColor:'#2e3c52',alignSelf:'center',maxHeight:30,position:'absolute',bottom:0}}>
        <TouchableWithoutFeedback>
        <View style={{paddingLeft:5,paddingRight:5,justifyContent:'center',flexDirection:'row'}}>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={locationDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countContent)}</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={onlineDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countOnline)}</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={checkDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.newContent)}</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={likeDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countLike)}</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={socialDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countShare)}</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={userDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countUser)}</Text></Text>
        </View>
        </View>
        </TouchableWithoutFeedback>
       </ScrollView>

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    yourCurLoc:state.yourCurLoc,
    isLogin:state.isLogin,
    slLang:state.slLang,
    user_profile:state.user_profile,
  }
}

export default connect(mapStateToProps)(LocationTab);
