/* @flow */

import React, { Component } from 'react';
import { Platform, View, Text, Image, Button,TouchableOpacity,StyleSheet, Dimensions, TextInput } from 'react-native';
//import { CheckBox } from 'react-native-elements';
//import RoundCheckbox from 'rn-round-checkbox';
import loginApi from '../api/loginApi';
import global from '../global';

import bgMap from '../../src/icon/bg-map.png';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import FacebookColor from '../../src/icon/Facebook_color.png';
import GoogleColor from '../../src/icon/Google_color.png';
import checkIC from '../../src/icon/ic-check.png';
import uncheckIC from '../../src/icon/ic-uncheck.png';
const {height, width} = Dimensions.get('window');

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: true,
      isCheck:true,
      txtUsername:'',
      txtPassword:'',
      errMsg:null,
    }
  }
  callLogin(){
    //console.log('txtUsername,txtPassword',this.state.txtUsername,this.state.txtPassword);
    const param = {username:this.state.txtUsername,password:this.state.txtPassword};
    loginApi(`${global.url}${'login'}`,param).then(e=>{
      if(e.code!==200){
        this.setState({errMsg:e.message})
      }else{
        this.props.navigation.goBack();
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
    const {navigate} = this.props.navigation;
    return (
      <View style={container}>
        <Image source={bgMap} style={bgImg} />

        <View style={contentWrap}>
              <View></View>
              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>LOGIN</Text>
              <View style={mrgTop}>
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholderTextColor="#ddd"
              placeholder="Email/ Phone number"
              onChangeText={(text) => this.setState({txtUsername: text})}
               />
              <TextInput underlineColorAndroid='transparent' style={txtInput} selectionColor='#5b89ab' placeholderTextColor="#ddd" secureTextEntry
              placeholder="Password"
              onChangeText={(text) => this.setState({txtPassword: text})}
              />
              </View>
              <View style={[wrapAdv, this.state.errMsg!==null? show : hide]}>
              <Text style={txtErr}>* {this.state.errMsg}</Text>
              </View>
              <View style={wrapAdv}>
                    <View  style={rememberClass}>
                    <TouchableOpacity onPress={()=>this.setState({isCheck:!this.state.isCheck})}>
                    <Image source={this.state.isCheck ? checkIC : uncheckIC} style={imgCheck} />
                    </TouchableOpacity>
                    <Text>Remember me</Text>
                    </View>

                    <TouchableOpacity onPress={()=>navigate('ForgotScr')}>
                    <Text style={[rememberClass,forgotpwd]}>Forgot Password</Text>
                    </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={()=>this.callLogin()}>
              <Text style={[btn,colorPress]}>LOGIN</Text>
              </TouchableOpacity>
              <View style={[btnWrapSoci,mrgTop]}>
                  <Image style={imgSoci} source={FacebookColor} />
                  <Image style={imgSoci} source={GoogleColor} />
              </View>
        </View>
        <View style={btnWrap}>
            <Text>Do not have an account? </Text>
            <TouchableOpacity
            onPress={()=>navigate('SignUpScr')}
            ><Text style={forgotpwd}>Register now!</Text></TouchableOpacity>
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
  btnWrapSoci: {width: 65, justifyContent: 'space-between', flexDirection:'row',},
  btnWrap : { flex : 1, flexDirection: 'row',alignItems: 'center',justifyContent: 'center', },
  contentWrap : { flex : 5,alignItems: 'center',justifyContent: 'center',},
  imgLogo : {
    width : 60,
    height : 60,
  },
  imgCheck:{width:18,height:18,marginRight:7},
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
