
import React, { Component } from 'react';
import {
  Platform, StyleSheet, View, AsyncStorage, Image, Dimensions,Text
} from 'react-native';
import { StackNavigator,TabNavigator,Animated,NavigationActions } from 'react-navigation';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
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
import global from './component/global';

//import Chat
import HomeChat from './component/conversation/HomeChat';
import Messenger from './component/conversation/Messenger';

//create-location
import ChooseCat from './component/create_location/ChooseCat';
import FormCreate from './component/create_location/FormCreate';
//import buy/sell
import ListBuySell from './component/buysell/ListBuySell';
import CreateBuySell from './component/buysell/CreateBuySell';
import ListProductBS from './component/buysell/ListProductBS';
import DetailBuySell from './component/buysell/DetailBuySell';
import ManageBuySell from './component/buysell/ManageBuySell';

//import ads
import Ads from './component/ads/Ads';
import DesignAds from './component/ads/DesignAds';
// import screen
import FadeView from './component/FadeView';
import DetailScreen from './component/main/DetailScreen';
import ListImageContent from './component/main/ListImageContent';
//import CategoryScreen from './component/main/home/CategoryScreen';
import SearchScreen from './component/main/home/SearchScreen';
import ListCategory from './component/main/home/ListCategory';

import HomeTab from './component/main/home/HomeTab';
import MakeMoney from './component/make_money/MakeMoney';
import CTVApprove from './component/make_money/CTVApprove';
import CTVDetail from './component/make_money/CTVDetail';
import CTVSubscribe from './component/make_money/CTVSubscribe';
import Wallet from './component/make_money/Wallet';
import WalletGuide from './component/make_money/WalletGuide';
import Transfer from './component/make_money/Transfer';
import History from './component/make_money/History';
import RequestTransfer from './component/make_money/RequestTransfer';

import OtherCat from './component/main/home/OtherCat';
import LocationTab from './component/main/home/LocationTab';

//import DistributeTab from './component/main/home/DistributeTab';
import NotifyTab from './component/main/notify/NotifyTab';
import PersonalTab from './component/main/personal/PersonalTab';
// import location
import SelectLocation from './component/main/location/SelectLocation';
import LocationScreen from './component/main/location/LocationScreen';
import ListLocation from './component/main/location/ListLocation';

import LoginScreen from './component/page_user/LoginScreen';
import SignUpScreen from './component/page_user/SignUpScreen';
import ForgotPasswordScreen from './component/page_user/ForgotPasswordScreen';
import VerifyAccountScreen from './component/page_user/VerifyAccountScreen';
import checkLocation from './component/api/checkLocation';
//LikeLocation,ListCheckin,UpdateInfo,Collection
import ChangeOwner from './component/main/personal/ChangeOwner';
import ListLocPer from './component/main/personal/ListLocPer';
import LikeLocation from './component/main/personal/LikeLocation';
import UpdateInfo from './component/main/personal/UpdateInfo';
import Setting from './component/main/personal/Setting';
import Collection from './component/main/personal/Collection';
import ListCheckin from './component/main/personal/ListCheckin';
import AppInfo from './component/main/personal/AppInfo';
import InternalManagement from './component/make_money/InternalManagement';
import getApi from './component/api/getApi';

const {width,height} = Dimensions.get('window');

