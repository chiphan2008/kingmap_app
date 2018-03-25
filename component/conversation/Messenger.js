/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,TextInput,ScrollView,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import io from 'socket.io-client/dist/socket.io.js';
import Moment from 'moment';
import getApi from '../api/getApi';
import global from '../global';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import sendEmailIC from '../../src/icon/ic-send-email.png';

var element;
function checkUrl(url){
  return url.indexOf('http')!=-1;
}
export default class Messenger extends Component {
  constructor(props) {
    super(props);
    element = this;
    this.state = {
      listData:[],
      index_item:0,
      text:'',
      checkID:-1,
      checkDate:'',
    };
    this.socket = io(`${global.url_server}`,{jsonp:false});
    this.socket.on('replyMessage-'+this.props.navigation.state.params.port_connect,function(data){
      //console.log('data',data);
      const {listData,index_item, checkID, checkDate} = element.state;
      const { user_id } =element.props.navigation.state.params;
      let arr = [];
      let countID=0;
      let countDate='';
      //let countData ='';

      // load first have one array: data.length!==undefined
      if(data.length>listData.length && data.length!==undefined){
        data.forEach((e,i)=>{
          const countData = data[i+1];
          listData.push(<ListMsg showHour={countData===undefined || (e.user_id!==countData.user_id && formatHour(e.create_at)===formatHour(countData.create_at)) ? true : false} checkDate={countDate} checkID={countID} data={e} userId={user_id} key={i} />);
          countID=e.user_id;
          countDate = e.create_at;
          //console.log('data[]',i+1,data[i+1]);
        });
        arr = listData;
        element.setState({
            checkDate:countDate,
            checkID:countID,
            index_item: data.length,
            listData: arr,
        });
      }
      if(data.length===undefined){
        countID = checkID;
        countDate = checkDate;
        if(index_item>1){
          //load continue…: data.length===undefined
          listData.push(<ListMsg showHour={checkID!==data.user_id ? true : false} checkDate={countDate} checkID={countID} data={data} userId={user_id} key={index_item} />)
          arr = listData;
          countID = data.user_id;
          countDate = data.create_at;
        }else {
          //load first, but don’t have data: data.length===undefined
          arr = [<ListMsg showHour={true} checkDate={countDate} checkID={countID} data={data} userId={user_id} key={index_item} />]
        }
        element.setState({
            checkDate:countDate,
            checkID:countID,
            index_item: index_item + 1,
            listData: arr
        });
      }
      //console.log('index_item',index_item);
  	})

  }

  sendMessage(){
    const { port_connect,urlhinh,user_id } = this.props.navigation.state.params;
    const { text } = this.state;
    let data = {
      group:port_connect,
      user_id,
      message : text,
      urlhinh,
      //create_at:Moment(new Date()),
    }
    if(text==='') data={};
    this.socket.emit('sendMessage',port_connect,data);
    this.setState({text:''});
  }
  componentWillMount(){
    this.sendMessage();
  }
  render() {
    const { name,urlhinh } = this.props.navigation.state.params;
    const { navigation } = this.props;
    const { listData,text,index_item } = this.state;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,bottomSend,txtInput,

    } = styles;

    return (
      <View style={container}>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>{
                  navigation.goBack();
                }}>
                <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                </TouchableOpacity>
                  <Text style={titleCreate}> {`${name}`.toUpperCase()} </Text>
                <View></View>
            </View>
        </View>
        <ScrollView style={{width,marginTop:75}}>
        {index_item>1 ? listData : <View key={0}></View>}
        </ScrollView>

        <View style={bottomSend}>
        <TextInput
        underlineColorAndroid='transparent'
        placeholder={`${'Nhập nội dung ...'}`}
        onChangeText={(text) => this.setState({text})}
        onSubmitEditing={(event) => {
          if(text!==''){this.sendMessage()}
        }}
        value={text}
        style={txtInput} />
        <TouchableOpacity
        onPress={()=>{
          if(text!==''){this.sendMessage()}
        }}>
        <Image source={sendEmailIC} style={{width:20,height:20}} />
        </TouchableOpacity>

        </View>

