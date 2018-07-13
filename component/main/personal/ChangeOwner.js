/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,FlatList,Alert,
  TouchableWithoutFeedback,Keyboard,
} from 'react-native';
import styles from '../../styles';
import getApi from '../../api/getApi';
import postApi from '../../api/postApi';
import global from '../../global';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
//import searchIC from '../../../src/icon/ic-white/ic-search.png';
import deleteIC from '../../../src/icon/color-red/ic-delete.png';
import {checkUrl,removeItem} from '../../libs';
const {width,height} = Dimensions.get('window');

var timeoutLoc;
export default class ChangeOwner extends Component {
  constructor(props){
    super(props);
    this.state = {
      noData:'',
      txtLoc:'',
      txtUser:'',
      listContent:[],
      showContent:[],
      arrLoc:{},
      showLoc:false,
      showUser:false,
      from_user:0,
      to_user:0,
      listUser:[],
      user_profile:{},
    }

  }
  search(route){
    const {userId,lang} = this.props.navigation.state.params;
    const {txtLoc,txtUser} = this.state;

    const kw = route==='user' ? txtUser : txtLoc;
    const router = route==='user' ? 'search-user' : 'search-content-user';
    if(kw==='') return;

    const url = `${global.url}${router}${'?query='}${kw}${'&id_user='}${userId}`;
    console.log(url);
    timeoutLoc = setTimeout(()=>{
      getApi(url)
      .then(arrData => {
        if(route==='content')
          this.setState({ listContent: arrData.data,from_user:userId,showLoc:true,showUser:false,noData: arrData.data.length===0 ? lang.not_found : '' });
        else
          this.setState({ listUser: arrData.data,from_user:userId,showLoc:false,showUser:true,noData: arrData.data.length===0 ? lang.not_found : '' });
      })
      .catch(err => console.log(err));
    },800);

  }
  chooseLoc(id,item,index,pop=null){
    Keyboard.dismiss();
    this.setState({showLoc:false,txtLoc:''})
    const {arrLoc,showContent} = this.state;
    if(this.state.arrLoc[id] && pop===null){
        this.setState({
          arrLoc: Object.assign(arrLoc,{[id]:!id}),
          showContent:removeItem(showContent,index),
        })
    }else {
      if(pop===null || (pop!==null && !this.state.arrLoc[id]))
      {this.setState({
        arrLoc: Object.assign(arrLoc,{[id]:id}),
        showContent:showContent.concat(item),
      })}
    }
  }

  confirmChange = () => {
    //console.log(this.state.user_profile.text);
    const {user_profile,showContent} = this.state;
    const {lang,userId} = this.props.navigation.state.params;

    if(showContent.length===0){return Alert.alert(lang.notify,lang.require_loc)}
    if(user_profile.id===undefined){return Alert.alert(lang.notify,lang.require_user)}

    return Alert.alert(lang.notify,`${lang.confirm_change}${user_profile.text}?`,[
      {text: lang.cancel, style: 'cancel'},
      {text: lang.confirm, onPress: () => this.changeOwner(userId,user_profile.id)},
    ],
   { cancelable: false } )
  }
  changeOwner(from_user,to_user){
    const {showContent} = this.state;
    const {lang} = this.props.navigation.state.params;
    var arr = new FormData();
    arr.append('from_user',from_user);
    arr.append('to_user',to_user);
    showContent.forEach((e)=>{
      arr.append('content[]',e.id);
    })

    postApi(`${global.url}${'change-owner?lang='}${lang.lang}`,arr).then(e=>{
      if(e.code!==undefined){
        this.setState({txtLoc:'',txtUser:'',listContent:[],showContent:[],listUser:[],user_profile:{},showLoc:false,showUser:false,});
        Alert.alert(lang.notify,`${e.data.message}`)
      }
    }).catch(err=>{});
  }
  render() {
    const {
      wrapSetting,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,inputLoc,btnSearchOwn,
      imgShare,show,hide,colorlbl,
      popupLocChange,topLocChange,topUserChange,
    } = styles;
    //console.log(inputLoc);
    const {lang,userId} = this.props.navigation.state.params;
    //console.log(lang);
    const {noData,txtLoc,txtUser,listContent,showContent,listUser,arrLoc,showLoc,showUser,user_profile} = this.state;
    return (
      <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss();this.setState({showLoc:false,showUser:false})}}>

