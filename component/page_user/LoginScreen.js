/* @flow */

import React, { Component } from 'react';
import {
  Platform, View, Text, Image, Button,TouchableOpacity,StyleSheet,
  Dimensions, TextInput, ScrollView,Alert,
  DeviceEventEmitter
 } from 'react-native';
//import { CheckBox } from 'react-native-elements';
//import RoundCheckbox from 'rn-round-checkbox';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

import loginApi from '../api/loginApi';
import gooApi from '../api/gooApi';
import getLanguage from '../api/getLanguage';
import checkLogin from '../api/checkLogin';
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

import faceApi from '../api/faceApi';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
var LoginBehavior = {
  'ios': FBLoginManager.LoginBehaviors.Browser,
  'android': FBLoginManager.LoginBehaviors.WebView
}
import {hasNumber,isEmail,checkPassword} from '../libs';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: true,
      isCheck:false,
      disable:false,
      txtUsername:'',
      txtPassword:'',
      errMsg:null,
      lang: lang_vn,
    }
    this.getLang();
    checkLogin().then(e=>{
      this.setState({isCheck:e.remember_me,txtUsername:e.email,txtPassword:e.pwd})
    });
  }

  getLang(){
    getLanguage().then((e) =>{
      //console.log(e);
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
     }
    });
  }

  loginGooIOS(){
    GoogleSignin.signIn().then((user) => {
      console.log('user',user);
    }).done();
    //   this.getGoogleID().then((user) => {
    //     console.log(user);
    //     //Alert.alert('user',user.id)
    //     //this.setState({txtUsername:user.id})
    //     gooApi(`${global.url}${'login-google'}`,user).then(e =>{
    //       if(e.code===200){
    //         this.props.navigation.navigate('MainScr');
    //       }else{
    //         this.setState({errMsg:e.message})
    //       }
    //     })
    // })
  }

  loginFB(){
    var _this=this;
    FBLoginManager.setLoginBehavior(LoginBehavior[Platform.OS]); // defaults to Native
    FBLoginManager.loginWithPermissions(["email","user_friends"], function(error, data){
      if(error) return;
      const profile = JSON.parse(data.profile);
      //console.log(profile.picture.data.url);
      if(profile.email===undefined || profile.email==='') return;
      faceApi(`${global.url}${'login-facebook'}`,profile).then(e =>{
        if(e.code===200){
          _this.props.navigation.navigate('MainScr');
        }else{
          _this.setState({errMsg:e.message})
        }
      })
    })

  }


  callLogin(){
    const {txtUsername, txtPassword, lang,isCheck} = this.state;
    //console.log(this.state);
    if(txtUsername==='' || txtUsername===undefined) return this.setState({errMsg:lang.err_email});
    if(!hasNumber(txtUsername) && !isEmail(txtUsername)) return this.setState({errMsg:lang.err_email_format});
    if(txtPassword==='' || txtPassword===undefined) return this.setState({errMsg:lang.err_pwd});
    this.setState({disable:true});
    const param = {username:txtUsername,password:txtPassword,isCheck};
    const { state,goBack,navigate } = this.props.navigation;
    const params = state.params || {};
    loginApi(`${global.url}${'login'}`,param).then(e=>{
      if(e.code!==200){
        this.setState({errMsg:this.state.lang.wrong_pwd,disable:false})
      }else{
        if(params.backScr!==undefined || params.backScr!=='') navigate('MainScr');
        else {
          DeviceEventEmitter.emit('goback',  {isLogin:true})
          goBack();
        }

      }
    }).catch(err=>{});
  }

  componentWillMount(){
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
    // play services are available. can now configure library
    })
    .catch((err) => {
      console.log("Play services error", err.code, err.message);
    })
    GoogleSignin.configure({
      iosClientId: '1004951541310-3ns8ppuvvallfta76rchcarcq1acbttl.apps.googleusercontent.com', // only for iOS
      webClientId: '972786239931-ca9skanuemmet91712knn6l4m6igm8g9.apps.googleusercontent.com',
      offlineAccess: false
    })
  }
  render() {
    var _this = this;
    const {
      container, imgLogo, title, imgSoci,btnWrapSoci,txtInput,mrgTop,pullR, pullL,
      btn, colorPress,  btnWrap, contentWrap,wrapAdv, rememberClass, forgotpwd,
      bgImg,imgCheck,txtErr,show,hide,
    } = styles;
    //console.log('this.props.navigation',this.props.navigation.state.params);
    const {lang,disable} = this.state;
    const {navigate, goBack, state} = this.props.navigation;
    //console.log('state.params',state.params);
    //const {backScr} = this.props.navigation.state.params;
    return (
      <View style={container}>
        <Image source={bgMap} style={bgImg} />
        <ScrollView>
        <TouchableOpacity style={{position:'absolute',top:15,right:15,zIndex:9}}
        onPress={()=>goBack()}>
        <Image source={closeIC} style={{width:20,height:20}} />
        </TouchableOpacity>
        <View style={contentWrap}>
              <View></View>
              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>{`${lang.login}`.toUpperCase()}</Text>
              <View style={mrgTop}>
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholderTextColor="#ddd"
              placeholder={lang.username}
              onSubmitEditing={(event)=> this.refs.pwd.focus()}
              autoFocus value={this.state.txtUsername}
              onChangeText={(txtUsername) => this.setState({txtUsername})}
               />
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholderTextColor="#ddd" secureTextEntry
              placeholder={lang.pwd} ref='pwd' value={this.state.txtPassword}
              onChangeText={(txtPassword) => this.setState({txtPassword})}
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
              <TouchableOpacity disabled={disable} onPress={()=>{this.callLogin()}}>
              <Text style={[btn,colorPress]}>{`${lang.login}`.toUpperCase()}</Text>
              </TouchableOpacity>
              <View style={[btnWrapSoci,mrgTop]}>
                  <TouchableOpacity onPress={()=>this.loginFB()}>
                  <Image style={imgSoci} source={FacebookColor} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>this.loginGooIOS()}>
                  <Image style={imgSoci} source={GoogleColor} />
                  </TouchableOpacity>
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
