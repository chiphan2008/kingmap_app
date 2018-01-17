/* @flow */

import React, { Component } from 'react';
import { Platform, View, Text, Image, Button, StyleSheet, Dimensions, TextInput } from 'react-native';
//import { CheckBox } from 'react-native-elements';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import FacebookColor from '../../src/icon/Facebook_color.png';
import GoogleColor from '../../src/icon/Google_color.png';
const {height, width} = Dimensions.get('window');

export default class VerifyAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked : true,
    }
  }
  render() {
    const {
      container, imgLogo, title, txtInput,mrgTop,
      btn, colorPress, contentWrap,txtAlign,verify
    } = styles;
    return (
      <View style={container}>
        <View style={contentWrap}>
              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>VERIFY ACCOUNT</Text>
              <View style={verify}>
                <TextInput underlineColorAndroid='transparent' style={txtInput} returnKeyType={"next"} maxLength = {1} selectionColor='#5b89ab' placeholderTextColor="#ddd" />
                <TextInput underlineColorAndroid='transparent' style={txtInput} returnKeyType={"next"} maxLength = {1}  selectionColor='#5b89ab' placeholderTextColor="#ddd" />
                <TextInput underlineColorAndroid='transparent' style={txtInput} returnKeyType={"next"} maxLength = {1}  selectionColor='#5b89ab' placeholderTextColor="#ddd" />
                <TextInput underlineColorAndroid='transparent' style={txtInput} returnKeyType={"done"} maxLength = {1}  selectionColor='#5b89ab' placeholderTextColor="#ddd" />
              </View>
              <Text style={[mrgTop,txtAlign]}>We will send you a password {"\n"} confirmation email.</Text>

              <Text style={[btn,colorPress]}>CONTINUE</Text>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mrgTop:{ marginTop : 15},
  txtAlign:{ textAlign : 'center'},
  contentWrap : { flex : 1,alignItems: 'center',justifyContent: 'center',},
  imgLogo : {
    width : 60,
    height : 60,
  },
  verify : {flexDirection:'row',justifyContent: 'space-between',width: (width - 100),},
  title : {
    fontSize: 22,
    marginTop: 10,
  },
  txtInput:{
    borderColor : "#e0e8ed",
    padding:15,
    borderRadius : 5,
    width: (width - 50)/6,
    borderWidth: 1,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    textAlign: 'center',
  },
  btn : {
    paddingTop:15,
    paddingBottom:15,
    borderRadius : 5,
    width: width - 50,
    borderWidth: 1,
    marginTop: 15,
  },
  colorPress : {
    fontSize:18,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#D0021B',
    overflow:'hidden',
    borderColor : "#D0021B",
  },
});
