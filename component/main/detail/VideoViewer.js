/* @flow */

import React, { Component } from 'react';
import {
  View,Modal,WebView,TouchableOpacity,Dimensions
} from 'react-native';
import closeIC from '../../../src/icon/ic-white/ic-close.png';
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
    //const {index} = this.state;
    return (
      link!=='' &&
      <Modal onRequestClose={() => null} visible={visible} transparent>
      <View style={{width,height,backgroundColor:'#000'}}>
      <WebView
         allowsInlineMediaPlayback
         source={{uri: `${link}${'?autoplay=1'}`}}
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
