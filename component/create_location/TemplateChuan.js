/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,
} from 'react-native';
import styles from '../styles';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
const {width,height} = Dimensions.get('window');

export default class AddImageMore extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,
    } = styles;
    return (
      <Modal
      onRequestClose={() => null}
      transparent
      animationType={'slide'}
      visible={this.props.showImgMore}
      >
        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>this.props.closeModal()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> THÊM HÌNH ẢNH </Text>
                  <View></View>
              </View>

          </View>
          <View style={{
            flexDirection:'row',justifyContent:'space-between',paddingTop:0,padding:10,paddingLeft:20,paddingRight:20,
            backgroundColor: '#D0021B',}}>
          <TouchableOpacity>
              <Text style={[titleCreate,titleActive]}>{`${'Không gian'}`.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
              <Text style={[titleCreate,titleTab]}>{`${'Thực đơn'}`.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
              <Text style={[titleCreate,titleTab]}>{`${'Video'}`.toUpperCase()}</Text>
          </TouchableOpacity>
          </View>

           <View style={{height:5}}></View>
        </View>
        </Modal>
    );
  }
}
