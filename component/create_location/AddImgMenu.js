/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,
} from 'react-native';
import styles from '../styles';
import postApi from '../api/postApi';
import getApi from '../api/getApi';
import global from '../global';
import cameraLargeIC from '../../src/icon/ic-create/ic-camera-large.png';
import closeLargeIC from '../../src/icon/ic-create/ic-close-large.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
const {width,height} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
//import {getIdYoutube} from '../libs';
var timeoutUpdate;
export default class AddImgMenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgMenu:[],
      des_menu:{},
      title_menu:{},
      imgMenuUpdate:[],
      des_menu_update:{},
      title_menu_update:{},
      txtErr:'',
      update:false,
    }
  }
  uploadSpace(){
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 50
    }).then(img => {
      if(this.state.update){
        img.forEach(e=>{
          this.state.imgMenu.unshift(e);
        })
        this.state.imgMenuUpdate=this.state.imgMenu;
      }else {
        this.state.imgMenu=img;
      }
      this.setState(this.state)
    }).catch(e=>console.log('e'));
  }
  ImageUpdate(id=null,title=null,description=null){
    timeoutUpdate = setTimeout(()=>{
      const url = `${global.url}${'image/menu/update'}`;
      const arr = new FormData();
      id!==null && arr.append('id',id);
      title!==null && arr.append('title',title);
      description!==null && arr.append('description',description);
      postApi(url,arr);
    },1000);

  }
  ImageDelete(id){
      const url = `${global.url}${'image/menu/delete/'}${id}`;
      getApi(url);
  }
  componentWillUpdate(){
    const {img_menu} = this.props;
    if(img_menu.length>0){
      let title_menu={};
      let des_menu={};
      img_menu.forEach((e,index)=>{
        title_menu = Object.assign(title_menu,{[`${'title_'}${index}`]:e.title,[`${'id_'}${e.id}`]:e.id});
        des_menu = Object.assign(des_menu,{[`${'des_'}${index}`]:e.description,[`${'id_'}${e.id}`]:e.id});
      })
      this.state.title_menu=title_menu;
      this.state.des_menu=des_menu;
      this.state.imgMenu=img_menu;
      this.state.update===false && this.setState(this.state,()=>{
        //this.props.submitImage(this.state.imgMenu,Object.entries(this.state.title_menu),Object.entries(this.state.des_menu));
        this.setState({update:true});
      })
    }
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,show,hide,colorWhite,titleErr,
    } = styles;
    const {imgMenu,des_menu,title_menu,update,
    imgMenuUpdate,des_menu_update,title_menu_update,} = this.state;
    const {lang} = this.props;
    return (

      <Modal onRequestClose={() => null} transparent
      animationType={'slide'} visible={this.props.visible}
      >
      <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    if(imgMenuUpdate.length>0){
                      this.props.submitImage(imgMenuUpdate,Object.entries(title_menu_update),Object.entries(des_menu_update));
                    }else {
                      this.props.submitImage(imgMenu,Object.entries(title_menu),Object.entries(des_menu));
                    }
                    this.props.closeModal();
                  }} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> {lang.add_gallery} </Text>
                  <View></View>
              </View>
          </View>


          <ScrollView>
          <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#FFFEFF',padding:50,marginBottom:5,borderColor:'#ECEEF3',borderBottomWidth:1}}>
            <TouchableOpacity
            onPress={()=>this.uploadSpace()}>
            <Image source={cameraLargeIC} style={{width:60,height:60,marginBottom:10}}/>
            </TouchableOpacity>
            <Text style={{fontSize:20}}>{lang.upload_image.toUpperCase()}</Text>
          </View>

          {this.state.imgMenu.length > 0 ?
            <View>
            {this.state.imgMenu.map((e,index)=>(
              <View key={index}>
              <Image style={{width,height:300,resizeMode: 'cover'}} source={{isStatic:true,uri:e.path!==undefined?`${e.path}`:`${e.url}`}} />
              <TouchableOpacity style={{position:'absolute',right:5,top:5}}
              onPress={()=>{
                this.state.imgMenu.splice(index, 1);
                Object.entries(this.state.title_menu).splice(index, 1);
                Object.entries(this.state.des_menu).splice(index, 1);
                if(update && e.url!==undefined) {
                  this.ImageDelete(des_menu[`${'id_'}${e.id}`]);
                  this.state.imgMenuUpdate.splice(index, 1);
                  Object.entries(this.state.title_menu_update).splice(index, 1);
                  Object.entries(this.state.des_menu_update).splice(index, 1);
                }
                this.setState(this.state)
              }}>
              <Image source={closeLargeIC} style={{width:22,height:22}}/>
              </TouchableOpacity>

              <View style={{backgroundColor:'#fff',marginBottom:20,width,paddingLeft:30,paddingRight:30}}>
              <TextInput underlineColorAndroid='transparent'
                placeholder={'Chủ đề'}
                placeholderTextColor={'#A9BFD0'}
                onChangeText={(text) => {
                  if(update && e.url!==undefined){
                    clearTimeout(timeoutUpdate);
                    this.ImageUpdate(des_menu[`${'id_'}${e.id}`],text,null);
                    this.state.title_menu = Object.assign(this.state.title_menu,{[`${'title_'}${e.id}`]:text})
                  }else {
                    this.state.title_menu_update = Object.assign(this.state.title_menu_update,{[`${'title_'}${index}`]:text})
                    this.state.title_menu = Object.assign(this.state.title_menu,{[`${'title_'}${index}`]:text})
                  }
                  this.setState(this.state);
                }}
                onBlur={()=>{
                  if(update && e.url!==undefined){
                    clearTimeout(timeoutUpdate);
                    this.ImageUpdate(des_menu[`${'id_'}${e.id}`],title_menu[`${'title_'}${e.id}`],null);
                  }
                }}
                onSubmitEditing={()=>{
                  if(update && e.url!==undefined){
                    clearTimeout(timeoutUpdate);
                    this.ImageUpdate(des_menu[`${'id_'}${e.id}`],title_menu[`${'title_'}${e.id}`],null);
                  }
                }}
                value={update?this.state.title_menu[`${'title_'}${e.id}`]:this.state.title_menu[`${'title_'}${index}`]}
               />
               <View style={{width:width-60,borderBottomWidth:1,borderColor:'#E0E8ED'}}></View>
               <TextInput underlineColorAndroid='transparent'
                 placeholder={'Viết mô tả'}
                 placeholderTextColor={'#A9BFD0'}
                 onChangeText={(text) => {
                   if(update && e.url!==undefined){
                     clearTimeout(timeoutUpdate);
                     this.ImageUpdate(des_menu[`${'id_'}${e.id}`],null,text);
                     this.state.des_menu = Object.assign(this.state.des_menu,{[`${'des_'}${e.id}`]:text})
                   }else {
                     this.state.des_menu_update = Object.assign(this.state.des_menu_update,{[`${'des_'}${index}`]:text})
                     this.state.des_menu = Object.assign(this.state.des_menu,{[`${'des_'}${index}`]:text})
                   }
                   this.setState(this.state);
                 }}
                 onBlur={()=>{
                   clearTimeout(timeoutUpdate);
                   if(update && e.url!==undefined) this.ImageUpdate(des_menu[`${'id_'}${e.id}`],null,des_menu[`${'des_'}${e.id}`]);
                 }}
                 onSubmitEditing={()=>{
                   clearTimeout(timeoutUpdate);
                   if(update && e.url!==undefined) this.ImageUpdate(des_menu[`${'id_'}${e.id}`],null,des_menu[`${'des_'}${e.id}`]);
                 }}
                 value={update?this.state.des_menu[`${'des_'}${e.id}`]:this.state.des_menu[`${'des_'}${index}`]}
                />
                </View>
              </View>
            ))}
            </View>
            :
            <View></View>
          }
          </ScrollView>
          </View>


        </Modal>

    );
  }
}
