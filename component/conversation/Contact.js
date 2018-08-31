/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,FlatList,
} from 'react-native';
import {connect} from 'react-redux';
const {height, width} = Dimensions.get('window');
import Moment from 'moment';
import getEncodeApi from '../api/getEncodeApi';
import postEncodeApi from '../api/postEncodeApi';
import global from '../global';
import ListChat from './ListChat';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import chatIC from '../../src/icon/ic-blue/ic-chat.png';
import userIC from '../../src/icon/ic-blue/ic-user.png';
import groupIC from '../../src/icon/ic-blue/ic-group.png';
import onlineIC from '../../src/icon/ic-green/ic-online.png';
import {checkUrl,checkFriend,getGroup,getDistanceHours,getDistanceMinutes,getDistanceDays} from '../libs';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSys:[],
      listHis:[],
      listAddFriend:{},
      yf_id:'',
      activeTab:'history',
    };
    this.getListFriend();
    this.getHistory();
  }
  getListFriend(){
    const { user_id } = this.props.navigation.state.params;
    const url = `${global.url_node}${'list-friend/'}${user_id}`;
    getEncodeApi(url).then(friends=>{
      friends.data.length>0 && this.props.dispatch({type:'UPDATE_MY_FRIENDS',myFriends:friends.data});
    })
  }
  
  getHistory(page=null){
    const { user_id } = this.props.navigation.state.params;
    if(page===null) page=0;
    const url = `${global.url_node}${'history-chat/'}${user_id}${'?skip='}${page}${'&limit=20'}`;
    getEncodeApi(url).then(hs=>{
      //console.log('getHistory',hs);
      if(page===0){
        this.state.listHis=hs.data;
      }else {
        this.state.listHis.concat(hs.data);
      }
        this.setState(this.state);
    })
  }
  getSystem(page=null){
    const { user_id } = this.props.navigation.state.params;
    if(page===null) page=0;
    const url = `${global.url_node}${'except-person/'}${user_id}${'?skip='}${page}${'&limit=20'}`;
    console.log(url);
    getEncodeApi(url).then(sys=>{
      //console.log('e',e.data);
        if(page===0){
          this.state.listSys=sys.data;
        }else {
          this.state.listSys.concat(sys.data);
        }
          this.setState(this.state);
    })
  }
  addFriend(friend_id){
    const { user_id } = this.props.navigation.state.params;
    const url = `${global.url_node}${'add-friend'}`;
    const param = `${'id='}${user_id}&${'friend_id='}${friend_id}`;
    //console.log('(url,param)',url,param);
    postEncodeApi(url,param).then((e)=>{
      this.getListFriend();
    });
  }
  removeFriend(friend_id){
    const { user_id } = this.props.navigation.state.params;
    const url = `${global.url_node}${'unfriend'}`;
    const param = `${'id='}${user_id}&${'friend_id='}${friend_id}`;
    postEncodeApi(url,param).then(()=>{
      this.getListFriend();
    });
  }
  render() {
    const { lang,name_module,user_id,avatar } = this.props.navigation.state.params;
    const { navigation,myFriends } = this.props;
    const { listSys,listHis,activeTab,listAddFriend,friends } = this.state;
    //console.log('listData',listData);
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,tabCenter,colorTabActive,wrapTab,borderActive,
      show, hide,btnAdd,
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${name_module}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>
      <View style={{backgroundColor:'#fff',flexDirection:'row'}}>

        <TouchableOpacity style={[wrapTab,activeTab==='history' ? borderActive : '']}
        onPress={()=>{
          activeTab!=='history' && this.setState({activeTab:'history'})
        }}>
        <Image source={chatIC} style={{width:25,height:25}} />
        </TouchableOpacity>

        <TouchableOpacity style={[wrapTab,activeTab==='contact' ? borderActive : '']}
        onPress={()=>{
          activeTab!=='contact' && this.setState({activeTab:'contact'})
        }}>
        <Image source={userIC} style={{width:25,height:25}} />
        </TouchableOpacity>

        <TouchableOpacity style={[wrapTab,activeTab==='system' ? borderActive : '']}
        onPress={()=>{
          activeTab!=='system' && this.setState({activeTab:'system'},()=>{
            this.state.listSys.length===0 && this.getSystem();
          })
        }}>
        <Image source={groupIC} style={{width:25,height:25}} />
        {/*<Text style={[activeTab==='system' ? colorTabActive : colorName,tabCenter]}> Hệ thống </Text>*/}
        </TouchableOpacity>

      </View>

        <View style={[contentWrap,activeTab==='history' ? show : hide]}>
        {listHis.length>0 ?
          <View>
          <FlatList
             extraData={this.state}
             keyExtractor={(item, index) => index.toString()}
             data={listHis}
             renderItem={({item,index}) => (
               <View style={wrapItems}>
               <TouchableOpacity style={{flexDirection:'row',alignItems:'center',width:width-105}}
               onPress={()=>{
                 navigation.navigate('MessengerScr',{id:user_id,friend_id:item.id,yf_avatar:item.urlhinh,name:item.name,port_connect:getGroup(user_id,item.id)})
                }}>
                <View>
                 <Image source={{uri: checkUrl(item.urlhinh) ? `${item.urlhinh}` : `${global.url_media}${item.urlhinh}`}} style={{width:50,height:50,borderRadius:25,marginRight:7}} />
                 {Moment(item.online_at)===Moment(item.offline_at) &&
                 <Image source={onlineIC} style={{width:10,height:10,position:'absolute',right:10,top:40}} />}
                 </View>
                 <View>
                  <Text style={colorName}>{item.name}</Text>
                  <Text style={{fontSize:14}}>{item.last_message}</Text>
                 </View>
               </TouchableOpacity>

               <View>
                 {getDistanceMinutes(item.update_at)<60 &&
                   <Text style={{fontSize:14}}>{getDistanceMinutes(item.update_at)} phút</Text>}
                 {getDistanceHours(item.update_at)<24 &&
                   <Text style={{fontSize:14}}>{getDistanceHours(item.update_at)} giờ</Text>}
                 {getDistanceDays(item.update_at)>1 &&
                   <Text style={{fontSize:14}}>{getDistanceDays(item.update_at)} ngày</Text>}
               </View>

               </View>
          )} />
          </View>

          :
          <View></View>
        }
        </View>

        <View style={[contentWrap,activeTab==='system' ? show : hide]}>
        {listSys.length>0 ?
          <View>
          <FlatList
             extraData={this.state}
             keyExtractor={(item, index) => index.toString()}
             data={listSys}
             renderItem={({item,index}) => (
               <View style={wrapItems}>
               <TouchableOpacity style={{flexDirection:'row',alignItems:'center',width:width-105}}
               onPress={()=>{
                 //navigation.navigate('MessengerScr',{id:user_id,friend_id:item.id,yf_avatar:item.urlhinh,name:item.name,port_connect:getGroup(user_id,item.id)})
                }}>
                <View>
                 <Image source={{uri: checkUrl(item.urlhinh) ? `${item.urlhinh}` : `${global.url_media}${item.urlhinh}`}} style={{width:50,height:50,borderRadius:25,marginRight:7}} />
                 {Moment(item.online_at)===Moment(item.offline_at) &&
                 <Image source={onlineIC} style={{width:10,height:10,position:'absolute',right:10,top:40}} />}
                 </View>
                 <Text style={colorName}>{item.name}</Text>
               </TouchableOpacity>
               {console.log(checkFriend(myFriends,item.id))}
               {(!checkFriend(myFriends,item.id) && listAddFriend[`${item.id}`]!==item.id) &&
               <TouchableOpacity style={btnAdd}
               onPress={()=>{this.setState({listAddFriend:Object.assign(this.state.listAddFriend,{[`${item.id}`]:item.id})},()=>{
                   this.addFriend(item.id)
                })
               }}>
                 <Text style={{color:'#5b89ab',fontSize:14}}>Kết bạn</Text>
               </TouchableOpacity>}
               </View>
          )} />
          </View>

          :
          <View></View>
        }
        </View>

        {activeTab==='contact' &&
        <View style={activeTab==='contact'?show:hide}>
          <ListChat
          addFriend={this.addFriend.bind(this)}
          removeFriend={this.removeFriend.bind(this)}
          user_id={user_id}
          navigation={this.props.navigation}
          avatar={avatar}/>
        </View>}

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {myFriends:state.myFriends}
}

export default connect(mapStateToProps)(Contact);

const styles = StyleSheet.create({
  container: {
    width,
    height
  },
  btnAdd:{flexDirection:'row',alignItems:'center',borderWidth:1,paddingLeft:10,paddingRight:10,padding:3,maxHeight:34,borderRadius:17,borderColor:'#5b89ab'},
  contentWrap : { width,alignItems: 'center',justifyContent: 'center',paddingBottom:Platform.OS==='ios' ? 100 : 130},
  wrapItems:{flexDirection:'row',width,justifyContent:'space-between',padding:15,backgroundColor:'#fff',marginBottom:1,alignItems:'center'},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  colorName:{color:'#2F3540',fontSize:16},
  colorTabActive:{color:'#5b89ab',fontSize:16,fontWeight:'400'},
  wrapTab:{width:width/3,padding:10,borderBottomWidth:1,borderColor:'#DDD',justifyContent:'center',alignItems:'center'},
  borderActive:{borderColor:'#5b89ab',borderBottomWidth:2},
  tabCenter:{textAlign:'center'},
  show : { display: 'flex'},
  hide : { display: 'none'},
})
