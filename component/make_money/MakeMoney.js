/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,
  ScrollView,FlatList
} from 'react-native';
import Moment from 'moment';
const {height, width} = Dimensions.get('window');
import {Select, Option} from "react-native-chooser";

//import styles from '../styles';
import getApi from '../api/getApi';
import postApi from '../api/postApi';
import global from '../global';

import logoTop from '../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../src/icon/ic-gray/ic-search.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import plusIC from '../../src/icon/ic-plus.png';
import subIC from '../../src/icon/ic-sub.png';
import filterIC from '../../src/icon/ic-filter.png';
//import calendarIC from '../../src/icon/ic-wallet/ic-calendar.png';
//import timeIC from '../../src/icon/ic-wallet/ic-time.png';
import historyIC from '../../src/icon/ic-wallet/ic-history.png';
import receiveIC from '../../src/icon/ic-wallet/ic-receive.png';
import walletIC from '../../src/icon/ic-wallet/ic-wallet.png';
import transferIC from '../../src/icon/ic-wallet/ic-transfer.png';
import withdrawIC from '../../src/icon/ic-wallet/ic-withdraw.png';
import {format_number,checkUrl} from '../libs';

export default class MakeMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choose_loc:global.choose_loc,
      showCoin:false,
      showLoc:false,
      showCTV:false,
      valCTV:'',
      valLoc:'',
      listAgency:[],
      listLoc:[],
      listData:{},
      statics:[
        {name:'AAA',value:5000},
        {name:'BBB',value:5000},
        {name:'CCC',value:5000},
      ],
    }
    this.getStatic();
  }
  onSelectLoc(value, label) {
    const { navigate } = this.props.navigation;
    const { lang,code_user } = this.props.navigation.state.params;
    navigate('DetailScr',{
      idContent:value,lat:0,lng:0,curLoc:{latitude:10.8142,longitude:106.6438,},lang
    });
  }
  callData(code){
    getApi(`${global.url}${'list-location?code='}${code}`)
    .then(arrLoc => {
      //console.log('arrLoc',arrLoc);
        this.setState({ listLoc: arrLoc.data });
    }).catch(err => console.log(err));
  }
  searchAgency(keyword){
    const { user_profile } = this.props.navigation.state.params;
    const arr = new FormData();
    arr.append('daily_id',user_profile.id);
    arr.append('keyword',keyword);
    postApi(`${global.url}${'static/search-ctv'}`,arr).then(arr => {
        this.setState({ listAgency:arr.data,valCTV:'' });
    }).catch(err => console.log(err));
  }
  getStatic(){
    const { user_profile } = this.props.navigation.state.params;
    const month = Moment().format('MM');
    const year = Moment().format('YYYY');
    const arr = new FormData();
    user_profile._roles.forEach(e=>{
      if(e.machine_name==='cong_tac_vien') arr.append('ctv_id',user_profile.id);
      if(e.machine_name==='tong_dai_ly') arr.append('daily_id',user_profile.id);
    })
    arr.append('month',month);
    arr.append('year',year);
    //console.log(arr);
    postApi(`${global.url}${'static'}`,arr)
    .then(arr => {
        this.setState({ listData:arr.data });
    }).catch(err => console.log(err));
  }
  componentWillMount(){
    const { code_user } = this.props.navigation.state.params;
  }
  render() {
    const { lang,code_user,name_module,user_profile } = this.props.navigation.state.params;
    const { navigate,goBack } = this.props.navigation;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,wrapDes,
      headLocationStyle, inputSearch,wrapWhite,marTop,titleHead,titleNormal,
      imgLogoTop,imgContent,colorTitle,titleCoin,contentKcoin,btnTransfer,colorlbl,
    } = styles;

    const {showCoin,showLoc,showCTV,listData,listAgency} = this.state;
    return (
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
                   <Text style={{color:'#5782A4'}}>{item.value}</Text>
                </View>
               )} />}

          </View>}

          {listData.count_location!==undefined &&  <View style={wrapWhite} >
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.total_location}`}</Text>
                  <Text style={titleCoin}>{`${format_number(listData.count_location)}`}</Text>
                </View>
                <TouchableOpacity onPress={()=>this.setState({showLoc:!this.state.showLoc})}>
                <Image source={showLoc?subIC:plusIC} style={{width:35,height:35}} />
                </TouchableOpacity>
              </View>

              {showLoc && <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                  <TextInput underlineColorAndroid='transparent'
                  style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                  onSubmitEditing={() => {}}
                  onChangeText={(valLoc) => this.setState({valLoc})}
                  value={this.state.valLoc} />

                  <TouchableOpacity style={{position:'absolute',top:20,right:5}}
                  onPress={()=>{
                    if (this.state.valLoc.trim()!=='') {

                    }
                  }}>
                    <Image style={{width:16,height:16,}} source={searchIC} />
                  </TouchableOpacity>
              </View>}

          </View>}

          {listData.count_ctv!==undefined && <View style={wrapWhite} >
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                  <Text numberOfLines={1} style={colorTitle}>{`${lang.total_coll}`}</Text>
                  <Text style={titleCoin}>{`${format_number(listData.count_ctv)}`}</Text>
                </View>
                <TouchableOpacity onPress={()=>this.setState({showCTV:!this.state.showCTV})}>
                <Image source={showCTV?subIC:plusIC} style={{width:35,height:35}} />
                </TouchableOpacity>
              </View>

              {showCTV && <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                  <TextInput underlineColorAndroid='transparent'
                  style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                  onSubmitEditing={() => {
                    if (this.state.valCTV.trim()!=='') {
                      this.searchAgency(this.state.valCTV);
                    }
                  }}
                  onChangeText={(valCTV) => this.setState({valCTV})}
                  value={this.state.valCTV} />

                  <TouchableOpacity style={{position:'absolute',top:20,right:5}}
                  onPress={()=>{
                    if (this.state.valCTV.trim()!=='') {
                      this.searchAgency(this.state.valCTV);
                    }
                  }}>
                    <Image style={{width:16,height:16,}} source={searchIC} />
                  </TouchableOpacity>

                  <FlatList
                   extraData={this.state}
                   data={listAgency}
                   style={{marginTop:15,maxHeight:height/3,minHeight:20}}
                   keyExtractor={(item,index) => index.toString()}
                   renderItem={({item,index}) =>(
                     <TouchableOpacity
                     onPress={()=>{navigate('CTVDetailScr',{lang,ctv_id:item.id,name:item.full_name,address:item.address,
                     avatar:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`})}}
                     style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                         <View style={{flexDirection:'row',paddingBottom:15}}>
                             <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                             <View style={{width:width-90}}>
                               <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                               <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                             </View>
                         </View>

                       </TouchableOpacity>
                   )} />

              </View>}

          </View>}


          <View style={wrapWhite}>
              <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text numberOfLines={1} style={colorTitle}>{`${lang.assign}`}</Text>
                <Image source={filterIC} style={{width:35,height:35}} />
              </View>
          </View>

          <View style={{alignItems:'center'}}>
            <TouchableOpacity style={[marTop,btnTransfer]}
            onPress={()=>navigate('ChooseCatScr',{lang:lang.lang})}>
            <Text style={titleCreate}>{`${lang.let_mm}`.toUpperCase()}</Text>
            <Text style={{color:'#fff'}}>{`(${lang.new_location_mm})`}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[marTop,wrapDes]}>
        <Text style={{color:'#6587A8',fontSize:16,lineHeight:28}}>{`${'Lưu ý : \n- Các địa điểm cần cập nhật mỗi tuần 1 lần để người dùng biết là địa điểm còn đang hoạt động.\n- Sau 03 tháng, điạ điểm nào không có các tương tác gì khác ngoài tìm kiếm thông tin thì các nhân viên quản lý địa điểm có trách nhiệm tiếp cận địa điểm để hai bên cùng hoạt động hiệu quả.\n- Sau 02 năm, các địa điểm của bạn sẽ tự động thoát ra khoải danh sách quản lý của bạn. \n\nVậy nên, bạn hay cố gắng tương tác nhiều với các địa điểm mà bạn đang quản lý trực tiếp.'}`}</Text>
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
          <View style={{justifyContent:'center',alignItems:'center',padding:15,height:height-95}}>
            <View>
            <Text style={{textAlign:'center',fontSize:20,fontWeight:'500'}}>{lang.title_ctv.toUpperCase()}</Text>
            <Text style={{textAlign:'center',fontSize:14,marginTop:5}}>{lang.des_ctv}</Text>
            </View>
            <TouchableOpacity style={{marginTop:15,backgroundColor:'#d0021b',borderRadius:3,width:width-30,paddingTop:10,paddingBottom:10,alignItems:'center'}}
            onPress={()=>navigate('CTVSubscribeScr',{id:user_profile.id,full_name:user_profile.full_name,titleScr:lang.subscribe_ctv,lang:lang.lang})}>
              <Text style={{color:'#fff'}}>{lang.subscribe_ctv}</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
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
    alignItems:'center',
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

  headLocationStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 75,
      position:'relative',zIndex:5,
  },
  inputSearch : {
    marginTop: 3,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
})
