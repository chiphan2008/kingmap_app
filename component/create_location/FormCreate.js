/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import getLanguage from '../api/getLanguage';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import cameraIC from '../../src/icon/ic-camera.png';


export default class FormCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCat:false,
    }
  }



  render() {
    const {navigate, goBack} = this.props.navigation;
    const {
      container,
      headCatStyle,headContent, wrapDistribute,shadown,wrapFilter,
      show,hide,colorlbl,
      listCreate,titleCreate,imgCamera,
      imgShare,wrapInputCre,wrapInputCreImg,wrapCreImg,widthLblCre,
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:20, height:20,marginTop:5}} />
              </TouchableOpacity>
              <Text style={titleCreate}> TẠO ĐỊA ĐIỂM </Text>
              <TouchableOpacity>
                <Text style={titleCreate}>Done</Text>
              </TouchableOpacity>
          </View>
      </View>

    <View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Tên</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCre} />
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Phân loại</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCreImg} />
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Địa chỉ</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCre} />
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Email</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCre} />
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Thời gian</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCreImg} />
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Giá cả</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCreImg} />
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={{height:15}}></View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Hình ảnh</Text>
          </View>
          <View style={wrapCreImg}></View>
          <TouchableOpacity style={imgCamera}>
          <Image source={cameraIC} style={imgShare}/>
          </TouchableOpacity>
        </View>
        <View style={{height:15}}></View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Tiện nghi</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCreImg} />
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Chi nhánh</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCreImg} />
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

      </View>

      </View>
    );
  }
}
