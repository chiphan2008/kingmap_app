/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput,
  Alert,TouchableOpacity,PermissionsAndroid, AsyncStorage } from 'react-native';
import RNSettings from 'react-native-settings';
const {height, width} = Dimensions.get('window');

import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';
import accessLocation from '../../api/accessLocation';
//import requestLocationPermission from '../../api/accessLocation';
import global from '../../global';
import styles from '../../styles.js';

import bgMap from '../../../src/icon/bg-map.png';
//import test from '../../../src/icon/test.svg';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import infoIC from '../../../src/icon/ic-white/ic-analysis.png';
import socialIC from '../../../src/icon/ic-white/ic-social.png';

import upDD from '../../../src/icon/ic-white/ic-dropdown_up.png';
import locationDD from '../../../src/icon/ic-gray/ic-location.png';
import onlineDD from '../../../src/icon/ic-gray/ic-online.png';
import checkDD from '../../../src/icon/ic-gray/ic-check-gray.png';
import likeDD from '../../../src/icon/ic-gray/ic-like.png';
import socialDD from '../../../src/icon/ic-gray/ic-social.png';
import plusIC from '../../../src/icon/ic-home/ic-plus.png';
import facebookIC from '../../../src/icon/ic-home/ic-facebook.png';
import googleIC from '../../../src/icon/ic-home/ic-google.png';
import twitterIC from '../../../src/icon/ic-home/ic-twitter.png';

import logoHome from '../../../src/icon/ic-home/Logo-home.png';
import hospitalOval from '../../../src/icon/ic-home/Oval-hospital.png';

import {Select, Option} from "react-native-chooser";

