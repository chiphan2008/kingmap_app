/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,Alert,AsyncStorage,
} from 'react-native';
import postApi from '../../api/postApi';
import checkLogin from '../../api/checkLogin';
import getLanguage from '../../api/getLanguage';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import eyeIC from '../../../src/icon/ic-create/ic-eye.png';
import eyeHideIC from '../../../src/icon/ic-create/ic-eye-hide.png';

const {width,height} = Dimensions.get('window');

export default class ChangePwd extends Component {
  constructor(props){
    super(props);
    this.state = {
      pwd_old:'',
      pwd_new:'',
      pwd_cf:'',
      email:'',
      showPwdOld:false,
      showPwdNew:false,
      showPwdCf:false,
      errMsg:'',
      selectLang:{
        valueLang:'',
        labelLang:'',
      },
    }
  }
  componentWillMount(){
    checkLogin().then(e=>this.setState({email:e.email}));
    this.getLang();
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
  updatePwd(){
    if(this.state.pwd_old==='') return this.setState({errMsg:'* Vui lòng nhập mật khẩu hiện tại'})
    if(this.state.pwd_new!==this.state.pwd_cf) return this.setState({errMsg:'* Xác nhận mật khẩu không đúng'})
    if(this.state.pwd_new.length<6) return this.setState({errMsg:'* Mật khẩu tối thiểu là 6 ký tự'})
    const arr = new FormData();
    arr.append('id_user',this.props.userId);
    arr.append('old_password',this.state.pwd_old);
    arr.append('new_password',this.state.pwd_new);


    postApi(`${global.url}${'user/change-password'}`,arr).then(e=>{
      console.log('e',e);
      if(e.code===200){
        AsyncStorage.removeItem('@MyAccount:key');
        Alert.alert(
          'Thông báo',
          'Cập nhật mật khẩu thành công.',
          [
            {text: 'OK', onPress: () => this.gotoLogin()}
          ]
        )}
      if(e.code===400){
        return this.setState({errMsg:`* ${e.message}`})
      }
    });
  }
  gotoLogin(){
    this.props.closeModal();
    this.props.closeSetting();
    this.props.navigation.navigate('LoginScr',{backScr:''})
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,
      imgInfo,wrapInputCreImg,marTop,colorTitle,txt,
      show,hide,flatlistItem,colorErr,
    } = styles;
    return (
      <Modal
      onRequestClose={() => null}
      transparent
      //animationType={'slide'}
      visible={this.props.visible}
      >
        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>this.props.closeModal()}>
                  <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{this.props.labelTitle.toUpperCase()} </Text>
                  <TouchableOpacity onPress={()=>this.updatePwd()}>
                  <Text style={titleCreate}>{'Lưu'} </Text>
                  </TouchableOpacity>
              </View>
          </View>

          <View style={listCreate}>
             <View style={{width:(width-30)/3}}>
             <Text style={colorTitle}>Mật khẩu cũ</Text>
             </View>
             <View style={{width:width-((width-50)/3),flexDirection:'row',alignItems:'center'}}>
             <TextInput underlineColorAndroid='transparent'
             placeholder={'******'}
             secureTextEntry={!this.state.showPwdOld}
             style={{width:width-((width-50)/2),padding:0,paddingRight:15}}
             onChangeText={(pwd_old) => this.setState({pwd_old})}
             value={this.state.pwd_old} />
             <TouchableOpacity
             onPress={()=>{this.setState({showPwdOld:!this.state.showPwdOld})}}>
             <Image source={this.state.showPwdOld ? eyeIC : eyeHideIC} style={{width:18,height:18}} />
             </TouchableOpacity>
             </View>
          </View>

          <View style={{height:15}}></View>
          <View style={listCreate}>
             <View style={{width:(width-30)/3}}>
             <Text style={colorTitle}>Mật khẩu mới</Text>
             </View>
             <View style={{width:width-((width-50)/3),flexDirection:'row',alignItems:'center'}}>
             <TextInput underlineColorAndroid='transparent'
             placeholder={'******'}
             secureTextEntry={!this.state.showPwdNew}
             style={{width:width-((width-50)/2),padding:0,paddingRight:15}}
             onChangeText={(pwd_new) => this.setState({pwd_new})}
             value={this.state.pwd_new} />
             <TouchableOpacity
             onPress={()=>{this.setState({showPwdNew:!this.state.showPwdNew})}}>
             <Image source={this.state.showPwdNew ? eyeIC : eyeHideIC} style={{width:18,height:18}} />
             </TouchableOpacity>
             </View>
          </View>

          <View style={listCreate}>
             <View style={{width:(width-30)/3}}>
             <Text style={colorTitle}>Xác nhận</Text>
             </View>
             <View style={{width:width-((width-50)/3),flexDirection:'row',alignItems:'center'}}>
             <TextInput underlineColorAndroid='transparent'
             placeholder={'******'}
             secureTextEntry={!this.state.showPwdCf}
             style={{width:width-((width-50)/2),padding:0,paddingRight:15}}
             onChangeText={(pwd_cf) => this.setState({pwd_cf})}
             value={this.state.pwd_cf} />
             <TouchableOpacity
             onPress={()=>{this.setState({showPwdCf:!this.state.showPwdCf})}}>
             <Image source={this.state.showPwdCf ? eyeIC : eyeHideIC} style={{width:18,height:18}} />
             </TouchableOpacity>
             </View>
          </View>
          <View style={{height:15}}></View>
            <View style={[flatlistItem,this.state.errMsg!=='' ? show : hide]}><Text style={colorErr}>{this.state.errMsg}</Text></View>

      </View>
    </Modal>
    );
  }
}
