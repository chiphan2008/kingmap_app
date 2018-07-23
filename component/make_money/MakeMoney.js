/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,Modal,Alert,
  ScrollView,FlatList,TouchableWithoutFeedback,
  DeviceEventEmitter, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import Moment from 'moment';
const {height, width} = Dimensions.get('window');
import {Select, Option} from "react-native-chooser";

//import styles from '../styles';
import postApi from '../api/postApi';
import getApi from '../api/getApi';
import global from '../global';
import checkLogin from '../api/checkLogin';
import loginServer from '../api/loginServer';
import GrantRight from './GrantRight';
import AddAgency from './AddAgency';
import BonusAgency from './BonusAgency';

import makeMoneyIC from '../../src/icon/make-money.png';
import logoTop from '../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../src/icon/ic-gray/ic-search.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import plusIC from '../../src/icon/ic-plus.png';
import subIC from '../../src/icon/ic-sub.png';
import filterIC from '../../src/icon/ic-filter.png';
import likeIC from '../../src/icon/ic-like.png';
import favoriteIcon from '../../src/icon/ic-favorite.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import checkIC from '../../src/icon/ic-create/ic-check.png';
import uncheckIC from '../../src/icon/ic-uncheck.png';
import removeIC from '../../src/icon/ic-create/ic-remove.png';
import lockIC from '../../src/icon/ic-lock.png';
import unlockIC from '../../src/icon/ic-unlock.png';
//import loginApi from '../api/loginApi';

//import calendarIC from '../../src/icon/ic-wallet/ic-calendar.png';
//import timeIC from '../../src/icon/ic-wallet/ic-time.png';
import historyIC from '../../src/icon/ic-wallet/ic-history.png';
import receiveIC from '../../src/icon/ic-wallet/ic-receive.png';
import walletIC from '../../src/icon/ic-wallet/ic-wallet.png';
import transferIC from '../../src/icon/ic-wallet/ic-transfer.png';
import withdrawIC from '../../src/icon/ic-wallet/ic-withdraw.png';
import profileIC from '../../src/icon/ic-profile.png';
import {format_number,checkUrl} from '../libs';

var com;
class MakeMoney extends Component {
  constructor(props) {
    super(props);
    const { _roles,api_roles,temp_daily_code } = this.props.navigation.state.params.user_profile;
    this.state = {
      showCoin:false,
      showLoc:false,
      showLocPop:false,
      showCTV:false,
      showCTVPop:false,
      showTDLPop:false,
      showTDLCTVPop:false,
      showArea:false,
      showListLocPend:false,
      showListCTVPend:false,
      listDistrict:{},
      labelArea:'',
      valCTV:'',
      kw:'',
      valLoc:'',
      listAgency:[],
      ListPend:[],
      ListLocPend:[],
      suggestPend:{},
      suggestLoc:{},
      listLoc:[],
      listData:{},
      itemChoose:{},
      assign:false,
      isNormal: _roles.length===0?true:false,
      isAgency: api_roles!==null && api_roles.tong_dai_ly!==undefined?true:false,
      isCeo: api_roles!==null && api_roles.ceo!==undefined?true:false,
      isCTV: api_roles!==null && api_roles.cong_tac_vien!==undefined?true:false,
      isPend: temp_daily_code===''?false:true,
      user_profile:{},
      loadMore:true,
      page:0,des_mm:'',
      index_ctv_pending:'',
      static_notes:'',
      noData:'',
      content:'',
    }
    loginServer(this.props.navigation.state.params.user_profile,'fgdjk')
    temp_daily_code==='' && this.getStatic();
    //console.log('this.state.curLoc',this.state.curLoc);
  }

  searchContentPending(page=null){
    const { user_profile } = this.props.navigation.state.params;
    const {isCTV,isAgency} = this.state;
    if(page===null) page=0;
    let url = `${global.url}${'static/search-content'}`;
    const arr = new FormData();
    isCTV && arr.append('ctv_id',user_profile.id);
    isAgency && arr.append('daily_id',user_profile.id);
    arr.append('moderation','request_publish');
    arr.append('skip',page);
    arr.append('limit',20);
    //console.log(url);
    //console.log(arr);
    postApi(url,arr).then(e => {
      //console.log(e.data);
      this.state.ListLocPend=page===0?e.data:this.state.ListLocPend.concat(e.data);
      this.state.page =page===0?20:this.state.page+20;
      this.state.loadMore =e.data.length===20?true:false;
      this.setState(this.state);
    }).catch(err => console.log(err));
  }
  searchContent(route,keyword, page=null){
    const { user_profile,lang } = this.props.navigation.state.params;
    const {isCTV,isAgency,isCeo} = this.state;
    if(page===null) page=0;
    let url = `${global.url}${'static/'}${route}`;
    const arr = new FormData();
    isCTV && arr.append('ctv_id',user_profile.id);
    isAgency && arr.append('daily_id',user_profile.id);
    // isCeo && arr.append('ceo_id',user_profile.id);
    arr.append('keyword',keyword);
    arr.append('skip', page);
    arr.append('limit', 20);
    // console.log(`${global.url}${'static/'}${route}`);
    // console.log(arr);

    postApi(url,arr).then(e => {
      this.state.noData = e.data.length>0?'':lang.not_found;
      //console.log('e.data', e.data);
      if(route==='search-content'){
        this.state.listLoc=page===0?e.data:this.state.listLoc.concat(e.data);
        this.state.page =page===0?20:this.state.page+20;
        this.state.loadMore =e.data.length===20?true:false;
        this.state.valLoc='';
        this.state.showLocPop=true;
      }else {
        this.state.listAgency=page===0?e.data:this.state.listAgency.concat(e.data);
        this.state.page =page===0?20:this.state.page+20;
        this.state.loadMore =e.data.length===20?true:false;
        this.state.valCTV='';
        this.state.kw=keyword;
        this.state.showCTVPop=true;
      }
        this.setState(this.state);
    }).catch(err => console.log(err));
  }

