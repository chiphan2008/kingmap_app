/* @flow */

import React, { Component } from 'react';
import { Platform, View, Text, Image, Button, StyleSheet, Dimensions, TextInput } from 'react-native';
//import { CheckBox } from 'react-native-elements';
import bgMap from '../../src/icon/bg-map.png';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import FacebookColor from '../../src/icon/Facebook_color.png';
import GoogleColor from '../../src/icon/Google_color.png';
const {height, width} = Dimensions.get('window');

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked : true,
    }
  }
  render() {
    const {
      container, imgLogo, title, txtInput,mrgTop,
      btn, colorPress, contentWrap,txtAlign,bgImg,
    } = styles;
    return (
      <View style={container}>
      <Image source={bgMap} style={bgImg} />
        <View style={contentWrap}>
              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>FORGOR PASSWORD</Text>
              <View style={mrgTop}>
              <TextInput style={txtInput} underlineColorAndroid='transparent' selectionColor='#5b89ab' placeholder="Email" placeholderTextColor="#ddd" />
              </View>
              <Text style={[mrgTop,txtAlign]}>We will send you a password {"\n"} confirmation email.</Text>

              <Text style={[btn,colorPress]}>SEND</Text>

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

  title : {
    fontSize: 22,
    marginTop: 10,
  },
  txtInput:{
    borderColor : "#e0e8ed",
    padding:15,
    borderRadius : 5,
    width: width - 50,
    borderWidth: 1,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor:'#fff',
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
  bgImg : {
    width,height,position: 'absolute',justifyContent: 'center',alignItems: 'center',alignSelf: 'stretch',resizeMode: 'stretch',
  },
});
