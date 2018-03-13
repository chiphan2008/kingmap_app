/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,BackHandler,
  TextInput,Dimensions,ScrollView,Alert,AsyncStorage,
} from 'react-native';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import postApi from '../../api/postApi';
import lang_vn from '../../lang/vn/user/language';
import lang_en from '../../lang/en/user/language';
import checkLogin from '../../api/checkLogin';
import global from '../../global';
import styles from '../../styles';

import nameLocationIC from '../../../src/icon/ic-create/ic-name-location.png';
import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import cameraIC from '../../../src/icon/ic-create/ic-camera.png';
import dateIC from '../../../src/icon/ic-create/ic-date.png';
import emailIC from '../../../src/icon/ic-create/ic-email.png';
import phoneIC from '../../../src/icon/ic-create/ic-phone.png';
import locationIC from '../../../src/icon/ic-create/ic-location.png';
import descriptionIC from '../../../src/icon/ic-create/ic-description.png';
const {width,height} = Dimensions.get('window');

function hasNumber(myString) {
  return /\d/.test(myString);
}

export default class UpdateInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      lang:lang_vn,
      full_name:'',
      birthday:'',
      phone:'',
      address:'',
      email:'',
      description:'',
      avatar:'',
      pwd:'',
      imgAvatar:{},
    }
  }

  // componentDidMount(){
  //   BackHandler.addEventListener('hardwareBackPress', this.onBackPress());
  // }
  // componentWillUnmount(){
  //   BackHandler.removeEventListener('hardwareBackPress', this.onBackPress());
  // }
  componentWillMount(){
    this.props.lang ==='en' ? this.setState({lang:lang_en}) : this.setState({lang:lang_vn})

    checkLogin().then(e=>{
      //console.log(`${global.url_media}/${e.avatar}`);
      this.setState({
        full_name:e.full_name,
        birthday: Moment(e.birthday).format('DD/MM/YYYY'),
        phone:e.phone,
        email:e.email,
        address:e.address,
        description:e.description,
        avatar:`${global.url_media}/${e.avatar}`,
        pwd:e.pwd,
        errMsg:'',
      });
    });
  }
  uploadAvatar(){
    ImagePicker.openPicker({
      cropping: true
    }).then(image =>{
      //console.log(image);
      this.setState({imgAvatar:image,avatar:image.path});
    });
  }
  updateUser(){
    let errMsg;
    const {  lang, birthday,full_name,phone } = this.state;
    //console.log('lang',lang);
    const day = String(birthday).split('/');
    //&& hasNumber(day[1])===false && hasNumber(day[0])===false && birthday.length!==10
    if(hasNumber(day[2])===false || hasNumber(day[1])===false || hasNumber(day[0])===false || birthday.length!==10 ){
      errMsg=lang.err_format;
    }
    //console.log(day[2]);
    if(hasNumber(phone)===false)  errMsg = lang.enter_numberic;

    if(hasNumber(full_name))  errMsg = lang.enter_text;
    if(full_name.length<3)  errMsg = lang.fullname_minlength;

    return  Alert.alert(lang.err,errMsg )
    const arr = new FormData();
    arr.append('full_name',full_name);
    arr.append('birthday',`${day[2]}-${day[1]}-${day[0]}`);
    arr.append('phone',phone);
    arr.append('address',this.state.address);
    arr.append('description',this.state.description);
    if(this.state.imgAvatar.path!==undefined){
      arr.append(`avatar`, {
        uri:`${this.state.imgAvatar.path}`,
        name: `my_avatar.jpg`,
        type: `${this.state.imgAvatar.mime}`
      });
    }
    //console.log(`${global.url}${'user/update/'}${this.props.userId}`);
    postApi(`${global.url}${'user/update/'}${this.props.userId}`,arr).then(e=>{
      //console.log(e);
      if(e.code===200){
        AsyncStorage.setItem('@MyAccount:key', JSON.stringify(Object.assign(e.data,{'pwd':this.state.pwd})));
        Alert.alert(lang.notify,'Cập nhật thành công.',
        [
          {text: 'OK', onPress: ()=>this.props.closeModal()}
        ])
      }
    });
  }
  onBackPress () {
      this.props.closeModal();
      return true
   }

  render() {
    //console.log(this.props.lang);
    const {
      wrapper,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,
      imgInfo,wrapInputCreImg,marTop,colorErr,
    } = styles;
    return (
      <Modal
      onRequestClose={() => null}
      transparent
      animationType={'slide'}
      visible={this.props.visible}
      >
      <ScrollView>
        <View style={wrapper}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>this.props.closeModal()}>
                  <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{this.props.labelTitle.toUpperCase()} </Text>
                  <TouchableOpacity onPress={()=>this.updateUser()}>
                  <Text style={titleCreate}>{'Lưu'} </Text>
                  </TouchableOpacity>
              </View>
          </View>

         <View style={{height:150,justifyContent:'center',alignItems:'center'}}>
          <Image source={{isStatic:true,uri:this.state.avatar}} style={{width:90,height:90,borderRadius:45}} />
          <TouchableOpacity style={{position:'absolute',top:90,right:(width/2)-45,padding:6,borderRadius:13,backgroundColor:'#fff',}}
          onPress={()=>this.uploadAvatar()}>
          <Image source={cameraIC} style={{width:16,height:16,}} />
          </TouchableOpacity>
         </View>

         <View style={listCreate}>
             <View style={widthLblCre}>
             <Image source={nameLocationIC} style={imgInfo} />
             </View>
             <TextInput underlineColorAndroid='transparent'
             returnKeyType = {"next"}
             onSubmitEditing={(event) => {this.refs.birthday.focus();}}
             style={wrapInputCreImg}
             placeholder={'Họ tên'}
             onChangeText={(full_name) => this.setState({full_name})}
             value={this.state.full_name}
              />
              <View style={{width:15}}></View>
         </View>
         <View style={listCreate}>
             <View style={widthLblCre}>
             <Image source={dateIC} style={imgInfo} />
             </View>
             <TextInput underlineColorAndroid='transparent'
             returnKeyType = {"next"}
             maxLength={10}
             ref='birthday'
             placeholder={'Sinh nhật'}
             onSubmitEditing={(event) => {this.refs.address.focus();}}
             style={wrapInputCreImg}
             onChangeText={(birthday) => this.setState({birthday})}
             value={this.state.birthday}
              />
              <View style={{width:15}}></View>
         </View>

         <View style={[listCreate,marTop]}>
             <View style={widthLblCre}>
             <Image source={locationIC} style={imgInfo} />
             </View>
             <TextInput underlineColorAndroid='transparent'
             returnKeyType = {"next"}
             ref='address'
             placeholder={'Địa chỉ'}
             onSubmitEditing={(event) => {this.refs.phone.focus();}}
             style={wrapInputCreImg}
             onChangeText={(address) => this.setState({address})}
             value={this.state.address}
              />
              <View style={{width:15}}></View>
         </View>

         <View style={listCreate}>
             <View style={widthLblCre}>
             <Image source={phoneIC} style={imgInfo} />
             </View>
             <TextInput underlineColorAndroid='transparent'
             returnKeyType = {"next"}
             ref='phone'
             placeholder={'Điện thoại'}
             onSubmitEditing={(event) => {this.refs.description.focus();}}
             style={wrapInputCreImg}
             onChangeText={(phone) => this.setState({phone})}
             value={this.state.phone}
              />
              <View style={{width:15}}></View>
         </View>

         <View style={listCreate}>
             <View style={widthLblCre}>
             <Image source={descriptionIC} style={imgInfo} />
             </View>
             <TextInput underlineColorAndroid='transparent'
             multiline
             numberOfLines={4}
             maxHeight={65}
             placeholder={'Giới thiệu bản thân'}
             returnKeyType = {"next"}
             ref='description'
             onSubmitEditing={(event) => {this.refs.email.focus();}}
             style={wrapInputCreImg}
             onChangeText={(description) => this.setState({description})}
             value={this.state.description}
              />
              <View style={{width:15}}></View>
         </View>

         <View style={listCreate}>
             <View style={widthLblCre}>
             <Image source={emailIC} style={imgInfo} />
             </View>
             <TextInput underlineColorAndroid='transparent'
             returnKeyType = {"done"}
             ref='email'
             editable={false}
             style={wrapInputCreImg}
             onChangeText={(email) => this.setState({email})}
             value={this.state.email}
              />
              <View style={{width:15}}></View>
         </View>

      </View>
      </ScrollView>
    </Modal>
    );
  }
}
