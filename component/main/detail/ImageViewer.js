/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,Modal,FlatList,TouchableOpacity,Dimensions
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
  componentDidMount() {
    const {index} = this.props;
    console.log('index',index);
    setTimeout(()=>{
      this.refs.flatlist.scrollToIndex({index:1, animated: true});
    },1000)
  }
  render() {
    const {visible,data,index} = this.props;
    console.log('index',index);
    //const {index} = this.state;
    return (
      <Modal onRequestClose={() => null} visible={visible} transparent>
      <View style={{backgroundColor:'#000',flex:1}}>

        <TouchableOpacity onPress={()=>this.props.closeModal()}
        style={{position:'absolute',padding:10,alignSelf:'flex-end',zIndex:9999, }}>
          <Image source={closeIC} style={{width:18,height:18}} />
        </TouchableOpacity>

        <FlatList
           horizontal ref='flatlist'
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item,index) => index}
           extraData={this.state}
           data={data}
           renderItem={({item,index}) => (
             <TouchableOpacity onPress={()=> {}} disabled >
                 <Image source={{uri :`${item.url}`}} resizeMode = 'contain' style={{width,height:'100%'}}/>
             </TouchableOpacity>
        )} />
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
