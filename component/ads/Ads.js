/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';

export default class Ads extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { lang,code_user,name_module,icon } = this.props.navigation.state.params;

    const { navigation } = this.props;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      headLocationStyle, inputSearch,wrapWhite,marTop,titleKcoin,
      titleHead,titleNormal,wrapBtn,btn,btnAd,btnTK,titleText,
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${name_module}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>

        <View style={contentWrap}>

          <Image source={{uri:icon}} style={{width:90,height:90,}} />
          <View style={{width:width-80,alignItems:'center'}}>
            <Text style={[titleHead,marTop]}>{name_module.toUpperCase()}</Text>
            <Text style={titleNormal}>Quảng cáo đơn giản và hiệu quả nhất tại KingMap với thao tác nhanh chóng.</Text>
          </View>

          <View style={[wrapBtn,marTop]}>
          <TouchableOpacity style={[btn,btnTK]}
          onPress={()=>navigation.navigate('DesignAdsScr',{lang,name_module:'Thiết kế quảng cáo'})}>
            <Text style={titleText}>{`${'Thiết kế quảng cáo'}`.toUpperCase()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[btn,btnAd]}>
            <Text style={titleText}>{`${'Đăng quảng cáo'}`.toUpperCase()}</Text>
          </TouchableOpacity>
          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignSelf: 'stretch',
  },
  titleHead:{fontSize:18,fontWeight:'bold',color:'#2F353F'},
  titleNormal:{fontSize:16,color:'#2F353F',marginTop:5,lineHeight:25,textAlign:'center'},
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  marTop:{marginTop:20},
  wrapBtn:{flexDirection:'row',width:width-30,justifyContent:'space-between'},
  btn:{borderRadius:5,width:(width-40)/2,padding:5,paddingTop:15,paddingBottom:15,alignItems:'center'},
  btnTK:{backgroundColor:'#777E8A'},
  btnAd:{backgroundColor:'#d0021b'},
  contentWrap : { width,height:height-155,alignItems: 'center',justifyContent: 'center'},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },

  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleText:{color:'white',fontSize: Platform.OS==='ios' ? 13 : 15,},
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  titleKcoin:{color:'white',fontSize:24,fontWeight:'bold',paddingTop:5},
  selectBoxCity : {
    marginBottom: 0,
  },


  headLocationStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 75,
      position:'relative',zIndex:5,
  },
  inputSearch : {
    marginTop: 3,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
})