  getStatic(){
    const { user_profile,lang } = this.props.navigation.state.params;
    const {isCTV,isAgency,isCeo} = this.state;
    if(user_profile.temp_daily_code===''){
      const month = Moment().format('MM');
      const year = Moment().format('YYYY');
      //let isCeo=false,isAgency=false,isCTV=false,isNormal=true;
      let let_mm='';
      const arr = new FormData();
      if(isCTV) {
        arr.append('ctv_id',user_profile.id);
        let_mm='tieu_de_make_money_ctv';
      }
      if(isAgency){
        arr.append('daily_id',user_profile.id);
        let_mm='tieu_de_make_money_tdl';
      }
      if(isCeo) {
        arr.append('ceo_id',user_profile.id);
        let_mm='tieu_de_make_money_ceo';
      }
      arr.append('month',month);
      arr.append('year',year);
      //console.log(`${global.url}${'static?'}${'block_text='}${let_mm}${'&block_text=luu_y_make_money&lang='}${lang.lang}`);
      //console.log(arr);
      user_profile._roles.length>0 && postApi(`${global.url}${'static?'}${'block_text='}${let_mm}${',luu_y_make_money&lang='}${lang.lang}`,arr).then(e => {
      //console.log('e.data',e.data);
      this.state.static_notes=e.block_text.luu_y_make_money;
      this.state.des_mm=e.block_text[let_mm];
      this.state.listData=e.data;
        this.setState(this.state,()=>{
          if(this.state.isAgency){
            this.getListPending();
            this.searchContentPending();
            //this.searchContent('ctv','');
          }
        });
      }).catch(err => console.log(err));
    }else {
      this.setState({isPend:true})
    }

  }
  gotoCreate = () => {
    checkLogin().then(e=>{
      const { lang } = this.props.navigation.state.params;
      loginServer(e,'cxv');
      if(e.temp_daily_code!==''){
        Alert.alert(lang.notify,lang.approve_ctv);
      }else if(e.count_area===0){
        Alert.alert(lang.notify,lang.approve_area_ctv);
      }else if(e.api_roles.cong_tac_vien!==undefined && e.api_roles.cong_tac_vien.active===0){
        Alert.alert(lang.notify,lang.approve_acc_ctv);
      }else {this.props.navigation.navigate('ChooseCatScr',{lang:lang.lang});}
    })
  }

  confirmdDelColl(id){
    const { lang } = this.props.navigation.state.params;
    Alert.alert(lang.notify,lang.confirm_collab_del,[
      {text: lang.cancel, style: 'cancel'},
      {text: lang.confirm, onPress: () => this.delColl(id)}
    ],{ cancelable: false })
  }

  delColl(id){
    const { user_profile } = this.props.navigation.state.params;
    const arr = new FormData();
    arr.append('daily_id',user_profile.id);
    arr.append('ctv_id',id);
    postApi(`${global.url}${'static/remove-ctv'}`,arr).then(() => {
      const act = this.state.isCeo?'find-daily':'search-ctv';
      this.searchContent(act,this.state.kw);
    } ).catch(err => console.log(err));
  }
  getListPending(){
    const { user_profile } = this.props.navigation.state.params;
    const arr = new FormData();
    arr.append('daily_id',user_profile.id);
    //console.log(`${global.url}${'static/search-ctv-pending'}`);
    postApi(`${global.url}${'static/search-ctv-pending'}`,arr)
    .then(e => {
      //console.log('e.data',e.data);
        this.setState({ ListPend:e.data });
    }).catch(err => console.log(err));
  }
  requestCTV(route,item=null){
    const { user_profile,lang } = this.props.navigation.state.params;
    let state=false;
    const arr = new FormData();
    arr.append('daily_id',user_profile.id);
    Object.entries(this.state.suggestPend).forEach(e=>{
      if(e[1]!==false){arr.append('ctv_id[]',e[1]);state=true;}
    })
    if(!state){
      Alert.alert(lang.notify,lang.choose_ctv);
      return false;
    }
    state && postApi(`${global.url}${'static/'}${route}${'-ctv'}${'?lang='}${lang.lang}`,arr).then(e => {
        if(e.code===200)Alert.alert(lang.notify,e.data,[
          {text: '', style: 'cancel'},
          {text: 'Ok', onPress: () => {
            this.state.showListCTVPend=false;
            if(Object.entries(this.state.suggestPend).length===1 && item!==null){
              this.state.assign=true;
              this.state.itemChoose=item;
            }
            this.setState(this.state,()=>{
              this.getStatic();
            })
          }}
        ],{ cancelable: false })
    }).catch(err => console.log(err));
  }

