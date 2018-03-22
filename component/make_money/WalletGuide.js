/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,
  ScrollView,
} from 'react-native';
const {height, width} = Dimensions.get('window');

//import styles from '../styles';
import getApi from '../api/getApi';
import global from '../global';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import calendarIC from '../../src/icon/ic-wallet/ic-calendar.png';
import timeIC from '../../src/icon/ic-wallet/ic-time.png';

export default class WalletGuide extends Component {
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
      popoverLoc,overLayout,shadown,txtAlign,txtInput,titleVer,
    } = styles;

    return (
      <View style={container}>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
              <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${title}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>
      <ScrollView >
        <View style={contentWrap}>

          <View style={wrapWhite}>

            <Text style={colorTitle}>
            {`${'Thật dễ dàng với Ví KingMap nếu bạn muốn nạp tiền vào ví \n\n- Bạn có thể “nhờ” chủ tài khoản khác chuyển tiền vào Ví KingMap của bạn và ...gửi lại tiền mặt cho họ. \n- Bạn tới các cửa hàng có giảm giá và mua bán ở đó, bạn vừa có lợi khi mua được hàng giá rẻ lại có thể “nhờ” người bán hàng chuyển dùm số tiền được giảm giá vào Ví KingMap của bạn. Một tiện ích bất ngờ và cực kỳ độc đáo. \n- Bạn có thể mua thẻ cào KingMap ở hầu hết các cửa hàng tiện ích và các đại lý điện thoại trên cả nước. \n- Bạn có thể chuyển tiền vào Ví KingMap từ tài khoản Internet banking của bạn \n- Bạn có thể nạp tiền từ thẻ tín dụng của bạn. \n- Bạn có thể ra ngân hàng gần nhất nạp tiền mặt.'}`}
            </Text>
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
  colorTitle : {
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
