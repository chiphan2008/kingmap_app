/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,
} from 'react-native';
import { StackNavigator,TabNavigator } from 'react-navigation';
//import {connect} from 'react-redux';
//import io from 'socket.io-client/dist/socket.io.js';
const {height, width} = Dimensions.get('window');
import HistoryChat from './HistoryChat';
import System from './System';
import Contact from './Contact';
import Messenger from './Messenger';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import chatIC from '../../src/icon/ic-blue/ic-chat.png';
import userIC from '../../src/icon/ic-blue/ic-user.png';
import groupIC from '../../src/icon/ic-blue/ic-group.png';
import onlineIC from '../../src/icon/ic-green/ic-online.png';

import {checkUrl,checkFriend,getGroup,getDistanceHours,getDistanceMinutes,getDistanceDays} from '../libs';
var element,timeoutHis;
export default class HomeChat extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    //console.log('listData',listData);
    const {
      container,headCatStyle,headContent,titleCreate,
    } = styles;
    let RootTabs = TabNavigator({
      HistoryT: {
        screen: HistoryChat,
        navigationOptions: {
          tabBarLabel: false,
          tabBarIcon: ({ tintColor }) => (
            <Image source={chatIC} style={[styles.icon, {tintColor}]} />
          ),
        },
      },
      ContactT: {
        screen: Contact,
        navigationOptions: {
          tabBarLabel: false,
          tabBarIcon: ({ tintColor }) => (
            <Image source={userIC} style={[styles.icon, {tintColor}]} />
          ),
        },
      },
      SystemT: {
        screen: System,
        navigationOptions: {
          tabBarLabel: false,
          tabBarIcon: ({ tintColor }) => (
            <Image source={groupIC} style={[styles.icon, {tintColor}]} />
          ),
        },
      },

    }, {
      initialRouteName:'HistoryT',
      tabBarPosition: 'top',
      //animationEnabled: false,
      allowFontScaling:true,
      swipeEnabled:true,
      scrollEnabled:true,
      //tabBarSelected: 'Home',
      ...TabNavigator.Presets.AndroidTopTabs,
      tabBarOptions: {
        showLabel:false,
        showIcon:true,
        labelStyle: {
          fontSize: 9.6,
          width:(width-40)/3,
        },
        iconStyle: {
          width:(width-40)/3,
        },
        containerStyle:'#fff',
        activeTintColor: '#5b89ab',
        inactiveTintColor: '#5b89ab',
        activeBackgroundColor:'#fff',
        borderBottomWidth: 0,
        style : {
            backgroundColor:'#fff',
            height: 50,
        },
        tabStyle:{
          paddingBottom:3,
        },
        indicatorStyle: {
            //backgroundColor: 'transparent',
            backgroundColor:'#5b89ab',
        },
      },
    });

    const RootNav = StackNavigator({
      HomeChatScr: {screen: RootTabs},
      MessengerScr: {screen: Messenger},
    },{
      headerMode: 'none',
      initialRouteName: 'HomeChatScr',//'MainScr',//
    });
    const { lang,name_module,user_id,avatar } = this.props.navigation.state.params;
    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>this.props.navigation.goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${name_module}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>
        <RootNav />
      </View>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     myFriends:state.myFriends,
//     detailBack:state.detailBack
//   }
// }
//
// export default connect(mapStateToProps)(HomeChat);

const styles = StyleSheet.create({
  container: { width,height},
  icon: {
    width: 24,
    height: 24,
  },
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},

})