const defaultState = {
  yourCurLoc : {
    latitude:'',
    longitude:''
  },
  slLang: {
    valueLang : '',
    labelLang : '',
  },
  myFriends:[],
  updateState:false,
  user_profile:{},
  isLogin:false,
  detailBack:'',
  listNoti: 0,
  count_suggest: 0,
};
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_MY_FRIENDS':
      return {...state,myFriends:action.myFriends}
      break;
    case 'UPDATE_COUNT_SUGGEST':
      return {...state,count_suggest:action.count_suggest}
      break;
    case 'UPDATE_LANG':
      return {...state,slLang:action.slLang}
      break;
    case 'STOP_START_UPDATE_STATE':
      return {...state,updateState:action.updateState}
      break;
    case 'FIND_CURRENT_LOCATION':
      return {
        ...state,
        yourCurLoc:action.yourCurLoc,
        updateState:action.updateState!==undefined?action.updateState:false,
      }
      break;

    case 'USER_LOGINED':
      return {
        ...state, isLogin:action.isLogin,
        user_profile:action.user_profile,
        updateState:action.updateState===undefined?false:action.updateState,
      }
      break;

    case 'DETAIL_BACK':
      return {...state,detailBack:action.detailBack}
      break;
    case 'GET_NOTIFY':
      return {...state, listNoti: action.listNoti}

    default:
      break;
  }
  //console.log('state',state);
  return state;
}
const store = createStore(reducer);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initApp : false,
      initRoute : 'HomeT',
      isLogin : false,
      lang : lang_vn,
      setVal:false,
      listNoti: 0,
    }
    getLanguage().then(e=>{
      //console.log('e',e);
      this.setState({
        lang : (e.valueLang==='vn' || e.valueLang==='') ?lang_vn:lang_en,
      });
    })
    checkLocation().then(e=>{
      if(e.idCountry!==undefined){
        this.setState({initApp:true});
      }
    });
  }

  getLang(slLang,route=null,updateRoute=null){
    // const { slLang } = defaultState;
    //console.log('slLang',slLang);
    if(route!==null) this.state.initApp=true;
    if(updateRoute!==null){
      this.state.initRoute=updateRoute;
    }else {
      this.state.initRoute='HomeT';
    }
    if(slLang.valueLang!==undefined){
      this.state.lang = (slLang.valueLang==='vn' || slLang.valueLang==='') ?lang_vn:lang_en;
    }
    this.setState(this.state);
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
    const {lang, listNoti} =this.state;
    const HomeScreen = StackNavigator({
      HomeTabs: { screen: HomeTab },
      //HomeTabs: { screen:LocationTab},

      //ListCatScr: { screen: ListCategory },

      //CatScr: { screen: CategoryScreen },

      //DistributeTabScr: { screen: DistributeTab },
    },{
      headerMode: 'none',
      header: null,
    });

    const LocScreen = StackNavigator({
      LocTabScr: { screen : LocationScreen },

      //CatScr: { screen: CategoryScreen },
      //ListCatScr: { screen: ListCategory },
      //DistributeTabScr: { screen: DistributeTab },
    },{
      headerMode: 'none',
      header: null,
    });



    let RootTabs = TabNavigator({
      HomeT: {
        screen: HomeScreen,
        navigationOptions: {
          tabBarLabel: `${lang.home}`,
          tabBarIcon: ({ tintColor }) => (
            <Image source={homeIC} style={[styles.icon, {tintColor}]} />
          ),
        },
      },
      LocationT: {
        screen: LocScreen,
        navigationOptions: {
          tabBarLabel: `${lang.location}`,
          tabBarIcon: ({ tintColor }) => (
            <Image source={locationIC} style={[styles.icon, {tintColor}]} />
          ),
          style : {
            borderBottomWidth:0,
          },
        },
      },
      NotifyT: {
        screen: NotifyTab,
        navigationOptions: {
          tabBarLabel: `${lang.notify}`,
        },
      },
      PersonalT: {
        screen: PersonalTab,
        navigationOptions: {
          tabBarLabel: `${lang.personal}`,
          tabBarIcon: ({ tintColor }) => (
            <Image source={personalIC} style={[styles.icon, {tintColor}]} />
          ),
          style : {
            borderBottomWidth:0,
          },
        },
      },

    }, {
      initialRouteName:this.state.initRoute,
      tabBarPosition: 'bottom',
      //animationEnabled: false,
      allowFontScaling:true,
      swipeEnabled:false,
      scrollEnabled:false,
      tabBarSelected: 'Home',
      tabBarOptions: {
        showLabel:true,
        showIcon:true,
        labelStyle: {
          fontSize: 9.6,
          width:(width-40)/4,
        },
        iconStyle: {
          width:(width-40)/4,
        },
        containerStyle:'#fff',
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
        path: 'home',
      },
      MakeMoneyScr: { screen: MakeMoney },
      CTVApproveScr: { screen: CTVApprove },
      CTVDetailScr: { screen: CTVDetail },
      CTVSubscribeScr: { screen: CTVSubscribe },
      WalletScr: { screen: Wallet },
      WalletGuideScr: { screen: WalletGuide },
      TransferScr: { screen: Transfer },
      HistoryScr: { screen: History },
      ManageBuySellScr: { screen: ManageBuySell },
      DetailBuySellScr: { screen: DetailBuySell },
      ListProductBScr: { screen: ListProductBS },
      CreateBuySellScr: { screen: CreateBuySell },
      ListBuySellScr: { screen: ListBuySell },
      AdsScr: { screen: Ads },
      DesignAdsScr: { screen: DesignAds },
      RequestTransferScr: { screen: RequestTransfer },

      SearchScr: { screen: SearchScreen },
      ListLocScr: { screen: ListLocation },
      OtherCatScr: { screen: OtherCat },
      DetailScr: {
        screen: DetailScreen,
      },
      ListIMGScr: {
        screen: ListImageContent,
      },
      ChooseCatScr: {
        screen: ChooseCat,
      },
      ChangeOwnerScr: { screen : ChangeOwner },
      ListLocPerScr: { screen : ListLocPer },
      CollectionScr: { screen : Collection },
      SettingScr: { screen : Setting },
      AppInfoScr: { screen: AppInfo },
      InternalManagementScr: {
        screen: InternalManagement
      },
      UpdateInfoScr: { screen : UpdateInfo },
      LikeLocationScr: { screen : LikeLocation },
      ListCheckinScr: { screen : ListCheckin },
      FormCreateScr: { screen: FormCreate},
      LoginScr: {
        screen: LoginScreen,
      },
      SignUpScr: {
        screen: SignUpScreen,
      },
      ForgotScr: {
        screen: ForgotPasswordScreen,
      },
      HomeChatScr: {
        screen: HomeChat,
      },
      MessengerScr: {
        screen: Messenger,
      },

    },
    {
      headerMode: 'none',
      initialRouteName: this.state.initApp ? 'MainScr' : 'IntroSrc',//'MainScr',//
    });
    //const {setVal} = this.state;
    const prefix = Platform.OS == 'android' ? 'kingmap://kingmap/' : 'kingmap://';
    return (
      <Provider store={store}>
        <RootNav screenProps={this.getLang.bind(this)} uriPrefix={prefix} />
      </Provider>
    );
  }
} ;
