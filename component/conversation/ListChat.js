/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import getEncodeApi from '../api/getEncodeApi';
import global from '../global';
import connectIC from '../../src/icon/ic-connect.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import closeIC from '../../src/icon/ic-close.png';
import arrowPreviewIC from '../../src/icon/ic-arrow-preview.png';
import {checkUrl} from '../libs';

export default class ListChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listFriend:[],
      listSuggestFriend:[],
      showSuggest:false,
    };
    this.getListFriend();
  }

  getListFriend(){
    const { user_id } = this.props;
    const url = `${global.url_node}${'list-friend/'}${user_id}/1`;
    console.log(url);
    getEncodeApi(url).then(e=>{
      this.setState({listFriend:[e.data]})
    })
  }

  render() {
    const { user_id,navigation,avatar } = this.props;
    const { listFriend,showSuggest } = this.state;
    //console.log('listFriend',listFriend);
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,wrapConnect,show,hide,
      itemCenter,bgWhite,
    } = styles;

    return (
      <View style={container}>
        <View style={contentWrap}>

            <View style={[showSuggest===false ? show : hide]}>
              <TouchableOpacity style={wrapConnect}
              onPress={()=>this.setState({showSuggest:true})}>
                <View style={itemCenter}>
                <Image source={connectIC} style={{width:18,height:18,marginRight:7}} />
                <Text style={colorName}>Gợi ý kết bạn</Text>
                </View>
                <Image source={arrowNextIC} style={{width:18,height:18}} />
              </TouchableOpacity>

              <View>
              {listFriend.length>0 ?
                <FlatList
                   extraData={this.state}
                   keyExtractor={(item, index) => index.toString()}
                   data={listFriend}
                   renderItem={({item}) => (
                     <View style={bgWhite}>
                     <TouchableOpacity style={[wrapItems]}
                     onPress={()=>navigation.navigate('MessengerScr',{user_id,yf_id:item.user_id,yf_avatar:item.urlhinh,name:item.name,port_connect:user_id<item.user_id ? `${user_id}_${item.user_id}` : `${item.user_id}_${user_id}`})}>
                       {/*<Image source={{uri: checkUrl(item.urlhinh) ? `${item.urlhinh}` : `${global.url_media}/${item.urlhinh}`}} style={{width:50,height:50,borderRadius:25,marginRight:7}} />
                       <Text style={colorName}>{item.name}</Text>*/}
                     </TouchableOpacity>
                     </View>
                )} />

                :
                <View></View>
              }
              </View>
            </View>

            <View style={showSuggest ? show : hide}>
              <TouchableOpacity style={wrapConnect}
              onPress={()=>this.setState({showSuggest:false})}>
                <Image source={arrowPreviewIC} style={{width:18,height:18,marginRight:7}} />
                <Text style={colorName}>Kết bạn</Text>
                <View style={{flexDirection:'row'}}>
                </View>

              </TouchableOpacity>

              {listFriend.length>0 ?
                <FlatList
                   extraData={this.state}
                   keyExtractor={(item, index) => index.toString()}
                   data={listFriend}
                   renderItem={({item}) => (
                     <View style={[itemCenter,bgWhite]}>
                       <TouchableOpacity style={wrapItems}
                       onPress={()=>navigation.navigate('MessengerScr',{user_id,yf_id:item.user_id,yf_avatar:item.urlhinh,name:item.name,port_connect:user_id<item.user_id ? `${user_id}_${item.user_id}` : `${item.user_id}_${user_id}`})}>
                         {/*<Image source={{uri: checkUrl(item.urlhinh) ? `${item.urlhinh}` : `${global.url_media}/${item.urlhinh}`}} style={{width:50,height:50,borderRadius:25,marginRight:7}} />
                         <Text style={colorName}>{item.name}</Text>*/}
                       </TouchableOpacity>
                       <View style={itemCenter}>
                           <TouchableOpacity style={{flexDirection:'row',alignItems:'center',borderWidth:1,paddingLeft:10,paddingRight:10,padding:3,maxHeight:34,borderRadius:17,borderColor:'#5b89ab',marginRight:10}}
                           onPress={()=>this.addFriend(item.id,item.name,item.urlhinh)}>
                             <Text style={{color:'#5b89ab',fontSize:14}}>Đồng ý</Text>
                           </TouchableOpacity>
                            <TouchableOpacity>
                            <Image source={closeIC} style={{width:20,height:20}} />
                            </TouchableOpacity>
                       </View>
                     </View>
                )} />

                :
                <View></View>
              }
            </View>


        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  itemCenter:{flexDirection:'row',alignItems:'center'},
  wrapConnect:{

    backgroundColor:'#fff',
    width,padding:10,
    paddingBottom:15,
    paddingTop:15,
    marginBottom:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  contentWrap : { width,height,alignItems: 'center',justifyContent: 'flex-start',paddingBottom:70},
  wrapItems:{flexDirection:'row',width:width-110,alignItems:'center',padding:15},
  bgWhite:{backgroundColor:'#fff',marginBottom:1},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  colorName:{color:'#2F3540',fontSize:16},
  show : { display: 'flex'},
  hide : { display: 'none'},
})
