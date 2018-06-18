/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import getEncodeApi from '../api/getEncodeApi';
import postEncodeApi from '../api/postEncodeApi';
import global from '../global';
import ListChat from './ListChat';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import {checkUrl} from '../libs';

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData:[],
      yf_id:'',
      activeTab:'system',
    };
    this.getData();
  }

  getData(page=null){
    const { user_id } = this.props.navigation.state.params;
    if(page===null) page=0;
    const url = `${global.url_node}${'except-person/'}${user_id}${'?skip='}${page}${'&limit=20'}`;
    console.log(url);
    getEncodeApi(url).then(e=>{
      //console.log('e',e.data);
      if(page===0){
        this.state.listData=e.data;
      }else {
        this.state.listData.concat(e.data);
      }
      this.setState(this.state)
    })
  }
  addFriend(id,name,urlhinh){
    const { user_id } = this.props.navigation.state.params;
    const url = `${global.url_node}${'add-friend'}`;
    const param = `${'id='}${user_id}&${'user_id='}${id}&${'name='}${name}&${'urlhinh='}${urlhinh}`;
    //console.log('(url,param)',url,param);
    postEncodeApi(url,param);
  }
  render() {
    const { lang,name_module,user_id,avatar } = this.props.navigation.state.params;
    const { navigation } = this.props;
    const { listData,activeTab } = this.state;
    //console.log('listData',listData);
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,tabCenter,colorTabActive,wrapTab,borderActive,
      show, hide
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${name_module}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>
      <View style={{backgroundColor:'#fff',flexDirection:'row',borderBottomWidth:1,borderColor:'#E9E8EF'}}>
        <TouchableOpacity style={[wrapTab,activeTab==='system' ? borderActive : '']}
        onPress={()=>{this.setState({activeTab:'system'})}}>
        <Text style={[activeTab==='system' ? colorTabActive : colorName,tabCenter]}> Hệ thống </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[wrapTab,activeTab==='contact' ? borderActive : '']}
        onPress={()=>{this.setState({activeTab:'contact'})}}>
        <Text style={[activeTab==='contact' ? colorTabActive : colorName,tabCenter]}> Danh bạ </Text>
        </TouchableOpacity>
      </View>

        <View style={[contentWrap,activeTab==='system' ? show : hide]}>
        {listData.length>0 ?
          <View>

          <FlatList
             extraData={this.state}
             keyExtractor={(item, index) => index.toString()}
             data={listData}
             renderItem={({item}) => (
               <View style={wrapItems}>
               <TouchableOpacity style={{flexDirection:'row',alignItems:'center',width:width-105}}
               onPress={()=>navigation.navigate('MessengerScr',{user_id,yf_id:item.id,yf_avatar:item.urlhinh,name:item.name,port_connect:user_id<item.id ? `${user_id}_${item.id}` : `${item.id}_${user_id}`})}>
                 <Image source={{uri: checkUrl(item.urlhinh) ? `${item.urlhinh}` : `${global.url_media}/${item.urlhinh}`}} style={{width:50,height:50,borderRadius:25,marginRight:7}} />
                 <Text style={colorName}>{item.name}</Text>
               </TouchableOpacity>

               <TouchableOpacity style={{flexDirection:'row',alignItems:'center',borderWidth:1,paddingLeft:10,paddingRight:10,padding:3,maxHeight:34,borderRadius:17,borderColor:'#5b89ab'}}
               onPress={()=>this.addFriend(item.id,item.name,item.urlhinh)}>
                 <Text style={{color:'#5b89ab',fontSize:14}}>Kết bạn</Text>
               </TouchableOpacity>
               </View>
          )} />
          </View>

          :
          <View></View>
        }
        </View>

        <View style={activeTab==='contact' ? show : hide}>
          <ListChat
          user_id={user_id}
          navigation={this.props.navigation}
          avatar={avatar}/>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height
  },
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
  wrapTab:{width:width/2,padding:10,borderBottomWidth:1},
  borderActive:{borderColor:'#5b89ab',borderBottomWidth:2},
  tabCenter:{textAlign:'center'},
  show : { display: 'flex'},
  hide : { display: 'none'},
})
