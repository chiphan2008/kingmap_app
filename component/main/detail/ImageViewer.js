/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,Modal,FlatList,TouchableOpacity,Dimensions,Platform
} from 'react-native';
import closeIC from '../../../src/icon/ic-white/ic-close.png';
const {width,height} = Dimensions.get('window');
import global from '../../global';
import * as lib from '../../libs';

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
    const {visible,data,index, local} = this.props;
    console.log('data',data.length,index,data[index]);
    //const {index} = this.state;
    return (
      data.length>0 &&
      <Modal onRequestClose={() => null} visible={visible} transparent={false}>
      <View style={{height,width,backgroundColor:'#000'}}>

        <TouchableOpacity onPress={()=>this.props.closeModal()}
        style={{position:'absolute',top:Platform.OS==='ios'?35:25,right:15,zIndex:9999, }}
        hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}>
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
             <View>
               <Image 
               source={local ? {uri :`${global.url_media}${item.image}`} : {uri :item.url ? `${item.url}` : `${item.image}`}} 
               resizeMode = 'contain' 
               style={{flex:1,width,height:'100%'}}/>
               <View style={{flexDirection: 'column',width, height: height*0.2, position: 'absolute', zIndex: 999,alignItems: 'center',justifyContent: 'center', marginTop: height*0.75, backgroundColor: 'rgba(0,0,0,.7)'}}>
                <Text style={{color: '#fff'}}>{item.name ? item.name : item.title ? item.title : ''}</Text>
                <Text style={{color: '#fff'}}>{item.url && item.description ? item.description : item.price ? `${lib.format_number(item.price)} ${item.currency}` : ''}</Text>
               </View>
             </View>
             
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