  requestLoc(route){
    const { user_profile,lang } = this.props.navigation.state.params;
    let state=false;
    const arr = new FormData();
    arr.append('daily_id',user_profile.id);
    Object.entries(this.state.suggestLoc).forEach(e=>{
      if(e[1]!==false){arr.append('content_id[]',e[1]);state=true;}
    })

    if(!state){
      Alert.alert(lang.notify,lang.choose_loc);
      return false;
    }
    state &&  postApi(`${global.url}${'static/'}${route}${'-content'}${'?lang='}${lang.lang}`,arr).then(e => {
        this.getStatic();
        if(e.code===200)Alert.alert(lang.notify,e.data)
    }).catch(err => console.log(err));
  }

  stopCTV(id,active){
    const { user_profile,lang } = this.props.navigation.state.params;
    const arr = new FormData();
    const route=active===0?'unlock':'lock';
    arr.append('daily_id',user_profile.id);
    arr.append('ctv_id[]',id);
    //console.log(`${global.url}${'static/'}${route}${'-ctv'}`);
    //console.log(arr);
    postApi(`${global.url}${'static/'}${route}${'-ctv'}${'?lang='}${lang.lang}`,arr).then(e => {
      if(e.code===200){
        Platform.OS==='android' ?
        Alert.alert(lang.notify,e.data,[
          {text: '', style: 'cancel'},
          {text: 'OK', onPress: () => this.searchContent('search-ctv',this.state.kw)}
        ],{ cancelable: false })
       :
       Alert.alert(lang.notify,e.data,[
         {text: 'OK', onPress: () => this.searchContent('search-ctv',this.state.kw)}
       ])
     }
    }).catch(err => console.log(err));
  }

  assignFunc = () => {
    const { lang } = this.props.navigation.state.params;
    const {listDistrict,itemChoose,isCeo} = this.state;

    if(itemChoose.id===undefined){
      Alert.alert(lang.notify,isCeo?lang.plz_choose_agency:lang.choose_ctv);
    }else if(Object.entries(listDistrict).length===0){
      Alert.alert(lang.notify,lang.plz_choose_area);
    }else {
      Platform.OS==='ios'?
      Alert.alert(lang.notify,lang.confirm_assign,[
        {text: 'OK', onPress: () => this.assignFuncConfirmed()}
      ])
      :
      Alert.alert(lang.notify,lang.confirm_assign,[
        {text: '', style: 'cancel'},
        {text: 'OK', onPress: () => this.assignFuncConfirmed()}
      ],{ cancelable: false })
    }
  }
  assignFuncConfirmed() {
    const { lang } = this.props.navigation.state.params;
    const {listDistrict,itemChoose,isCeo} = this.state;

    const arr = new FormData();
    arr.append('id',itemChoose.id);
    Object.entries(listDistrict).forEach(e=>{
      e[1]!==false && arr.append('district[]',e[1]);
    })
    const act = isCeo?'daily':'ctv';
    postApi(`${global.url}${'static/area-'}${act}${'?lang='}${lang.lang}`,arr).then(e => {
      if(e.code===200){
        Platform.OS==='ios'?
        Alert.alert(lang.notify,e.data,[
          {text: 'OK', onPress: () => this.setState({
            listDistrict:{},itemChoose:{},listAgency:[],valCTV:'',assign:false,showCTVPop:false,showArea:false})}
        ])
        :
        Alert.alert(lang.notify,e.data,[
          {text: '', style: 'cancel'},
          {text: 'OK', onPress: () => this.setState({
            listDistrict:{},itemChoose:{},listAgency:[],valCTV:'',assign:false,showCTVPop:false,showArea:false})}
        ],{ cancelable: false })
     }else {
       Alert.alert(lang.notify,e.message)
     }
    }).catch(err => console.log(err));
  }

  assignWork(){
    const { user_profile,lang } = this.props.navigation.state.params;
    //const userId = daily_id!==''?daily_id:ctv_id;
    getApi(`${global.url}${'static/giaoviec/'}${user_profile.id}${'?lang='}${lang.lang}`).then(arr => {
        arr.data!==null && this.setState({ content:arr.data[0].content===null?'':arr.data[0].content });
    }).catch(err => console.log(err));
  }

  componentWillMount(){
    //setTimeout(()=>{
      const { user_profile } = this.props.navigation.state.params;
      this.assignWork();
      checkLogin().then(e=>{
        //console.log(e);
        if(user_profile._roles.length!==e._roles.length) this.props.navigation.navigate('MainScr');
        e.temp_daily_code!=='' && this.setState({isPend:true})
      })
    //},2000)
  }
  componentDidMount(){
    DeviceEventEmitter.addListener('gobackCTV', (e)=>{
      if(e.isLogin) {
        this.state.showListCTVPend=false;
        if(e.ctv!==undefined){this.state.assign=true;
        this.state.itemChoose=e.ctv;}
        this.setState(this.state,()=>{
          this.getStatic();

        })
      }
    })
  }
  render() {
    const { lang,code_user,name_module,user_profile } = this.props.navigation.state.params;
    //console.log(user_profile);
    const { navigate,goBack } = this.props.navigation;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,wrapDes,
      headLocationStyle, inputSearch,wrapWhite,marTop,titleHead,titleNormal,wrapSetting,
      imgLogoTop,imgContent,colorTitle,titleCoin,contentKcoin,btnTransfer,colorlbl,
      popoverLoc,padBuySell,overLayout,shadown,listOverService,imgShare,show,hide,
    } = styles;

