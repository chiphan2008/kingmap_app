/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,FlatList,
} from 'react-native';
import styles from '../../styles';
import getApi from '../../api/getApi';
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
    const {userId} = this.props;
    const {txtLoc,txtUser} = this.state;

    const kw = route==='user' ? txtUser : txtLoc;
    if(kw==='') return;

    const url = `${global.url}${'search-'}${route}${'?query='}${kw}${'&id_user='}${userId}`;
    console.log(url);
    timeoutLoc = setTimeout(()=>{
      getApi(url)
      .then(arrData => {
        if(route==='content')
          this.setState({ listContent: arrData.data,from_user:userId,showLoc:true,showUser:false });
        else
          this.setState({ listUser: arrData.data,from_user:userId,showLoc:false,showUser:true });
      })
      .catch(err => console.log(err));
    },800);

  }
  chooseLoc(id,item,index,pop=null){
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



  render() {
    const {
      wrapSetting,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,inputLoc,btnSearchOwn,
      imgShare,show,hide,colorlbl,
      popupLocChange,topLocChange,topUserChange,
    } = styles;
    const {visible,title,lang,userId} = this.props;
    //console.log(userId);
    const {txtLoc,txtUser,listContent,showContent,listUser,arrLoc,showLoc,showUser,user_profile} = this.state;
    return (

        <View style={[wrapSetting,visible ? show : hide]} onLayout={()=>{//this.getData(userId)
        }}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>this.props.closeModal()}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> {title} </Text>
                  <View></View>
              </View>
          </View>
          <View style={{backgroundColor:'#fff'}}>
            <View style={{padding:15}}>

                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <TextInput underlineColorAndroid='transparent'
                    placeholder={lang.name_location} style={inputLoc}
                    onChangeText={(txtLoc) => {
                      this.setState({txtLoc},()=>{
                        clearTimeout(timeoutLoc);
                        if(txtLoc.length>3){
                          this.search('content');
                        }
                      });
                    }}
                    value={txtLoc}
                     />

                   {/*<TouchableOpacity style={btnSearchOwn}>
                   <Image source={searchIC} style={{width:20,height:20}} />
                   </TouchableOpacity>*/}
                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <TextInput underlineColorAndroid='transparent' ref='Users'
                    placeholder={lang.enter_email_number} style={inputLoc}
                    onChangeText={(txtUser) => {
                      this.setState({txtUser},()=>{
                        clearTimeout(timeoutLoc);
                        if(txtUser.length>3){
                          this.search('user');
                        }
                      })
                    }}
                    value={txtUser}

                     />

                 </View>

                 {user_profile.id!==undefined &&
                   <View style={{flexDirection:'row',maxWidth:width-50}}>
                       <Image source={{uri:checkUrl(user_profile.avatar) ? user_profile.avatar : `${global.url_media}${user_profile.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                       <View>
                         <Text numberOfLines={1} style={colorlbl}>{user_profile.text}</Text>
                       </View>
                   </View>}

             </View>
         </View>

         <View style={{padding:15}}>
         <FlatList
            extraData={this.state}
            data={showContent}
            keyExtractor={(item,index) => index}
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
         </View>


         <View style={[popupLocChange,topLocChange,showLoc ? show :hide]}>
         <FlatList
            extraData={this.state}
            data={listContent}
            keyExtractor={(item,index) => index}
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
         </View>

         <View style={[popupLocChange,topUserChange,showUser ? show :hide]}>
         <FlatList
            extraData={this.state}
            data={listUser}
            keyExtractor={(item,index) => index}
            renderItem={({item}) =>(
              <TouchableOpacity onPress={()=>{this.setState({ user_profile:item,showUser:false,txtUser:'' })}} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <View style={{flexDirection:'row',maxWidth:width-50}}>
                      <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                      <View>
                        <Text numberOfLines={1} style={colorlbl}>{item.text}</Text>
                      </View>
                  </View>
              </TouchableOpacity>
            )} />
         </View>


        </View>
    );
  }
}
