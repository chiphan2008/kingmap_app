/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity} from 'react-native';
const {height, width} = Dimensions.get('window');


import bgMap from '../../../src/icon/bg-map.png';
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
import hotelOval from '../../../src/icon/ic-home/Oval-hotel.png';
import bankOval from '../../../src/icon/ic-home/Oval-bank.png';
import foodOval from '../../../src/icon/ic-home/Oval-food.png';
import logoHome from '../../../src/icon/ic-home/Logo-home.png';
import entertainmentOval from '../../../src/icon/ic-home/Oval-entertainment.png';
import coffeeOval from '../../../src/icon/ic-home/Oval-coffee.png';
import shopOval from '../../../src/icon/ic-home/Oval-shop.png';

import {Select, Option} from "react-native-chooser";

export default class Hometab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueLang : "VIE",
      showInfo : false,
      showShare : false,
    }
  }
  onSelectLang(value, label) {
    this.setState({
      valueLang : value
    });
  }
  goToCat(){
    this.props.navigation.navigate('LocationT');
  }
  render() {
    const {navigation} = this.props;
    //console.log("this.props.Hometab=",util.inspect(this.props.navigation,false,null));
    const {
      container, bgImg,
      headStyle, headContent,imgLogoTop,imgSocial, imgInfo,wrapIcRight,
      selectBox,optionListStyle,OptionItem,inputSearch,show,hide,colorTextPP,colorNumPP,
      wrapContent,leftContent,rightContent,middleContent,imgContent,labelCat,
      plusStyle,popover,overLayout,listOver,imgMargin,imgUp,imgUpInfo,imgUpShare
    } = styles;

    return (
      <View style={container}>
      <Image source={bgMap} style={bgImg} />
        <View style={headStyle}>
            <View style={headContent}>
            <Select
                  onSelect = {this.onSelectLang.bind(this)}
                  defaultText  = {this.state.valueLang}
                  style = {selectBox}
                  textStyle = {{color:'#fff'}}
                  optionListStyle={optionListStyle}
                  indicatorColor="#fff"
                  indicator="down"
                  indicatorSize={7}
                  transparent
                >
                <Option style={OptionItem} value ="VIE">VIE</Option>
                <Option style={OptionItem} value="ENG">ENG</Option>
            </Select>
            <Image source={logoTop} style={imgLogoTop} />
                <View style={wrapIcRight}>
                  <TouchableOpacity onPress={()=> this.setState({showInfo:!this.state.showInfo,showShare:false}) } >
                    <Image source={infoIC} style={imgInfo} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> this.setState({showShare:!this.state.showShare,showInfo:false}) } >
                      <Image source={socialIC} style={imgSocial} />
                  </TouchableOpacity>
                </View>

          </View>
          <TextInput underlineColorAndroid='transparent' placeholder="Find place" style={inputSearch} />
          <Image style={{width:16,height:16,top:Platform.OS==='ios' ? -26 : -32,left:(width-80)/2}} source={searchIC} />
        </View>



      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  bgImg : {
    width,height,position: 'absolute',justifyContent: 'center',alignItems: 'center',alignSelf: 'stretch',resizeMode: 'stretch',
  },
  headStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 110,
      position:'relative',zIndex:5,
  },
  inputSearch : {
    marginTop: 8,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,textAlign:'center',
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  imgLogoTop : {
      width: 138,height: 25,
  },
  imgContent : {
      width: 65,height: 65,marginBottom:10,resizeMode : 'cover',
  },
  labelCat :{
    marginBottom:40,backgroundColor:'transparent',textAlign:'center',width:65,
  },
  wrapIcRight:{
    width:55,justifyContent: 'space-between',flexDirection: 'row',marginTop: 7,
  },
  imgInfo : {
      width: 20,height: 20,
  },
  imgSocial : {
      width: 21,height: 23,
  },
  selectBox : {
    width:50,borderColor:'transparent',position:'relative',paddingLeft:0,paddingTop:5,
  },
  optionListStyle :{
    backgroundColor:'#fff',borderColor:'transparent',position:'absolute',width: 55,  height:60,
    top:Platform.OS ==='ios' ? 48 : 35,left:10,
  },
  OptionItem : {
    paddingTop: 7,paddingBottom: 0,marginTop: 0,marginBottom: 0,
  },
  wrapContent :{
    flexDirection:'row',
    alignItems:'center',
    flex:1,
    overflow:'hidden',
  },
  leftContent :{
    justifyContent:'space-between',
    alignItems:'flex-end',
    flex:1,
  },
  rightContent :{
    justifyContent:'space-between',
    alignItems:'flex-start',
    flex:1,
  },
  middleContent :{
    justifyContent:'space-between',
    alignItems:'center',
    flex:1,
  },
  plusStyle :{width:50,height:50,bottom:10,position:'absolute',right:10},
  popover : {
    top: Platform.OS ==='ios' ? 55 :40,
    alignItems:'center',
    position:'absolute',
    width,height:300,
    zIndex:5,
  },
  colorTextPP :{color:'#B8BBC0'},
  colorNumPP :{fontWeight: 'bold',color:'#2F353F'},
  imgUp:{width: 14,height: 7,top:1,position:'absolute'},
  imgUpInfo :{right:58},
  imgUpShare :{right:20},
  imgMargin: {margin:10},
  listOver:{alignItems:'center',flexDirection:'row',padding:10,borderBottomColor:'#EEEDEE', borderBottomWidth:1,},
  overLayout:{backgroundColor:'#fff',width: width-20,borderRadius:4,overflow:'hidden',top:7},
  show : { display: 'flex'},
  hide : { display: 'none'},
});