    const {
      itemChoose,showCoin,showLoc,showLocPop,showCTV,showCTVPop,showTDLPop,showTDLCTVPop,showArea,listData,index_ctv_pending,noData,
      listAgency,listLoc,isCeo,isAgency,isNormal,isCTV,assign,listDistrict,labelArea,ListPend,suggestPend,
      ListLocPend,suggestLoc,showListLocPend,showListCTVPend,loadMore,page,static_notes,des_mm,
      content
    } = this.state;
    const {yourCurLoc} = this.props;
    const _this = this;
    //console.log(user_profile);
    return (
      <View>
      {isNormal &&
        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>goBack()}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={{marginTop:5,color:'#fff', fontWeight: 'bold', fontSize: 17}}>{lang.subscribe_ctv.toUpperCase()}</Text>
                  <View></View>
              </View>
          </View>
            {this.state.isPend===false && isNormal &&
            <View style={{justifyContent:'center',alignItems:'center',padding:15,height:height-95}}>
            <View>

              <Text numberOfLines={2} style={{textAlign:'center',fontSize:20,fontWeight:'bold',color:'#000'}}>
              {lang.title_ctv.toUpperCase()}
              </Text>
              <Text style={{textAlign:'center',fontSize:14,marginTop:5}}>{lang.des_ctv}</Text>
            </View>
            <TouchableOpacity style={{marginTop:15,backgroundColor:'#d0021b',borderRadius:3,width:width-30,paddingTop:10,paddingBottom:10,alignItems:'center'}}
            onPress={()=>navigate('CTVSubscribeScr',{user_profile,titleScr:lang.subscribe_ctv,lang:lang.lang})}>
              <Text style={{color:'#fff', fontSize: 12, fontWeight: 'bold'}}>{lang.subscribe_ctv}</Text>
            </TouchableOpacity>
            </View>}
            {this.state.isPend && isNormal &&
              <View style={{justifyContent:'center',alignItems:'center',padding:15,height:height-95}}>
              <Text style={{textAlign:'center',fontSize:20,fontWeight:'400',color:'#000'}}>{lang.plz_approve}</Text>
              </View>
              }

        </View>
      }

      {(isCTV || isAgency || isCeo) &&
        <View  style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>goBack()}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Image source={logoTop} style={imgLogoTop} />
                  <View></View>
              </View>
          </View>
          <ScrollView>
          <View style={contentWrap}>

          <View style={{width:width-80,height:200,justifyContent:'center',alignItems:'center'}}>
          <View style={{marginBottom:5,width:80,height:80,backgroundColor:'#fff',borderRadius:60,justifyContent:'center',alignItems:'center'}}>
          <Image source={makeMoneyIC} style={{width:60,height:60}} />
          </View>
          <Text style={titleHead}> {`${name_module}`.toUpperCase()} </Text>
          <Text style={titleNormal}> {des_mm} </Text>
          </View>

          <View>
          {/*console.log('user_profile',user_profile)*/}
          {(isCTV || isAgency) && <TouchableOpacity style={wrapWhite}
          onPress={()=>{
            navigate('CTVDetailScr',{
              lang,content,ctv_id:isCTV?user_profile.id:'',
              daily_id:isAgency?user_profile.id:'',
              name:user_profile.full_name,address:user_profile.address,
            avatar:checkUrl(user_profile.avatar) ? user_profile.avatar : `${global.url_media}${user_profile.avatar}`})
          }}>
            <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text numberOfLines={1} style={colorTitle}>{`${lang.info_general}`}</Text>
              <TouchableOpacity onPress={()=>{
                listData.total>0 && this.setState({showCoin:!this.state.showCoin})
              }}>
                <Image source={profileIC} style={{width:35,height:35}} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>}

