/* @flow */

import React, { Component } from 'react';
import {
  Platform, View, Text, Image, Button,TouchableOpacity,StyleSheet,
  Dimensions, TextInput, ScrollView } from 'react-native';
//import { CheckBox } from 'react-native-elements';
//import RoundCheckbox from 'rn-round-checkbox';
import loginApi from '../api/loginApi';
import getLanguage from '../api/getLanguage';
import lang_en from '../lang/en/user/language';
import lang_vn from '../lang/vn/user/language';
import global from '../global';

import closeIC from '../../src/icon/ic-close.png';
import bgMap from '../../src/icon/bg-map.png';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import FacebookColor from '../../src/icon/Facebook_color.png';
import GoogleColor from '../../src/icon/Google_color.png';
import checkIC from '../../src/icon/ic-check.png';
import uncheckIC from '../../src/icon/ic-uncheck.png';
const {height, width} = Dimensions.get('window');

function isEmail(text){
  let email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  return email.test(text);
}

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: true,
      isCheck:true,
      txtUsername:'',
      txtPassword:'',
      errMsg:null,
      lang: lang_vn,
    }
    this.getLang();
  }

  getLang(){
    getLanguage().then((e) =>{
      //console.log(e);
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
     }
    });
  }

  callLogin(backScr){
    const {txtUsername, txtPassword, lang} = this.state;
    if(txtUsername==='') return this.setState({errMsg:lang.err_email});
    if(txtPassword==='') return this.setState({errMsg:lang.err_pwd});
    const param = {username:txtUsername,password:txtPassword};
    loginApi(`${global.url}${'login'}`,param).then(e=>{
      if(e.code!==200){
        this.setState({errMsg:this.state.lang.wrong_pwd})
      }else{
        if(backScr!=='')
        this.props.navigation.goBack();
        else
        this.props.navigation.navigate('MainScr');
      }
    })
  }
  render() {
    const {
      container, imgLogo, title, imgSoci,btnWrapSoci,txtInput,mrgTop,pullR, pullL,
      btn, colorPress,  btnWrap, contentWrap,wrapAdv, rememberClass, forgotpwd,
      bgImg,imgCheck,txtErr,show,hide,
    } = styles;
    //console.log('this.props.navigation',this.props.navigation);
    const {lang} = this.state;
    const {navigate, goBack} = this.props.navigation;
    const {backScr} = this.props.navigation.state.params;
    return (
      <View style={container}>
        <Image source={bgMap} style={bgImg} />
        <ScrollView>
        <TouchableOpacity style={{position:'absolute',top:15,right:15,zIndex:9}}
        onPress={()=>goBack()}>
        <Image source={closeIC} style={{width:24,height:24}} />
        </TouchableOpacity>
        <View style={contentWrap}>
              <View></View>
              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>{`${lang.login}`.toUpperCase()}</Text>
              <View style={mrgTop}>
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholderTextColor="#ddd"
              placeholder={lang.username}
              onSubmitEditing={(event)=> this.refs.pwd.focus()}
              autoFocus
              onChangeText={(text) => this.setState({txtUsername: text})}
               />
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholderTextColor="#ddd" secureTextEntry
              placeholder={lang.pwd} ref='pwd'
              onChangeText={(text) => this.setState({txtPassword: text})}
              />
              </View>
              <View style={[wrapAdv, this.state.errMsg!==null? show : hide]}>
              <Text style={txtErr}> {this.state.errMsg}</Text>
              </View>
              <View style={wrapAdv}>
                    <View  style={rememberClass}>
                    <TouchableOpacity onPress={()=>this.setState({isCheck:!this.state.isCheck})}>
                    <Image source={this.state.isCheck ? checkIC : uncheckIC} style={imgCheck} />
                    </TouchableOpacity>
                    <Text>{lang.remember_me}</Text>
                    </View>

                    <TouchableOpacity onPress={()=>navigate('ForgotScr')}>
                    <Text style={[rememberClass,forgotpwd]}>{lang.forgot_pwd}</Text>
                    </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={()=>this.callLogin(backScr)}>
              <Text style={[btn,colorPress]}>{`${lang.login}`.toUpperCase()}</Text>
              </TouchableOpacity>
              <View style={[btnWrapSoci,mrgTop]}>
                  <Image style={imgSoci} source={FacebookColor} />
                  <Image style={imgSoci} source={GoogleColor} />
              </View>
        </View>
        <View style={btnWrap}>
            <Text>{lang.ask_acc} </Text>
            <TouchableOpacity
            onPress={()=>navigate('SignUpScr')}
            ><Text style={forgotpwd}>{lang.reg_now}</Text></TouchableOpacity>
        </View>
        <View style={{height:15}}></View>
        </ScrollView>
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
  wrapAdv : {width: width - 50, justifyContent: 'space-between', flexDirection:'row'},
  rememberClass : {
    flexDirection:'row',
    width : (width - 80)/2,
    marginTop:5,
  },
  txtErr:{color:'#BF2827',marginTop:7,textAlign:'left'},
  show:{display:'flex'},
  hide:{display:'none'},
  pullL : {textAlign: 'left',},
  pullR : {textAlign: 'right',},
  forgotpwd : {textAlign: 'right', color: '#5b89ab'},
  mrgTop:{ marginTop : 15},
  btnWrapSoci: {width: 90, justifyContent: 'space-between', flexDirection:'row',},
  btnWrap : { flex : 1, flexDirection: 'row',alignItems: 'center',justifyContent: 'center', },
  contentWrap : { width,height:Platform.OS==='ios' ? height-50 : height-65,alignItems: 'center',justifyContent: 'center',},
  imgLogo : {
    width : 60,
    height : 60,
  },
  imgCheck:{width:18,height:18,marginRight:7},
  imgSoci : {
    width : 40,
    height : 40,
  },
  title : {
    fontSize: 22,
    marginTop: 10,
  },
  txtInput:{
    borderColor : "#e0e8ed",
    padding:Platform.OS==='ios' ? 15 : 10,
    borderRadius : 5,
    width: width - 50,
    borderWidth: 1,
    marginTop: 15,
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
