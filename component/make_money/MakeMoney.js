/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,Modal,Alert,
  ScrollView,FlatList
} from 'react-native';
import Moment from 'moment';
const {height, width} = Dimensions.get('window');
import {Select, Option} from "react-native-chooser";

//import styles from '../styles';
import getApi from '../api/getApi';
import postApi from '../api/postApi';
import global from '../global';
import checkLogin from '../api/checkLogin';
import loginServer from '../api/loginServer';

import logoTop from '../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../src/icon/ic-gray/ic-search.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import plusIC from '../../src/icon/ic-plus.png';
import subIC from '../../src/icon/ic-sub.png';
import filterIC from '../../src/icon/ic-filter.png';
import likeIC from '../../src/icon/ic-like.png';
import favoriteIcon from '../../src/icon/ic-favorite.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import checkIC from '../../src/icon/ic-check.png';
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
import {format_number,checkUrl} from '../libs';

var com;
export default class MakeMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCoin:false,
      showLoc:false,
      showCTV:false,
      showArea:false,
      listDistrict:{},
      labelArea:'',
      valCTV:'',
      kw:'',
      valLoc:'',
      listAgency:[],
      ListPend:[],
      suggestPend:{},
      listLoc:[],
      listData:{},
      itemChoose:{},
      assign:false,
      isAgency:false,
      isPend:false,
      user_profile:{},
      lockCTV:{},
    }
    const { user_profile } = this.props.navigation.state.params;
    loginServer(user_profile,'fgdjk')
    user_profile.temp_daily_code==='' && this.getStatic();
  }


  searchContent(route,keyword){
    const { user_profile } = this.props.navigation.state.params;
    const arr = new FormData();
    user_profile._roles!==undefined && user_profile._roles.forEach(e=>{
      if(e.machine_name==='cong_tac_vien') arr.append('ctv_id',user_profile.id);
      if(e.machine_name==='tong_dai_ly') {arr.append('daily_id',user_profile.id);isAgency=true}
    })
    arr.append('keyword',keyword);

    //console.log(`${global.url}${'static/search-'}${route}`);
    //console.log(arr);
    postApi(`${global.url}${'static/search-'}${route}`,arr).then(e => {

      if(route==='ctv'){
        this.state.listAgency=e.data;
        this.state.valCTV='';
        this.state.kw=keyword;
      }else {
        this.state.listLoc=e.data;
        this.state.valLoc='';
      }
        this.setState(this.state);
    }).catch(err => console.log(err));
  }
  getStatic(){
    const { user_profile } = this.props.navigation.state.params;
    if(user_profile.temp_daily_code===''){
      const month = Moment().format('MM');
      const year = Moment().format('YYYY');
      let isAgency=false;
      const arr = new FormData();
      //console.log(user_profile);
      user_profile._roles!==undefined &&  user_profile._roles.forEach(e=>{
        if(e.machine_name==='cong_tac_vien') arr.append('ctv_id',user_profile.id);
        if(e.machine_name==='tong_dai_ly') {arr.append('daily_id',user_profile.id);isAgency=true}
      })
      arr.append('month',month);
      arr.append('year',year);
      //console.log(arr);
      user_profile._roles.length>0 && postApi(`${global.url}${'static'}`,arr).then(e => {
      //console.log('e.data',e.data);
        this.setState({ listData:e.data,isAgency },()=>{
          isAgency && this.getListPending();
        });
      }).catch(err => console.log(err));
    }else {
      this.setState({isPend:true})
    }



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
      this.searchContent('ctv',this.state.kw);
    } ).catch(err => console.log(err));
  }
  getListPending(){
    const { user_profile } = this.props.navigation.state.params;
    const arr = new FormData();
    arr.append('daily_id',user_profile.id);
    //console.log(arr);
    //console.log(`${global.url}${'static/search-ctv-pending'}`);
    postApi(`${global.url}${'static/search-ctv-pending'}`,arr)
    .then(e => {
      console.log('e.data',e.data);
        this.setState({ ListPend:e.data });
    }).catch(err => console.log(err));
  }
  requestCTV(route){
    const { user_profile,lang } = this.props.navigation.state.params;
    if(Object.entries(this.state.suggestPend).length===0){
      Alert(lang.notify,lang.choose_ctv);
      return false;
    }
    const arr = new FormData();
    arr.append('daily_id',user_profile.id);
    Object.entries(this.state.suggestPend).forEach(e=>{
      arr.append('ctv_id[]',e[1]);
    })
    postApi(`${global.url}${'static/'}${route}${'-ctv'}`,arr).then(e => {
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
    postApi(`${global.url}${'static/'}${route}${'-ctv'}`,arr).then(e => {
        this.searchContent('ctv',this.state.kw);
    }).catch(err => console.log(err));
  }

  assignFunc = () => {
    const { lang } = this.props.navigation.state.params;
    const {listDistrict,itemChoose} = this.state;

    if(itemChoose.id===undefined){
      Alert.alert(lang.notify,lang.choose_ctv);
    }else if(Object.entries(listDistrict).length===0){
      Alert.alert(lang.notify,lang.plz_choose_area);
    }else {
      const arr = new FormData();
      arr.append('id',itemChoose.id);
      Object.entries(listDistrict).forEach(e=>{
        arr.append('district[]',e[1]);
      })
      //console.log(arr);
      //console.log(`${global.url}${'static/area-ctv'}`);
      postApi(`${global.url}${'static/area-ctv'}`,arr)
      .then(e => {
        if(e.code===200){
          Alert.alert(lang.notify,e.data,[
            {text: '', style: 'cancel'},
            {text: 'OK', onPress: () => this.setState({ listAgency:[],valCTV:'',assign:false})}
          ],{ cancelable: false })
       }else {
         Alert.alert(lang.notify,e.message)
       }
      }).catch(err => console.log(err));
    }
  }
  componentWillMount(){
    //setTimeout(()=>{
      const { user_profile } = this.props.navigation.state.params;

      checkLogin().then(e=>{
        if(user_profile._roles.length!==e._roles.length) this.props.navigation.navigate('MainScr');
        e.temp_daily_code!=='' && this.setState({isPend:true})
      })
    //},2000)

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
      itemChoose,showCoin,showLoc,showCTV,showArea,listData,lockCTV,
      listAgency,listLoc,isAgency,assign,listDistrict,labelArea,ListPend,suggestPend} = this.state;
    const _this = this;
    //console.log(user_profile);
    return (
      <View>
      <ScrollView style={container}>
      {user_profile._roles!==undefined && user_profile._roles.length>0?
      <View>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Image source={logoTop} style={imgLogoTop} />
              <View></View>
          </View>
      </View>

        <View style={contentWrap}>

        <View style={{width:width-80,height:110,justifyContent:'center',alignItems:'center'}}>
        <Text style={titleHead}> {`${name_module}`.toUpperCase()} </Text>
        <Text style={titleNormal}> {`${lang.des_mm}`} </Text>
        </View>

        <View>
          {listData.total!==undefined &&
            <View style={wrapWhite}>
            <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View>
                <Text numberOfLines={1} style={colorTitle}>{`${lang.total_MM}`}</Text>
                <Text style={titleCoin}>{`${format_number(listData.total)}`}</Text>
              </View>
              <TouchableOpacity onPress={()=>this.setState({showCoin:!this.state.showCoin})}>
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
                   <Text style={{color:'#5782A4'}}>{format_number(item.value)}</Text>
                </View>
               )} />}

          </View>}

          {listData.count_location!==undefined &&  <View style={wrapWhite} >
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.total_location}`}</Text>
                  <Text style={titleCoin}>{`${format_number(listData.count_location)}`}</Text>
                </View>
                <TouchableOpacity onPress={()=>this.setState({showLoc:!this.state.showLoc,listLoc:[]})}>
                <Image source={showLoc?subIC:plusIC} style={{width:35,height:35}} />
                </TouchableOpacity>
              </View>

              {showLoc && <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                  <TextInput underlineColorAndroid='transparent'
                  style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                  onSubmitEditing={() => {
                    if (this.state.valLoc.trim()!=='') {
                      this.searchContent('content',this.state.valLoc);
                    }
                  }}
                  onChangeText={(valLoc) => this.setState({valLoc})}
                  value={this.state.valLoc} />

                  <TouchableOpacity style={{position:'absolute',top:20,right:5}}
                  onPress={()=>{
                    if (this.state.valLoc.trim()!=='') {
                      this.searchContent('content',this.state.valLoc);
                    }
                  }}>
                    <Image style={{width:16,height:16,}} source={searchIC} />
                  </TouchableOpacity>
              </View>}

              {showLoc && listLoc.length>0 &&
              <FlatList
               extraData={this.state}
               data={listLoc}
               style={{marginTop:15,maxHeight:height/3}}
               keyExtractor={(item,index) => index.toString()}
               renderItem={({item,index}) =>(
                   <TouchableOpacity
                   onPress={()=>{navigate('CTVDetailScr',{lang,content_id:item.id,name:item.name,address:`${item.address}, ${item._district.name}, ${item._city.name}`,
                   avatar:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`})}}
                   style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                       <View style={{flexDirection:'row',paddingBottom:15}}>
                           <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:70,height:60,marginRight:10}} />
                           <View style={{width:width-110,justifyContent:'space-between'}}>
                             <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                             <Text numberOfLines={1} style={{color:'#6791AF',fontSize:12}}>{`${item.address}, ${item._district.name}, ${item._city.name}`}</Text>
                             <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Image source={likeIC} style={{width:18,height:15,marginRight:5}} />
                              <Text>{item.like} | </Text>
                              <Image source={favoriteIcon} style={{width:16,height:16,marginRight:5}} />
                              <Text>{item.vote}</Text>
                             </View>
                           </View>
                       </View>
                   </TouchableOpacity>
               )} />}

          </View>}

          {listData.count_ctv!==undefined && <View style={wrapWhite} >
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.total_coll}`}</Text>
                  <Text style={titleCoin}>{`${format_number(listData.count_ctv)}`}</Text>
                </View>
                <TouchableOpacity onPress={()=>this.setState({showCTV:!this.state.showCTV,listAgency:[]})}>
                <Image source={showCTV?subIC:plusIC} style={{width:35,height:35}} />
                </TouchableOpacity>
              </View>

              {showCTV && <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                  <TextInput underlineColorAndroid='transparent'
                  style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                  onSubmitEditing={() => {
                    if (this.state.valCTV.trim()!=='') {
                      this.searchContent('ctv',this.state.valCTV);
                    }
                  }}
                  onChangeText={(valCTV) => this.setState({valCTV})}
                  value={this.state.valCTV} />

                  <TouchableOpacity style={{position:'absolute',top:20,right:5}}
                  onPress={()=>{
                    if (this.state.valCTV.trim()!=='') {
                      this.searchContent('ctv',this.state.valCTV);
                    }
                  }}>
                    <Image style={{width:16,height:16,}} source={searchIC} />
                  </TouchableOpacity>

                  {showCTV && listAgency.length>0 &&
                  <FlatList
                   extraData={this.state}
                   data={listAgency}
                   style={{marginTop:15,maxHeight:height/3}}
                   keyExtractor={(item,index) => index.toString()}
                   renderItem={({item,index}) =>(
                     <TouchableOpacity
                     onPress={()=>{navigate('CTVDetailScr',{lang,ctv_id:item.id,name:item.full_name,address:item.address,
                     avatar:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`})}}
                     style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                         <View style={{flexDirection:'row',paddingBottom:15,alignItems:'center'}}>
                             <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                             <View style={{width:width-142}}>
                               <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                               <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                             </View>
                             <TouchableOpacity onPress={()=>{
                               this.stopCTV(item.id,item.role_active)
                             }}>
                             <Image source={item.role_active===0?unlockIC:lockIC} style={{width:22,height:22,marginRight:7}} />
                             </TouchableOpacity>
                             <TouchableOpacity onPress={()=>{this.confirmdDelColl(item.id)}}>
                             <Image source={removeIC} style={{width:20,height:20}} />
                             </TouchableOpacity>
                         </View>

                       </TouchableOpacity>
                   )} />}

              </View>}

          </View>}


          {isAgency &&
            <TouchableOpacity style={wrapWhite} onPress={()=>{
              checkLogin().then(e=>{
                e.temp_daily_code!=='' && this.setState({assign:true,listAgency:[],valCTV:''});
              })

            }}>
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text numberOfLines={1} style={colorTitle}>{`${lang.assign}`}</Text>
                <Image source={filterIC} style={{width:35,height:35}} />
              </View>
          </TouchableOpacity>}

          {isAgency &&
            <View style={wrapWhite}>
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text numberOfLines={1} style={colorTitle}>{`${lang.pending_collaborators}`}</Text>
                {/*<Image source={filterIC} style={{width:35,height:35}} />*/}
              </View>
              {ListPend.length>0 &&
                <View>
                  <FlatList
                   extraData={this.state}
                   data={ListPend}
                   style={{marginTop:15,maxHeight:height/3}}
                   keyExtractor={(item,index) => index.toString()}
                   renderItem={({item,index}) =>(
                     <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                     onPress={()=>{
                       if(suggestPend[item.id]){
                         this.state.suggestPend = Object.assign(this.state.suggestPend,{[item.id]:!item.id});
                       }else {
                         this.state.suggestPend = Object.assign(this.state.suggestPend,{[item.id]:item.id});
                       }
                       this.setState(this.state);
                     }}>
                         <View style={{flexDirection:'row',paddingBottom:15}}>
                             <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                             <View style={{width:width-110}}>
                               <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                               <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                             </View>
                         </View>
                    <Image source={suggestPend[item.id]?checkIC:uncheckIC} style={{width:20,height:20}} />
                    </TouchableOpacity>
                   )} />

                   <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20}}>
                       <TouchableOpacity style={{alignItems:'center',padding:7,borderWidth:1,borderRadius:4,borderColor:'#d0021b',minWidth:width/3}}
                       onPress={()=>{this.requestCTV('decline')}}>
                         <Text style={{color:'#d0021b',fontSize:16}}>{`${lang.reject}`}</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={{alignItems:'center',padding:7,borderRadius:4,backgroundColor:'#d0021b',marginLeft:10,minWidth:width/3}}
                       onPress={()=>{this.requestCTV('accept')}}>
                         <Text style={{color:'#fff',fontSize:16}}>{`${lang.accept}`}</Text>
                       </TouchableOpacity>
                   </View>

                 </View>}
          </View>}

          {!isAgency && <View style={{alignItems:'center'}}>
            <TouchableOpacity style={[marTop,btnTransfer]}
            onPress={()=>navigate('ChooseCatScr',{lang:lang.lang})}>
            <Text style={titleCreate}>{`${lang.let_mm}`.toUpperCase()}</Text>
            <Text style={{color:'#fff'}}>{`(${lang.new_location_mm})`}</Text>
            </TouchableOpacity>
          </View>}
        </View>

        <View style={[marTop,wrapDes]}>
        <Text style={{color:'#6587A8',fontSize:16,lineHeight:28}}>{`${'Lưu ý : \n- Các địa điểm cần cập nhật mỗi tuần 1 lần để người dùng biết là địa điểm còn đang hoạt động.\n- Sau 03 tháng, điạ điểm nào không có các tương tác gì khác ngoài tìm kiếm thông tin thì các nhân viên quản lý địa điểm có trách nhiệm tiếp cận địa điểm để hai bên cùng hoạt động hiệu quả.\n- Sau 02 năm, các địa điểm của bạn sẽ tự động thoát ra khỏi danh sách quản lý của bạn. \n\nVậy nên, bạn hay cố gắng tương tác nhiều với các địa điểm mà bạn đang quản lý trực tiếp.'}`}</Text>
        </View>

        </View>
        <View style={{height:height/6}}></View>
        </View>
        :
        <View>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>goBack()}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={{marginTop:5,color:'#fff'}}>{lang.subscribe_ctv.toUpperCase()}</Text>
                  <View></View>
              </View>
          </View>

            {this.state.isPend ?
              <View style={{justifyContent:'center',alignItems:'center',padding:15,height:height-95}}>
              <Text style={{textAlign:'center',fontSize:20,fontWeight:'400'}}>{lang.plz_approve}</Text>
              </View>
              :
              <View style={{justifyContent:'center',alignItems:'center',padding:15,height:height-95}}>
              <View>
              <Text style={{textAlign:'center',fontSize:20,fontWeight:'500'}}>{lang.title_ctv.toUpperCase()}</Text>
              <Text style={{textAlign:'center',fontSize:14,marginTop:5}}>{lang.des_ctv}</Text>
              </View>
              <TouchableOpacity style={{marginTop:15,backgroundColor:'#d0021b',borderRadius:3,width:width-30,paddingTop:10,paddingBottom:10,alignItems:'center'}}
              onPress={()=>navigate('CTVSubscribeScr',{user_profile,titleScr:lang.subscribe_ctv,lang:lang.lang})}>
                <Text style={{color:'#fff'}}>{lang.subscribe_ctv}</Text>
              </TouchableOpacity>
              </View>
            }

        </View>
      }

      </ScrollView>

      {assign &&
        <View style={wrapSetting}>
        <ScrollView>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{this.setState({
                    assign:false,listAgency:[],valCTV:''
                  })}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={{marginTop:5,color:'#fff'}}>{lang.assign.toUpperCase()}</Text>
                  <View></View>
              </View>
          </View>

          <View style={wrapWhite} >
              <View>
              <Text numberOfLines={1} style={colorTitle}>{`${lang.choose_coll}`}</Text>
              </View>
              <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                  <TextInput underlineColorAndroid='transparent'
                  style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                  onSubmitEditing={() => {
                    if (this.state.valCTV.trim()!=='') {
                      this.searchContent('ctv',this.state.valCTV);
                    }
                  }}
                  onChangeText={(valCTV) => this.setState({valCTV})}
                  value={this.state.valCTV} />

                  <TouchableOpacity style={{position:'absolute',top:20,right:5}}
                  onPress={()=>{
                    if (this.state.valCTV.trim()!=='') {
                      this.searchContent('ctv',this.state.valCTV);
                    }
                  }}>
                    <Image style={{width:16,height:16,}} source={searchIC} />
                  </TouchableOpacity>
              </View>
              {listAgency.length>0 &&
              <FlatList
               extraData={this.state}
               data={listAgency}
               style={{marginTop:15,maxHeight:height/4}}
               keyExtractor={(item,index) => index.toString()}
               renderItem={({item,index}) =>(
                 <TouchableOpacity onPress={()=>{this.setState({itemChoose:item,listAgency:[]})}}
                 style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                     <View style={{flexDirection:'row',paddingBottom:15}}>
                         <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                         <View style={{width:width-90}}>
                           <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                           <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                         </View>
                     </View>
                  </TouchableOpacity>
               )} />}
          </View>
          {itemChoose.avatar!==undefined &&
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:15}}>
              <View style={{flexDirection:'row',paddingBottom:15}}>
                  <Image source={{uri:checkUrl(itemChoose.avatar) ? itemChoose.avatar : `${global.url_media}${itemChoose.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                  <View style={{width:width-90}}>
                    <Text numberOfLines={1} style={colorlbl}>{itemChoose.full_name}</Text>
                    <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${itemChoose.address}`}</Text>
                  </View>
              </View>
           </View>}
           <View style={wrapWhite} >
               <View>
               <Text numberOfLines={1} style={colorTitle}>{`${lang.choose_area}`}</Text>
               </View>
               <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}></View>
               <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between'}}
               onPress={()=>this.setState({showArea:true})}>
               <Text numberOfLines={1} style={colorTitle}>{`${lang.area}`}</Text>
               <Image source={arrowNextIC} style={{width:18,height:18}}/>
               </TouchableOpacity>
          </View>

          <View style={{alignItems:'center'}}>
            <TouchableOpacity onPress={()=>{this.assignFunc()}} style={[marTop,btnTransfer]} >
            <Text style={{color:'#fff'}}>{`${lang.assign}`}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
        </View>
      }

      {showArea && listData.area!==undefined &&
        <Modal onRequestClose={() => null} transparent visible={showArea}>
        <TouchableOpacity onPress={()=>this.setState({showArea:false})} style={[popoverLoc,padBuySell]}>
        <View style={[overLayout,shadown]}>
          <FlatList
             keyExtractor={(item,index) => index.toString()}
             extraData={this.state}
             data={listData.area}
             renderItem={({item}) => (
               <View style={listOverService}>
                <TouchableOpacity onPress={()=>{ this.setState({labelArea:item.name,
                  listDistrict:Object.assign(listDistrict,{[item.id]:item.id}) });}}
               style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}>
                    <Text style={colorTitle}>{item.name}</Text>
                    <Image source={checkIC} style={[imgShare,listDistrict[item.id]===item.id ? show : hide]} />
                </TouchableOpacity>
                </View>
           )} />
        </View>
        </TouchableOpacity>
      </Modal>}
      </View>
    );
  }
}

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
    fontWeight:'400',
    color:'#d0021b',
  },
  contentKcoin:{flexDirection:'row',justifyContent:'space-between',width:width-80,alignItems:'center'},
  colorTitle:{color:'#2F353F',fontSize:16},
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
  titleCreate:{color:'white',fontSize:18,paddingTop:5,fontWeight:'500'},
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