          <View style={wrapWhite} >
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.my_coin}`}</Text>
                  <Text style={titleCoin}>{`${format_number(user_profile.coin)}`}</Text>
                </View>
              </View>
          </View>



            {listData.total!==undefined &&
              <View style={wrapWhite}>
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.total_MM}`}</Text>
                  <Text style={titleCoin}>{`${listData.total ? format_number(listData.total) : 0}`}</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                  listData.total>0 && this.setState({showCoin:!this.state.showCoin})
                }}>
                <Image source={showCoin?subIC:plusIC} style={{width:35,height:35}} />
              </TouchableOpacity>
              </View>

              {showCoin &&
                <FlatList
                extraData={this.state}
                data={listData.static}
                style={{borderColor:'#E0E8ED',borderTopWidth:1,marginTop:5}}
                keyExtractor={(item,index) => index.toString()}
                renderItem={({item,index}) =>(
                  <View style={{marginTop:5,width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{color:'#2F3C51'}}>{item.name}</Text>
                    <Text style={{color:'#5782A4'}}>{item.value ? format_number(item.value) : 0}</Text>
                  </View>
                )} />}

            </View>}

            {listData.count_location!==undefined &&  <View style={wrapWhite} >
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <TouchableOpacity style={{width:width-70}}
                  onPress={()=>{listData.count_location>0 && this.setState({listLoc:[],noData:''},()=>{
                     this.searchContent('search-content','');
                  })}}>
                    <Text numberOfLines={1} style={colorTitle}>{`${lang.total_location}`}</Text>
                    <Text style={titleCoin}>{`${listData.count_location ? format_number(listData.count_location) : 0}`}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{listData.count_location>0 && this.setState({showLoc:!this.state.showLoc,listLoc:[],noData:''})}}>
                  <Image source={showLoc?subIC:plusIC} style={{width:35,height:35}} />
                  </TouchableOpacity>
                </View>

                {showLoc && <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                    <TextInput underlineColorAndroid='transparent'
                    style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                    onSubmitEditing={() => {
                      if (this.state.valLoc.trim()!=='') {
                        this.searchContent('search-content',this.state.valLoc);
                      }
                    }}
                    onChangeText={(valLoc) => this.setState({valLoc})}
                    value={this.state.valLoc} />

                    <TouchableOpacity style={{position:'absolute',top:Platform.OS==='ios'?16:20,right:5}}
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={()=>{
                      if (this.state.valLoc.trim()!=='') {
                        this.searchContent('search-content',this.state.valLoc);
                      }
                    }}>
                      <Image style={{width:16,height:16,}} source={searchIC} />
                    </TouchableOpacity>
                </View>}

            </View>}

            {(isCeo || isAgency) && <View style={wrapWhite} >
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <TouchableOpacity style={{width:width-70}}
                  onPress={()=>this.setState({listAgency:[]},()=>{
                    const act = isCeo?'find-daily':'search-ctv';
                      this.searchContent(act,'');
                  })}>
                    <Text numberOfLines={1} style={colorTitle}>{isCeo?`${lang.total_agency}`:`${lang.total_coll}`}</Text>
                    <Text style={titleCoin}>{isCeo?`${listData.count_daily ? format_number(listData.count_daily) : 0}`:`${listData.count_ctv ? format_number(listData.count_ctv) : 0}`}</Text>
                  </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                      (listData.count_ctv>0 || listData.count_daily>0) && this.setState({showCTV:!this.state.showCTV})}}>
                    <Image source={showCTV?subIC:plusIC} style={{width:35,height:35}} />
                    </TouchableOpacity>

                </View>

                {showCTV && <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                    <TextInput underlineColorAndroid='transparent'
                    style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                    onSubmitEditing={() => {
                      if (this.state.valCTV.trim()!=='') {
                        const act = isCeo?'find-daily':'search-ctv';
                        this.searchContent(act,this.state.valCTV);
                      }
                    }}
                    onChangeText={(valCTV) => this.setState({valCTV})}
                    value={this.state.valCTV} />

                    <TouchableOpacity style={{position:'absolute',top:Platform.OS==='ios'?16:20,right:5}}
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={()=>{
                      if (this.state.valCTV.trim()!=='') {
                        const act = isCeo?'find-daily':'search-ctv';
                        this.searchContent(act,this.state.valCTV);
                      }
                    }}>
                      <Image style={{width:16,height:16,}} source={searchIC} />
                    </TouchableOpacity>

                </View>}

            </View>}

            {isAgency &&
              <View style={wrapWhite}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <View>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.pending_collaborators}`}</Text>
                  <Text style={titleCoin}>{`${listData.count_ctv_pending ? listData.count_ctv_pending : 0}`}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>{this.setState({showListCTVPend:true})}}>
                  <Image source={plusIC} style={{width:35,height:35}} />
                  </TouchableOpacity>
                </View>
            </View>}

            {isAgency &&
              <View style={wrapWhite}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.pending_location}`}</Text>
                  <Text style={titleCoin}>{`${listData.count_location_pending ? listData.count_location_pending : 0}`}</Text>
                </View>
                <TouchableOpacity onPress={()=>{this.setState({showListLocPend:true})}}>
                <Image source={plusIC} style={{width:35,height:35}} />
                </TouchableOpacity>
                </View>
            </View>}
            {(isAgency || isCeo) &&
              <TouchableOpacity style={wrapWhite} onPress={()=>{
                this.setState({assign:true,listAgency:[],itemChoose:{},listDistrict:{},showCTV:false,valCTV:''});
              }}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.assign}`}</Text>
                  <Image source={filterIC} style={{width:35,height:35}} />
                </View>
            </TouchableOpacity>}

            {isCeo &&
              <TouchableOpacity style={wrapWhite} onPress={()=>{
                this.setState({showTDLCTVPop:true});
              }}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.bonus_ctv}`}</Text>
                  <Image source={filterIC} style={{width:35,height:35}} />
                </View>
            </TouchableOpacity>}

            {isCeo &&
              <TouchableOpacity style={wrapWhite} onPress={()=>{
                this.setState({showTDLPop:true});
              }}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.add_agency}`}</Text>
                  <Image source={filterIC} style={{width:35,height:35}} />
                </View>
            </TouchableOpacity>}

            {isCTV && <View style={{alignItems:'center'}}>
              <TouchableOpacity style={[marTop,btnTransfer]}
              onPress={()=>this.gotoCreate()}>
              <Text style={titleCreate}>{`${lang.let_mm}`.toUpperCase()}</Text>
              <Text style={{color:'#fff'}}>{`(${lang.new_location_mm})`}</Text>
              </TouchableOpacity>
            </View>}
          </View>

          <View style={[marTop,wrapDes]}>
          {content!=='' && <Text style={{color:'#6587A8',fontSize:16,lineHeight:28}}>{`${content}\n\n`}</Text>}
          <Text style={{color:'#6587A8',fontSize:16,lineHeight:28}}>{`${static_notes}`}</Text>
          </View>

          </View>
          <View style={{height:height/6}}></View>
          </ScrollView>

        </View>

      }

      {assign &&
        <GrantRight
        closeModal={()=>this.setState({
          showCTVPop:false,assign:false,listAgency:[],valCTV:'',itemChoose:{},listDistrict:{}
        })}
        hidePopup={()=>this.setState({listAgency:[],noData:''})}
        userId={user_profile.id}
        itemChoose={itemChoose} noData={noData}
        chooseDist={(listDistrict)=>this.setState({listDistrict})}
        lang={lang} isCeo={isCeo} listAgency={listAgency}
        showKV={()=>this.setState({showArea:true})}
        searchContent={(route,keyword)=>{this.searchContent(route,keyword)}}
        chooseUser={(item)=>this.setState({itemChoose:item,listAgency:[]})}
        assignFunc={()=>{this.assignFunc()}}
        />
      }

      {showTDLPop &&
        <AddAgency
        closeModal={()=>this.setState({showTDLPop:false})}
        assignArea={(itemChoose)=>this.setState({itemChoose,assign:true,showTDLPop:false})}
        lang={lang} isCeo={isCeo}
        />
      }

      {showTDLCTVPop &&
        <BonusAgency
        closeModal={()=>this.setState({showTDLCTVPop:false})}
        //assignArea={(itemChoose)=>this.setState({itemChoose,assign:true,showTDLCTVPop:false})}
        lang={lang} isCeo={isCeo}
        />
      }

      {showCTVPop &&
        <View style={[popoverLoc]}>
        <TouchableOpacity onPress={()=>this.setState({showCTVPop:false,listAgency:[],noData:''})}
        style={{justifyContent:'center',alignSelf:'center',flex:1}}>
        <TouchableWithoutFeedback style={{justifyContent:'center'}}>
        <View style={[overLayout,shadown]}>
        <FlatList
         extraData={this.state}
         data={listAgency}
         ListEmptyComponent={<Text style={{color:'#000',fontSize:16}}>{noData}</Text>}
         style={{margin:15,maxHeight:height/2}}
         keyExtractor={(item,index) => index.toString()}
         renderItem={({item,index}) =>(
           <TouchableOpacity
           onPress={()=>{navigate('CTVDetailScr',{
             lang,ctv_id:isCeo?'':item.id,daily_id:isCeo?item.id:'',name:item.full_name,address:item.address,
           avatar:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`})}}
           style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
               <View style={{flexDirection:'row',paddingBottom:15,alignItems:'center'}}>
                   <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                   <View style={{width:isCeo?width-110:width-170}}>
                     <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                     <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                   </View>
                   {!isCeo &&
                  <TouchableOpacity onPress={()=>{
                     //console.log(item.role_active);
                     this.stopCTV(item.id,item.role_active)
                   }}>
                   <Image source={item.role_active===0?unlockIC:lockIC} style={{width:22,height:22,marginRight:7}} />
                   </TouchableOpacity>}
                   {!isCeo &&
                   <TouchableOpacity onPress={()=>{this.confirmdDelColl(item.id)}}>
                   <Image source={removeIC} style={{width:20,height:20}} />
                   </TouchableOpacity>
                   }
               </View>

             </TouchableOpacity>
         )}
         onEndReachedThreshold={0.5}
         onEndReached={() => {
          if(loadMore) this.setState({loadMore:false},()=>{
            this.searchContent(isCeo?'find-daily':'search-ctv','', page)
          });
         }}
         ListFooterComponent={() => {
          return (
            <View>
              {this.state.loadMore && <ActivityIndicator size="large" color="#d0021b" />}
            </View>
          )
        }}/>
         </View>
         </TouchableWithoutFeedback>
       </TouchableOpacity>
     </View>}

      {showLocPop &&
        <View style={[popoverLoc]}>
        <TouchableOpacity onPress={()=>this.setState({showLocPop:false,listLoc:[],noData:''})} style={{justifyContent:'center',alignItems:'center',flex:1}}>
        <TouchableWithoutFeedback>
        <View style={[overLayout,shadown]}>
          <FlatList
           extraData={this.state}
           data={listLoc}
           ListEmptyComponent={<Text style={{color:'#000',fontSize:16}}>{noData}</Text>}
           style={{padding:15,marginTop:5,marginBottom:5,maxHeight:height/2}}
           keyExtractor={(item,index) => index.toString()}
           renderItem={({item,index}) =>(
               <TouchableOpacity
               onPress={()=>{navigate('CTVDetailScr',{
                 lang,daily_id:isAgency?user_profile.id:'',ctv_id:isCTV?user_profile.id:'',ceo_id:isCeo?user_profile.id:'',content_id:item.id,name:item.name,address:`${item.address}, ${item._district.name}, ${item._city.name}`,
               avatar:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`})}}
               style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                   <View style={{flexDirection:'row',paddingBottom:17}}>
                       <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:70,height:60,marginRight:10}} />
                       <View style={{width:width-130,justifyContent:'space-between'}}>
                         <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF',fontSize:12}}>{`${item.address}, ${item._district.name}, ${item._city.name}`}</Text>
                         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                             <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Image source={likeIC} style={{width:18,height:15,marginRight:5}} />
                              <Text>{item.like} | </Text>
                              <Image source={favoriteIcon} style={{width:16,height:16,marginRight:5}} />
                              <Text>{item.vote}</Text>
                             </View>
                             <View style={{width:width/3}}>
                             {item.moderation==='publish' &&
                             <View style={{flexDirection:'row',alignItems:'center'}}>
                             <View style={{marginTop:1,width:10,height:10,borderRadius:5,backgroundColor:'#5cb85c',marginLeft:5,marginRight:5}}></View>
                             <Text>{lang.active}</Text></View>}
                             {item.moderation==='request_publish' &&
                             <View style={{flexDirection:'row',alignItems:'center'}}>
                             <View style={{marginTop:1,width:10,height:10,borderRadius:5,backgroundColor:'#d0021b',marginLeft:5,marginRight:5}}></View>
                             <Text>{lang.wait_approve}</Text></View>}
                             {item.moderation==='un_publish' &&
                             <View style={{flexDirection:'row',alignItems:'center'}}>
                             <View style={{marginTop:1,width:10,height:10,borderRadius:5,backgroundColor:'#f5be23',marginLeft:5,marginRight:5}}></View>
                             <Text>{lang.close}</Text></View>}
                             </View>

                          </View>
                       </View>
                   </View>
               </TouchableOpacity>
           )}
           onEndReachedThreshold={0.5}
           onEndReached={() => {
            if(loadMore) this.setState({loadMore:false},()=>{
              this.searchContent('search-content','', page)
            });
            }}
           ListFooterComponent={() => {
             return (
               <View>
                 {this.state.loadMore && <ActivityIndicator size="large" color="#d0021b" />}
               </View>
             )
           }}/>
           </View>
           </TouchableWithoutFeedback>
           </TouchableOpacity>
         </View>}

      {showListLocPend && ListLocPend.length>0 &&
        <View style={{position:'absolute'}}>
        <TouchableOpacity onPress={()=>this.setState({showListLocPend:false},()=>{this.searchContentPending()})} style={[popoverLoc,padBuySell]}>
        <TouchableWithoutFeedback >
            <View style={[overLayout,shadown]}>
            <FlatList
             extraData={this.state}
             data={ListLocPend}
             onEndReachedThreshold={0.5}
             onEndReached={() => {
               if(loadMore) this.setState({loadMore:false},()=>{
                 this.searchContentPending(page)
               });
             }}
             style={{padding:15,marginTop:15,marginBottom:15,}}
             keyExtractor={(item,index) => index.toString()}
             renderItem={({item,index}) =>(
               <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
               onPress={()=>{
                 navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,lang:lang.lang,update:true,yourCurLoc})
               }}>
                   <View style={{flexDirection:'row',paddingBottom:17}}>
                       <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                       <View style={{width:width-140}}>
                         <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}, ${item._district.name}, ${item._city.name}`}</Text>
                       </View>
                   </View>
                  <TouchableOpacity onPress={()=>{
                    if(suggestLoc[item.id]){
                      this.state.suggestLoc = Object.assign(this.state.suggestLoc,{[item.id]:!item.id});
                    }else{
                      this.state.suggestLoc = Object.assign(this.state.suggestLoc,{[item.id]:item.id});
                    }
                    this.setState(this.state);
                  }}>
                  <Image source={suggestLoc[item.id]?checkIC:uncheckIC} style={{width:24,height:24,marginLeft:5,marginBottom:25}} />
                  </TouchableOpacity>
              </TouchableOpacity>
             )} />
             {ListLocPend.length>0 &&
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingTop:15,paddingBottom:15}}>
                 <TouchableOpacity style={{alignItems:'center',padding:7,borderWidth:1,borderRadius:4,borderColor:'#d0021b',minWidth:width/3}}
                 onPress={()=>{this.requestLoc('reject')}}>
                   <Text style={{color:'#d0021b',fontSize:16}}>{`${lang.reject}`}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={{alignItems:'center',padding:7,borderRadius:4,backgroundColor:'#d0021b',marginLeft:10,minWidth:width/3}}
                 onPress={()=>{this.requestLoc('publish')}}>
                   <Text style={{color:'#fff',fontSize:16}}>{`${lang.display}`}</Text>
                 </TouchableOpacity>
             </View>}
            </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </View>}

    {showListCTVPend && ListPend.length>0 &&
      <View style={{position:'absolute'}}>
      <TouchableOpacity onPress={()=>this.setState({showListCTVPend:false})} style={[popoverLoc,padBuySell]}>
      <TouchableWithoutFeedback>
      <View style={[overLayout,shadown]}>
      <FlatList
       extraData={this.state}
       data={ListPend}
       style={{padding:15,marginTop:15,marginBottom:15,}}
       keyExtractor={(item,index) => index.toString()}
       renderItem={({item,index}) =>(
         <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
         onPress={()=>{ navigate('CTVApproveScr',{lang,el:item,daily_id:user_profile.id}) }}>
             <View style={{flexDirection:'row',paddingBottom:15}}>
                 <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                 <View style={{width:width-130}}>
                   <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                   <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                 </View>
             </View>
          <TouchableOpacity onPress={()=>{
            if(suggestPend[item.id]){
              this.state.suggestPend = Object.assign(this.state.suggestPend,{[item.id]:!item.id});
            }else {
              this.state.index_ctv_pending=index;
              this.state.suggestPend = Object.assign(this.state.suggestPend,{[item.id]:item.id});
            }
            this.setState(this.state);
          }}>
          <Image source={suggestPend[item.id]?checkIC:uncheckIC} style={{width:20,height:20}} />
          </TouchableOpacity>
        </TouchableOpacity>
       )} />

       {ListPend.length>0 &&
         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingTop:15,paddingBottom:15}}>
           <TouchableOpacity style={{alignItems:'center',padding:7,borderWidth:1,borderRadius:4,borderColor:'#d0021b',minWidth:width/3}}
           onPress={()=>{this.requestCTV('decline')}}>
             <Text style={{color:'#d0021b',fontSize:16}}>{`${lang.reject}`}</Text>
           </TouchableOpacity>
           <TouchableOpacity style={{alignItems:'center',padding:7,borderRadius:4,backgroundColor:'#d0021b',marginLeft:10,minWidth:width/3}}
           onPress={()=>{this.requestCTV('accept',ListPend[index_ctv_pending])}}>
             <Text style={{color:'#fff',fontSize:16}}>{`${lang.accept}`}</Text>
           </TouchableOpacity>
       </View>}
       </View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  </View>}

      {showArea && listData.area!==undefined &&
        <Modal onRequestClose={() => null} transparent visible={showArea} >
        <TouchableOpacity onLayout={()=>{
          this.state.itemChoose._area!==undefined && Object.entries(listDistrict).length===0 && this.state.itemChoose._area.forEach(e=>{
            this.setState({ listDistrict: Object.assign(listDistrict,{[e.id]:e.id}) })
          })
        }}
        onPress={()=>this.setState({showArea:false})} style={[popoverLoc,padBuySell]}>
        <TouchableWithoutFeedback>
        <View style={[overLayout,shadown]}>
          <FlatList
             keyExtractor={(item,index) => index.toString()}
             extraData={this.state}
             data={listData.area}
             renderItem={({item}) => (
               <View style={listOverService}>
                <TouchableOpacity onPress={()=>{
                  this.state.labelArea=item.name;
                  if(listDistrict[item.id]){
                    this.state.listDistrict=Object.assign(listDistrict,{[item.id]:!item.id});
                  }else {
                    this.state.listDistrict=Object.assign(listDistrict,{[item.id]:item.id});
                  }
                  this.setState(this.state);
                }}
               style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}>
                    <Text style={{color:'#2F353F',fontSize:16,}}>{item.name}</Text>
                    <Image source={checkIC} style={[imgShare,listDistrict[item.id]===item.id ? show : hide]} />
                </TouchableOpacity>
                </View>
           )} />
           </View>
        </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {yourCurLoc:state.yourCurLoc}
}