export default class HomeTab extends Component {
  constructor(props) {
    super(props);
    staticLang_vn = {
      other:'Khác',
      location:'Địa điểm',
      online:'Trực tuyến',
      new_location:'Địa điểm mới',
      like : 'Thích',
      share : 'Chia sẽ',
    }
    staticLang_en = {
      other:'Other',
      location:'Location',
      online:'Online',
      new_location:'New location',
      like : 'Like',
      share : 'Share',
    };
    this.state = {
      //permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      Width_Layout:'',
      Height_Layout:'',
      listCategory : [],
      listStatus : [],
      lang : staticLang_vn,
      selectLang: {
        valueLang : "vn",
        labelLang : "VIE",
      },
      showInfo : false,
      showShare : false,
      latitude: null,
      longitude: null,
      error: null,

    };

    accessLocation();
    arrLang = [{name:'VIE',v:'vn'},{name:'ENG',v:'en'}];
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
          e.valueLang==='vn' ?  this.setState({lang : staticLang_vn}) : this.setState({lang : staticLang_en});
          this.getCategory(this.state.selectLang.valueLang);
     }
    });
  }

  onSelectLang(value, label) {
    AsyncStorage.setItem('@MyLanguage:key',JSON.stringify({valueLang:value,labelLang :label}));
    value==='vn' ?  this.setState({lang : staticLang_vn}) : this.setState({lang : staticLang_en});
    this.getCategory(value)
    this.setState({
      selectLang: {
        valueLang : value,
        labelLang : label,
      },
      showShare:false,
      showInfo:false,
    });
  }
  getCategory(lang){
    getApi(global.url+'categories?language='+lang)
    .then(arrCategory => {
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


  render() {
    const {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
    //console.log("this.props.Hometab=",util.inspect(this.state.listCategory,false,null));
    const {
      container, bgImg,
      headStyle, headContent,imgLogoTop,imgSocial, imgWidthGoogle, imgInfo,imgShare,wrapIcRight,FlatList,
      selectBox,optionListStyle,OptionItem,inputSearch,show,hide,colorTextPP,colorNumPP,
      wrapContent,imgContent,square,wrapCircle,logoCenter,circle1,circle2,circle3,circle4,circle5,circle6,circle7,circle8,labelCat,
      plusStyle,imgPlusStyle,popover,overLayout,listOver,popoverShare,overLayoutShare,listOverShare,imgMargin,imgUpHome,imgUpInfo,imgUpShare
    } = styles;

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
          <TextInput underlineColorAndroid='transparent' placeholder="Find place" style={inputSearch} />
          <Image style={{width:16,height:16,top:-28,left:-50}} source={searchIC} />
        </View>

        <View style={wrapContent}>
            <View style={square}>

            {
              this.state.listCategory.map((e)=>{
                //console.log(e.sub_category)
                switch (e.alias) {
                  case 'do-an':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle1]}
                          onPress={() => navigate('CatScr',{idCat:e.id,name_cat:e.name,sub_cat:e.sub_category, }) }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}  >{e.name}</Text>
                      </TouchableOpacity>)
                  case 'thuc-uong':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle2]}
                          onPress={() => navigate('CatScr',{idCat:e.id,name_cat:e.name,sub_cat:e.sub_category}) }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}  >{e.name}</Text>
                      </TouchableOpacity>);
                  case 'thoi-trang':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle3]}
                          onPress={() => navigate('CatScr',{idCat:e.id,name_cat:e.name,sub_cat:e.sub_category}) }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}  >{e.name}</Text>
                      </TouchableOpacity>);
                  case 'ngan-hang':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle4]}
                          onPress={() => navigate('CatScr',{idCat:e.id,name_cat:e.name,sub_cat:e.sub_category}) }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}  >{e.name}</Text>
                      </TouchableOpacity>);
                  case 'giai-tri':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle5]}
                          onPress={() => navigate('CatScr',{idCat:e.id,name_cat:e.name,sub_cat:e.sub_category}) }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}  >{e.name}</Text>
                      </TouchableOpacity>);
                  case 'khach-san':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle6]}
                          onPress={() => navigate('CatScr',{idCat:e.id,name_cat:e.name,sub_cat:e.sub_category}) }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                        <Text style={labelCat}  >{e.name}</Text>
                      </TouchableOpacity>);

                  //default:

                }
              })
            }

              <TouchableOpacity
              onPress={()=>navigate('OtherCatScr')}
              style={[wrapCircle,logoCenter]}>
              <Image style={imgContent} source={logoHome} />
              <Text style={labelCat}>{this.state.lang.other}</Text>
              </TouchableOpacity>

            </View>
        </View>
        <TouchableOpacity style={plusStyle}>
            <Image source={plusIC} style={imgPlusStyle} />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>this.setState({showInfo:!this.state.showInfo})} style={[popover, this.state.showInfo ? show : hide]}>
          <Image style={[imgUpHome,imgUpInfo]} source={upDD} />

          <View style={overLayout}>
          <View style={listOver}>
              <Image style={[imgInfo,imgMargin]} source={locationDD} />
              <Text style={colorTextPP}>{this.state.lang.location}: <Text style={colorNumPP}>{this.state.listStatus.countContent}k</Text></Text>
          </View>
          <View style={listOver}>
              <Image style={[imgInfo,imgMargin]} source={onlineDD} />
              <Text style={colorTextPP}>{this.state.lang.online}: <Text style={colorNumPP}>{this.state.listStatus.countOnline}</Text></Text>
          </View>
          <View style={listOver}>
              <Image style={[imgInfo,imgMargin]} source={checkDD} />
              <Text style={colorTextPP}>{this.state.lang.new_location}: <Text style={colorNumPP}>{this.state.listStatus.newContent}k</Text></Text>
          </View>
          <View style={listOver}>
              <Image style={[imgInfo,imgMargin]} source={likeDD} />
              <Text style={colorTextPP}>{this.state.lang.like}: <Text style={colorNumPP}>{this.state.listStatus.countLike}k</Text></Text>
          </View>
          <View style={listOver}>
              <Image style={[imgInfo,imgMargin]} source={socialDD} />
              <Text style={colorTextPP}>{this.state.lang.share}: <Text style={colorNumPP}>{this.state.listStatus.countShare}k</Text></Text>
          </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>this.setState({showShare:!this.state.showShare})} style={[popoverShare, this.state.showShare ? show : hide]}>
          <Image style={[imgUpHome,imgUpShare]} source={upDD} />
            <View style={overLayoutShare}>
                <TouchableOpacity style={listOverShare}>
                    <Image style={[imgWidthGoogle,imgMargin]} source={googleIC} />
                    <Text style={colorNumPP}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={listOverShare}>
                    <Image style={[imgShare,imgMargin]} source={facebookIC} />
                    <Text style={colorNumPP}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={listOverShare}>
                    <Image style={[imgShare,imgMargin]} source={twitterIC} />
                    <Text style={colorNumPP}>Twitter</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>

      </View>
    );
  }
}