        <View style={[wrapSetting]}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>this.props.navigation.goBack()}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> {lang.change_owner} </Text>
                  <TouchableOpacity onPress={()=>{this.confirmChange()}}>
                  <Text style={titleCreate}> {lang.done} </Text>
                  </TouchableOpacity>
              </View>
          </View>
          <View style={{backgroundColor:'#fff'}}>

            <View style={{padding:15}}>

              <TextInput underlineColorAndroid='transparent' style={inputLoc}
              //placeholderTextColor={'red'}
              placeholder={lang.name_location}
              onChangeText={(txtLoc) => {
                this.setState({txtLoc},()=>{
                  clearTimeout(timeoutLoc);
                  if(txtLoc.length>1){
                    this.search('content');
                  }
                });
              }}
              value={txtLoc}
               />

               <TextInput underlineColorAndroid='transparent' ref='Users'
               placeholder={`${lang.enter_email_number}`} style={inputLoc}
               onChangeText={(txtUser) => {
                 this.setState({txtUser},()=>{
                   clearTimeout(timeoutLoc);
                   if(txtUser.length>1){
                     this.search('user');
                   }
                 })
               }}
               value={txtUser}/>

             </View>

         </View>
         {showContent.length>0 &&
         <View style={{padding:15}}>
         <Text numberOfLines={1} style={colorlbl}>{lang.selected_locations}</Text>
         <FlatList
            extraData={this.state}
            style={{marginTop:15}}
            data={showContent}
            keyExtractor={(item,index) => index.toString()}
            renderItem={({item,index}) =>(
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <View style={{flexDirection:'row',maxWidth:width-110}}>
                      <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                      <View>
                      <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                      <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                      </View>
                  </View>
                  <TouchableOpacity onPress={()=>{this.chooseLoc(item.id,item,index)}}
                  style={arrLoc[item.id] ? show : hide }>
                    <Image source={deleteIC} style={[imgShare]} />
                  </TouchableOpacity>
              </View>
            )} />
         </View>}


         {showLoc && <View style={[popupLocChange,topLocChange]}>
         <FlatList
            extraData={this.state}
            data={listContent}
            ListEmptyComponent={<Text>{noData!=='' ? noData : '' }</Text> }
            keyExtractor={(item,index) => index.toString()}
            renderItem={({item,index}) =>(
              <TouchableOpacity onPress={()=>{this.chooseLoc(item.id,item,index,'kfd')}} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <View style={{flexDirection:'row',maxWidth:width-50}}>
                      <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                      <View>
                        <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                        <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                      </View>
                  </View>
              </TouchableOpacity>
            )} />
         </View>}

         {showUser && <View style={[popupLocChange,topUserChange]}>
         <FlatList
            extraData={this.state}
            data={listUser}
            ListEmptyComponent={<Text>{noData!=='' ? noData : '' }</Text> }
            keyExtractor={(item,index) => index}
            renderItem={({item}) =>(
              <TouchableOpacity onPress={()=>{clearTimeout(timeoutLoc);this.setState({ user_profile:item,showUser:false,txtUser:item.text })}} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <View style={{flexDirection:'row',maxWidth:width-50}}>
                      <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                      <View>
                        <Text numberOfLines={1} style={colorlbl}>{item.text}</Text>
                      </View>
                  </View>
              </TouchableOpacity>
            )} />
         </View>}



        </View>
        </TouchableWithoutFeedback>
    );
  }
}
