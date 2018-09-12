/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,FlatList,TextInput
} from 'react-native';
import {connect} from 'react-redux';
import io from 'socket.io-client/dist/socket.io.js';
const {height, width} = Dimensions.get('window');
import Moment from 'moment';
import getEncodeApi from '../api/getEncodeApi';
import postEncodeApi from '../api/postEncodeApi';
import global from '../global';

import onlineIC from '../../src/icon/ic-green/ic-online.png';
import searchIC from '../../src/icon/ic-gray/ic-search.png';

import {checkUrl,checkFriend,getGroup,getDistanceHours,getDistanceMinutes,getDistanceDays} from '../libs';
var element,timeoutHis;
class HistoryChat extends Component {
  constructor(props) {
    super(props);
    element = this;
    this.state = {
      listHis:[],
      valSearch:'',
    };
    const { id } = this.props.user_profile;
    this.socket = io(`${global.url_server}`,{jsonp:false});
    this.socket.on('updateHistory-'+id,function(data){
      if(data.update){
        timeoutHis = setTimeout(function () {
          element.getHistory();
        }, 1500);
      }
    })
    this.getHistory();
  }

  getHistory(page=null){
    //this.getListFriend();
    const { id } = this.props.user_profile;
    if(page===null) page=0;
    const url = `${global.url_node}${'history-chat/'}${id}${'?skip='}${page}${'&limit=20'}`;
    getEncodeApi(url).then(hs=>{
      //console.log('getHistory',hs);
      this.state.listHis=page===0?hs.data:this.state.listHis.concat(hs.data);
        this.setState(this.state);
    })
  }

  componentDidUpdate(){
    if(this.props.detailBack==='UpdateHistoryChat'){
      this.props.dispatch({type:'DETAIL_BACK',detailBack:''});
      this.getHistory();
    }
  }


  _onLongPressHis(id,name){

  }

  render() {
    const { navigation,user_profile } = this.props;
    const { listHis } = this.state;
    const {
      container,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,inputSearch
    } = styles;

    return (
      <View style={container}>
        <View style={{padding:3,alignItems:'center',justifyContent:'center',marginBottom:3}}>
            <TextInput underlineColorAndroid='transparent'
            placeholder={'Search...'} style={inputSearch}
            onSubmitEditing={() => {
            }}
            onChangeText={(valSearch) => this.setState({valSearch})}
            value={this.state.valSearch} />

            {/*<TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
            onPress={()=>{
              if (this.state.valSearch.trim()!=='') {
                navigate('SearchScr',{keyword:this.state.valSearch,lat:yourCurLoc.latitude,lng:yourCurLoc.longitude,idCat:'',lang:this.state.lang.lang});
                this.setState({valSearch:''})
              }
            }}>
              <Image style={{width:16,height:16,}} source={searchIC} />
            </TouchableOpacity>*/}
        </View>

          <FlatList
             extraData={this.state}
             keyExtractor={(item, index) => index.toString()}
             data={listHis}
             renderItem={({item,index}) => (
               <View style={wrapItems}>
               <TouchableOpacity style={{flexDirection:'row',alignItems:'center',width:width-105}}
                onPress={()=>{
                 navigation.navigate('MessengerScr',{id:user_profile.id,friend_id:item.id,yf_avatar:item.urlhinh,name:item.name,port_connect:getGroup(user_profile.id,item.id)})
                }}
                onLongPress={()=>this._onLongPressHis(item.id,item.name)}
                >
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
                 {getDistanceHours(item.update_at)<24 && getDistanceHours(item.update_at)>1 &&
                   <Text style={{fontSize:14}}>{getDistanceHours(item.update_at)} giờ</Text>}
                 {getDistanceDays(item.update_at)>1 &&
                   <Text style={{fontSize:14}}>{getDistanceDays(item.update_at)} ngày</Text>}
               </View>

               </View>
          )} />

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    detailBack:state.detailBack,
    user_profile:state.user_profile
  }
}

export default connect(mapStateToProps)(HistoryChat);

const styles = StyleSheet.create({
  container: { width,height},
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
  inputSearch : {
    marginTop: 3,width:width-10,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
})
