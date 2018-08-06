/* @flow */
import React, { Component } from 'react';
import {
  View,Modal,WebView,TouchableOpacity,Dimensions,Image,Platform
} from 'react-native';
import closeIC from '../../../src/icon/ic-white/ic-close.png';
import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import {chanelVideo} from '../../libs';
const {width,height} = Dimensions.get('window');


export default class VideoViewer extends Component {
  constructor(props){
    super(props);
    // this.state = {
    //   index:0,
    // }
  }

  render() {
    const {visible,link} = this.props;
    let newLink;
    if(link.type === "youtube"){
      newLink = link.link.replace('watch?v=', 'embed/');
      newLink = newLink.replace('https://m', 'https://www')
      newLink = newLink.split('&')[0];
      newLink = `<html><iframe width="100%" height="100%" src=${newLink} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="0" fs="1"></iframe></html>`;
      //console.log(newLink)
    } else{
      newLink = `<html><iframe src="https://www.facebook.com/plugins/video.php?href=${link.link}" width="100%" height="100% scrolling="no" style="overflow:hidden;height:100%;width:100%;background-color:'#000'" frameborder="0" allowFullScreen="0" fs="1"></iframe></html>`;
    }
    // newLink = `<html><iframe width="100%" height="100%" src="https://www.youtube.com/embed/XrYG5aG4QKI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="0" fs="1"></iframe></html>`;
    return (
      link!=={} &&
      <Modal onRequestClose={() => null} visible={visible} transparent>
      <TouchableOpacity style={{position:'absolute',zIndex:999,top:18,left:8}}
      onPress={()=>{this.props.closeModal()}}
      hitSlop={{top: 30, bottom: 28, left: 30, right: 28}}>
      <Image source={arrowLeft} style={{width:22, height:22}} />
      </TouchableOpacity>
      <View style={{flex: 1,width,backgroundColor:'#000',justifyContent:'center',alignItems:'center'}}>

      <View style={{flex:0.6,width:width,backgroundColor:'#000',justifyContent: 'center',alignSelf:'center',padding:0}}>
        <WebView
            style={{flex: 1, justifyContent: 'center',backgroundColor:'#000'}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ html: newLink }}
        />
      </View>
      </View>
      
      </Modal>
    );
  }
}
