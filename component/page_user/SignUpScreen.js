/* @flow */

import React, { Component } from 'react';
import { Platform, View, Text, Image, Button, StyleSheet, Dimensions, TextInput,TouchableOpacity } from 'react-native';
//import { CheckBox } from 'react-native-elements';
import bgMap from '../../src/icon/bg-map.png';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import FacebookColor from '../../src/icon/Facebook_color.png';
import GoogleColor from '../../src/icon/Google_color.png';
const {height, width} = Dimensions.get('window');

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked : true,
    }
  }
  render() {
    const {
      container, imgLogo, title, txtInput,mrgTop,imgSoci,bgImg,
      btn, colorPress, contentWrap, btnWrap,forgotpwd,btnWrapSoci,
    } = styles;
    const {navigate} = this.props.navigation;
    return (
      <View style={container}>
      <Image source={bgMap} style={bgImg} />
        <View style={contentWrap}>
              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>REGISTER</Text>
              <View style={mrgTop}>
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder="Full name" placeholderTextColor="#ddd" />
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder="Email" placeholderTextColor="#ddd" />
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder="Phone number" placeholderTextColor="#ddd" />
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder="Password" placeholderTextColor="#ddd" secureTextEntry/>
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder="Re-Password" placeholderTextColor="#ddd" secureTextEntry />
              </View>

              <Text style={[btn,colorPress]}>REGISTER</Text>
              <View style={[btnWrapSoci,mrgTop]}>
                  <Image style={imgSoci} source={FacebookColor} />
                  <Image style={imgSoci} source={GoogleColor} />
              </View>
              <View style={btnWrap}>
                  <Text>Do not have an account?  </Text><TouchableOpacity onPress={()=>navigate('LoginScr')}>
                  <Text style={forgotpwd}>Login now!</Text></TouchableOpacity>
              </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor:'transparent',
  },
  btnWrap :{marginTop:50,flexDirection: 'row',alignItems: 'center',justifyContent: 'center',},
  forgotpwd : {textAlign: 'right', color: '#5b89ab'},
  pullL : {textAlign: 'left',},
  pullR : {textAlign: 'right',},
  mrgTop:{ marginTop : 15},
  btnWrapSoci: {width: 65, justifyContent: 'space-between', flexDirection:'row',},
  contentWrap : { flex : 1,alignItems: 'center',justifyContent: 'center',},
  imgLogo : {
    width : 60,
    height : 60,
  },
  imgSoci : {
    width : 30,
    height : 30,
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
    marginTop: Platform.OS === 'ios' ? 10 : 15,
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
