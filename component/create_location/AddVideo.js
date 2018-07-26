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
import {getThumbVideo} from '../libs';

export default class AddVideo extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgVideo:[],
      listVideo:[],
      txtVideoLink:'',
      txtErr:'',
      update:true,
    }
  }
  componentWillUpdate(){
    const {listVideo} = this.props;
    if(listVideo.length>0){
      var imgVideo = [],lstVideo=[];
      listVideo.forEach((e)=>{
        imgVideo = imgVideo.concat(e.thumbnail);
        lstVideo = lstVideo.concat(e.link);;
      })
      this.state.listVideo = lstVideo;
      this.state.imgVideo = imgVideo;
      this.state.update && this.setState(this.state,()=>{
        this.setState({update:false});
      })
    }
  }
  uploadVideo(link){
    const {lang} = this.props;
    if(link!==''){
      var youtube_video_id = getThumbVideo(link);
      if(this.state.imgVideo.includes(youtube_video_id)){
        return this.setState({
          txtErr:'* '+lang.exi_link,
          txtVideoLink:'',
        })
      }
      if(youtube_video_id===undefined){
        return this.setState({
          txtErr:'* '+lang.unlink,
        })
      }
      this.setState({
        listVideo: this.state.listVideo.concat(link),
        imgVideo: this.state.imgVideo.concat(youtube_video_id),
        txtErr:'',
        txtVideoLink:'',
      });
    }else {
      this.setState({
        txtErr:'* '+lang.require_link,
      })
    }
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,show,hide,colorWhite,titleErr,
    } = styles;
    const {lang}= this.props;
    return (

      <Modal onRequestClose={() => null} transparent
      animationType={'slide'}
      visible={this.props.visible} >
      <ScrollView style={container}>

          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    this.props.submitImage(this.state.listVideo);
                    this.props.closeModal();
                  }}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> VIDEO </Text>
                  <View></View>
              </View>

          </View>

          <View style={[container]}>
          <View style={{backgroundColor:'#FFFEFF',paddingTop:30,paddingBottom:30,paddingLeft:15,paddingRight:15,marginBottom:5,borderColor:'#ECEEF3',borderBottomWidth:1}}>
          <Text style={{fontSize:20}}>{lang.enter_video_link}</Text>
          <View style={{flexDirection:'row',marginTop:10}}>
            <TextInput
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.setState({txtVideoLink:text})}
            placeholder={`${this.props.lang.title_link}`}
            value={this.state.txtVideoLink}
            style={{borderRadius:3,paddingLeft:10,paddingTop:5,paddingBottom:5,fontSize:16,width:width-100,borderWidth:1,borderColor:'#E1E7EC',marginRight:10}} />
            <TouchableOpacity
            style={{justifyContent:'center',alignItems:'center',backgroundColor:'#2F353F',borderRadius:3,padding:0,paddingBottom:5,paddingLeft:10,paddingRight:10}}
            onPress={()=>{
              this.uploadVideo(this.state.txtVideoLink);
            }}>
              <Text style={titleCreate}>{lang.add}</Text>
            </TouchableOpacity>
            </View>
            <Text style={[titleErr,this.state.txtErr ? show : hide]}>{this.state.txtErr}</Text>
          </View>
          {this.state.imgVideo.length > 0 ?
            <View>
            {this.state.imgVideo.map((e,index)=>(
              <View  key={index}>
              <Image style={{width,height:300,marginBottom:5,resizeMode: 'cover'}}
              source={{uri:e}} />
              <TouchableOpacity style={{position:'absolute',right:5,top:5}}
              onPress={()=>{
                this.state.imgVideo.splice(index,1);
                this.state.listVideo.splice(index,1);
                this.setState({imgVideo:this.state.imgVideo,listVideo:this.state.listVideo})
              }}>
              <Image source={closeLargeIC} style={{width:22,height:22}}/>
              </TouchableOpacity>
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
