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


export default class MakeMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choose_loc:global.choose_loc,
      listLoc:{
        your_location:[],
        new_location:0,
        pay_money:{},
        make_money:0
      },
    }
  }
  onSelectLoc(value, label) {
    const { navigate } = this.props.navigation;
    const { lang } = this.props.navigation.state.params;
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
    const { lang } = this.props.navigation.state.params;
    const {
      container,contentWrap,
      headLocationStyle, inputSearch,wrapWhite,marTop,
      selectBox,selectBoxCity,optionListStyle,optionListStyleCity,
    } = styles;

    return (
      <View style={container}>

        <View style={headLocationStyle}>
          <TextInput underlineColorAndroid='transparent' placeholder={lang.search} style={inputSearch} />
          <Image style={{width:16,height:16,top:Platform.OS==='ios' ? -26 : -32,left:(width-80)/2}} source={searchIC} />
        </View>

        <View style={contentWrap}>
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

        </Select>

        <View style={[wrapWhite,marTop]}>
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
  wrapWhite:{backgroundColor:'#fff',flex:1,width},
  contentWrap : { flex : 1,alignItems: 'center',justifyContent: 'flex-start',marginTop:20},

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
