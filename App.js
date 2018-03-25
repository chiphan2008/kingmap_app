
import React, { Component } from 'react';
import {
  Platform, StyleSheet, View, AsyncStorage, Image
} from 'react-native';
import { StackNavigator,TabNavigator,Animated, } from 'react-navigation';
//import util from 'util';
//import icon tabBarIcon
import getLanguage from './component/api/getLanguage';
import lang_vn from './component/lang/vn/language';
import lang_en from './component/lang/en/language';
import homeIC from './src/icon/ic-home/ic-home.png';
import locationIC from './src/icon/ic-home/ic-location.png';
import infoIC from './src/icon/ic-home/ic-info.png';
import notifyIC from './src/icon/ic-home/ic-notification.png';
import moreIC from './src/icon/ic-home/ic-more.png';
import personalIC from './src/icon/ic-home/ic-personal.png';

//import Chat
import Contact from './component/conversation/Contact';
import Messenger from './component/conversation/Messenger';
//create-location
import ChooseCat from './component/create_location/ChooseCat';
import FormCreate from './component/create_location/FormCreate';
// import screen
import FadeView from './component/FadeView';
import DetailScreen from './component/main/DetailScreen';
import ListImageContent from './component/main/ListImageContent';
import CategoryScreen from './component/main/home/CategoryScreen';
import SearchScreen from './component/main/home/SearchScreen';
import ListCategory from './component/main/home/ListCategory';

import HomeTab from './component/main/home/HomeTab';
import MakeMoney from './component/make_money/MakeMoney';
import Wallet from './component/make_money/Wallet';
import WalletGuide from './component/make_money/WalletGuide';
import Transfer from './component/make_money/Transfer';
import History from './component/make_money/History';
import RequestTransfer from './component/make_money/RequestTransfer';

import Ads from './component/ads/Ads';
import DesignAds from './component/ads/DesignAds';

import LocationTab from './component/main/home/LocationTab';
import ListLocation from './component/main/home/ListLocation';
import DistributeTab from './component/main/home/DistributeTab';
import NotifyTab from './component/main/notify/NotifyTab';
import PersonalTab from './component/main/personal/PersonalTab';

import SelectLocation from './component/main/location/SelectLocation';

import LoginScreen from './component/page_user/LoginScreen';
import SignUpScreen from './component/page_user/SignUpScreen';
import ForgotPasswordScreen from './component/page_user/ForgotPasswordScreen';
import VerifyAccountScreen from './component/page_user/VerifyAccountScreen';
import checkLocation from './component/api/checkLocation';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initApp : false,
      initRoute : 'HomeT',
      isLogin : false,
      lang : lang_vn,
    }
    getLanguage().then((e) =>{
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
     }
    });
  }
  componentWillMount(){
    checkLocation().then(e=>{
      if(e.idCountry!==undefined){
        this.setState({initApp:true});
      }
    });
  }

  render(){
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
      OtherCatScr: { screen: LocationTab },
      ListLocScr: { screen: ListLocation },
      SearchScr: { screen: SearchScreen },
      MakeMoneyScr: { screen: MakeMoney },
      WalletScr: { screen: Wallet },
      WalletGuideScr: { screen: WalletGuide },
      TransferScr: { screen: Transfer },
      HistoryScr: { screen: History },
      AdsScr: { screen: Ads },
      DesignAdsScr: { screen: DesignAds },
      RequestTransferScr: { screen: RequestTransfer },
      //CatScr: { screen: CategoryScreen },
      //ListCatScr: { screen: ListCategory },
      //OtherCatScr: { screen: DistributeTab },
    },{
      headerMode: 'none',
    });


    const RootTabs = TabNavigator({
      HomeT: {
        screen: HomeScreen,
        navigationOptions: {
          tabBarLabel: `${this.state.lang.home}`,
          tabBarIcon: ({ tintColor }) => (
            <Image source={homeIC} style={[styles.icon, {tintColor}]} />
          ),
        },
      },
      NotifyT: {
        screen: NotifyTab,
        navigationOptions: {
          tabBarLabel: `${this.state.lang.notify}`,
          tabBarIcon: ({ tintColor }) => (
            <Image source={notifyIC} style={[styles.icon, {tintColor}]} />
          ),
        },
      },
      PersonalT: {
        screen: PersonalTab,
        navigationOptions: {
          tabBarLabel: `${this.state.lang.personal}`,
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
          tabBarLabel: `${this.state.lang.other}`,
          tabBarIcon: ({ tintColor }) => (
            <Image source={moreIC} style={[styles.icon, {tintColor}]} />
          ),
          style : {
            borderBottomWidth:0,
          },
        },
      },


    }, {
      initialRouteName:this.state.initRoute,
      tabBarPosition: 'bottom',
      animationEnabled: false,
      swipeEnabled: true,
      tabBarSelected: 'Home',
      tabBarOptions: {
        showLabel:true,
        showIcon:true,
        labelStyle: {
          fontSize: 10.5,
        },
        activeTintColor: '#fff',
        inactiveTintColor: '#B8BBC0',
        activeBackgroundColor:'#D0021B',
        borderBottomWidth: 0,
        style : {
            backgroundColor:'#D0021B',
            height: Platform.OS==='ios' ? 55 : 60,

        },
        tabStyle:{
          paddingBottom:3,
        },
        indicatorStyle: {
            backgroundColor: 'transparent',
        },
      },
    });

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
      ChooseCatScr: {
        screen: ChooseCat,
      },
      FormCreateScr: {
        screen: FormCreate,
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
      ContactScr: {
        screen: Contact,
      },
      MessengerScr: {
        screen: Messenger,
      },

    },
    {
      headerMode: 'none',
      initialRouteName: this.state.initApp ? 'MainScr' : 'IntroSrc',
    });

    return (<RootNav screenProps={(value)=>{value==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});}} />);
  }
} ;
