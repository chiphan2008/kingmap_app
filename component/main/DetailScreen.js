/* @flow */

import React, { Component } from 'react';
import {Platform, ScrollView, FlatList, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity} from 'react-native';
const {height, width} = Dimensions.get('window');

import global from '../global';
import getApi from '../api/getApi';
import loginServer from '../api/loginServer';
import checkLogin from '../api/checkLogin';

import Header from './detail/Header';
import Content from './detail/Content';
import MapContent from './detail/MapContent';
import Comments from './detail/Comments';
import Suggest from './detail/Suggest';
import SpaceContent from './detail/SpaceContent';
import Services from './detail/Services';
import OtherBranch from './detail/OtherBranch';

import checkinIC from '../../src/icon/ic-white/ic-check-in.png';


import {Select, Option} from "react-native-chooser";

export default class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region:{
        latitude:10.7818513,
        longitude: 106.6769368,
        latitudeDelta:  0.014422,
        longitudeDelta: 0.011121,
        latlng: '10.7818513,106.6769368',
      },
      curLoc:this.props.navigation.state.params.curLoc || '10.7818513,106.6769368',
      listData:{
        image_space:[],
        image_menu:[],
        link_video:[],
        list_service:[],
        list_suggest:[],
        list_group:[],
        content:{
          alias:'',
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
      scroll:true,
      savelike:false,
      collection:false,
      notifyInfo:'',
    }
    checkLogin().then(e=>{
      if(e.id!==undefined){
        this.setState({user_id:e.id,ema:e.email,pwd:e.pwd});
        loginServer(e.email,e.pwd);
      }
    });
  }

  requestLogin(){
    checkLogin().then(e=>{
      if(e.id===undefined){
        this.props.navigation.navigate('LoginScr',{backScr:'DetailScr'});
      }else{
        this.setState({user_id:e.id});
      }
    });
  }

  getContent(idContent){
    let latlng = this.props.navigation.state.params.curLoc.latlng || '10.7818513,106.6769368';
    const url = `${global.url}${'content/'}${idContent}${'?location='}${latlng}`;
    //console.log('url',url);
    getApi(url)
    .then(arrData => {
        this.setState({
          listData: arrData.data,
          liked: arrData.data.content.like,
          vote: arrData.data.content.vote,
          hasLiked: arrData.data.content.has_like,
          region:{
            latitude: parseFloat(arrData.data.content.lat),
            longitude: parseFloat(arrData.data.content.lng),
            altitude: 7,
            latitudeDelta:  0.004422,
            longitudeDelta: 0.001121,
            latlng:`${this.props.navigation.state.params.lat}${','}${this.props.navigation.state.params.lng}`,
          },
        });
    })
    .catch(err => console.log(err));
  }

  componentWillMount(){
    this.getContent(this.props.navigation.state.params.idContent);
  }

  onRegionChange(region) {
    this.setState({ region });
  }
  callCollect(){
    this.setState({collection:true,scroll:false});
  }
  saveLike(routing){
    this.requestLogin();
    getApi(`${global.url}${routing}${'?content='}${this.props.navigation.state.params.idContent}${'&user='}${this.state.user_id}`).then(e=>
      {this.setState({savelike:true,scroll:false});
        switch (routing) {
          case 'like':
              this.setState({liked:e.data.like,hasLiked:e.data.is_like});
              if(e.data.is_like===1){
                this.setState({notifyInfo:'Đã thích'});
              }else{
                this.setState({notifyInfo:'Đã bỏ thích'});
              }
            break;
          case 'save-like':
              if(e.data.is_like===1){
                this.setState({notifyInfo:'Đã lưu vào yêu thích'});
              }else{
                this.setState({notifyInfo:'Đã bỏ yêu thích'});
              }
            break;
          case 'checkin':
              if(e.data.is_like===1){
                this.setState({notifyInfo:'Checkin thành công'});
              }else{
                this.setState({notifyInfo:'Đã bỏ checkin'});
              }
            break;
        }

      }
    );
  }

  render() {
    const {navigate} = this.props.navigation;
    const { idContent,lang } = this.props.navigation.state.params;
    //console.log('lang',lang);
    const {
      container, bgImg,colorWhite,likeIC,shareIC,imgIC,voteIC,
      imgSocial, imgInfo,aligncenter,
      selectBox,optionListStyle,OptionItem,show,hide,colorTextPP,colorNumPP,
      wrapContent,leftContent,rightContent,middleContent,imgContent,labelCat,wrapImgDetail,
      wrapContentDetail,rowFlex,imgMail,imgContentIC,imgICLocation,imgICMail,
      rowFlexBottom,rowFlexImg,colorBlack,
      titleSpace,sizeTitle,imgSpace,widthHafl,txtAddrOver,colorText,
      padLeft,saveContentStyle,imgSave,
    } = styles;

    return (
      <ScrollView scrollEnabled={this.state.scroll} style={container}>
        <Header
        lang={lang}
        navigation={this.props.navigation}
        idContent={idContent}
        userId={this.state.user_id}
        requestLogin={this.requestLogin.bind(this)}
        saveLike={this.saveLike.bind(this)}
        callCollect={this.callCollect.bind(this)}
        />
        <Content
        listContent={this.state.listData.content}
        userId={this.state.user_id}
        requestLogin={this.requestLogin.bind(this)}
        saveLike={this.saveLike.bind(this)}
        liked={this.state.liked}
        vote={this.state.vote}
        hasLiked={this.state.hasLiked}
        />
        <SpaceContent
        navigation={this.props.navigation}
        idContent={idContent}
        listImgSpace={this.state.listData.image_space}
        listImgMenu={this.state.listData.image_menu}
        listImgVideo={this.state.listData.link_video}
        />

        <Services
        listServices={this.state.listData.list_service}
        serviceContent={this.state.listData.service_content}
        />

        <MapContent
        curLoc={this.state.curLoc}
        region={this.state.region}
        />


        <View style={wrapContentDetail}>
          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>BÌNH LUẬN ({this.state.listData.content._comments.length})</Text>
          </View>

          <Comments
          lang={lang}
          idContent={idContent}
          userId={this.state.user_id}
          requestLogin={this.requestLogin.bind(this)}
          listComment={this.state.listData.content._comments}
          />

          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>CHI NHÁNH KHÁC</Text>
          </View>
          <OtherBranch
          listGroup={this.state.listData.list_group}
          navigation={this.props.navigation}
          />


        </View>

        <Suggest
        listSuggest={this.state.listData.list_suggest}
        navigation={this.props.navigation}
        />


        <TouchableOpacity
        onPress={()=>this.setState({scroll:true,savelike:false})}
        style={[saveContentStyle, this.state.savelike ? show : hide]}>
          <Image source={checkinIC} style={imgSave} />
          <Text style={{color:'#fff',fontSize:18}}>{this.state.notifyInfo}</Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={()=>this.setState({collection:false,scroll:true})}
        style={[saveContentStyle, this.state.collection ? show : hide]}>
          <View style={{width:width-100,borderRadius:3,backgroundColor:'#fff',padding:15,marginBottom:7}}>
            <Text style={{color:'#6587A8',fontSize:18}}>{`${'Tạo mới'}`.toUpperCase()}</Text>
            <View style={{flexDirection:'row',marginBottom:7}}>
              <TextInput underlineColorAndroid={'transparent'} style={{borderColor:'#E1E7EC',borderWidth:1,borderRadius:1,width:width-180}} />
            </View>
          </View>
        </TouchableOpacity>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  imgIC:{width:21,height:23,marginBottom:5},

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
  titleSpace:{flexDirection:'row',justifyContent:'space-between',padding:30,paddingLeft:0,paddingRight:20,},
  rowFlex:{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},
  rowFlexImg:{flexDirection:'row',marginBottom:20},
  rowFlexBottom:{flexDirection:'row',padding:5,paddingLeft:10,marginTop:15,marginBottom:15,alignItems:'flex-end'},
  padLeft:{paddingLeft:15},
  wrapContentDetail:{flexWrap:'wrap',padding:10,backgroundColor:'#fff'},

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
