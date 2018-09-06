/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  Dimensions,PanResponder,Animated,AsyncStorage,

} from 'react-native';
import ChangePwd from './ChangePwd';
import checkNoti from '../../api/checkNoti';
import checkLogin from '../../api/checkLogin';
import getLanguage from '../../api/getLanguage';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';

const {width,height} = Dimensions.get('window');

export default class AppInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:'',
      user_id:'',
      active:1,
      pan:2,
      showChangePwd:false,
      selectLang:{
        valueLang:'',
        labelLang:'',
      },
    }
  }
  componentWillMount(){
    checkLogin().then(e=>this.setState({email:e.email,user_id:e.id}));
    this.getLang();
  }

  getLang(){
    getLanguage().then((e) =>{
      if(e!==null){
          this.setState({
            selectLang:{
              valueLang:e.valueLang,
              labelLang:e.labelLang,
            }
          });
     }
    });
  }

  render() {
    //console.log(this.props.navigation);
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,show,hide,
      imgInfo,wrapInputCreImg,marTop,colorTitle,txt
    } = styles;

    const {lang} = this.props.navigation.state.params;
    const {goBack} = this.props.navigation;
    return (

        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{goBack();}}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  >
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{'Thông tin ứng dụng'.toUpperCase()} </Text>
                  <View></View>
              </View>
          </View>

         <View style={listCreate}>
            <View style={{width:(width-30)/2}}>
              <Text style={colorTitle}>Version</Text>
            </View>
            <View style={{width:(width-30)/2}}>
              <Text style={{color:'#B8B9BD'}}>{'1.0.4 release'}</Text>
            </View>
         </View>

         <View style={{height:2}}></View>

         <View style={listCreate}>
            <View style={{width:(width-30)/2}}>
              <Text style={colorTitle}>{'Ngày cập nhật:'}</Text>
            </View>
            <View style={{width:(width-30)/2}}>
              <Text style={{color:'#B8B9BD'}}>{'06/09/2018'}</Text>
            </View>
         </View>
      </View>


    );
  }
}
