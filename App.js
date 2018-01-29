
import React, { Component } from 'react';
import {
  Platform, StyleSheet, View, AsyncStorage, Image
} from 'react-native';
import { StackNavigator,TabNavigator,Animated, } from 'react-navigation';
//import util from 'util';
//import icon tabBarIcon
import homeIC from './src/icon/ic-home/ic-home.png';
import locationIC from './src/icon/ic-home/ic-location.png';
import infoIC from './src/icon/ic-home/ic-info.png';
import notifyIC from './src/icon/ic-home/ic-notification.png';
import personalIC from './src/icon/ic-home/ic-personal.png';

// import screen
import FadeView from './component/FadeView';
import DetailScreen from './component/main/DetailScreen';
import ListImageContent from './component/main/ListImageContent';
import CategoryScreen from './component/main/home/CategoryScreen';
import ListCategory from './component/main/home/ListCategory';

import HomeTab from './component/main/home/HomeTab';
import LocationTab from './component/main/location/LocationTab';
import ListLocation from './component/main/location/ListLocation';
import DistributeTab from './component/main/home/DistributeTab';
import NotifyTab from './component/main/notify/NotifyTab';
import PersonalTab from './component/main/personal/PersonalTab';

import SelectLocation from './component/main/location/SelectLocation';

import LoginScreen from './component/page_user/LoginScreen';
import SignUpScreen from './component/page_user/SignUpScreen';
import ForgotPasswordScreen from './component/page_user/ForgotPasswordScreen';
import VerifyAccountScreen from './component/page_user/VerifyAccountScreen';
import checkLocation from './component/api/checkLocation';
//import getApiKey from './component/api/getApiKey';

//AsyncStorage.removeItem('@LocationKey:key');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

const HomeScreen = StackNavigator({
  HomeTabs: { screen: HomeTab },
  CatScr: { screen: CategoryScreen },
  ListCatScr: { screen: ListCategory },
  OtherCatScr: { screen: DistributeTab },
},{
  headerMode: 'none',
});

const LocationScreen = StackNavigator({
  LocTab: { screen: LocationTab },
  ListLocScr: { screen: ListLocation },
},{
  headerMode: 'none',

});

const RootTabs = TabNavigator({
  HomeT: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Image source={homeIC} style={[styles.icon, {tintColor}]} />
      ),
    },
  },
  LocationT: {
    screen: LocationScreen,//LocationTab,//,DistributeTab
    navigationOptions: {
      tabBarLabel: 'Địa điểm',
      tabBarIcon: ({ tintColor }) => (
        <Image source={locationIC} style={[styles.icon, {tintColor}]} />
      ),
      tabBarVisible:true,
    },
  },
  NotifyT: {
    screen: NotifyTab,
    navigationOptions: {
      tabBarLabel: 'Thông báo',
      tabBarIcon: ({ tintColor }) => (
        <Image source={notifyIC} style={[styles.icon, {tintColor}]} />
      ),
    },
  },
  PersonalT: {
    screen: PersonalTab,
    navigationOptions: {
      tabBarLabel: 'Cá nhân',
      tabBarIcon: ({ tintColor }) => (
        <Image source={personalIC} style={[styles.icon, {tintColor}]} />
      ),
      style : {
        borderBottomWidth:0,
      },
    },
  },
  InfoT: {
    screen: PersonalTab,
    navigationOptions: {
      tabBarLabel: 'Info',
      tabBarIcon: ({ tintColor }) => (
        <Image source={infoIC} style={[styles.icon, {tintColor}]} />
      ),
      style : {
        borderBottomWidth:0,
      },
    },
  },


}, {
  //initialRouteName:'LocationT',
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: true,
  tabBarSelected: 'Home',
  tabBarOptions: {
    showLabel:true,
    showIcon:true,
    labelStyle: {
      fontSize: 11,
    },
    activeTintColor: '#fff',
    inactiveTintColor: '#B8BBC0',
    activeBackgroundColor:'#BF2827',
    borderBottomWidth: 0,
    style : {
        backgroundColor:'#BF2827',
    },
    indicatorStyle: {
        backgroundColor: 'transparent',
    },
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initApp : false,
    }
  }
  componentWillMount(){
    checkLocation().then(e=>{
      //console.log('e',e.idCountry);
      if(e.idCountry!==undefined){
        this.setState({initApp:true});
      }
    });
  }
  render(){
    const RootNav = StackNavigator(
      {
      IntroSrc: {
        screen: FadeView,
      },
      MainScr: {
        screen: RootTabs,
      },
      DetailScr: {
        screen: DetailScreen,
      },
      ListIMGScr: {
        screen: ListImageContent,
      },
      LoginScr: {
        screen: LoginScreen,
      },
      SignUpScr: {
        screen: SignUpScreen,
      },
      ForgotScr: {
        screen: ForgotPasswordScreen,
      },

    },
    {
      headerMode: 'none',
      initialRouteName: this.state.initApp ? 'MainScr' : 'IntroSrc',
    });

    return (<RootNav />);
  }
} ;
