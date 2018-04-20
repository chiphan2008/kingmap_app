/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,BackHandler,
  TextInput,Dimensions,ScrollView,Alert,AsyncStorage,
} from 'react-native';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import postApi from '../../api/postApi';
import encodeApi from '../../api/encodeApi';
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
import sortDownIC from '../../../src/icon/ic-sort-down.png';
const {width,height} = Dimensions.get('window');
import {hasNumber} from '../../libs';


export default class UpdateInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      full_name:'',
      dDay:'',
      mDay:'',
      yDay:'',
      disable:true,
      showDay:false,
      showMonth:false,
      showYear:false,
      listDay:31,
      listMonth:12,
      listYear:Moment(new Date()).format('YYYY'),
      phone:'',
      address:'',
      email:'',
      description:'',
      avatar:'',
      pwd:'',
      imgAvatar:{},
    }
  }

  componentWillMount(){

    checkLogin().then(e=>{
      //console.log('moment.default(date).format()',Moment(new Date()).format());
      //console.log('e.birthday',e);
      let strday;
      if(e.birthday===null || e.birthday===undefined){
        strday = String(Moment(new Date()).format('YYYY-MM-DD')).split('-') ;
      }else {
        strday = String(e.birthday).split('-');
      }

      //console.log('strday',strday[0],strday[1],strday[2],);
      this.setState({
        full_name:e.full_name,
        dDay:strday[2],
        mDay:strday[1],
        yDay:strday[0],
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
    }).catch(e=>console.log('e'));
  }
  updateUser(){
    let errMsg;
    let err = false;
    const {lang} = this.props;
    const { full_name,phone,dDay,mDay,yDay, } = this.state;
    this.setState({
      showDay:false,
      showMonth:false,
      showYear:false,
    });

    if(hasNumber(phone)===false){
      errMsg = lang.enter_numberic;
      err=true;
    }

    if(full_name.length<3){
      errMsg = lang.fullname_minlength;
      err=true;
    }
    if(hasNumber(full_name)){
       errMsg = lang.enter_text;
       err=true;
    }


    if(err) {
      return  Alert.alert(lang.err,errMsg );
    }else {

      const arr = new FormData();
      arr.append('full_name',full_name);
      arr.append('birthday',`${yDay}-${mDay}-${dDay}`);
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
          encodeApi(`${global.url_node}${'person'}`,'POST',e.data);
          AsyncStorage.setItem('@MyAccount:key', JSON.stringify(Object.assign(e.data,{'pwd':this.state.pwd})));
          Alert.alert(lang.notify,lang.update_success,
          [
            {text: 'OK', onPress: ()=>this.props.closeModal()}
          ])
        }
      });
    }

  }
  handlePhone = (text,param) => {
    if(param==='phone'){
      if (/^\d+$/.test(text) || text==='') {
        this.setState({ phone: text });
      }
    }
  }
  onBackPress () {
      this.props.closeModal();
      return true
   }

  render() {
    const {
      wrapper,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,
      imgInfo,wrapInputCreImg,marTop,colorErr,btnInfo,btnYInfo,colorTitle,
      wrapBtnInfo,wrapInfo,show,hide,posDay,posMonth,posYear,widthDay,widthYear,
    } = styles;
    const {labelTitle,lang,visible} = this.props;
    const {listDay,listMonth,listYear,showDay,showMonth,showYear,disable} = this.state;
    return (
      <Modal
      onRequestClose={() => null}
      transparent
      animationType={'slide'}
      visible={visible}
      >
      <ScrollView scrollEnabled={disable} horizontalScroll={disable}>
        <View style={wrapper}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>this.props.closeModal()}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{labelTitle.toUpperCase()} </Text>
                  <TouchableOpacity onPress={()=>this.updateUser()}>
                  <Text style={titleCreate}>{lang.save} </Text>
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
             onSubmitEditing={(event) => {this.refs.dDay.focus();}}
             style={wrapInputCreImg}
             placeholder={lang.full_name}
             onChangeText={(full_name) => this.setState({full_name})}
             value={this.state.full_name}
              />
              <View style={{width:15}}></View>
         </View>
         <View style={listCreate}>
             <View style={widthLblCre}>
             <Image source={dateIC} style={imgInfo} />
             </View>

              <View style={{flexDirection:'row',width:width-100,alignItems:'center',position:'relative',overflow:'visible'}}>

                <TouchableOpacity style={btnInfo}
                onPress={()=>{
                  this.setState({disable:showDay,showDay:!showDay,showMonth:false,showYear:false})
                }}>
                    <Text style={colorTitle}>{this.state.dDay}</Text>
                    <Image source={sortDownIC} style={{width:12,height:12}} />
                </TouchableOpacity>
                <Text> / </Text>

                <TouchableOpacity style={btnInfo}
                onPress={()=>{this.setState({showDay:false,disable:showMonth,showMonth:!showMonth,showYear:false});
                }}>
                    <Text style={colorTitle}>{this.state.mDay}</Text>
                    <Image source={sortDownIC} style={{width:12,height:12}} />
                </TouchableOpacity>
                <Text> / </Text>

                <TouchableOpacity style={btnYInfo}
                onPress={()=>{this.setState({showDay:false,showMonth:false,disable:showYear,showYear:!showYear});
                }}>
                    <Text style={colorTitle}>{this.state.yDay}</Text>
                    <Image source={sortDownIC} style={{width:12,height:12}} />
                </TouchableOpacity>

              </View>


              <View style={{width:15}}></View>
         </View>


         <View style={[wrapInfo,wrapBtnInfo,posDay,widthDay,showDay ? show : hide]}>
         <ScrollView>
         {Array(listDay).fill().map((_, i) => {
           i=i+1; i = i<10 ? `0${i}` : i;
           return (
             <TouchableOpacity key={i} onPress={()=>this.setState({dDay:i,showDay:false,disable:true})}>
                <Text style={colorTitle}>{i}</Text>
            </TouchableOpacity>
         )})}

         </ScrollView>
         </View>


         <View style={[wrapInfo,wrapBtnInfo,posMonth,widthDay,showMonth ? show : hide]}>
         <ScrollView>
         {Array(listMonth).fill().map((_, i) => {
           i=i+1; i = i<10 ? `0${i}` : i;
           return (
             <TouchableOpacity key={i} onPress={()=>this.setState({mDay:i,showMonth:false,disable:true})}>
                <Text style={colorTitle}>{i}</Text>
            </TouchableOpacity>
         )})}
         </ScrollView>
         </View>



         <View style={[wrapInfo,wrapBtnInfo,posYear,widthYear,showYear ? show : hide]}>
         <ScrollView>
         {Array(100).fill().map((_, i) => {
           i=listYear-i;
           return (
             <TouchableOpacity key={i} onPress={()=>this.setState({yDay:i,showYear:false,disable:true})}>
                <Text style={colorTitle}>{i}</Text>
            </TouchableOpacity>
         )})}
         </ScrollView>
         </View>


         <View style={[listCreate,marTop]}>
             <View style={widthLblCre}>
             <Image source={locationIC} style={imgInfo} />
             </View>
             <TextInput underlineColorAndroid='transparent'
             returnKeyType = {"next"} ref='address' placeholder={lang.address}
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
             returnKeyType = {"next"} ref='phone'
             maxLength={12} keyboardType={'numeric'}
             placeholder={lang.phone}
             onSubmitEditing={(event) => {this.refs.description.focus();}}
             style={wrapInputCreImg}
             onChangeText={(text)=>this.handlePhone(text,'phone')}
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
             placeholder={lang.description_persional}
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
