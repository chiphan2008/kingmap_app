/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity} from 'react-native';
const {height, width} = Dimensions.get('window');

import styles from '../../styles';

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
      headStyle, imgLogoTop,imgSocial, imgInfo,wrapIcRight,
      selectBox,optionListStyle,OptionItem,inputSearch,show,hide,colorTextPP,colorNumPP,
      wrapContent,leftContent,rightContent,middleContent,imgContent,labelCat,
      plusStyle,popover,overLayout,listOver,imgMargin,imgUp,imgUpInfo,imgUpShare
    } = styles;

    return (
      <View style={container}>
      <Image source={bgMap} style={bgImg} />
        <View style={headStyle}>

          <TextInput underlineColorAndroid='transparent' placeholder="Find place" style={inputSearch} />
          <Image style={{width:16,height:16,top:Platform.OS==='ios' ? -26 : -32,left:(width-80)/2}} source={searchIC} />
        </View>



      </View>
    );
  }
}
