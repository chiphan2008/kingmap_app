/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput,ScrollView,Alert,
  TouchableOpacity,PermissionsAndroid, AsyncStorage, Modal,Keyboard,YellowBox } from 'react-native';
import RNSettings from 'react-native-settings';
//import SvgUri from 'react-native-svg-uri';
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

import bgMap from '../../../src/icon/bg-map.png';
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
import {format_number} from '../../libs';
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

import {Select, Option} from "react-native-chooser";
var timeoutLang;
export default class HomeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      Width_Layout:'',
      Height_Layout:'',
      listCategory : [],
      listStatus : [],
      lang : lang_vn,
      selectLang: {
        valueLang : "vn",
        labelLang : "VIE",
      },
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
      curLoc:{},
      user_profile:{},
      valSearch:'',

    };
    accessLocation();
    checkLogin().then(e=>{
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        loginServer(e);
        //console.log(e);
        const params = {username:e.email,password:e.pwd};
        var _this = this;
        //let approve_acc_ctv = e.api_roles.cong_tac_vien!==undefined && e.api_roles.active===0?true:false;
        _this.setState({user_profile:e,user_id:e.id,avatar:e.avatar,code_user:e.phone,isLogin:true});

        // loginApi(`${global.url}${'login'}`,params).then(el=>{
        //   console.log(el.data[0]);
        //   _this.setState({user_profile:el.data[0],user_id:e.id,avatar:e.avatar,code_user:e.phone,isLogin:true});
        // }).catch(err=>{});
      }
    })

    this.findLoc();
    this.getLang();
    Keyboard.dismiss();
    arrLang = [{name:'VIE',v:'vn'},{name:'ENG',v:'en'}];
  }

  findLoc(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude,longitude} = position.coords;
          this.setState({curLoc:{
            latitude,longitude
          }});
      },
      (error) => {
        getLocationByIP().then((e) => {
          const {latitude,longitude} = e;
            this.setState({curLoc:{
              latitude,longitude
            }});

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
       //console.log('lang.Location',e);
       if(e!==null){
        timeoutLang = setTimeout(function () {
          _this.setState({
            selectLang:{
              valueLang:e.valueLang,
              labelLang:e.labelLang,
            },
            lang : e.valueLang==='vn' ? lang_vn : lang_en,
          },()=>{
            _this.getCategory(e.valueLang);
          });
        }, 1000);

      }
     });
   }

   onSelectLang(value, label) {
     if(this.state.selectLang.valueLang!==value){
       clearTimeout(timeoutLang);
       AsyncStorage.setItem('@MyLanguage:key',JSON.stringify({valueLang:value,labelLang :label})).then(()=>{
         setTimeout(() => {
             this.props.screenProps();
         }, 500);
       });
     }
   }

   getCategory(lang){
     //console.log(global.url+'modules?language='+lang+'&limit=100');
     getApi(global.url+'modules?language='+lang+'&limit=100')
     .then(arrCategory => {
       //console.log('arrCategory',arrCategory);
       if(arrCategory!==undefined){setTimeout(() => {
           this.setState({ listCategory: arrCategory.data },()=>{
             this.getListStatus();
           });
       }, 100);}
     }).catch(err => console.log(err));
   }
   getListStatus(){
     getApi(global.url+'get-static')
     .then(arrData => {
       setTimeout(()=>{
         this.setState({ listStatus: arrData.data });
       },500)
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
       }else if(e.count_area===0 && e.api_roles!==null){
         //chua phan kv
         Alert.alert(this.state.lang.notify,this.state.lang.approve_area_ctv);
       }else if(e.api_roles!==null && e.api_roles.cong_tac_vien!==undefined && e.api_roles.cong_tac_vien.active===0){
         // tk CTV bi khoa
         Alert.alert(this.state.lang.notify,this.state.lang.approve_acc_ctv);
       }else {this.props.navigation.navigate('ChooseCatScr',{lang:this.state.lang.lang}) }
     })
   }
  render() {
    //console.log('this.props',this.props);
    const {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
    const {listStatus,user_profile,curLoc} = this.state;
    //console.log("this.props.Hometab=",util.inspect(this.state.listCategory,false,null));
    const {
      container, bgImg,colorlbl,flexRow,
      headStyle, headContent,imgLogoTop,imgSocial, imgWidthGoogle, imgShare,wrapIcRight,
      selectBox,optionListStyle,OptionItem,inputSearch,show,hide,colorTextPP,colorWhite,marRight,itemCreate,
      wrapContent,imgContent,square,wrapCircle,logoCenter,circle1,circle2,circle3,circle4,circle5,circle6,circle7,circle8,labelCat,labelNum,
      plusStyle,imgPlusStyle,popover,overLayout,listOver,popoverShare,popoverCreate,overLayoutShare,listOverShare,imgMargin,imgUpHome,imgUpInfo,imgUpShare
    } = styles;
    let i=0;
    return (
      <View style={container} >

      <Image source={bgMap} style={bgImg} />
        <View style={headStyle}>
            <View style={headContent}>
            <TouchableOpacity onPress={()=> this.setState({showInfo:false,showShare:false}) } >
                <Image source={logoTop} style={imgLogoTop} />
            </TouchableOpacity>

            <Select
                  onClick={()=> this.setState({showInfo:false,showShare:false}) }
                  onSelect = {this.onSelectLang.bind(this)}
                  defaultText  = {this.state.selectLang.labelLang}
                  style = {selectBox}
                  textStyle = {{color:'#fff'}}
                  optionListStyle={optionListStyle}
                  indicatorColor="#fff"
                  indicator="down"
                  indicatorSize={7}
                  transparent
                >
                {arrLang.map((e,i)=>(
                    <Option style={OptionItem} key={i} value ={e.v}>{e.name}</Option>
                ))}
            </Select>

          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder={this.state.lang.search} style={inputSearch}
          onSubmitEditing={() => { if (this.state.valSearch.trim()!==''){
            navigate('SearchScr',{keyword:this.state.valSearch,idCat:'',lat:curLoc.latitude,lng:curLoc.longitude,lang:this.state.lang.lang})}
            this.setState({valSearch:''})
          }}
          onChangeText={(valSearch) => this.setState({valSearch})}
          value={this.state.valSearch} />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (this.state.valSearch.trim()!=='') {
              navigate('SearchScr',{keyword:this.state.valSearch,lat:curLoc.latitude,lng:curLoc.longitude,idCat:'',lang:this.state.lang.lang});
              this.setState({valSearch:''})
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>
        </View>

        <ScrollView>
        <View style={wrapContent}>

            <View style={square}>
            {

              this.state.listCategory.map((e,index)=>{
                const x=118;const y=120;const distance=140;
                let angle = (360/(this.state.listCategory.length-1));
                let pos = this.findNewPoint(x, y, angle, distance);
                //console.log(e);
                switch (e.machine_name) {

                  case 'ads':
                      angle *= index-i;
                      pos = this.findNewPoint(x, y, angle, distance);
                      return (<TouchableOpacity
                          key={e.id}
                          style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,overflow: 'visible'}}
                          onPress={() => {
                            this.requestLogin();
                            if(this.state.isLogin){
                              navigate('AdsScr',{icon:`${global.url_media}${e.image}`,name_module:e.name,code_user:this.state.code_user,lang:this.state.lang});
                            }
                          }}
                          >
                          {/*<Text style={labelNum}>(25)</Text>*/}
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>
                      </TouchableOpacity>);
                        break;
                  case 'rao_vat':
                      angle *= index-i;
                      pos = this.findNewPoint(x, y, angle, distance);
                      return (<TouchableOpacity
                          key={e.id}
                          style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,overflow: 'visible'}}
                          onPress={() => {
                            //this.requestLogin();
                            // if(this.state.isLogin){
                            // }
                            navigate('ListBuySellScr',{icon:`${global.url_media}${e.image}`,name_module:e.name,code_user:this.state.code_user,lang:this.state.lang});

                          }}
                          >
                          {/*<Text style={labelNum}>(25)</Text>*/}
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>
                      </TouchableOpacity>);
                        break;
                  case 'chat':
                      angle *= index-i;
                      pos = this.findNewPoint(x, y, angle, distance);
                      return (<TouchableOpacity
                          key={e.id}
                          style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,overflow: 'visible'}}
                          onPress={() => {
                            this.requestLogin();
                            if(this.state.isLogin){
                              navigate('ContactScr',{user_id:this.state.user_id,avatar:this.state.avatar, name_module:e.name,lang:this.state.lang});
                            }
                          }}
                          >
                          {/*<Text style={labelNum}>(25)</Text>*/}
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>
                      </TouchableOpacity>);
                        break;

                  case 'make_money':
                      angle *= index-i;
                      pos = this.findNewPoint(x, y, angle, distance);
                      return (<TouchableOpacity
                          key={e.id}
                          style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,overflow: 'visible'}}
                          onPress={() => {
                            this.requestLogin();

                            if(this.state.isLogin){
                              navigate('MakeMoneyScr',{user_profile,icon:`${global.url_media}${e.image}`,name_module:e.name,lang:this.state.lang}) }}
                            }
                          >
                          {/*<Text style={labelNum}>(25)</Text>*/}
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>
                      </TouchableOpacity>);
                        break;
                case 'vi':
                    angle *= index-i;
                    pos = this.findNewPoint(x, y, angle, distance);
                    return (<TouchableOpacity
                        key={e.id}
                        onPress={()=>navigate('WalletScr',{code_user:this.state.code_user,lang:this.state.lang})}
                        style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,overflow: 'visible'}}
                        >
                        {/*<Text style={labelNum}>(25)</Text>*/}
                        {/*<Image style={imgContent} source={logoHome} />*/}
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>

                        </TouchableOpacity>);
                      break;
                  case 'dia_diem':
                      i=1;
                      return (
                    <TouchableOpacity
                      key={e.id}
                      style={[wrapCircle,logoCenter]}
                      onPress={() => navigate('OtherCatScr',{name_module:e.name,lang:this.state.lang}) }
                      >
                      {/*<Text style={labelNum}>(25)</Text>*/}
                    <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                    <Text style={labelCat}>{e.name}</Text>
                  </TouchableOpacity>);
                        break;
                  default:
                  angle *= index-i;
                  pos = this.findNewPoint(x, y, angle, distance);
                    return (<TouchableOpacity
                        key={e.id}
                        style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,}}
                        onPress={() => navigate('CatScr') }
                        >
                      <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      <Text style={labelCat}>{e.name}</Text>
                      {/*<Text style={labelNum}>(25)</Text>*/}
                    </TouchableOpacity>);
                    break;

                }
              })
            }

            </View>
        </View>
        </ScrollView>

        <TouchableOpacity
        onPress={()=>{
          this.requestLogin();
          if(this.state.isLogin){
            this.setState({showCreate:!this.state.showCreate,showInfo:false,showShare:false},()=>{
              loginServer(this.state.user_profile,'cxv');
            });
          }
        }}
        style={plusStyle}>
            <Image source={plusIC} style={[imgPlusStyle, this.state.showCreate===false ? show : hide]} />
        </TouchableOpacity>

        <Modal onRequestClose={() => null} transparent visible={this.state.showCreate}>
        <TouchableOpacity onPress={()=>this.setState({showCreate:!this.state.showCreate})}
         style={popoverCreate}>
            <TouchableOpacity
            onPress={()=>{
              this.setState({showCreate:false},()=>{
                this.gotoCreate();
              });
            }}
            style={itemCreate}>
              <Text style={colorlbl}>{this.state.lang.create_location}</Text>
            </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.setState({showCreate:!this.state.showCreate})} >
            <Image source={this.state.showCreate===false ? plusIC : closeIC} style={imgPlusStyle} />
        </TouchableOpacity>
        </TouchableOpacity>
        </Modal>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{width,backgroundColor:'#2e3c52',paddingRight:10,paddingLeft:5}}>

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

       </ScrollView>

      </View>
    );
  }
}
