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

import onlineIC from '../../src/icon/ic-green/ic-online.png';

import {checkUrl,checkFriend,getGroup,getDistanceHours,getDistanceMinutes,getDistanceDays} from '../libs';
var element,timeoutHis;
class System extends Component {
  constructor(props) {
    super(props);
    element = this;
    this.state = {
      listSys:[],
      listAddFriend:{},
      loadMore:false,
      page:0,
      scrollPosition:0,
    };
    this.getSystem();
  }

  getSystem(page=null){
    const { id } = this.props.user_profile;
    if(page===null) page=0;
    const url = `${global.url_node}${'except-person/'}${id}${'?skip='}${page}${'&limit=20'}`;
    //console.log('getSystem',url);
    getEncodeApi(url).then(sys=>{
        this.state.listSys=page===0?sys.data: this.state.listSys.concat(sys.data);
        this.state.page += 20;
        this.state.loadMore = sys.data.length===20?true:false;
        this.setState(this.state);
    })
  }

  addFriend(friend_id){
    const { id } = this.props.user_profile;
    const url = `${global.url_node}${'add-friend'}`;
    const param = `${'id='}${id}&${'friend_id='}${friend_id}`;
    //console.log('(url,param)',url,param);
    postEncodeApi(url,param);
  }

  render() {
    const { user_profile, navigation, myFriends } = this.props;
    const { listSys,listAddFriend } = this.state;
    //console.log('listData',listData);
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,btnAdd,
    } = styles;

    return (
      <View style={container}>
        <View style={contentWrap}>
          <FlatList
             extraData={this.state}
             keyExtractor={item => item.id.toString()}
             data={listSys}
             onEndReachedThreshold={0.01}
             onEndReached={() => {
               if(this.state.loadMore){
                 this.setState({loadMore:false},()=>{
                   this.getSystem(this.state.page);
                 })
               }
             }}
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
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    myFriends:state.myFriends,
    user_profile:state.user_profile
  }
}

export default connect(mapStateToProps)(System);

const styles = StyleSheet.create({
  container: { width,height},
  btnAdd:{flexDirection:'row',alignItems:'center',borderWidth:1,paddingLeft:10,paddingRight:10,padding:3,maxHeight:34,borderRadius:17,borderColor:'#5b89ab'},
  contentWrap : { paddingBottom:Platform.OS==='ios' ? 100 : 130},
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

})
