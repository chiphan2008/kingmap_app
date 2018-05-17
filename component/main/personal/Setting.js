/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  Dimensions,PanResponder,Animated,AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';
import ChangePwd from './ChangePwd';
import checkNoti from '../../api/checkNoti';
import checkLogin from '../../api/checkLogin';
import getLanguage from '../../api/getLanguage';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';

const {width,height} = Dimensions.get('window');

export class SwitchButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      pan: 2,
      active:1,
    };
    checkNoti().then(e=>{
      //console.log(e);
      if(e.active!==undefined){
        this.setState({
          pan: Math.round(e.pan),
          active:Math.round(e.active),
        })
      }
    });
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderRelease: (e, gestureState) => {
        const x = Math.round(gestureState.dx);
        if(x < 0){
          this.setState({pan:2,active:1});
          this.props.setNoti(1,2);
        }
        if(x > 2){
          this.setState({pan:20,active:0});
          this.props.setNoti(0,20);
        }
      }

    });
  }

render() {
  //console.log('pan',this.state.pan);
    return (
      <View style={{width:46,height:26,borderWidth:1,borderRadius:13,borderColor:'#D4DAE4',backgroundColor:'#FFFEFF',justifyContent:'center'}}>
        <Animated.View {...this._panResponder.panHandlers} style={{transform:[{translateX:this.state.pan},{translateY:0}] }}>
        <View style={{width:22,height:22,borderRadius:11,backgroundColor:this.state.active===0 ? '#BDC4CD' : '#d0021b' }}>
        </View>
        </Animated.View>
      </View>
    );
  }

}

export default class Setting extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:'',
      user_id:'',
      active:1,
      pan:2,
      showChangePwd:false,
      selectLang:{
        valueLang:'',
        labelLang:'',
      },
    }
  }
  componentWillMount(){
    checkLogin().then(e=>this.setState({email:e.email,user_id:e.id}));
    this.getLang();
  }

  setNotify(){
    AsyncStorage.setItem('@Notify:key',JSON.stringify({active:this.state.active,pan:this.state.pan}) );
  }

  getLang(){
    getLanguage().then((e) =>{
      if(e!==null){
          this.setState({
            selectLang:{
              valueLang:e.valueLang,
              labelLang:e.labelLang,
            }
          });
     }
    });
  }

  render() {
    //console.log(this.props.navigation);
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,show,hide,
      imgInfo,wrapInputCreImg,marTop,colorTitle,txt
    } = styles;

    const {lang} = this.props.navigation.state.params;
    const {goBack} = this.props.navigation;
    return (

        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{this.setNotify();
                    DeviceEventEmitter.emit('goback',  {isLogin:true})
                    goBack();
                  }}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{lang.setting_account.toUpperCase()} </Text>
                  <View></View>
              </View>
          </View>

         <View style={listCreate}>
            <View style={{width:(width-30)/2}}>
            <Text style={colorTitle}>Nhận thông báo</Text>
            </View>
            <View style={{width:(width-30)/2}}>

            <SwitchButton setNoti={(active,pan)=>this.setState({active,pan})}/>

            </View>
         </View>

         <View style={listCreate}>
            <View style={{width:(width-30)/2}}>
            <Text style={colorTitle}>Ngôn ngữ</Text>
            </View>
            <View style={{width:(width-30)/2}}>
            <TouchableOpacity onPress={()=>{
              this.state.selectLang.valueLang==='vn' ? this.setState({selectLang:{valueLang:'en',labelLang:'ENG'}}) : this.setState({selectLang:{valueLang:'vn',labelLang:'VN'}})
            }}>
            <Text style={txt}>{this.state.selectLang.labelLang}</Text>
            </TouchableOpacity>
            </View>
         </View>

         <View style={{height:15}}></View>

         <View style={listCreate}>
            <View style={{width:(width-30)/2}}>
            <Text style={colorTitle}>Email</Text>
            </View>
            <View style={{width:(width-30)/2}}>
            <Text style={{color:'#B8B9BD'}}>{this.state.email}</Text>
            </View>
         </View>

         <View style={listCreate}>
            <View style={{width:(width-30)/2}}>
              <Text style={colorTitle}>Mật khẩu</Text>
            </View>

            <View style={{width:(width-30)/2}}>
              <TouchableOpacity onPress={()=>this.setState({showChangePwd:true})}>
              <Text style={colorTitle}>******</Text>
              </TouchableOpacity>
            </View>
            <ChangePwd
            navigation={this.props.navigation}
            userId={this.state.user_id}
            labelTitle={`${'Thay đổi mật khẩu'}`}
            visible={this.state.showChangePwd}
            closeSetting={()=>this.props.closeModal()}
            closeModal={()=>{this.setState({showChangePwd:false});}} />

         </View>


      </View>

    );
  }
}
