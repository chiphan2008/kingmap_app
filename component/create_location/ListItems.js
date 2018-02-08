/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,TextInput,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles';
import photoIC from '../../src/icon/ic-create/ic-photo.png';

export default class ListItems extends Component {
    constructor(props) {
      super(props);
      this.state = {
        id:0,
        name:'',
        price:0,
        currency:'',
      }
    }
    render(){
      const {listCreate,colorWhite,imgInfo} = styles;
      return(
        <View style={listCreate}>
            <View style={{flexDirection:'row'}}>
            <TextInput underlineColorAndroid='transparent'
            placeholder="Tên"
            style={{width:90,padding:0,marginLeft:15,borderBottomWidth:1,fontSize:16}}
             />

             <TextInput underlineColorAndroid='transparent'
             placeholder="Giá"
             keyboardType={'numeric'}
             style={{width:90,padding:0,marginLeft:15,borderBottomWidth:1,fontSize:16}}
              />

             <TouchableOpacity style={{width:50,backgroundColor:'#313B50',borderRadius:3,padding:5,marginLeft:7,alignItems:'center',marginRight:7}}>
             <Text style={colorWhite}>VND</Text>
             </TouchableOpacity>

             <TouchableOpacity style={{alignSelf:'center'}}>
             <Image source={photoIC} style={imgInfo}/>
             </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
