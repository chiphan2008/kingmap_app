/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,TouchableWithoutFeedback,
  TextInput,Dimensions,ScrollView,StyleSheet,
} from 'react-native';
import styles from '../styles';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import notiIC from '../../src/icon/color-red/ic-notification.png';
const {width,height} = Dimensions.get('window');

export class ListTime extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View style={{padding:15,width}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

        <TextInput underlineColorAndroid='transparent'
        style={{padding:5,width:(width-70)/4,borderWidth:1,borderColor:'#ccc',borderRadius:3}} />

        <TextInput underlineColorAndroid='transparent'
        style={{padding:5,width:(width-70)/4,borderWidth:1,borderColor:'#ccc',borderRadius:3}} />

        <TextInput underlineColorAndroid='transparent'
        style={{padding:5,width:(width-70)/4,borderWidth:1,borderColor:'#ccc',borderRadius:3}} />

        <TextInput underlineColorAndroid='transparent'
        style={{padding:5,width:(width-70)/4,borderWidth:1,borderColor:'#ccc',borderRadius:3}} />

        </View>
      </View>
    );
  }
}

export default class ListOpenTime extends Component {
  constructor(props){
    super(props);
    this.state = {
      index:0,
      listData:[<ListTime key={0} />]
    }
  }

  render() {
    const {
      container,headCatStyle,headContent,titleCreate,show,hide,
    } = styles;
    const {lang} = this.props;
    return (

      <View style={container}>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={()=>{
                this.props.closeModal(`${from_date}`,`${to_date}`,`${from_hour.h}:${padMinutes(from_hour.m)}`,`${to_hour.h}:${padMinutes(to_hour.m)}`)}}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {lang.choose_time} </Text>
              <View></View>
          </View>

      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:25}}>
        {this.state.listData}


      </View>

    </View>

    );
  }
}
