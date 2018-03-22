/* @flow */

import React, { Component } from 'react';
import { Platform, View, Text, Image, Button, StyleSheet, Dimensions, TextInput,TouchableOpacity,ScrollView, Alert } from 'react-native';
//import { CheckBox } from 'react-native-elements';
import lang_en from '../lang/en/user/language';
import lang_vn from '../lang/vn/user/language';
import postApi from '../api/postApi';
import global from '../global';
import getLanguage from '../api/getLanguage';

import closeIC from '../../src/icon/ic-close.png';
import bgMap from '../../src/icon/bg-map.png';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import FacebookColor from '../../src/icon/Facebook_color.png';
import GoogleColor from '../../src/icon/Google_color.png';
const {height, width} = Dimensions.get('window');

function hasNumber(text) {
  return /\d/.test(text);
}
function isEmail(text){
  let email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  return email.test(text);
}

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: lang_vn,
      full_name:'',
      err_fullname:'',
      email:'',
      err_email:'',
      phone:'',
      err_phone:'',
      pwd:'',
      err_pwd:'',
      re_pwd:'',
      err_repwd:'',
      errMsg:'',
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
  handlePhone = (phone) => {
    if (/^\d+$/.test(phone)) {
      this.setState({ phone });
    }
  }
  signUp(){
    let err=false;
    const {errMsg,err_fullname, full_name, phone, email, pwd,re_pwd, lang } = this.state;

    if(full_name===''){
      this.setState({err_fullname:lang.err_fullname});
      err=true;
    }else {
      if(hasNumber(full_name)){
        this.setState({err_fullname:lang.err_format});
        err=true;
      }else {
        this.setState({err_fullname:''});
      }
    }

    if(email===''){
      this.setState({err_email:lang.err_email});
      err=true;
    }else {
      if(!isEmail(email)){
        this.setState({err_email:lang.err_email_format});
        err=true;
      }else {
        this.setState({err_email:''});
      }
    }
    if(phone==='') {
      this.setState({err_phone:lang.err_phone});
      err=true;
    }else {
      this.setState({err_phone:''});
    }
    if(pwd.length<6){
      this.setState({err_pwd:lang.err_pwd_length});
      err=true;
    }else {
      this.setState({err_pwd:''});
    }
    if(pwd!==re_pwd) {this.setState({errMsg:lang.err_pwd_repwd});err=true;}
    if(err){
      return false;
    }else{

      var arr = new FormData();
      arr.append('full_name',full_name);
      arr.append('phone',phone);
      arr.append('email',email);
      arr.append('password',pwd);

      postApi(`${global.url}${'register?lang='}${this.state.lang.lang}`,arr).then(e=>{
        if(e.code===200){
          Alert.alert(lang.notify,`${lang.active_acc}`)
        }else{
          Alert.alert(lang.notify,`${e.message}`)
        }

      });
    }
  }
  render() {
    const {
      container, imgLogo, title, txtInput,mrgTop,imgSoci,bgImg,
      btn, colorPress, contentWrap, btnWrap,forgotpwd,btnWrapSoci,
      txtErr,show,hide,flexStart,
    } = styles;
    const {lang,errMsg,err_fullname, err_email,err_phone, err_pwd} =this.state;
    const {navigate,goBack} = this.props.navigation;
    return (

      <View style={container}>

      <Image source={bgMap} style={bgImg} />

      <ScrollView>
        <View style={contentWrap}>
              <TouchableOpacity style={{position:'absolute',top:15,right:15,zIndex:9}}
              onPress={()=>goBack()}>
                  <Image source={closeIC} style={{width:24,height:24}} />
              </TouchableOpacity>

              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>{`${lang.register}`.toUpperCase()}</Text>

          <View style={mrgTop}>
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder={`${lang.full_name}`} placeholderTextColor="#ddd"
                autoFocus onSubmitEditing={(event)=> this.refs.email.focus()}
                value={this.state.full_name}
                onChangeText={(full_name)=>this.setState({full_name})} />
              <View style={[mrgTop,err_fullname !=='' ? show : hide]}>
              <Text style={txtErr}>{err_fullname}</Text>
              </View>

              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder="Email" placeholderTextColor="#ddd"
              keyboardType={'email-address'} onSubmitEditing={(event)=> this.refs.phone.focus()}
              ref='email'
              value={this.state.email}
              onChangeText={(email)=>this.setState({email})}/>

              <View style={[mrgTop,err_email !=='' ? show : hide]}>
              <Text style={txtErr}>{err_email}</Text>
              </View>

              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder={`${lang.phone}`} placeholderTextColor="#ddd"
              keyboardType={'numeric'} onSubmitEditing={(event)=> this.refs.pwd.focus()}
              ref='phone' maxLength={11} minLength={10}
              value={this.state.phone}
              onChangeText={(phone)=>this.handlePhone(phone)} />

              <View style={[mrgTop,err_phone !=='' ? show : hide]}>
              <Text style={txtErr}>{err_phone}</Text>
              </View>

              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder={`${lang.pwd}`} placeholderTextColor="#ddd" secureTextEntry
              onSubmitEditing={(event)=> this.refs.repwd.focus()}
              maxLength={32} ref='pwd' value={this.state.pwd}
              onChangeText={(pwd)=>this.setState({pwd})} />

              <View style={[mrgTop,err_pwd !=='' ? show : hide]}>
              <Text style={txtErr}>{err_pwd}</Text>
              </View>

              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholder={`${lang.re_pwd}`} placeholderTextColor="#ddd" secureTextEntry
              ref='repwd' value={this.state.re_pwd} maxLength={32}
              onChangeText={(re_pwd)=>this.setState({re_pwd})}/>

              <View style={[flexStart,mrgTop,errMsg!=='' ? show : hide]}>
              <Text style={txtErr}>{errMsg}</Text>
              </View>
              <View style={{height:30}}></View>
              <TouchableOpacity style={[mrgTop]} onPress={()=>this.signUp()}>
              <Text style={[btn,colorPress]}>{`${lang.register}`.toUpperCase()}</Text>
              </TouchableOpacity>


        </View>
              <View style={[btnWrapSoci,mrgTop]}>
                  <Image style={imgSoci} source={FacebookColor} />
                  <Image style={imgSoci} source={GoogleColor} />
              </View>
              <View style={[btnWrap]}>
                  <Text>{`${lang.ask_acc_login}`}  </Text><TouchableOpacity onPress={()=>navigate('LoginScr',{backScr:''})}>
                  <Text style={forgotpwd}>{`${lang.log_now}`}</Text></TouchableOpacity>
              </View>

        </View>
        </ScrollView>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,minHeight:height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'transparent',
  },
  flexStart:{alignSelf:'flex-start',alignItems:'flex-start',},
  show:{display:'flex'},
  hide:{display:'none'},
  txtErr:{color:'#BF2827'},
  btnWrap :{flexDirection: 'row',alignItems: 'center',justifyContent:'center',marginTop:40},
  forgotpwd : {textAlign: 'right', color: '#5b89ab'},
  pullL : {textAlign: 'left',},
  pullR : {textAlign: 'right',},
  mrgTop:{ marginTop : 15},
  btnWrapSoci: {width: 90, justifyContent: 'space-between', flexDirection:'row',},
  contentWrap : {width,minHeight:height, padding:25,paddingTop:55,marginBottom:75,alignItems: 'center',justifyContent: 'center',},
  imgLogo : {
    width : 60,
    height : 60,
  },
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
    padding:10,
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
