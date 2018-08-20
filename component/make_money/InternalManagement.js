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
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import filterIC from '../../src/icon/ic-filter.png';
import checkIC from '../../src/icon/ic-create/ic-check.png';
import uncheckIC from '../../src/icon/ic-uncheck.png';
import {format_number,checkUrl} from '../libs';

class InternalManagement extends Component {
  constructor(props) {
    super(props);
    const { _roles,api_roles,temp_daily_code } = this.props.navigation.state.params.user_profile;
    this.state = {
      showCoin:false,
      showLoc:false,
      showLocPop:false,
      showCTV:false,
      showCTVCeo:false,
      showCTVPop:false,
      showTDLPop:false,
      showTDLCTVPop:false,
      showArea:false,
      showListLocPend:false,
      showListCTVPend:false,
      listDistrict:{},
      labelArea:'',
      valCTV:'',
      valCTVCeo:'',
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
      page:0,des_mm:'',let_mm:'',
      index_ctv_pending:'',
      static_notes:'',
      noData:'',
      content:'',
      searchCTV:false,
      showQLNBPop: false
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
        this.state.searchCTV = (route==='find-ctv' || route==='search-ctv')?true:false;
        this.state.listAgency=page===0?e.data:this.state.listAgency.concat(e.data);
        this.state.page =page===0?20:this.state.page+20;
        this.state.loadMore =e.data.length===20?true:false;
        this.state.valCTV='';
        this.state.valCTVCeo='';
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
      let let_mm='',des_mm='';
      const arr = new FormData();
      if(isCTV) {
        arr.append('ctv_id',user_profile.id);
        let_mm='mo_ta_ctv';
        des_mm='tieu_de_make_money_ctv';
      }
      if(isAgency){
        arr.append('daily_id',user_profile.id);
        let_mm='mo_ta_tdl';
        des_mm='tieu_de_make_money_tdl';
      }
      if(isCeo) {
        arr.append('ceo_id',user_profile.id);
        let_mm='tieu_de_make_money_ceo';
      }
      arr.append('month',month);
      arr.append('year',year);
      //console.log(`${global.url}${'static?'}${'block_text='}${let_mm}${'&block_text=luu_y_make_money&lang='}${lang.lang}`);
      //console.log(arr);
      user_profile._roles.length>0 &&
      postApi(`${global.url}${'static?'}${'block_text='}${let_mm},${des_mm},${',luu_y_make_money&lang='}${lang.lang}`,arr).then(e => {
      //console.log('e.data',e.block_text);
      this.state.static_notes=e.block_text.luu_y_make_money;
      !isCeo && (this.state.des_mm=e.block_text[des_mm]);
      this.state.let_mm=e.block_text[let_mm];
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
      container,headCatStyle,headContent,titleCreate,
      headLocationStyle, inputSearch,wrapWhite,
      imgLogoTop,imgContent,colorTitle,titleCoin,contentKcoin,btnTransfer,colorlbl,
      popoverLoc,padBuySell,overLayout,shadown,listOverService,imgShare,show,hide,
    } = styles;

    const {
      itemChoose,showCoin,showLoc,showLocPop,showCTV,showCTVCeo,showCTVPop,showTDLPop,showTDLCTVPop,showQLNBPop,showArea,listData,index_ctv_pending,noData,
      listAgency,listLoc,isCeo,isAgency,isNormal,isCTV,assign,listDistrict,labelArea,ListPend,suggestPend,
      ListLocPend,suggestLoc,showListLocPend,showListCTVPend,loadMore,page,static_notes,des_mm,
      content,searchCTV,let_mm
    } = this.state;
    const {yourCurLoc} = this.props;
    const _this = this;
    //console.log(user_profile);
    return (
      <View>
          <View style={container}>
          <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                <Text style={titleCreate}>{lang.internal_management} </Text>
                <View></View>
              </View>
          </View>
          <View>
            <TouchableOpacity style={wrapWhite} onPress={()=>{
                  this.setState({assign:true,listAgency:[],itemChoose:{},listDistrict:{},showCTV:false,showCTVCeo:false,valCTV:''});
                }}>
                  <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text numberOfLines={1} style={colorTitle}>{`${lang.assign}`}</Text>
                    <Image source={filterIC} style={{width:35,height:35}} />
                  </View>
            </TouchableOpacity>
            <TouchableOpacity style={wrapWhite} onPress={()=>{
                this.setState({showTDLCTVPop:true});
              }}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.bonus_ctv}`}</Text>
                  <Image source={filterIC} style={{width:35,height:35}} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={wrapWhite} onPress={()=>{
                this.setState({showTDLPop:true});
              }}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.add_agency}`}</Text>
                  <Image source={filterIC} style={{width:35,height:35}} />
                </View>
            </TouchableOpacity>
          </View>
            
        </View>

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

export default connect(mapStateToProps)(InternalManagement);

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
  titleNormal:{fontSize:15,color:'#2F353F',marginTop:0,lineHeight:18,textAlign:'center'},
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
    marginBottom:1,
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
