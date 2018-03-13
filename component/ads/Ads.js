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

export default class Ads extends Component {
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
    const { lang,code_user,name_module,icon } = this.props.navigation.state.params;
    const { navigation } = this.props;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      headLocationStyle, inputSearch,wrapWhite,marTop,titleKcoin,
      titleHead,titleNormal,
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

          <TouchableOpacity >
            <Text>{`${'Đăng quảng cáo ngay'}`.toUpperCase()}</Text>
          </TouchableOpacity>
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

  contentWrap : { width,height:height-155,alignItems: 'center',justifyContent: 'center'},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },

  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
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
