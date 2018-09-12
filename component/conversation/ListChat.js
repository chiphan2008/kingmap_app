/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,FlatList,TextInput
} from 'react-native';
import {connect} from 'react-redux';
const {height, width} = Dimensions.get('window');
import getEncodeApi from '../api/getEncodeApi';
import global from '../global';
import connectIC from '../../src/icon/ic-connect.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import closeIC from '../../src/icon/ic-close.png';
import arrowPreviewIC from '../../src/icon/ic-arrow-preview.png';
import searchIC from '../../src/icon/ic-gray/ic-search.png';
import {checkUrl,getGroup} from '../libs';

class ListChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listFriend:[],
      listSuggestFriend:[],
      showSuggest:false,
      valSearch:'',
    };
    this.getListFriend();
  }

  getListFriend(status='accept'){
    const { user_id } = this.props;
    const url = `${global.url_node}${'list-friend/'}${user_id}/${status}`;
    console.log(url);
    getEncodeApi(url).then(lf=>{
      if(status==='accept') {
        this.state.listFriend=lf.data;
      }
      if(status==='request') this.state.listSuggestFriend=lf.data;
      this.setState(this.state);
    })
  }
  actFriend(route,id,index){
    this.state.listSuggestFriend.splice(index,1);
    if(route==='un'){
      this.props.removeFriend(id);
    }else {
      this.props.addFriend(id)
    }
    this.setState(this.state,()=>{
      this.getListFriend();
    })
  }
  // componentWillMount(){
  //   this.getListFriend('request');
  // }
  render() {
    const { user_id,navigation,avatar,countSuggest } = this.props;
    const { listFriend,showSuggest,listSuggestFriend } = this.state;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,wrapConnect,show,hide,
      itemCenter,bgWhite,inputSearch
    } = styles;

    return (
      <View style={container}>
        <View style={contentWrap}>

            <View style={[showSuggest===false ? show : hide]}>
              <TouchableOpacity style={wrapConnect}
              onPress={()=>this.setState({showSuggest:true},()=>{
                this.getListFriend('request');
              })}>
                <View style={itemCenter}>
                <Image source={connectIC} style={{width:18,height:18,marginRight:7}} />
                <Text style={colorName}>Gợi ý kết bạn ({countSuggest})</Text>
                </View>
                <Image source={arrowNextIC} style={{width:18,height:18}} />
              </TouchableOpacity>

              <View style={{padding:3,alignItems:'center',justifyContent:'center',marginBottom:3,marginTop:3}}>
                  <TextInput underlineColorAndroid='transparent'
                  placeholder={'Search...'} style={inputSearch}
                  onSubmitEditing={() => {
                  }}
                  onChangeText={(valSearch) => this.setState({valSearch})}
                  value={this.state.valSearch} />

                  {/*<TouchableOpacity style={{top:Platform.OS==='ios' ? 65 : 70,left:(width-30),position:'absolute'}}
                  onPress={()=>{
                    if (this.state.valSearch.trim()!=='') {
                      navigate('SearchScr',{keyword:this.state.valSearch,lat:yourCurLoc.latitude,lng:yourCurLoc.longitude,idCat:'',lang:this.state.lang.lang});
                      this.setState({valSearch:''})
                    }
                  }}>
                    <Image style={{width:16,height:16,}} source={searchIC} />
                  </TouchableOpacity>*/}
              </View>

              <View style={{height:Platform.OS==='ios'? height-205 : height-250}}>
              {listFriend.length>0 ?
                <FlatList
                   extraData={this.state}
                   keyExtractor={(item, index) => index.toString()}
                   data={listFriend}
                   renderItem={({item}) => (
                     <View style={bgWhite}>
                     <TouchableOpacity style={[wrapItems]}
                     onPress={()=>navigation.navigate('MessengerScr',
                     {id:user_id,friend_id:item.id,yf_avatar:item.urlhinh,name:item.name,port_connect:getGroup(user_id,item.id)})}
                     onLongPress={()=>alert('onLongPress')}
                     >
                       <Image source={{uri: checkUrl(item.urlhinh) ? `${item.urlhinh}` : `${global.url_media}/${item.urlhinh}`}} style={{width:50,height:50,borderRadius:25,marginRight:7}} />
                       <Text style={colorName}>{item.name}</Text>
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

              {listSuggestFriend.length>0 ?
                <FlatList
                   extraData={this.state}
                   keyExtractor={(item, index) => index.toString()}
                   data={listSuggestFriend}
                   renderItem={({item,index}) => (
                     <View style={[itemCenter,bgWhite]}>
                       <TouchableOpacity style={wrapItems}
                       onPress={()=>navigation.navigate('MessengerScr',{id:user_id,friend_id:item.id,yf_avatar:item.urlhinh,name:item.name,port_connect:getGroup(user_id,item.id)})}>
                         <Image source={{uri: checkUrl(item.urlhinh) ? `${item.urlhinh}` : `${global.url_media}/${item.urlhinh}`}} style={{width:50,height:50,borderRadius:25,marginRight:7}} />
                         <Text style={colorName}>{item.name}</Text>
                       </TouchableOpacity>
                       <View style={itemCenter}>
                           <TouchableOpacity style={{flexDirection:'row',alignItems:'center',borderWidth:1,paddingLeft:10,paddingRight:10,padding:3,maxHeight:34,borderRadius:17,borderColor:'#5b89ab',marginRight:10}}
                           onPress={()=>this.actFriend('add',item.id,index)}>
                             <Text style={{color:'#5b89ab',fontSize:14}}>Đồng ý</Text>
                           </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.actFriend('un',item.id,index)}>
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

const mapStateToProps = (state) => {
  return {myFriends:state.myFriends}
}

export default connect(mapStateToProps)(ListChat);

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
    //marginBottom:10,
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
  inputSearch : {
    width:width-10,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  colorName:{color:'#2F3540',fontSize:16},
  show : { display: 'flex'},
  hide : { display: 'none'},
})
