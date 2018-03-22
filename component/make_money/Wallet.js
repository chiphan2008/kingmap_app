/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,
  FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import {Select, Option} from "react-native-chooser";

//import styles from '../styles';
import getApi from '../api/getApi';
import global from '../global';

import searchIC from '../../src/icon/ic-gray/ic-search.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
//import calendarIC from '../../src/icon/ic-wallet/ic-calendar.png';
//import timeIC from '../../src/icon/ic-wallet/ic-time.png';
import historyIC from '../../src/icon/ic-wallet/ic-history.png';
import receiveIC from '../../src/icon/ic-wallet/ic-receive.png';
import walletIC from '../../src/icon/ic-wallet/ic-wallet.png';
import transferIC from '../../src/icon/ic-wallet/ic-transfer.png';
import withdrawIC from '../../src/icon/ic-wallet/ic-withdraw.png';


export default class Wallet extends Component {
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
    const { lang,code_user } = this.props.navigation.state.params;
    const { navigation } = this.props;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      headLocationStyle, inputSearch,wrapWhite,marTop,titleKcoin,
      selectBox,selectBoxCity,optionListStyle,optionListStyleCity,
      imgContent,colorTitle,
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${lang.my_wallet}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>

        <View style={contentWrap}>
        <View style={{backgroundColor:'#2e3c52',width,height:110,justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'white'}}> {`${'Số Kcoin bạn đang có trong ví'}`} </Text>
        <Text style={titleKcoin}> {`${'200.000'}`.toUpperCase()} </Text>
        </View>

        <View>
          <TouchableOpacity
          onPress={()=> navigation.navigate('TransferScr',{lang,title:lang.transfer,code_user})}
          style={wrapWhite}>
          <Image source={transferIC} style={imgContent} />
          <Text style={colorTitle}>{lang.transfer}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={wrapWhite}
          onPress={()=> navigation.navigate('WalletGuideScr',{lang,title:lang.wallet_guide,code_user})}>
          <Image source={walletIC} style={imgContent} />
          <Text style={colorTitle}>{lang.wallet_guide}</Text>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={()=> navigation.navigate('RequestTransferScr',{lang,title:lang.request_transfer})}
          style={wrapWhite}>
          <Image source={withdrawIC} style={imgContent} />
          <Text style={colorTitle}>Yêu cầu rút tiền</Text>
          </TouchableOpacity>

          <TouchableOpacity style={wrapWhite}
          onPress={()=> navigation.navigate('HistoryScr',{lang,title:lang.history,code_user})}
          >
          <Image source={historyIC} style={imgContent} />
          <Text style={colorTitle}>Lịch sử giao dịch</Text>
          </TouchableOpacity>
          {/*
            <View style={{padding:20}}>
              <Text>Địa điểm mới: {this.state.listLoc.new_location}</Text>
              <Text>Bạn đang có: {this.state.listLoc.make_money} kcoin</Text>
              <Text>Thống kê chi phí trong tháng: </Text>
              <Text>- Phí quảng cáo:  {this.state.listLoc.pay_money.quang_cao}</Text>
              <Text>- Phí rao vặt:  {this.state.listLoc.pay_money.rao_vat}</Text>
              <Text>- Phí tạo khuyến mãi:  {this.state.listLoc.pay_money.khuyen_mai}</Text>
              <Text>- Phí thuê website:  {this.state.listLoc.pay_money.thue_web}</Text>
              <Text>- Phí mua phần mềm:  {this.state.listLoc.pay_money.phan_mem}</Text>
            </View>
            <Select
                  onSelect = {this.onSelectLoc.bind(this)}
                  defaultText={lang.choose_loc}
                  style = {[selectBox,selectBoxCity]}
                  textStyle = {{color:'#5b89ab'}}
                  optionListStyle={[optionListStyle,optionListStyleCity]}
                  transparent
                  indicatorColor="#5b89ab"
                  indicator="down"
                  indicatorSize={7}
                >
                {this.state.listLoc.your_location.map((e)=>(
                  <Option numberOfLines={1} value={e.id} key={e.id}>{e.name}</Option>
                ))}

            </Select>*/}
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

  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  marTop:{marginTop:20},
  wrapWhite:{
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems:'center',
    padding:15,
    marginBottom:1,
    width
  },
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
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  titleKcoin:{color:'white',fontSize:24,fontWeight:'bold',paddingTop:5},
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
