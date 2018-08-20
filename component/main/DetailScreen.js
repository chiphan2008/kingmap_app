/* @flow */

import React, { Component } from 'react';
import {
  Platform, ScrollView, View, Text, StyleSheet,
  Dimensions, Image, TextInput, TouchableOpacity,
  //DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
const {height, width} = Dimensions.get('window');

import global from '../global';
import getApi from '../api/getApi';
import loginServer from '../api/loginServer';
import checkLogin from '../api/checkLogin';
//import getLocationByIP from '../api/getLocationByIP';

import Collection from './detail/Collection';
import Header from './detail/Header';
import Content from './detail/Content';
import MapContent from './detail/MapContent';
import Comments from './detail/Comments';
import Suggest from './detail/Suggest';
import Discounts from './detail/Discounts';
import SpaceContent from './detail/SpaceContent';
import Services from './detail/Services';
import OtherBranch from './detail/OtherBranch';
import lang_vn from '../lang/vn/language';
import lang_en from '../lang/en/language';

import checkinIC from '../../src/icon/ic-white/ic-check-in.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';

import {Select, Option} from "react-native-chooser";


var timeoutCheckUser;
class DetailScreen extends Component {
  constructor(props) {
    super(props);
    const {lang} = this.props.navigation.state.params;
    //console.log('lang1',lang.lang);
    this.state = {
      lang:lang==='vn' ? lang_vn : lang_en,
      region:{},
      listData:{
        image_space:[],
        image_menu:[],
        link_video:[],
        list_service:[],
        list_suggest:[],
        list_group:[],
        products:[],
        discounts:[],
        content:{
          alias:'',
          _branchs:[],
          _district:{name:''},
          _city:{name:''},
          _country:{name:''},
          _comments:[],
        },
      },

      user_id:0,
      pwd:'',
      ema:'',
      liked:0,
      vote:0,
      hasLiked:0,
      hasSaveLike:0,
      hasCheckin:0,
      hasCollection:[],
      scroll:true,
      savelike:false,
      collection:false,
      notifyInfo:'',
      isLogin:false,
    }
    this.refresh();
    //if(curLoc===undefined) this.findLoc();
  }


  getContent(idContent){
    const {latitude,longitude} = this.props.yourCurLoc;
    const {lang} = this.state;
    const {update} =this.props.navigation.state.params;
    //console.log(latitude,longitude);
    //if(latlng===undefined) latlng='10.7818513,106.6769368';
    const act = update!==undefined?'content-update':'content';
    const url = `${global.url}${act}/${idContent}${'?location='}${latitude},${longitude}&lang=${lang.lang}`;
    console.log('url',lang.lang);
    getApi(url)
    .then(arrData => {
      //console.log('arrData.data.content.lat',arrData.data.content.lat);
        this.setState({
          listData: arrData.data,
          liked: arrData.data.content.like,
          vote: arrData.data.content.vote,
          hasLiked: arrData.data.content.has_like,
          hasSaveLike: arrData.data.content.has_save_like,
          hasCheckin: arrData.data.content.has_checkin,
          hasCollection: arrData.data.content.has_collection,
          region:{
            latitude: Number(arrData.data.content.lat),
            longitude: Number(arrData.data.content.lng),
            altitude: 7,
            latitudeDelta:  0.004422,
            longitudeDelta: 0.001121,
            latlng:`${arrData.data.content.lat},${arrData.data.content.lng}`,
          },
        });
    }).catch(err => {});
  }

  componentWillMount(){
    this.props.isLogin && this.refresh();
    this.getContent(this.props.navigation.state.params.idContent);
  }
  likeContent(id_content){
    const {user_id} = this.state;
    const {idContent} = this.props.navigation.state.params;
    if(this.props.isLogin===false){ this.requestLogin();return;}
    getApi(`${global.url}${'like'}${'?content='}${id_content}${'&user='}${user_id}`).then(e=>{
      this.getContent(idContent);
    })

  }

  callCollect(){

    if(this.props.isLogin===false){ this.requestLogin();}else {
      this.setState({collection:true,scroll:false});
    }
  }
  requestLogin(){
    const {state,navigate} = this.props.navigation;
    const {idContent,lang,lat,lng} = this.props.navigation.state.params;
    if(this.props.isLogin===false) navigate('LoginScr');

  }
  refresh(){
    checkLogin().then(e=>{
      if(e.id!==undefined){
        timeoutCheckUser = setTimeout(()=>{
          this.setState({user_id:e.id,ema:e.email,pwd:e.pwd,isLogin:true});
          loginServer(e);
        },500)
      }
    });
  }


  // componentWillUnMount(){
  //   //clearTimeout(timeoutCheckUser);
  // }
  saveLike(routing){
    const {user_id,lang} = this.state;
    if(this.props.isLogin===false){ this.requestLogin();return;}
    getApi(`${global.url}${routing}${'?content='}${this.props.navigation.state.params.idContent}${'&user='}${user_id}`).then(e=>
      {this.setState({savelike:true,scroll:false});
        switch (routing) {
          case 'like':
          //console.log('e.data.is_like',e.data.is_like);
              this.setState({liked:e.data.like,hasLiked:e.data.is_like});
              if(e.data.is_like===1){
                this.setState({notifyInfo:lang.liked});
                setTimeout(()=>{
                  this.setState({savelike:false,scroll:true})
                },1500)
              }else{
                this.setState({notifyInfo:lang.unlike});
                setTimeout(()=>{
                  this.setState({savelike:false,scroll:true})
                },1500)
              }
            break;
          case 'save-like':
              //hasCheckin
              //console.log('e.data.is_like',e.data.is_like);
              if(e.data.is_like===1){
                this.setState({notifyInfo:lang.saved_to_favorites,hasSaveLike:1});
                setTimeout(()=>{
                  this.setState({savelike:false,scroll:true})
                },1500)
              }else{
                this.setState({notifyInfo:lang.dropped_favorites,hasSaveLike:0});
                setTimeout(()=>{
                  this.setState({savelike:false,scroll:true})
                },1500)
              }
            break;
          case 'checkin':
          //console.log('e.data.is_like',e.data.is_like);

              if(e.data.is_like===1){
                this.setState({notifyInfo:lang.check_in_successfully,hasCheckin:1});
                setTimeout(()=>{
                  this.setState({savelike:false,scroll:true})
                },1500)
              }else{
                this.setState({notifyInfo:lang.checked_out,hasCheckin:0});
                setTimeout(()=>{
                  this.setState({savelike:false,scroll:true})
                },1500)
              }
            break;
        }

      }
    );
  }
  backList(){
    this.props.dispatch({type:'DETAIL_BACK',detailBack:'DetailScreen'});
    this.props.navigation.goBack();
  }
  scrollTop = () => {
    this._scrollView.scrollTo({x: 0, y: 0, animated: true});
  }
  render() {
    //console.log('this.props.navigation',this.props.navigation.state.params.curLoc);

    const {navigate} = this.props.navigation;
    const { yourCurLoc } = this.props;
    //console.log('this.props.navigation',this.props.navigation);
    const {lang,user_id,isLogin,scroll,hasCheckin,hasSaveLike,listData,hasCollection} = this.state;
    //console.log('lang',lang.lang);
    const { idContent, moderation } = this.props.navigation.state.params;
    //console.log('idContent',idContent);
    //console.log('listData.discounts',listData.discounts);
    const {
      container, bgImg,colorWhite,likeIC,shareIC,imgIC,voteIC,
      imgSocial, imgInfo,aligncenter,
      selectBox,optionListStyle,OptionItem,show,hide,colorTextPP,colorNumPP,
      wrapContent,leftContent,rightContent,middleContent,imgContent,labelCat,wrapImgDetail,
      wrapContentDetail,rowFlex,imgMail,imgContentIC,imgICLocation,imgICMail,
      rowFlexBottom,rowFlexImg,colorBlack,headContent,
      titleSpace,sizeTitle,imgSpace,widthHafl,txtAddrOver,colorText,
      padLeft,saveContentStyle,imgSave, headStyle
    } = styles;

    return (
      <View style={container}>
        <View style={headStyle}>
          <View style={headContent}>
          <TouchableOpacity onPress={()=>{this.backList()}}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
          </TouchableOpacity>
              {/*<Image source={logoTop} style={imgLogoTop} />*/}
              <View style={{width:width-80,marginTop:3}}>
              <Text numberOfLines={1} style={{fontSize:16,color:'#fff'}}>{listData.content.name}</Text>
              </View>
              <View></View>
          </View>
        </View>

        <ScrollView scrollEnabled={scroll} ref={(c) => { this._scrollView = c; }}>
        <Header
        lang={lang}
        title={listData.content.name}
        url={`${global.url_media}/${listData.content.alias}`}
        backList={this.backList.bind(this)}
        hasCheckin={hasCheckin}
        hasSaveLike={hasSaveLike}
        hasCollection={hasCollection}
        navigation={this.props.navigation}
        idContent={idContent}
        userId={user_id}
        requestLogin={this.requestLogin.bind(this)}
        saveLike={this.saveLike.bind(this)}
        callCollect={this.callCollect.bind(this)}
        moderation={moderation}
        />
        <Content
        listContent={listData.content}
        userId={user_id}
        isLogin={isLogin}
        requestLogin={this.requestLogin.bind(this)}
        saveLike={this.saveLike.bind(this)}
        liked={this.state.liked}
        vote={this.state.vote}
        hasLiked={this.state.hasLiked}
        moderation={moderation}
        />
        <SpaceContent
        lang={lang}
        navigation={this.props.navigation}
        idContent={idContent} moderation={moderation}
        listImgSpace={listData.image_space}
        listImgMenu={listData.image_menu}
        listImgVideo={listData.link_video}
        listProduct={listData.products}
        />
        <Discounts
        lang={lang}
        curLoc={this.props.yourCurLoc}
        listDiscounts={listData.discounts}
        navigation={this.props.navigation}
        userId={user_id}
        requestLogin={this.requestLogin.bind(this)}
        isLogin={this.state.isLogin}
        refresh={(id)=>{this.getContent(id);this.scrollTop()}}
        />

        <Services
        listServices={listData.list_service}
        serviceContent={listData.service_content}
        />

        <MapContent
        lang={lang}
        distance={Number.parseFloat(listData.content.line).toFixed(0)}
        curLoc={this.props.yourCurLoc}
        region={this.state.region}
        />


        <View style={wrapContentDetail}>
          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>{lang.comment.toUpperCase()} ({listData.content._comments.length})</Text>
          </View>

          <Comments
          lang={lang}
          idContent={idContent}
          userId={user_id}
          requestLogin={this.requestLogin.bind(this)}
          listComment={listData.content._comments}
          moderation={moderation}
          />

          {listData.content._branchs.length>0 &&
          <View>
          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>{lang.other_branch.toUpperCase()}</Text>
          </View>
          <OtherBranch
            lang={lang}
            curLoc={this.props.yourCurLoc}
            listGroup={listData.content._branchs}
            navigation={this.props.navigation}
            />
          </View>
          }


        </View>

        <Suggest
        lang={lang}
        curLoc={this.props.yourCurLoc}
        listSuggest={listData.list_suggest}
        likeContent={this.likeContent.bind(this)}
        navigation={this.props.navigation}
        userId={user_id}
        requestLogin={this.requestLogin.bind(this)}
        isLogin={this.state.isLogin}
        refresh={(id)=>{this.getContent(id);this.scrollTop()}}
        />


        {this.state.savelike && <TouchableOpacity
        onPress={()=>this.setState({scroll:true,savelike:false})}
        style={[saveContentStyle, this.state.savelike ? show : hide]}>
          <Image source={checkinIC} style={imgSave} />
          <Text style={{color:'#fff',fontSize:18}}>{this.state.notifyInfo}</Text>
        </TouchableOpacity>}

        <Collection
        hasCollection={(hasCollection)=>this.setState({hasCollection})}
        idContent={idContent} userId={user_id} lang={lang} visible={this.state.collection}
        closeModal={(has_collection)=>this.setState({collection:false,scroll:true,hasCollection: has_collection ? [1] : []},()=>{
          //console.log('has_collection',has_collection);
        })}
         />

      </ScrollView>
      </View>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    yourCurLoc:state.yourCurLoc,
    isLogin:state.isLogin,
    updateState:state.updateState,
  }
}

export default connect(mapStateToProps)(DetailScreen);

const styles = StyleSheet.create({
  container: {flex: 1},
  imgIC:{width:21,height:23,marginBottom:5},
  headStyle: {
    backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 65,
    position:'relative',zIndex:5,justifyContent:'center',
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  imgContentIC:{width:16,height:16,},
  imgICLocation:{width:14,height:16,},
  imgICMail:{width:16,height:12,marginTop:5},
  imgMail:{width:22,height:17},
  likeIC:{width:25,height:21,marginRight:7},
  imgSpace:{
    width:Platform.OS==='ios' ? 160 : 200,
    height:Platform.OS==='ios' ? 160 : 200,
    marginRight:20
  },
  widthHafl:{width:(width-40)/2,overflow:'hidden'},
  txtAddrOver:{color:'#6587A8',fontSize:14,overflow:'hidden',marginTop:5},
  colorText :{color:'#303B50',fontSize:17,marginTop:7},
  sizeTitle:{fontSize:20},
  titleSpace:{flexDirection:'row',justifyContent:'space-between',paddingTop:30,paddingBottom:30,paddingLeft:0,paddingRight:0},
  rowFlex:{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},
  rowFlexImg:{flexDirection:'row',marginBottom:20},
  rowFlexBottom:{flexDirection:'row',padding:5,paddingLeft:10,marginTop:15,marginBottom:15,alignItems:'flex-end'},
  padLeft:{paddingLeft:15},
  wrapContentDetail:{padding:10,backgroundColor:'#fff'},

  imgContent : {
      width: 65,height: 65,marginBottom:10,resizeMode : 'cover',
  },
  labelCat :{
    marginBottom:40,backgroundColor:'transparent',textAlign:'center',width:65,
  },
  wrapImgDetail:{marginRight:15,alignItems:'center'},
  imgInfo : {
      width: 20,height: 20,
  },
  imgSocial : {
      width: 21,height: 23,
  },
  selectBox : {
    width:50,borderColor:'transparent',position:'relative',paddingLeft:0,paddingTop:5,
  },
  optionListStyle :{
    backgroundColor:'#fff',borderColor:'transparent',position:'absolute',width: 55,  height:60,
    top:Platform.OS ==='ios' ? 48 : 35,left:10,
  },
  OptionItem : {
    paddingTop: 7,paddingBottom: 0,marginTop: 0,marginBottom: 0,
  },
  wrapContent :{
    flexDirection:'row',
    alignItems:'center',
    flex:1,
    overflow:'hidden',
  },
  leftContent :{
    justifyContent:'space-between',
    alignItems:'flex-end',
    flex:1,
  },
  rightContent :{
    justifyContent:'space-between',
    alignItems:'flex-start',
    flex:1,
  },
  middleContent :{
    justifyContent:'space-between',
    alignItems:'center',
    flex:1,
  },
  plusStyle :{width:50,height:50,bottom:10,position:'absolute',right:10},
  popover : {
    top: Platform.OS ==='ios' ? 55 :40,
    alignItems:'center',
    position:'absolute',
    width,height:300,
    zIndex:5,
  },
  colorBlack:{color:'#303B50',overflow:'hidden',fontSize:15,},
  colorTextPP :{color:'#B8BBC0'},
  colorNumPP :{fontWeight: 'bold',color:'#2F353F'},
  imgUp:{width: 14,height: 7,top:1,position:'absolute'},
  imgUpInfo :{right:58},
  imgUpShare :{right:20},
  imgMargin: {margin:10},
  listOver:{alignItems:'center',flexDirection:'row',padding:10,borderBottomColor:'#EEEDEE', borderBottomWidth:1,},
  overLayout:{backgroundColor:'#fff',width: width-20,borderRadius:4,overflow:'hidden',top:7},
  show : { display: 'flex'},
  hide : { display: 'none'},
  imgSave:{width:90,height:90,marginBottom:7},
  saveContentStyle:{
      position:'absolute',width,height,zIndex:100,backgroundColor:'rgba(0,0,0,0.7)',
      justifyContent:'center',alignItems:'center',
      alignSelf:'stretch',
  },
});
