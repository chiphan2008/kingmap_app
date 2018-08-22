/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image, PanResponder,
  TextInput,Dimensions,ScrollView,Alert,AsyncStorage,
  TouchableWithoutFeedback,Platform,KeyboardAvoidingView
} from 'react-native';
import {connect} from 'react-redux';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import postApi from '../../api/postApi';
import encodeApi from '../../api/encodeApi';
import checkLogin from '../../api/checkLogin';
//import loginServer from '../../api/loginServer';
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
import {hasNumber,checkUrl} from '../../libs';


class UpdateInfo extends Component {
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
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt,gestureState) => {
        return Math.abs(gestureState.dy) > 2 ;  // can adjust this num
      },
      onPanResponderGrant: (e, gestureState) => {
        this.fScroll.setNativeProps({ scrollEnabled: false })
      },
      onPanResponderMove: () => { },
      onPanResponderTerminationRequest: () => true,
    })

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
        avatar:checkUrl(e.avatar)?e.avatar:`${global.url_media}/${e.avatar}`,
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
    const {lang} = this.props.navigation.state.params;
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
      const {userId} = this.props.navigation.state.params;
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
      //console.log(arr);
      //console.log(`${global.url}${'user/update/'}${userId}`);
      postApi(`${global.url}${'user/update/'}${userId}`,arr).then(e=>{
        if(e.code===200){
          //loginServer(e.data)
          this.props.dispatch({type:'USER_LOGINED',isLogin:true,user_profile:e.data[0]});
          encodeApi(`${global.url_node}${'person'}`,'POST',e.data[0]);
          AsyncStorage.setItem('@MyAccount:key', JSON.stringify(Object.assign(e.data[0],{'pwd':this.state.pwd})));
          Alert.alert(lang.notify,lang.update_success,
          [
            {text: 'OK', onPress: ()=>this.closeModal()}
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
  closeModal () {
    this.props.dispatch({type:'STOP_START_UPDATE_STATE',updateState:true});
    this.props.navigation.goBack();
  }

  render() {
    const {
      wrapper,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,
      imgInfo,wrapInputCreImg,marTop,colorErr,btnInfo,btnYInfo,colourTitle,colorTitle,
      wrapBtnInfo,wrapSelect,show,hide,posDay,posMonth,posYear,widthDay,widthYear,
    } = styles;
    const {lang} = this.props.navigation.state.params;
    const {listDay,listMonth,listYear,showDay,showMonth,showYear,disable} = this.state;
    return (
      <TouchableWithoutFeedback onPress={()=>{
        this.setState({showDay:false,showMonth:false,showYear:false,disable:true});
        this.fScroll.setNativeProps({ scrollEnabled: true });
      }}>
        <View style={wrapper} onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: true });
        }}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{this.closeModal()}} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{lang.info_per.toUpperCase()} </Text>
                  <TouchableOpacity onPress={()=>this.updateUser()}>
                  <Text style={titleCreate}>{lang.save} </Text>
                  </TouchableOpacity>
              </View>
          </View>
          <ScrollView ref={(e) => { this.fScroll = e }}>
          <KeyboardAvoidingView behavior="padding">
          <TouchableWithoutFeedback onPress={() =>{
            this.fScroll.setNativeProps({ scrollEnabled: true });
            this.setState({showDay:false,showMonth:false,showYear:false})}}>
           <View style={{height:150,justifyContent:'center',alignItems:'center'}}>
            {this.state.avatar!=='' && <Image source={{isStatic:true,uri:this.state.avatar}} style={{width:90,height:90,borderRadius:45}} />}
            <TouchableOpacity style={{position:'absolute',top:90,right:(width/2)-45,padding:6,borderRadius:13,backgroundColor:'#fff',}}
            onPress={()=>this.uploadAvatar()}>
            <Image source={cameraIC} style={{width:16,height:16,}} />
            </TouchableOpacity>
           </View>
           </TouchableWithoutFeedback>

           <TouchableWithoutFeedback onPress={() =>{
             this.fScroll.setNativeProps({ scrollEnabled: true });
             this.setState({showDay:false,showMonth:false,showYear:false})
           }}>
             <View style={listCreate}>
                 <View style={widthLblCre}>
                 <Image source={nameLocationIC} style={imgInfo} />
                 </View>
                 <TextInput underlineColorAndroid='transparent'
                 returnKeyType = {"next"}
                 onSubmitEditing={(event) => {this.refs.address.focus();}}
                 style={wrapInputCreImg} placeholder={lang.full_name}
                 onChangeText={(full_name) => this.setState({full_name})}
                 value={this.state.full_name}
                  />
                  <View style={{width:15}}></View>
             </View>
             </TouchableWithoutFeedback>
           <TouchableWithoutFeedback onPress={() =>{
             this.fScroll.setNativeProps({ scrollEnabled: true });
             this.setState({showDay:false,showMonth:false,showYear:false})}}>
             <View style={listCreate}>
                 <View style={widthLblCre}>
                 <Image source={dateIC} style={imgInfo} />
                 </View>

                  <View style={{flexDirection:'row',width:width-100,alignItems:'center',overflow:'visible'}}>

                    <TouchableOpacity style={btnInfo}
                    onPress={()=>{
                      this.setState({disable:showDay,showDay:!showDay,showMonth:false,showYear:false})
                    }}>
                        <Text style={colourTitle}>{this.state.dDay}</Text>
                        <Image source={sortDownIC} style={{width:12,height:12}} />
                    </TouchableOpacity>
                    <Text> / </Text>

                    <TouchableOpacity style={btnInfo}
                    onPress={()=>{this.setState({showDay:false,disable:showMonth,showMonth:!showMonth,showYear:false});
                    }}>
                        <Text style={colourTitle}>{this.state.mDay}</Text>
                        <Image source={sortDownIC} style={{width:12,height:12}} />
                    </TouchableOpacity>
                    <Text> / </Text>

                    <TouchableOpacity style={btnYInfo}
                    onPress={()=>{this.setState({showDay:false,showMonth:false,disable:showYear,showYear:!showYear});
                    }}>
                        <Text style={colourTitle}>{this.state.yDay}</Text>
                        <Image source={sortDownIC} style={{width:12,height:12}} />
                    </TouchableOpacity>
                </View>
                  <View style={{width:15}}></View>
             </View>
           </TouchableWithoutFeedback>

         {showDay && <View style={[wrapSelect,wrapBtnInfo,{top:Platform.OS==='ios'?245:275,left:Platform.OS==='ios'?52:57}]}>
         <ScrollView {...this._panResponder.panHandlers}
    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })} >
         <View style={widthDay}>
         {Array(listDay).fill().map((_, i) => {
           i=i+1; i = i<10 ? `0${i}` : i;
           return (
             <TouchableOpacity key={i} onPress={()=>this.setState({dDay:i,showDay:false,disable:true})}>
                <Text style={colourTitle}>{i}</Text>
            </TouchableOpacity>
         )})}
         </View>
         </ScrollView>
         </View>}

         {showMonth && <View
         style={[wrapSelect,wrapBtnInfo,{top:Platform.OS==='ios'?245:275,left:Platform.OS==='ios'?110:115}]}>
         <ScrollView {...this._panResponder.panHandlers}
    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })} >
         <View style={widthDay}>
         {Array(listMonth).fill().map((_, i) => {
           i=i+1; i = i<10 ? `0${i}` : i;
           return (
             <TouchableOpacity key={i} onPress={()=>this.setState({mDay:i,showMonth:false,disable:true})}>
                <Text style={colourTitle}>{i}</Text>
            </TouchableOpacity>
         )})}
         </View>
         </ScrollView>
         </View>}

         {showYear && <View style={[wrapSelect,wrapBtnInfo,{top:Platform.OS==='ios'?245:275,left:Platform.OS==='ios'?170:175}]}>
         <ScrollView {...this._panResponder.panHandlers}
    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })} >
         <View style={widthYear}>
         {Array(100).fill().map((_, i) => {
           i=listYear-i;
           return (
             <TouchableOpacity key={i} onPress={()=>this.setState({yDay:i,showYear:false,disable:true})}>
                <Text style={colourTitle}>{i}</Text>
            </TouchableOpacity>
         )})}
         </View>

         </ScrollView>
         </View>}

         <TouchableWithoutFeedback onPress={() =>{
           this.fScroll.setNativeProps({ scrollEnabled: true });
           this.setState({showDay:false,showMonth:false,showYear:false})}}>
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
           </TouchableWithoutFeedback>
           <TouchableWithoutFeedback onPress={() =>{
             this.fScroll.setNativeProps({ scrollEnabled: true });;
             this.setState({showDay:false,showMonth:false,showYear:false})}}>
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() =>{
            this.fScroll.setNativeProps({ scrollEnabled: true });
            this.setState({showDay:false,showMonth:false,showYear:false})}}>
           <View style={listCreate}>
               <View style={widthLblCre}>
               <Image source={descriptionIC} style={imgInfo} />
               </View>
               <TextInput underlineColorAndroid='transparent'
               multiline
               numberOfLines={4}
               maxHeight={65}
               placeholder={lang.description_persional}
               returnKeyType = {"done"} ref='description'
               style={wrapInputCreImg}
               onChangeText={(description) => this.setState({description})}
               value={this.state.description}
                />
                <View style={{width:15}}></View>
           </View>
           </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() =>{
            this.fScroll.setNativeProps({ scrollEnabled: true });
            this.setState({showDay:false,showMonth:false,showYear:false})}}>
           <View style={[listCreate, {marginBottom: 20}]}>
               <View style={widthLblCre}>
               <Image source={emailIC} style={imgInfo} />
               </View>
               <Text numberOfLines={1} style={[wrapInputCreImg, {color: 'black'}]}>{this.state.email}</Text>
               <View style={{width:15}}></View>
           </View>
           </TouchableWithoutFeedback>
         <View style={{height:15}}></View>
         </KeyboardAvoidingView>
         </ScrollView>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect()(UpdateInfo);
