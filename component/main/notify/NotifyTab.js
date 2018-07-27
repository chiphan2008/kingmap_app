/* @flow */

import React, { Component } from 'react';
import {
  Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity,
  FlatList,AppState,TouchableWithoutFeedback,Keyboard
} from 'react-native';
import Moment from 'moment';
import PushNotification from 'react-native-push-notification';
import Pusher from 'pusher-js/react-native';
import {connect} from 'react-redux';
const {height, width} = Dimensions.get('window');

import getApi from '../../api/getApi';
import global from '../../global';
import styles from '../../styles';
import getLanguage from '../../api/getLanguage';
import checkLogin from '../../api/checkLogin';
import loginServer from '../../api/loginServer';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import getLocationByIP from '../../api/getLocationByIP';

import bgMap from '../../../src/icon/bg-map.jpg';
import userProfileIC from '../../../src/icon/ic-user-profile.png';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import infoIC from '../../../src/icon/ic-white/ic-analysis.png';
import socialIC from '../../../src/icon/ic-white/ic-social.png';

const socket = new Pusher("cccc47e9fa4d58585b38", {
  cluster: "ap1",
  activityTimeout : 30000,
  pongTimeout : 30000
});
console.ignoredYellowBox = [
    'Setting a timer'
]

const channelNews = socket.subscribe('get-new-notifi-0');
var NotiTimeout,countNoti,channelUserAll,channelUser;

class NotifyTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang : lang_vn,
      showInfo : false,
      showShare : false,
      curLoc:{},
      listNoti:[],
      //appState: AppState.currentState,
    };
    //this.getLoc();
    getLanguage().then((e) =>{
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
     }
    });
    checkLogin().then(e=>{
      //console.log('checkLogin',e);
      //console.log('isLogin',this.props.isLogin);
      if(e.id!==undefined){
        channelUserAll = socket.subscribe('get-new-notifi-all');
        channelUser = socket.subscribe(`${'get-new-notifi-'}${e.id}`);
      }
    });
    this.getData();
  }
  getData(){
    const url = `${global.url}${'getlistnoti'}`;
    // console.log(url);
    getApi(url).then(arrData => {
      //console.log('arrData',arrData.data);
        this.setState({ listNoti: arrData.data });
    }).catch(err => console.log(err));
  }

  componentDidMount(){

      PushNotification.configure({
          onNotification: function(notification) {
              console.log( 'NOTIFICATION:', notification );
              //notification.finish(PushNotificationIOS.FetchResult.NoData);
          },
      });
      AppState.addEventListener('change', (nextAppState)=>{
        //alert('nextAppState.toString()');

        //alert(nextAppState.toString());
      });
  }
  componentWillUnmount() {
    AppState.removeEventListener('change');
  }

  componentWillUpdate(){
    //clearTimeout(NotiTimeout);
    //console.log('componentWillUpdate');

      countNoti = 0;
      channelNews.bind(`${'App\\Events\\getNotifi'}`, function(data) {
        //console.log(data);
        countNoti += 1;
        if(countNoti === 3){
          const {title,contentText} = data.data;
          PushNotification.localNotificationSchedule({
            data:data.data,
            title,
            message: contentText,
            date: new Date(Date.now()) // in 60 secs  + (3 * 1000)
          });
          countNoti=0;
        }
      });
      this.state.isLogin && channelUserAll.bind(`${'App\\Events\\getNotifi'}`,function(data) {
        //console.log(data);
        const {title,contentText} = data.data;
          PushNotification.localNotificationSchedule({
            data:data.data,
            title,
            message: contentText,
            date: new Date(Date.now()) // in 60 secs  + (3 * 1000)
          });
      });

      this.state.isLogin && channelUser.bind(`${'App\\Events\\getNotifi'}`,function(data) {
        //console.log(data);
        const {title,contentText} = data.data;
          PushNotification.localNotificationSchedule({
            data:data.data,
            title,
            message: contentText,
            date: new Date(Date.now()) // in 60 secs  + (3 * 1000)
          });
      });

    // channelNews.bind(`${'App\\Events\\getNotifi'}`, function(data) {
    //   console.log('data.message',data);
    //   PushNotification.localNotificationSchedule({
    //     message: data.message, // (required)
    //     //date: new Date(Date.now() + (3 * 1000)) // in 60 secs
    //   });
    // });
    // console.log('channelNews',channelNews);

  }
  render() {
    const {navigate} = this.props.navigation;
    //console.log("this.props.Hometab=",util.inspect(this.props.navigation,false,null));
    const {
      container, bgImg,
      headStyle, imgLogoTop,headContent,inputSearch,colorlbl,
      listAdd,imgShare,wrapContent,btnPress,marTop,colorNext,
    } = styles;
    const { listNoti, lang } = this.state;
    const { isLogin } =this.props;
    // console.log('listNoti',isLogin);
    // console.log('listNoti.notifications',listNoti.notifications);
    return (
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View style={container}>
        <View style={headStyle}>
          <View style={headContent}>
            <View></View>
            <Image source={logoTop} style={imgLogoTop} />
            <View></View>
          </View>
          <View style={{height:11}}></View>
          <TextInput underlineColorAndroid='transparent'
          placeholder={this.state.lang.search} style={inputSearch}
          onSubmitEditing={() => { if (this.state.valSearch.trim()!==''){navigate('SearchScr',{keyword:this.state.valSearch,lat:this.state.curLoc.lat,lng:this.state.curLoc.lng,lang:this.state.lang})} }}
          onChangeText={(valSearch) => this.setState({valSearch})}
          value={this.state.valSearch} />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (this.state.valSearch.trim()!=='') {
              navigate('SearchScr',{keyword:this.state.valSearch,lat:this.state.curLoc.lat,lng:this.state.curLoc.lng,lang:this.state.lang});
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>
        </View>

        <View>
        {/*console.log('listNoti.notifications',listNoti.notifications,isLogin)*/}
        {listNoti.notifications !== undefined  && isLogin ?
          <FlatList
           extraData={this.state}
           data={listNoti.notifications}
           keyExtractor={item => item.id.toString()}
           renderItem={({item}) =>(
             <TouchableOpacity onPress={()=>{
             }}
             style={{padding:15,flexDirection:'row',backgroundColor:'white',marginBottom:1}}>
             <Image source={{uri: `${global.url_media}${item.image}`}}
             style={{width:35,height:35,marginRight:5}} />
             <View style={{paddingRight:30,}}>
             <Text numberOfLines={1} style={{color:'#000'}}>{item.contentText}</Text>
             <Text numberOfLines={1} style={{fontSize:12}}>{Moment(item.created_at).format("DD/MM/YYYY h:m:s")}</Text>
             </View>
             </TouchableOpacity>
           )}
           style={{marginBottom:110,}}
         />
         :
         <View style={wrapContent}>
           <Text style={{color:'#B8B9BD'}}>{lang.request_login}</Text>
           <TouchableOpacity onPress={()=>navigate('LoginScr',{backScr:'MainScr'})} style={[btnPress,marTop]}>
           <Text style={colorNext}> {lang._login}</Text>
           </TouchableOpacity>
         </View>
          }
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    yourCurLoc:state.yourCurLoc,
    isLogin:state.isLogin,
    user_profile:state.user_profile,
    //updateState:state.updateState,

  }
}

export default connect(mapStateToProps)(NotifyTab);
