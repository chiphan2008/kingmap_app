/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,FlatList,
} from 'react-native';
import {connect} from 'react-redux';
//import io from 'socket.io-client/dist/socket.io.js';
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
var element,timeoutHis;
class Contact extends Component {
  constructor(props) {
    super(props);
    element = this;
    this.countSuggest=0;
    this.getListFriend();
    this.getStaticFriend();
  }

  getStaticFriend(){
    const { id } = this.props.user_profile;
    const url = `${global.url_node}${'static-friend/'}${id}`;
    getEncodeApi(url).then(staticfr=>{
      // this.countSuggest= staticfr.data.length;
      this.props.dispatch({type: 'UPDATE_COUNT_SUGGEST', count_suggest: staticfr.data.length})
    })
  }

  getListFriend(){
    const { id } = this.props.user_profile;
    const url = `${global.url_node}${'list-friend/'}${id}`;
    getEncodeApi(url).then(friends=>{
      friends.data.length>0 && this.props.dispatch({type:'UPDATE_MY_FRIENDS',myFriends:friends.data});
    })
  }

  addFriend(friend_id){
    const { id } = this.props.user_profile;
    const url = `${global.url_node}${'add-friend'}`;
    const param = `${'id='}${id}&${'friend_id='}${friend_id}`;
    //console.log('(url,param)',url,param);
    postEncodeApi(url,param).then((e)=>{
      this.getListFriend();
    });
  }
  removeFriend(friend_id){
    const { id } = this.props.user_profile;
    const url = `${global.url_node}${'unfriend'}`;
    const param = `${'id='}${id}&${'friend_id='}${friend_id}`;
    postEncodeApi(url,param).then(()=>{
      this.getListFriend();
    });
  }

  render() {
    const { user_profile, navigation,myFriends } = this.props;
    const { container } = styles;
    return (
      <View style={container}>
        <ListChat
        addFriend={this.addFriend.bind(this)}
        removeFriend={this.removeFriend.bind(this)}
        user_id={user_profile.id}
        countSuggest={this.countSuggest}
        navigation={this.props.navigation}
        avatar={user_profile.avatar}/>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user_profile:state.user_profile
  }
}

export default connect(mapStateToProps)(Contact);

const styles = StyleSheet.create({
  container: { width,height},
})
