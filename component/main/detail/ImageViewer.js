/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,Modal,FlatList,TouchableOpacity,Dimensions,Platform
} from 'react-native';
import closeIC from '../../../src/icon/ic-white/ic-close.png';
const {width,height} = Dimensions.get('window');

export default class ImageViewer extends Component {
  constructor(props){
    super(props);
    // this.state = {
    //   index:0,
    // }
  }
  gotoItem(index,data) {
    //const {index} = this.props;
    setTimeout(() => {
      this.flatlist.scrollToIndex({index,animated:false})
    }, 100);

  }

  getItemLayout = (data, index) => (
    { length: 0, offset: (width/2)*index, index }
  );

  render() {
    const {visible,data,index} = this.props;
    //console.log('data',data.length,index,data[index]);
    //const {index} = this.state;
    return (
      data.length>0 &&
      <Modal onRequestClose={() => null} visible={visible} transparent={false}>
      <View style={{height,width,backgroundColor:'#000'}}>

        <TouchableOpacity onPress={()=>this.props.closeModal()}
        style={{position:'absolute',top:Platform.OS==='ios'?25:15,right:15,zIndex:9999, }}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Image source={closeIC} style={{width:22,height:22}} />
        </TouchableOpacity>

        <FlatList
           horizontal
           pagingEnabled
           removeClippedSubviews={false}
           initialScrollIndex={0}
           initialNumToRender={data.length}
           //maxToRenderPerBatch={data.length}
           onScrollToIndexFailed={(info)=>console.log(info)}
           ref={(ref) => { this.flatlist = ref; }}
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item,index) => index.toString()}
           //getItemLayout={this.getItemLayout}
           extraData={this.state}
           data={data}
           renderItem={({item,index}) => (
             <Image source={{uri :`${item.url}`}} resizeMode = 'contain' style={{flex:1,width,height:'100%'}}/>
        )} />
        <View onLayout={()=>{this.gotoItem(index,data)}}></View>
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