export default connect(mapStateToProps)(MakeMoney);

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor:'#E9E9EF'
  },
  listOverService:{
      borderBottomColor:'#EEEDEE',
      borderBottomWidth:1,
  },
  shadown:{
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#999',
    shadowOpacity: .5,
  },
  overLayout:{
    backgroundColor:'#fff',width: width-20,borderRadius:6,overflow:'hidden',top:7,
    maxHeight:Platform.OS ==='ios' ? 350 : 380,
  },
  padBuySell:{ paddingTop: 120},
  popoverLoc : {
    alignItems:'center',
    position:'absolute',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:999,
  },
  imgShare : {
      width: 16,height: 16,
  },
  wrapSetting: {width,height,backgroundColor:'#F1F2F5',position:'absolute',zIndex:99,top:0,left:0},
  btnTransfer:{width:width-40,alignItems:'center',justifyContent:'center',backgroundColor:'#d0021b',padding:10,borderRadius:5},
  titleHead:{fontSize:20,fontWeight:'bold',color:'#2F353F'},
  titleNormal:{fontSize:15,color:'#2F353F',marginTop:5,lineHeight:22,textAlign:'center'},
  imgLogoTop : {
      width: 138,height: 25,
  },
  colorlbl :{color:'#323640',fontSize:16},
  wrapDes:{width:width-40},
  marTop:{marginTop:20},
  wrapWhite:{
    backgroundColor:'#fff',
    //alignItems:'center',
    padding:15,
    marginBottom:5,
    width
  },

  titleCoin : {
    fontSize: 18,
    fontWeight:'300',
    color:'#d0021b',
  },
  contentKcoin:{flexDirection:'row',justifyContent:'space-between',width:width-80,alignItems:'center'},
  colorTitle:{color:'#2F353F',fontSize:16,fontWeight:'bold',},
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
  titleCreate:{color:'white',fontSize:18,paddingTop:5,fontWeight:'bold'},
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
  show : { display: 'flex',},
  hide : { display: 'none'},
  headLocationStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 75,
      position:'relative',zIndex:5,
  },
  inputSearch : {
    marginTop: 3,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
})
