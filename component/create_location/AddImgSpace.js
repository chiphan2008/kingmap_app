/* @flow */
import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,Platform,
  TouchableWithoutFeedback,Keyboard
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
      activeKeyboard:0,
    }
  }
  uploadSpace(){
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 50
    }).then(img => {
        //console.log(img);
      // if(this.state.update){
      //   img.forEach(e=>{
      //     //this.state.imgSpace.unshift(e);
      //     this.state.imgSpace.push(e);
      //   })
      //   this.state.imgSpaceUpdate=this.state.imgSpace;
      // }else {
      //   this.state.imgSpace=img;
      // }
      img.forEach(e=>{
        //this.state.imgSpace.unshift(e);
        this.state.imgSpace.push(e);
      })
      this.state.imgSpaceUpdate=this.state.imgSpace;
      this.setState(this.state,()=>{
        this.gotoEndScroll();
      })
    }).catch(e=>console.log('e',e));
  }
  gotoEndScroll = (contentWidth, contentHeight) => {
    this.scrollView.scrollToEnd({animated: false});
  }
  ImageUpdate(id=null,title=null,description=null){
    timeoutUpdate = setTimeout(()=>{
      const url = `${global.url}${'image/space/update'}`;
      const arr = new FormData();
      id!==null && arr.append('id',id);
      title!==null && arr.append('title',title);
      description!==null && arr.append('description',description);
      id!==undefined && postApi(url,arr);
    },1000);

  }
  ImageDelete(id){
      const url = `${global.url}${'image/space/delete/'}${id}`;
      getApi(url);
  }
  componentDidMount(){
    // const {img_space, title_space, des_space} = this.props;
    // if(img_space.length>0){
    //   this.state.title_space=title_space;
    //   this.state.des_space=des_space;
    //   this.state.imgSpace=img_space;
    //   this.state.update===false && this.setState(this.state);
    // }
  }
  componentWillUpdate(){
    const {img_space,des_space,title_space,editLoc} = this.props;
    if(img_space.length>0){
      //console.log(this.state.title_space[`${'title_0'}`]);
      this.state.title_space=title_space;
      this.state.des_space=des_space;
      this.state.imgSpace=img_space;
      if(editLoc){
        this.state.title_space_update=title_space;
        this.state.des_space_update=des_space;
        this.state.imgSpaceUpdate=img_space;
      }
      this.state.update===false && this.setState(this.state,()=>{
        //this.props.submitImage(this.state.imgSpace,Object.entries(this.state.title_space),Object.entries(this.state.des_space));
        this.setState({update:true});
      })
    }
  }
  componentDidMount(){
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({activeKeyboard:230});
  }

  _keyboardDidHide = () => {
    this.setState({activeKeyboard:0});
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
      <View style={container}>

          <ScrollView keyboardShouldPersistTaps='always'
          onContentSizeChange={(contentWidth, contentHeight)=>{
            //this.gotoEndScroll(contentWidth, contentHeight)
          }}
          ref={(scrollView) => { this.scrollView = scrollView }}
          stickyHeaderIndices={[0]}
          >
          <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    if(imgSpaceUpdate.length>0){
                      this.props.submitImage(imgSpaceUpdate,title_space_update,des_space_update);
                    }else {
                      this.props.submitImage(imgSpace,title_space,des_space);
                    }
                    this.props.closeModal();
                  }} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> {lang.add_gallery} </Text>
                  <View></View>
              </View>
          </View>
          </TouchableWithoutFeedback>
          <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#FFFEFF',padding:50,borderColor:'#ECEEF3',borderBottomWidth:1,marginBottom:5}}>
            <TouchableOpacity onPress={()=>this.uploadSpace()}>
            <Image source={cameraLargeIC} style={{width:60,height:60,marginBottom:10}}/>
            </TouchableOpacity>
            <Text style={{fontSize:20}}>{lang.upload_image.toUpperCase()}</Text>
          </View>
          {this.state.imgSpace.length > 0 ?
            <View style={{paddingBottom:this.state.activeKeyboard}}>
            {this.state.imgSpace.map((e,index)=>(
              <View key={index}>
              <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
              <Image style={{width,height:300,resizeMode: 'cover'}} source={{isStatic:true,uri:e.path==undefined?`${e.url}`:`${e.path}`}} />
              </TouchableWithoutFeedback>
              <TouchableOpacity style={{position:'absolute',right:5,top:5}}
              onPress={()=>{
                this.state.imgSpace.splice(index, 1);
                delete this.state.title_space[`${'title_'}${index}`];
                delete this.state.des_space[`${'des_'}${index}`];
                delete this.state.title_space_update[`${'title_'}${index}`];
                delete this.state.des_space_update[`${'des_'}${index}`];
                if(editLoc && e.url!==undefined) {
                  this.ImageDelete(des_space[`${'id_'}${e.id}`]);
                  this.state.imgSpaceUpdate.splice(index, 1);
                }
                this.setState(this.state)
              }}>
              <Image source={closeLargeIC} style={{width:22,height:22}}/>
              </TouchableOpacity>
              <View style={{backgroundColor:'#fff',marginBottom:20,width,paddingLeft:30,paddingRight:30}}>
              <TextInput underlineColorAndroid='transparent'
                placeholder={lang.subject}
                style={Platform.OS==='ios'?{paddingTop:20,paddingBottom:20}:null}
                maxLength={128}
                placeholderTextColor={'#A9BFD0'}
                onChangeText={(text) => {
                  if(editLoc && e.url!==undefined){
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
                  if(editLoc && e.url!==undefined){
                    clearTimeout(timeoutUpdate);
                    this.ImageUpdate(des_space[`${'id_'}${e.id}`],title_space[`${'title_'}${e.id}`],null);
                  }
                }}
                onSubmitEditing={()=>{
                  if(editLoc && e.url!==undefined){
                    clearTimeout(timeoutUpdate);
                    this.ImageUpdate(des_space[`${'id_'}${e.id}`],title_space[`${'title_'}${e.id}`],null);
                  }
                }}
                value={e.url!==undefined?this.state.title_space[`${'title_'}${e.id}`]:this.state.title_space[`${'title_'}${index}`]}
               />
               <View style={{width:width-60,borderBottomWidth:1,borderColor:'#E0E8ED'}}></View>
               <TextInput underlineColorAndroid='transparent'
                 placeholder={lang.write_description}
                 style={Platform.OS==='ios'?{paddingTop:20,paddingBottom:20}:null}
                 placeholderTextColor={'#A9BFD0'}
                 maxLength={128}
                 onChangeText={(text) => {
                   if(editLoc && e.url!==undefined){
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
                   if(editLoc && e.url!==undefined) this.ImageUpdate(des_space[`${'id_'}${e.id}`],null,des_space[`${'des_'}${e.id}`]);
                 }}
                 onSubmitEditing={()=>{
                   clearTimeout(timeoutUpdate);
                   if(editLoc && e.url!==undefined) this.ImageUpdate(des_space[`${'id_'}${e.id}`],null,des_space[`${'des_'}${e.id}`]);
                 }}
                 value={e.url!==undefined?this.state.des_space[`${'des_'}${e.id}`]:this.state.des_space[`${'des_'}${index}`]}
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
