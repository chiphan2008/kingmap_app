/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput,ScrollView,
  TouchableOpacity,PermissionsAndroid, AsyncStorage, Modal,Keyboard } from 'react-native';
import RNSettings from 'react-native-settings';
const {height, width} = Dimensions.get('window');

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

import {Select, Option} from "react-native-chooser";

export default class HomeTab extends Component {
  constructor(props) {
    super(props);
    Keyboard.dismiss;
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
      valSearch:'',
    };
    checkLogin().then(e=>{
      //console.log(e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        loginServer(e);
        this.setState({user_id:e.id,avatar:e.avatar,code_user:e.phone,isLogin:true});
      }
    })
    this.getLoc();
    accessLocation();
    arrLang = [{name:'VIE',v:'vn'},{name:'ENG',v:'en'}];
  }

  getLoc(){
    navigator.geolocation.getCurrentPosition(
          (position) => {
            //console.log('position',position);
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
              //console.log('e',e);
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

  requestLogin(){
    if(this.state.isLogin===false){
      this.props.navigation.navigate('LoginScr',{backScr:'MainScr'});
    }
  }

  getLang(){
    getLanguage().then((e) =>{
      if(e!==null){
          this.setState({
            selectLang:{
              valueLang:e.valueLang,
              labelLang:e.labelLang,
            }
          });
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
          this.getCategory(this.state.selectLang.valueLang);
     }
    });
  }

  onSelectLang(value, label) {
    AsyncStorage.setItem('@MyLanguage:key',JSON.stringify({valueLang:value,labelLang :label}));
    value==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
    //this.getCategory(value);
    this.setState({
      selectLang: {
        valueLang : value,
        labelLang : label,
      },
      showShare:false,
      showInfo:false,
    });

    setTimeout(() => {
        this.props.screenProps(value);
    }, 2000);
  }
  getCategory(lang){
    getApi(global.url+'modules?language='+lang)
    .then(arrCategory => {
      //console.log('arrCategory',arrCategory);
        this.setState({ listCategory: arrCategory.data });
    })
    .catch(err => console.log(err));
  }
  getListStatus(){
    getApi(global.url+'get-static')
    .then(arrData => {
        this.setState({ listStatus: arrData.data });
    })
    .catch(err => console.log(err));
  }
  componentWillMount() {
      this.getLang();
      this.getListStatus();
      //this.getCategory(this.state.selectLang.valueLang);
  }

  findNewPoint(x, y, angle, distance) {
      let result = {};
      result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
      result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);
      return result;
  }
  render() {
    //console.log('this.props',this.props);
    const {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
    const {listStatus} = this.state;
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

        <ScrollView>
        <View style={wrapContent}>

            <View style={square}>
            {

              this.state.listCategory.map((e,index)=>{
                const x=118;const y=120;const distance=140;
                let angle = (360/(this.state.listCategory.length-1));
                let pos = this.findNewPoint(x, y, angle, distance);
                switch (e.alias) {

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
                          <Text style={labelNum}>(25)</Text>
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>
                      </TouchableOpacity>);
                        break;
                  case 'rao-vat':
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
                          <Text style={labelNum}>(25)</Text>
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
                          <Text style={labelNum}>(25)</Text>
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>
                      </TouchableOpacity>);
                        break;

                  case 'make-money':
                      angle *= index-i;
                      pos = this.findNewPoint(x, y, angle, distance);
                      return (<TouchableOpacity
                          key={e.id}
                          style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,overflow: 'visible'}}
                          onPress={() => navigate('MakeMoneyScr',{icon:`${global.url_media}${e.image}`,name_module:e.name,lang:this.state.lang}) }
                          >
                          <Text style={labelNum}>(25)</Text>
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>
                      </TouchableOpacity>);
                        break;
                case 'wallet':
                    angle *= index-i;
                    pos = this.findNewPoint(x, y, angle, distance);
                    return (<TouchableOpacity
                        key={e.id}
                        onPress={()=>navigate('WalletScr',{code_user:this.state.code_user,lang:this.state.lang})}
                        style={{position:'absolute',alignItems:'center',top:pos.y,left :pos.x,overflow: 'visible'}}
                        >
                        <Text style={labelNum}>(25)</Text>
                        {/*<Image style={imgContent} source={logoHome} />*/}
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}>{e.name}</Text>

                        </TouchableOpacity>);
                      break;
                  case 'location':
                      i=1;
                      return (
                    <TouchableOpacity
                      key={e.id}
                      style={[wrapCircle,logoCenter]}
                      onPress={() => navigate('OtherCatScr',{name_module:e.name,lang:this.state.lang}) }
                      >
                      <Text style={labelNum}>(25)</Text>
                    <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                    <Text style={labelCat}>{e.name}</Text>
                  </TouchableOpacity>);
                        break;
                  default:
                  angle *= index-i;
                  pos = this.findNewPoint(x, y, angle, distance);
                    return (<TouchableOpacity
                        key={e.id}
                        style={{position:'absolute',flex:1,alignItems:'center',top:pos.y,left :pos.x,}}
                        onPress={() => navigate('CatScr') }
                        >
                      <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      <Text style={labelCat}>{e.name}</Text>
                      <Text style={labelNum}>(25)</Text>
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

        <View style={flexRow}>
          <View style={flexRow}>
              <Image style={[imgShare,imgMargin]} source={locationDD} />
              <Text style={colorTextPP}><Text style={colorWhite}>{listStatus.countContent}k</Text></Text>
          </View>
          <View style={flexRow}>
              <Image style={[imgShare,imgMargin]} source={onlineDD} />
              <Text style={colorTextPP}><Text style={colorWhite}>{listStatus.countOnline}</Text></Text>
          </View>
          <View style={flexRow}>
              <Image style={[imgShare,imgMargin]} source={checkDD} />
              <Text style={colorTextPP}><Text style={colorWhite}>{listStatus.newContent}k</Text></Text>
          </View>
          <View style={flexRow}>
              <Image style={[imgShare,imgMargin]} source={likeDD} />
              <Text style={colorTextPP}><Text style={colorWhite}>{listStatus.countLike}k</Text></Text>
          </View>
          <View style={flexRow}>
              <Image style={[imgShare,imgMargin]} source={socialDD} />
              <Text style={colorTextPP}><Text style={colorWhite}>{listStatus.countShare}k</Text></Text>
          </View>
          <View style={flexRow}>
              <Image style={[imgShare,imgMargin]} source={userDD} />
              <Text style={colorTextPP}><Text style={colorWhite}>{listStatus.countUser}</Text></Text>
          </View>
          </View>

      </View>
    );
  }
}
