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
    //console.log('data',link);
    let newLink;
    if(link.type === "youtube"){
      newLink = link.link.replace('watch?v=', 'embed/');
      newLink = newLink.replace('https://m', 'https://www')
      newLink = newLink.split('&')[0];
      //console.log(newLink)
    } else{
      newLink = `https://www.facebook.com/plugins/video.php?height=${'300'}&href=${link.link}`;
    }
    return (
      link!=={} &&
      <Modal onRequestClose={() => null} visible={visible} transparent>
      <TouchableOpacity style={{position:'absolute',zIndex:999,top:14,left:5}}
      onPress={()=>{this.props.closeModal()}}
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
      <Image source={arrowLeft} style={{width:22, height:22}} />
      </TouchableOpacity>
      <View style={{width,height,backgroundColor:'#000',justifyContent:'center',alignItems:'center'}}>

        <View style={{width:width-15,height:width,backgroundColor:'#000',alignSelf:'center',padding:0}}>
          <WebView
              javaScriptEnabled={true}
              domStorageEnabled={true}
              source={{uri: newLink }}
          />
        </View>
      </View>
      </Modal>
    );
  }
}
