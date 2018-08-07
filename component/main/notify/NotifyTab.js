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
import notifyIC from '../../../src/icon/ic-home/ic-notification.png';

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
      page: 0,
      loadMore: true
      //appState: AppState.currentState,
    };
    //this.getLoc();
    getLanguage().then((e) =>{
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
     }
    });
    this.getData();
  }

  static navigationOptions = props => {
    const { state  } = props.navigation;
    // console.log('navigation',state)
    return {
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Image source={notifyIC} style={[{width: 24, height: 24}, {tintColor}]} />
          {state.params!==undefined && state.params.listNoti>0 && <View style={[{
            position: 'absolute', zIndex:999, right: -14, bottom: 6,
            backgroundColor: '#fff', opacity:1,borderRadius: 9, width: 18, height: 18,
            justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={{fontWeight:'bold',color: '#000',fontSize:11,padding:2}}>{state.params.listNoti}</Text>
            </View>
          }

        </View>
      ),
    }
  };


  componentWillReceiveProps(nextProps) {
    if (nextProps.listNoti != this.props.listNoti) {
      this.props.navigation.setParams({ listNoti: nextProps.listNoti });
    }
  }


  getData(page=null){
    if(page===null) page=0;
    const url = `${global.url}${'getlistnoti'}?skip=${page}&limit=20`;
    // console.log(url);
    getApi(url).then(arrData => {
      //console.log('arrData',arrData.data);
      let listNoti = arrData.data.notifications;
      //arrData.data.notifications!==undefined && this.props.dispatch({type:'GET_NOTIFY',listNoti:arrData.data.count_notifications});
        this.setState({
            listNoti: page===0? arrData.data : this.state.listNoti.concat(arrData.data),
            page: page===0?20:this.state.page+20,
          loadMore: arrData.data.length===20?true:false
        });
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
      this.props.navigation.setParams({ listNoti: this.props.listNoti });
  }
  componentWillUnmount() {
    AppState.removeEventListener('change');
  }
  componentWillUpdate(){
    // console.log('isLogin',this.props.isLogin);
    // console.log('user_profile',this.props.user_profile);

      const {user_profile,isLogin} = this.props;
      if(isLogin && user_profile.id!==undefined){
        channelUserAll = socket.subscribe('get-new-notifi-all');
        channelUser = socket.subscribe(`${'get-new-notifi-'}${user_profile.id}`);
      }


  }
  componentDidUpdate(){
      countNoti = 0;
      clearTimeout(NotiTimeout);
      channelNews.bind(`${'App\\Events\\getNotifi'}`, function(data) {
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
      NotiTimeout = setTimeout(()=>{
          this.props.isLogin && channelUserAll.bind(`${'App\\Events\\getNotifi'}`,function(data) {
            //console.log(data);
            const {title,contentText} = data.data;
              PushNotification.localNotificationSchedule({
                data:data.data,
                title,
                message: contentText,
                date: new Date(Date.now()) // in 60 secs  + (3 * 1000)
              });
          });

          this.props.isLogin && channelUser.bind(`${'App\\Events\\getNotifi'}`,function(data) {
            //console.log(data);
            const {title,contentText} = data.data;
              PushNotification.localNotificationSchedule({
                data:data.data,
                title,
                message: contentText,
                date: new Date(Date.now()) // in 60 secs  + (3 * 1000)
              });
          });
      },1500);
  }

  requestOwner(route){
    const url = `${global.url_media}${route}`;
    getApi(url).then(arrData => {
      this.getData();
    }).catch(err => console.log(err));
  }
  render() {
    const {navigate} = this.props.navigation;
    //console.log("this.props.Hometab=",util.inspect(this.props.navigation,false,null));
    const {
      container, bgImg,
      headStyle, imgLogoTop,headContent,inputSearch,colorlbl,
      listAdd,imgShare,wrapContent,btnPress,marTop,colorNext,
    } = styles;
      const { listNoti, lang, page, loadMore } = this.state;
    const { isLogin } =this.props;

    //console.log('listNoti',listNoti.notifications);
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
             <Text style={{color:'#000'}}>{item.contentText}</Text>

             {item.data!==null && <View style={{flexDirection:'row',marginTop:5,marginBottom:5}}>
              <TouchableOpacity onPress={(e)=>{
                e.stopPropagation();
                this.requestOwner(item.data.link_apply)
              }}
              style={{backgroundColor:'#86be57',borderRadius:3,padding:3,marginRight:5,minWidth:80,alignItems:'center'}}>
                <Text numberOfLines={1} style={{fontSize:14,color:'#fff'}}>{`${lang.accept}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={(e)=>{
                e.stopPropagation();
                this.requestOwner(item.data.link_decline)}}
              style={{backgroundColor:'#fff',borderColor:'#DDD',borderWidth:1,borderRadius:3,padding:3,marginRight:3,minWidth:80,alignItems:'center'}}>
                <Text numberOfLines={1} style={{fontSize:14,color:'#000'}}>{`${lang.reject}`}</Text>
              </TouchableOpacity>
             </View>}
             <Text numberOfLines={1} style={{fontSize:12}}>{Moment(item.created_at).format("DD/MM/YYYY h:m:s")}</Text>
             </View>
             </TouchableOpacity>
           )}
           style={{marginBottom:110,}}
           onEndReachedThreshold={0.5}
          onEndReached={() => {
            if(loadMore) this.setState({loadMore:false},()=>{
              this.getData(page)
            });
          }}
         />
         :
         <View style={[wrapContent, {width: width}]}>
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
    listNoti: state.listNoti
  }
}

export default connect(mapStateToProps)(NotifyTab);