      </View>
    );
  }
}
function formatDate(d){
  return Moment(d).format('DD/MM/YY');
}
function formatHour(h){
  return Moment(h).add(12, 'hours').format('HH:mm');
}
export class ListMsg extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {data, userId, checkID, checkDate, showHour} = this.props;
    //console.log('userId===data.user_id',userId,data.user_id);
    //console.log('showHour',showHour,data.message);
    const {
      wrapAva,radiusAva,wrapMsg,colorMsg,avatarRight,avatarLeft,
      msgLeft,msgRight,bgMe,show,hide,colorWhite,groupTop,wrapDate,
      lineDate,wrapDatePaging,groupTopRight,
    } = styles;
    return(
      <View>
      {data.message!==undefined ?
        <View style={{paddingLeft:10,paddingRight:10,marginBottom:7}}>
          <View style={[wrapDatePaging,formatDate(checkDate)!==formatDate(data.create_at) ? show :hide ]}>
            <View style={{borderRadius:10,backgroundColor:'#C5C4CE',padding:3,paddingLeft:5,paddingRight:5}}>
            <Text style={{color:'#fff',fontSize:12}}>{Moment(data.create_at).add(12, 'hours').format('DD/MM/YYYY')}</Text>
            </View>
            <View style={lineDate}></View>
          </View>

          <View style={[userId===data.user_id ? avatarRight : avatarLeft,checkID===data.user_id && userId===data.user_id ? groupTopRight : '']}>
            <View style={[wrapAva,userId===data.user_id || checkID===data.user_id ? hide : show]}>
              <Image source={{uri: checkUrl(data.urlhinh) ? `${data.urlhinh}` : `${global.url_media}/${data.urlhinh}`}} style={radiusAva} />
            </View>
            <View style={[wrapDate,userId===data.user_id ? msgRight : msgLeft,checkID===data.user_id  ? groupTop : '']}>
              <View style={[wrapMsg,userId===data.user_id ? bgMe : '']}>
                <Text style={userId===data.user_id ? colorWhite : colorMsg}>{data.message}</Text>
              </View>
              <View style={showHour ? show : hide}>
                <Text style={{color:'#6587A8',fontSize:12}}> {formatHour(data.create_at)}</Text>
              </View>

            </View>
          </View>

        </View>
        :
        <View></View>
      }

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  emp:{},
  contentWrap : { width},
  colorMsg:{color:'#2F353F',lineHeight:22},
  colorWhite:{color:'#fff',lineHeight:22},
  wrapMsg:{
    borderColor:'#E1E7EC',
    borderWidth:1,
    borderRadius:8,
    backgroundColor:'#fff',
    padding:10,
    paddingTop:5,
    paddingBottom:5,

  },
  lineDate:{width:width-110,borderBottomWidth:1,borderColor:'#C5C4CE',position:'absolute',top:11,zIndex:-1},
  wrapDate:{
    maxWidth:width-110,
    justifyContent:'center',
    position:'absolute',
    top:0,
  },
  wrapDatePaging:{width,alignItems:'center',marginBottom:10},
  groupTop:{top:-24},
  groupTopRight:{top:3},
  msgLeft:{left:60,},
  msgRight:{right:0},
  bgMe:{backgroundColor:'#303B50'},
  radiusAva:{width:50,height:50,borderRadius:25},
  wrapAva:{width:54,height:54,borderRadius:27,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'},
  avatarRight:{
    flexDirection:'row',
    width:width-25,
    alignItems:'flex-end',
    minHeight:50,
  },
  avatarLeft:{flexDirection:'row',width:width-25,alignItems:'flex-start',
    minHeight:30
  },
  wrapItems:{flexDirection:'row',width,alignItems:'center',padding:15,backgroundColor:'#fff',marginBottom:1},
  headCatStyle : {
      backgroundColor: '#D0021B',
      paddingTop: Platform.OS==='ios' ? 30 : 20,
      alignItems: 'center',height: 65,width,
      position:'absolute',zIndex:99,top:0
  },
  txtInput:{
    borderRadius:3,
    paddingLeft:10,paddingTop:5,paddingBottom:5,
    fontSize:16,
    width:width-50,
    borderWidth:0,
    borderColor:'#000',
    marginRight:10,
    marginBottom:5,
  },
  bottomSend:{
    width,height:50,
    backgroundColor:'#fff',
    borderColor:'#E1E7EC',
    borderTopWidth:1,
    position:'absolute',
    zIndex:999,bottom:Platform.OS==='ios' ? 0 : 25,
    flexDirection:'row',

    alignItems:'center',
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  colorName:{color:'#2F3540',fontSize:16},
  show : { display: 'flex'},
  hide : { display: 'none'},
})
