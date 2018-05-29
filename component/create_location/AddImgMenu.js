/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,
} from 'react-native';
import styles from '../styles';
import cameraLargeIC from '../../src/icon/ic-create/ic-camera-large.png';
import closeLargeIC from '../../src/icon/ic-create/ic-close-large.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
const {width,height} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
//import {getIdYoutube} from '../libs';

export default class AddImgMenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgMenu:[],
      des_menu:{},
      title_menu:{},
      txtErr:'',
      update:true,
    }
  }
  uploadSpace(){
    ImagePicker.openPicker({
      multiple: true
    }).then(imgMenu => {
      //console.log(imgMenu);
      this.setState({imgMenu})
    }).catch(e=>console.log('e'));
  }
  componentWillUpdate(){
    const {img_menu} = this.props;
    if(img_menu.length>0){
      let title_menu={};
      let des_menu={};
      img_menu.forEach((e,index)=>{
        title_menu = Object.assign(title_menu,{[`${'title_'}${index}`]:e.title});
        des_menu = Object.assign(des_menu,{[`${'des_'}${index}`]:e.description});
      })
      this.state.title_menu=title_menu;
      this.state.des_menu=des_menu;
      this.state.imgMenu=img_menu;
      this.state.update && this.setState(this.state,()=>{
        this.props.submitImage(this.state.imgMenu,Object.entries(this.state.title_menu),Object.entries(this.state.des_menu));
        this.setState({update:false});
      })
    }
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,show,hide,colorWhite,titleErr,
    } = styles;
    const {imgMenu,des_menu,title_menu,update} = this.state;
    return (

      <Modal onRequestClose={() => null} transparent
      animationType={'slide'} visible={this.props.visible}
      >
      <ScrollView style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    this.props.submitImage(imgMenu,Object.entries(title_menu),Object.entries(des_menu));
                    this.props.closeModal();
                  }}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> THÊM HÌNH ẢNH </Text>
                  <View></View>
              </View>

          </View>


          <View style={[container]}>
          <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#FFFEFF',padding:50,marginBottom:5,borderColor:'#ECEEF3',borderBottomWidth:1}}>
            <TouchableOpacity
            onPress={()=>this.uploadSpace()}>
            <Image source={cameraLargeIC} style={{width:60,height:60,marginBottom:10}}/>
            </TouchableOpacity>
            <Text style={{fontSize:20}}>TẢI ẢNH LÊN</Text>
          </View>
          {this.state.imgMenu.length > 0 ?
            <View>
            {this.state.imgMenu.map((e,index)=>(
              <View key={index}>
              <Image style={{width,height:300,resizeMode: 'cover'}} source={{isStatic:true,uri:update?`${e.path}`:`${e.url}`}} />
              <TouchableOpacity style={{position:'absolute',right:5,top:5}}
              onPress={()=>{
                this.state.imgMenu.splice(index, 1);
                Object.entries(this.state.title_menu).splice(index, 1);
                Object.entries(this.state.des_menu).splice(index, 1);
                this.setState(this.state)
              }}>
              <Image source={closeLargeIC} style={{width:22,height:22}}/>
              </TouchableOpacity>

              <View style={{backgroundColor:'#fff',marginBottom:20,width,paddingLeft:30,paddingRight:30}}>
              <TextInput underlineColorAndroid='transparent'
                placeholder={'Chủ đề'}
                placeholderTextColor={'#A9BFD0'}
                onChangeText={(text) => {
                  this.state.title_menu = Object.assign(this.state.title_menu,{[`${'title_'}${index}`]:text})
                  this.setState(this.state);
                }}
                value={this.state.title_menu[`${'title_'}${index}`]}
               />
               <View style={{width:width-60,borderBottomWidth:1,borderColor:'#E0E8ED'}}></View>
               <TextInput underlineColorAndroid='transparent'
                 placeholder={'Viết mô tả'}
                 placeholderTextColor={'#A9BFD0'}
                 onChangeText={(text) => {
                   this.state.des_menu = Object.assign(this.state.des_menu,{[`${'des_'}${index}`]:text})
                   this.setState(this.state);
                 }}
                 value={this.state.des_menu[`${'des_'}${index}`]}
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
