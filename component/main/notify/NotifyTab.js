/* @flow */

import React, { Component } from 'react';
import {
  Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity,
FlatList} from 'react-native';
import Moment from 'moment';
import PushNotification from 'react-native-push-notification';
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

import bgMap from '../../../src/icon/bg-map.png';
import userProfileIC from '../../../src/icon/ic-user-profile.png';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import infoIC from '../../../src/icon/ic-white/ic-analysis.png';
import socialIC from '../../../src/icon/ic-white/ic-social.png';

export default class NotifyTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang : lang_vn,
      showInfo : false,
      showShare : false,
      isLogin:false,
      curLoc:{},
      listNoti:[],

    };
    //this.getLoc();
    getLanguage().then((e) =>{
      if(e!==null){
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
     }
    });
    checkLogin().then(e=>{
      //console.log('checkLogin',e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({isLogin:true});
        loginServer(e);
      }
    });
    this.getData();
  }
  getData(){
    const url = `${global.url}${'getlistnoti'}`;
    //console.log(url);
    getApi(url)
    .then(arrData => {
      //console.log('arrData',arrData.data);
        this.setState({ listNoti: arrData.data });
    })
    .catch(err => console.log(err));
  }

  componentDidMount(){
    PushNotification.configure({
        onNotification: function(notification) {
            console.log( 'NOTIFICATION:', notification );
            //notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
    });
  }

  componentWillUpdate(){
    // PushNotification.localNotificationSchedule({
    //   message: "My Notification Message", // (required)
    //   date: new Date(Date.now() + (3 * 1000)) // in 60 secs
    // });
  }
  render() {
    const {navigate} = this.props.navigation;
    //console.log("this.props.Hometab=",util.inspect(this.props.navigation,false,null));
    const {
      container, bgImg,
      headStyle, imgLogoTop,headContent,inputSearch,colorlbl,
      listAdd,imgShare,wrapContent,btnPress,marTop,colorNext,
    } = styles;
    const {listNoti,isLogin,lang} = this.state;
    return (
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
        {listNoti.notifications !== undefined && isLogin ?
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
           <TouchableOpacity onPress={()=>navigate('LoginScr')} style={[btnPress,marTop]}>
           <Text style={colorNext}> {lang._login}</Text>
           </TouchableOpacity>
         </View>
          }
        </View>
      </View>
    );
  }
}
