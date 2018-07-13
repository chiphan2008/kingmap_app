/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,
} from 'react-native';
import postApi from '../api/postApi';
import getApi from '../api/getApi';
import global from '../global';
import styles from '../styles';
import cameraLargeIC from '../../src/icon/ic-create/ic-camera-large.png';
import closeLargeIC from '../../src/icon/ic-create/ic-close-large.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
const {width,height} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
//import {getIdYoutube} from '../libs';
var timeoutUpdate;
export default class AddImgSpace extends Component {
  constructor(props){
    super(props);

    this.state = {
      imgSpace:[],
      des_space:{},
      title_space:{},
      imgSpaceUpdate:[],
      des_space_update:{},
      title_space_update:{},
      txtErr:'',
      update:false,
    }
  }
  uploadSpace(){
    ImagePicker.openPicker({
      multiple: true
    }).then(img => {
      //console.log(img);
      if(this.state.update){
        img.forEach(e=>{
          this.state.imgSpace.unshift(e);
        })
        this.state.imgSpaceUpdate=this.state.imgSpace;
      }else {
        this.state.imgSpace=img;
      }
      this.setState(this.state)
    }).catch(e=>console.log('e',e));
  }
  ImageUpdate(id=null,title=null,description=null){
    timeoutUpdate = setTimeout(()=>{
      const url = `${global.url}${'image/space/update'}`;
      const arr = new FormData();
      id!==null && arr.append('id',id);
      title!==null && arr.append('title',title);
      description!==null && arr.append('description',description);
      postApi(url,arr);
    },1000);

  }
  ImageDelete(id){
      const url = `${global.url}${'image/space/delete/'}${id}`;
      getApi(url);
  }
  componentWillUpdate(){
    const {img_space} = this.props;
    if(img_space.length>0){
      let title_space={};
      let des_space={};
      img_space.forEach((e,index)=>{
        title_space = Object.assign(title_space,{[`${'title_'}${e.id}`]:e.title,[`${'id_'}${e.id}`]:e.id});
        des_space = Object.assign(des_space,{[`${'des_'}${e.id}`]:e.description,[`${'id_'}${e.id}`]:e.id});
      })
      this.state.title_space=title_space;
      this.state.des_space=des_space;
      this.state.imgSpace=img_space;
      this.state.update===false && this.setState(this.state,()=>{
        //this.props.submitImage(this.state.imgSpace,Object.entries(this.state.title_space),Object.entries(this.state.des_space));
        this.setState({update:true});
      })
    }
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,show,hide,colorWhite,titleErr,
    } = styles;
    const {imgSpace,des_space,title_space,update,
    imgSpaceUpdate,des_space_update,title_space_update,} = this.state;
    const {lang,editLoc} = this.props;
    return (

      <Modal onRequestClose={() => null} transparent
      animationType={'slide'} visible={this.props.visible}
      >
      <ScrollView style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    if(imgSpaceUpdate.length>0){
                      this.props.submitImage(imgSpaceUpdate,Object.entries(title_space_update),Object.entries(des_space_update));
                    }else {
                      this.props.submitImage(imgSpace,Object.entries(title_space),Object.entries(des_space));
                    }
                    this.props.closeModal();
                  }} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> {lang.add_gallery} </Text>
                  <View></View>
              </View>

          </View>


          <View style={[container]}>
          <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#FFFEFF',padding:50,borderColor:'#ECEEF3',borderBottomWidth:1,marginBottom:5}}>
            <TouchableOpacity
            onPress={()=>this.uploadSpace()}>
            <Image source={cameraLargeIC} style={{width:60,height:60,marginBottom:10}}/>
            </TouchableOpacity>
            <Text style={{fontSize:20}}>{lang.upload_image.toUpperCase()}</Text>
          </View>
          {this.state.imgSpace.length > 0 ?
            <View>
            {this.state.imgSpace.map((e,index)=>(
              <View key={index}>
              <Image style={{width,height:300,resizeMode: 'cover'}} source={{isStatic:true,uri:e.path==undefined?`${e.url}`:`${e.path}`}} />
              <TouchableOpacity style={{position:'absolute',right:5,top:5}}
              onPress={()=>{
                this.state.imgSpace.splice(index, 1);
                Object.entries(this.state.title_space).splice(index, 1);
                Object.entries(this.state.des_space).splice(index, 1);
                if(update && e.url!==undefined) {
                  this.ImageDelete(des_space[`${'id_'}${e.id}`]);
                  this.state.imgSpaceUpdate.splice(index, 1);
                  Object.entries(this.state.title_space_update).splice(index, 1);
                  Object.entries(this.state.des_space_update).splice(index, 1);
                }
                this.setState(this.state)
              }}>
              <Image source={closeLargeIC} style={{width:22,height:22}}/>
              </TouchableOpacity>

              <View style={{backgroundColor:'#fff',marginBottom:20,width,paddingLeft:30,paddingRight:30}}>
              <TextInput underlineColorAndroid='transparent'
                placeholder={'Chủ đề'}
                maxLength={512}
                placeholderTextColor={'#A9BFD0'}
                onChangeText={(text) => {
                  if(update && e.url!==undefined){
                    clearTimeout(timeoutUpdate);
                    this.ImageUpdate(des_space[`${'id_'}${e.id}`],text,null);
                    this.state.title_space = Object.assign(this.state.title_space,{[`${'title_'}${e.id}`]:text})
                  }else {
                    this.state.title_space_update = Object.assign(this.state.title_space_update,{[`${'title_'}${index}`]:text})
                    this.state.title_space = Object.assign(this.state.title_space,{[`${'title_'}${index}`]:text})
                  }
                  this.setState(this.state);
                }}
                onBlur={()=>{
                  if(update && e.url!==undefined){
                    clearTimeout(timeoutUpdate);
                    this.ImageUpdate(des_space[`${'id_'}${e.id}`],title_space[`${'title_'}${e.id}`],null);
                  }
                }}
                onSubmitEditing={()=>{
                  if(update && e.url!==undefined){
                    clearTimeout(timeoutUpdate);
                    this.ImageUpdate(des_space[`${'id_'}${e.id}`],title_space[`${'title_'}${e.id}`],null);
                  }
                }}
                value={update?this.state.title_space[`${'title_'}${e.id}`]:this.state.title_space[`${'title_'}${index}`]}
               />
               <View style={{width:width-60,borderBottomWidth:1,borderColor:'#E0E8ED'}}></View>
               <TextInput underlineColorAndroid='transparent'
                 placeholder={'Viết mô tả'}
                 placeholderTextColor={'#A9BFD0'}
                 maxLength={512}
                 onChangeText={(text) => {
                   if(update && e.url!==undefined){
                     clearTimeout(timeoutUpdate);
                     this.ImageUpdate(des_space[`${'id_'}${e.id}`],null,text);
                     this.state.des_space = Object.assign(this.state.des_space,{[`${'des_'}${e.id}`]:text})
                   }else {
                     this.state.des_space_update = Object.assign(this.state.des_space_update,{[`${'des_'}${index}`]:text})
                     this.state.des_space = Object.assign(this.state.des_space,{[`${'des_'}${index}`]:text})
                   }
                   this.setState(this.state);
                 }}
                 onBlur={()=>{
                   clearTimeout(timeoutUpdate);
                   if(update && e.url!==undefined) this.ImageUpdate(des_space[`${'id_'}${e.id}`],null,des_space[`${'des_'}${e.id}`]);
                 }}
                 onSubmitEditing={()=>{
                   clearTimeout(timeoutUpdate);
                   if(update && e.url!==undefined) this.ImageUpdate(des_space[`${'id_'}${e.id}`],null,des_space[`${'des_'}${e.id}`]);
                 }}
                 value={update?this.state.des_space[`${'des_'}${e.id}`]:this.state.des_space[`${'des_'}${index}`]}
                />
                </View>
              </View>
            ))}
            </View>
            :
            <View></View>
          }
          </View>

        </ScrollView>
        </Modal>

    );
  }
}
