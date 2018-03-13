/* @flow */

import React, { Component } from 'react';
import { Platform, View, Text, Image, Alert,
  StyleSheet, Dimensions, TextInput,
  TouchableOpacity, } from 'react-native';
//import { CheckBox } from 'react-native-elements';
import bgMap from '../../src/icon/bg-map.png';
import lang_en from '../lang/en/user/language';
import lang_vn from '../lang/vn/user/language';
import postApi from '../api/postApi';
import global from '../global';
import getLanguage from '../api/getLanguage';

import closeIC from '../../src/icon/ic-close.png';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import FacebookColor from '../../src/icon/Facebook_color.png';
import GoogleColor from '../../src/icon/Google_color.png';
const {height, width} = Dimensions.get('window');

function isEmail(text){
  let email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  return email.test(text);
}

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang : lang_vn,
      email:'',
      errMsg:'',
    }
    this.getLang();
  }
  getLang(){
    getLanguage().then((e) =>{
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
     }
    });
  }

  forgotPwd(){
    const {errMsg, lang, email } = this.state;
    if(isEmail(email)===false){
      return this.setState({errMsg:`${lang.format_email}`});
    }

    var arr = new FormData();
    arr.append('email',email);
    this.setState({email:''});

    postApi(`${global.url}${'forgot-password?lang='}${lang.lang}`,arr).then(e=>{
      if(e.code===200){
        Alert.alert(lang.notify,lang.send_email)
      }else{
        Alert.alert(lang.notify,`${e.message}`)
      }

    })
  }

  render() {
    const {
      container, imgLogo, title, txtInput,mrgTop,
      btn, colorPress, contentWrap,txtAlign,bgImg,
      show,hide,
    } = styles;
    const {goBack} = this.props.navigation;
    const {lang,errMsg} = this.state;
    return (
      <View style={container}>
      <Image source={bgMap} style={bgImg} />
        <View style={contentWrap}>
              <TouchableOpacity style={{position:'absolute',top:15,right:15,zIndex:9}}
              onPress={()=>goBack()}>
              <Image source={closeIC} style={{width:24,height:24}} />
              </TouchableOpacity>

              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>{lang.forgot_pwd.toUpperCase()}</Text>
              <View style={mrgTop}>
              <TextInput style={txtInput} underlineColorAndroid='transparent' selectionColor='#5b89ab' placeholder="Email" placeholderTextColor="#ddd"
              keyboardType={'email-address'}
              onChangeText={(email)=>this.setState({email})}
              value={this.state.email} />
              </View>
              <View style={errMsg!=='' ? show : hide}>
              <Text style={{color:'#D0021B'}}>* {errMsg}</Text>
              </View>
              <Text style={[mrgTop,txtAlign]}>{lang.info_pwd}</Text>
              <TouchableOpacity
              onPress={()=>{this.forgotPwd()}}>
              <Text style={[btn,colorPress]}>{lang.send.toUpperCase()}</Text>
              </TouchableOpacity>

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
  show : { display: 'flex'},
  hide : { display: 'none'},
});
