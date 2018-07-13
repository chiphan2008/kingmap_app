/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,
  ScrollView,
} from 'react-native';
const {height, width} = Dimensions.get('window');

//import styles from '../styles';
import global from '../global';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import calendarIC from '../../src/icon/ic-wallet/ic-calendar.png';
import timeIC from '../../src/icon/ic-wallet/ic-time.png';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choose_loc:global.choose_loc,
      showCode:false,
    }
  }


  render() {
    const { lang,title,code_user } = this.props.navigation.state.params;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      headLocationStyle, inputSearch,wrapWhite,marTop,titleKcoin,
      selectBox,marRight,blueColor,imgCalendar,
      imgInfo,imgShare,colorTitle,wrapContent,wrapInput,btnTransfer,btnFinish,
      popoverLoc,overLayout,shadown,txtAlign,txtInput,titleVer,titleCoin,
    } = styles;

    return (
      <View style={container}>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>this.props.navigation.goBack()}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${title}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>
      <ScrollView >
        <View style={contentWrap}>

          <View style={wrapWhite}>
            <View>
                <Text style={titleVer}>0906 880 119</Text>
                <View style={{flexDirection:'row',marginTop:5}}>
                  <Image source={timeIC} style={imgShare} />
                  <Text style={[blueColor,marRight]}>09:46</Text>
                  <Text style={[blueColor,marRight]}> | </Text>
                  <Image source={calendarIC} style={imgCalendar} />
                  <Text style={blueColor}>03/03/2018 </Text>
                </View>
            </View>
            <Text style={titleCoin}>200.000</Text>
          </View>

          <View style={wrapWhite}>
            <View>
                <Text style={titleVer}>0906 880 119</Text>
                <View style={{flexDirection:'row',marginTop:5}}>
                  <Image source={timeIC} style={imgShare} />
                  <Text style={[blueColor,marRight]}>09:46</Text>
                  <Text style={[blueColor,marRight]}> | </Text>
                  <Image source={calendarIC} style={imgCalendar} />
                  <Text style={blueColor}>03/03/2018 </Text>
                </View>
            </View>
            <Text style={titleCoin}>200.000</Text>
          </View>

          <View style={wrapWhite}>
            <View>
                <Text style={titleVer}>0906 880 119</Text>
                <View style={{flexDirection:'row',marginTop:5}}>
                  <Image source={timeIC} style={imgShare} />
                  <Text style={[blueColor,marRight]}>09:46</Text>
                  <Text style={[blueColor,marRight]}> | </Text>
                  <Image source={calendarIC} style={imgCalendar} />
                  <Text style={blueColor}>03/03/2018 </Text>
                </View>
            </View>
            <Text style={titleCoin}>200.000</Text>
          </View>

          <View style={wrapWhite}>
            <View>
                <Text style={titleVer}>0906 880 119</Text>
                <View style={{flexDirection:'row',marginTop:5}}>
                  <Image source={timeIC} style={imgShare} />
                  <Text style={[blueColor,marRight]}>09:46</Text>
                  <Text style={[blueColor,marRight]}> | </Text>
                  <Image source={calendarIC} style={imgCalendar} />
                  <Text style={blueColor}>03/03/2018 </Text>
                </View>
            </View>
            <Text style={titleCoin}>200.000</Text>
          </View>

        </View>
      </ScrollView >



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
  titleVer : {
    fontSize: 18,
    fontWeight:'bold',
    color:'#1E1F29',
  },
  titleCoin : {
    fontSize: 20,
    fontWeight:'bold',
    color:'#d0021b',
  },
  txtInput:{
    borderColor : "#6587A8",
    padding:0,
    borderRadius : 5,
    width: 50,
    height: 50,
    borderWidth: 1,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    textAlign: 'center',
    marginRight:5,
  },
  txtAlign:{textAlign:'center',color:'#6587A8'},
  btnFinish:{width:width/3},
  btnTransfer:{alignItems:'center',justifyContent:'center',backgroundColor:'#d0021b',padding:10,borderRadius:5},
  wrapContent: {
    width:width-30,
  },
  popoverLoc : {
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:8,
  },
  overLayout:{
    backgroundColor:'#fff',width:width-30,borderRadius:5,padding:15,alignItems:'center'
  },
  wrapInput:{
    backgroundColor:'#fff',borderColor:'#E1E7EC',borderWidth:1,borderRadius:5,marginTop:8,
    padding:Platform.OS==='ios' ? 15 : 10 },
  marTop:{marginTop:20},
  wrapWhite:{
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    padding:15,
    marginBottom:1,
    width
  },

  colorTitle:{color:'#2F353F'},
  imgInfo:{width:32,height:32,marginRight:10},
  imgShare:{width:16,height:16,marginRight:10},
  imgCalendar:{width:17,height:16,marginRight:10},
  marRight:{marginRight:10},
  blueColor:{color:'#6587A8'},
  contentWrap : { flex : 1,alignItems: 'center',justifyContent: 'flex-start'},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },
  selectBox : {
    borderRadius : 5,
    borderWidth : 1,
    borderColor : "#e0e8ed",
    width: width - 38,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    //alignSelf: 'stretch',
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  titleKcoin:{color:'white',fontSize:24,fontWeight:'bold',paddingTop:5},
  headLocationStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 75,
      position:'relative',zIndex:5,
  },
  inputSearch : {
    marginTop: 3,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
})
