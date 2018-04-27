/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput,ScrollView,
  TouchableOpacity,PermissionsAndroid, AsyncStorage, Modal,Keyboard } from 'react-native';
import RNSettings from 'react-native-settings';
const {height, width} = Dimensions.get('window');
import Geolocation from '../../api/Geolocation';
//import hasLocationPermission from '../../api/hasLocationPermission';


import getApi from '../../api/getApi';
//import reqLatLng from '../../api/reqLatLng';
import getLanguage from '../../api/getLanguage';
import accessLocation from '../../api/accessLocation';
import getLocationByIP from '../../api/getLocationByIP';

import global from '../../global';
import loginServer from '../../api/loginServer';
import checkLogin from '../../api/checkLogin';
import checkLocation from '../../api/checkLocation';
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
import {format_number} from '../../libs';

export default class LocationTab extends Component {
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
      valSearch:'',
    };

    accessLocation();
    checkLogin().then(e=>{
      //console.log(e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        loginServer(e);
        this.setState({user_id:e.id,avatar:e.avatar,code_user:e.phone,isLogin:true});
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
        AsyncStorage.setItem('@currentLocation:key',JSON.stringify({
          latitude,longitude
        }))
        this.setState({curLoc:{
          latitude,longitude
        }},()=>{
          this.getCategory(`${latitude},${longitude}`);
        })
      },
      (error) => {
        // Geolocation().then(e=>{
        //   const {latitude,longitude} = e;
        //   this.setState({curLoc:{
        //     latitude,longitude
        //   }},()=>{
        //     this.getCategory(`${latitude},${longitude}`);
        //   })
        // })
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
    getLanguage().then((e) =>{
      //console.log('lang.Location',e);
      if(e!==null){
          this.setState({
            selectLang:{
              valueLang:e.valueLang,
              labelLang:e.labelLang,
            },
            lang : e.valueLang==='vn' ? lang_vn : lang_en,
          },()=>{
            this.getCategory(e.valueLang);
          });
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
        this.props.screenProps();
    }, 1000);
  }
  getCategory(lang){
    getApi(global.url+'categories?language='+lang+'&limit=100')
    .then(arrCategory => {
      //console.log('arrCategory',arrCategory);
      if(arrCategory!==undefined){setTimeout(() => {
          this.setState({ listCategory: arrCategory.data },()=>{
            this.getListStatus();
          });
      }, 500);}
    })
    .catch(err => console.log(err));
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
      let result = {};
      result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
      result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);
      return result;
  }
  render() {
    //console.log('Location');
    const {height, width} = Dimensions.get('window');
    const {navigate,state} = this.props.navigation;
    //console.log('this.props.navigation',this.props.navigation);
    const {listStatus,listCategory,curLoc} = this.state;
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
              listCategory.map((e,index)=>{
                const x=118;const y=120;const distance=140;
                let items = listCategory.length-1>8 ? 8 : listCategory.length-1;
                let angle = (360/items);
                let pos = this.findNewPoint(x, y, angle, distance);
                if(index<8){
                  switch (e.alias) {

                    default:
                    angle *= index-i;
                    pos = this.findNewPoint(x, y, angle, distance);
                    return (<TouchableOpacity
                        key={e.id}
                        style={{position:'absolute',flex:1,alignItems:'center',top:pos.y,left :pos.x,}}
                        onPress={()=>navigate('SearchScr',{idCat:e.id,labelCat:e.name,service_items:e.service_items, keyword:this.state.valSearch,lat:curLoc.latitude,lng:curLoc.longitude,lang:this.state.lang.lang}) }
                        >
                      <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      <Text style={labelCat}>{e.name}</Text>
                      {/*<Text style={labelNum}>(25)</Text>*/}
                    </TouchableOpacity>);
                    break;
                  }
                }
              })
            }
            <TouchableOpacity style={[wrapCircle,logoCenter]}
              onPress={() => navigate('OtherCatScr',{name_module:'AAA',lang:this.state.lang,curLoc}) }>
            <Image style={imgContent} source={logoHome} />
            <Text style={labelCat}>{this.state.lang.other}</Text>
            </TouchableOpacity>
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{width,backgroundColor:'#2e3c52',paddingRight:10,paddingLeft:5}}>

        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={locationDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countContent)}k</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={onlineDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countOnline)}</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={checkDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.newContent)}k</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={likeDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countLike)}k</Text></Text>
        </View>
        <View style={flexRow}>
            <Image style={[imgShare,imgMargin]} source={socialDD} />
            <Text style={colorTextPP}><Text style={colorWhite}>{format_number(listStatus.countShare)}k</Text></Text>
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
