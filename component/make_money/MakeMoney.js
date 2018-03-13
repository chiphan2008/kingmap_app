/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,
  ScrollView,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import {Select, Option} from "react-native-chooser";

//import styles from '../styles';
import getApi from '../api/getApi';
import global from '../global';

import logoTop from '../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../src/icon/ic-gray/ic-search.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
//import calendarIC from '../../src/icon/ic-wallet/ic-calendar.png';
//import timeIC from '../../src/icon/ic-wallet/ic-time.png';
import historyIC from '../../src/icon/ic-wallet/ic-history.png';
import receiveIC from '../../src/icon/ic-wallet/ic-receive.png';
import walletIC from '../../src/icon/ic-wallet/ic-wallet.png';
import transferIC from '../../src/icon/ic-wallet/ic-transfer.png';
import withdrawIC from '../../src/icon/ic-wallet/ic-withdraw.png';


export default class MakeMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choose_loc:global.choose_loc,
    }
  }
  onSelectLoc(value, label) {
    const { navigate } = this.props.navigation;
    const { lang,code_user } = this.props.navigation.state.params;
    navigate('DetailScr',{
      idContent:value,lat:0,lng:0,curLoc:{latitude:10.8142,longitude:106.6438,},lang
    });
  }
  callData(code){
    getApi(`${global.url}${'list-location?code='}${code}`)
    .then(arrLoc => {
      //console.log('arrLoc',arrLoc);
        this.setState({ listLoc: arrLoc.data });
    })
    .catch(err => console.log(err));
  }
  componentWillMount(){
    const { code_user } = this.props.navigation.state.params;
    this.callData(code_user);
  }
  render() {
    const { lang,code_user,name_module } = this.props.navigation.state.params;
    const { navigation } = this.props;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,wrapDes,
      headLocationStyle, inputSearch,wrapWhite,marTop,titleHead,titleNormal,
      imgLogoTop,imgContent,colorTitle,titleCoin,contentKcoin,btnTransfer,
    } = styles;

    return (
      <ScrollView style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
              </TouchableOpacity>
                <Image source={logoTop} style={imgLogoTop} />
              <View></View>
          </View>
      </View>

        <View style={contentWrap}>

        <View style={{width:width-80,height:110,justifyContent:'center',alignItems:'center'}}>
        <Text style={titleHead}> {`${name_module}`.toUpperCase()} </Text>
        <Text style={titleNormal}> {`${'Giúp bạn kiếm tiền mọi lúc, mọi nơi bằng một công việc đơn giản và hợp pháp'}`} </Text>
        </View>

        <View>
          <View style={wrapWhite}>
            <Image source={transferIC} style={imgContent} />
            <View style={contentKcoin}>
              <View style={{width:width/2}}>
                <Text style={colorTitle}>{`${'Số Kcoin bạn đang có trong ví'}`}</Text>
              </View>
              <Text style={titleCoin}>{`${'500.000'}`}</Text>
            </View>
          </View>

          <View style={wrapWhite} >
            <Image source={receiveIC} style={imgContent} />
            <View style={contentKcoin}>
              <View style={{width:width/2}}>
                <Text style={colorTitle}>{`${'Tổng Kcoin bạn kiếm đuược trong tháng này'}`}</Text>
              </View>
              <Text style={titleCoin}>{`${'500.000'}`}</Text>
            </View>
          </View>

          <TouchableOpacity style={wrapWhite}
          onPress={()=> navigation.navigate('ReceiveScr',{lang,title:lang.receive,code_user})}
          >
            <Image source={receiveIC} style={imgContent} />
            <Text style={colorTitle}>{`${'Danh sách địa điểm của bạn'}`}</Text>
          </TouchableOpacity>

          <View style={{alignItems:'center'}}>
            <TouchableOpacity style={[marTop,btnTransfer]}>
            <Text style={titleCreate}>{`${'Nào cùng kiếm tiền'}`.toUpperCase()}</Text>
            <Text style={{color:'#fff'}}>{`${'(Tạo địa điểm mới thêm vào danh sách)'}`}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[marTop,wrapDes]}>
        <Text style={{color:'#6587A8',fontSize:16,lineHeight:28}}>{`${'Bạn hãy thường xuyên quan tâm đến khách hàng của mình: \n + Sau 4 tuần địa chỉ sẽ bị chìm.\n + Sau 4 tuần địa chỉ sẽ bị chìm. '}`}</Text>
        </View>

        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignSelf: 'stretch',
  },
  btnTransfer:{width:width-40,alignItems:'center',justifyContent:'center',backgroundColor:'#d0021b',padding:10,borderRadius:5},
  titleHead:{fontSize:20,fontWeight:'bold',color:'#2F353F'},
  titleNormal:{fontSize:15,color:'#2F353F',marginTop:5,lineHeight:22,textAlign:'center'},
  imgLogoTop : {
      width: 138,height: 25,
  },
  wrapDes:{width:width-40},
  marTop:{marginTop:20},
  wrapWhite:{
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems:'center',
    padding:15,
    marginBottom:1,
    width
  },
  titleCoin : {
    fontSize: 20,
    fontWeight:'500',
    color:'#d0021b',
  },
  contentKcoin:{flexDirection:'row',justifyContent:'space-between',width:width-80,alignItems:'center'},
  colorTitle:{color:'#2F353F',fontSize:16},
  imgContent:{width:38,height:38,marginRight:10},
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
  titleCreate:{color:'white',fontSize:18,paddingTop:5,fontWeight:'500'},
  selectBoxCity : {
    marginBottom: 0,
  },
  OptionItem : {
    borderBottomColor: '#e0e8ed',
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  optionListStyle : {
    borderRadius : 5,
    width: width - 38,
    minHeight: 200,
    maxHeight: 200,
    borderColor : "#fff",
    borderWidth : 0,
    marginTop:15,
    backgroundColor: '#fff',
    shadowOffset:{  width: 2,  height: 2,  },
    shadowColor: '#ddd',
    shadowOpacity: .5,
  },
  optionListStyleCountry : {
    top: Platform.OS === 'ios' ? 113 : 125,
  },
  optionListStyleCity : {
    top: Platform.OS === 'ios' ? -97 : -176,
  },

  headLocationStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 75,
      position:'relative',zIndex:5,
  },
  inputSearch : {
    marginTop: 3,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
})
