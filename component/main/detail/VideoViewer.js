/* @flow */

import React, { Component } from 'react';
import {
  View,Modal,WebView,TouchableOpacity,Dimensions,Image
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
    //console.log('data',data.length,index,data[index]);
    //const {index} = this.state;//${'?autoplay=1'}
    return (
      link!=='' &&
      <Modal onRequestClose={() => null} visible={visible} transparent>
      <TouchableOpacity style={{position:'absolute',zIndex:999,top:14,left:5}}
      onPress={()=>{this.props.closeModal()}} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
      <Image source={arrowLeft} style={{width:18, height:18}} />
      </TouchableOpacity>
      <View  onLayout={()=>console.log(chanelVideo(link))} style={{width,height:height-24,backgroundColor:'#000',justifyContent:'center',alignItems:'center'}}>

      <WebView

         style={{width,height:width,backgroundColor:'#000',alignSelf:'center',marginTop:height/4,padding:0}}
         //resizeMode='cover'
         allowsInlineMediaPlayback
         source={{
           html:`<iframe  width="${width-15}" height="300" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="true" allowtransparency="true" src="${chanelVideo(link)}"  scrolling="no"></iframe>`
           //uri: `${link}`
         }}
         javaScriptEnabled
         domStorageEnabled
         automaticallyAdjustContentInsets={false}
         decelerationRate="normal"
         //onNavigationStateChange={this.onNavigationStateChange}
         //onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
         startInLoadingState={true}
         //scalesPageToFit={true}
      />
      </View>
      </Modal>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
