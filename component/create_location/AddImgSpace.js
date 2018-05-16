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

export default class AddImgSpace extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgSpace:[],
      des_space:{},
      title_space:{},
      txtErr:'',
    }
  }
  uploadSpace(){
    ImagePicker.openPicker({
      multiple: true
    }).then(imgSpace => {
      //console.log(imgSpace);
      this.setState({imgSpace})
    }).catch(e=>console.log('e'));
  }

  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,show,hide,colorWhite,titleErr,
    } = styles;
    const {imgSpace,des_space,title_space} = this.state;
    return (

      <Modal onRequestClose={() => null} transparent
      animationType={'slide'} visible={this.props.visible}
      >
      <ScrollView style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    this.props.submitImage(imgSpace,Object.entries(title_space),Object.entries(des_space));
                    this.props.closeModal();
                  }}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> THÊM HÌNH ẢNH </Text>
                  <View></View>
              </View>

          </View>


          <View style={[container]}>
          <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#FFFEFF',padding:50,borderColor:'#ECEEF3',borderBottomWidth:1,marginBottom:5}}>
            <TouchableOpacity
            onPress={()=>this.uploadSpace()}>
            <Image source={cameraLargeIC} style={{width:60,height:60,marginBottom:10}}/>
            </TouchableOpacity>
            <Text style={{fontSize:20}}>TẢI ẢNH LÊN</Text>
          </View>
          {this.state.imgSpace.length > 0 ?
            <View>
            {this.state.imgSpace.map((e,index)=>(
              <View key={index}>
              <Image style={{width,height:300,resizeMode: 'cover'}} source={{isStatic:true,uri:`${e.path}`}} />
              <TouchableOpacity style={{position:'absolute',right:5,top:5}}
              onPress={()=>{
                this.state.imgSpace.splice(index, 1);
                Object.entries(this.state.title_space).splice(index, 1);
                Object.entries(this.state.des_space).splice(index, 1);
                this.setState(this.state)
              }}>
              <Image source={closeLargeIC} style={{width:22,height:22}}/>
              </TouchableOpacity>

              <View style={{backgroundColor:'#fff',marginBottom:20,width,paddingLeft:30,paddingRight:30}}>
              <TextInput underlineColorAndroid='transparent'
                placeholder={'Chủ đề'}
                placeholderTextColor={'#A9BFD0'}
                onChangeText={(text) => {
                  this.state.title_space = Object.assign(this.state.title_space,{[`${'title_'}${index}`]:text})
                  this.setState(this.state);
                }}
                value={this.state.title_space[`${'title_'}${index}`]}
               />
               <View style={{width:width-60,borderBottomWidth:1,borderColor:'#E0E8ED'}}></View>
               <TextInput underlineColorAndroid='transparent'
                 placeholder={'Viết mô tả'}
                 placeholderTextColor={'#A9BFD0'}
                 onChangeText={(text) => {
                   this.state.des_space = Object.assign(this.state.des_space,{[`${'des_'}${index}`]:text})
                   this.setState(this.state);
                 }}
                 value={this.state.des_space[`${'des_'}${index}`]}
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
