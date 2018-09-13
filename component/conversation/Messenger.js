/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,TextInput,ScrollView,Keyboard,Modal,
  RefreshControl
} from 'react-native';
import {connect} from 'react-redux';
const {height, width} = Dimensions.get('window');
import io from 'socket.io-client/dist/socket.io.js';
import Moment from 'moment';
import getEncodeApi from '../api/getEncodeApi';
import postEncodeApi from '../api/postEncodeApi';
import global from '../global';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import sendEmailIC from '../../src/icon/ic-send-email.png';
import attachIC from '../../src/icon/ic-blue/ic-attach.png';
import microIC from '../../src/icon/ic-blue/ic-micro.png';
import musicIC from '../../src/icon/ic-blue/ic-music.png';
import pictureIC from '../../src/icon/ic-blue/ic-picture.png';
import videoCallIC from '../../src/icon/ic-blue/ic-video-call.png';
import videoClipIC from '../../src/icon/ic-blue/ic-video-clip.png';

import {checkUrl,formatDate,formatHour,checkFriendAccept,getGroup} from '../libs';

var element,timeoutHis,timeoutShowType;
class Messenger extends Component {
  constructor(props) {
    super(props);
    element = this;
    this.state = {
      isFriend:false,
      listData:[],
      index_item:0,
      text:'',
      checkID:-1,
      checkDate:'',
      showType:false,
      myID:'',
      activeKeyboard:25,
      scrollHeight:0,
      socketID:'',
      visible:true,
      refreshing:true,
    };
    const {port_connect} = this.props.navigation.state.params;
    this.loadHistoryChat();

    this.socket = io(`${global.url_server}`,{jsonp:false});
    this.socket.on('replyStatus-'+port_connect,function(data){
      clearTimeout(timeoutShowType);
      if(data.showType!==undefined){
        console.log('showType',data);
        timeoutShowType = setTimeout(()=>{
          element.setState({showType:data.showType,myID:data.id})
        },500)
      }
    })
    this.socket.on('replyMessage-'+port_connect,function(data){
      console.log('replyMessage',data);
      // load first have one array: data.length!==undefined
      if(data.message!==undefined && data.message!=='' && data.socketID !== element.state.socketID){

        const {listData,index_item, checkID, checkDate} = element.state;
        const { id,name,yf_avatar } =element.props.navigation.state.params;
        let arr = element.state.listData;
        let countID=0;
        let countDate='';

        countID = checkID;
        countDate = checkDate;
        // if(index_item>1){
        //   //load continue…: data.length===undefined
        //
        // }else {
        //   //load first, but don’t have data: data.length===undefined
        //   arr = [<ListMsg name={name} showHour={true} index={index_item} checkDate={countDate} checkID={countID} data={data} userId={id} key={index_item} yf_avatar={yf_avatar} />]
        // }
        console.log('load continue',index_item);
        arr.push(<ListMsg name={name} showHour={checkID!==data.id ? true : false}
          checkDate={countDate} checkID={countID}
          data={data} userId={id} index={index_item}
          key={index_item} yf_avatar={yf_avatar} />)
        countID = data.id;
        countDate = data.create_at;

        element.setState({
            checkDate:countDate,
            checkID:countID,
            index_item: index_item + 1,
            listData:arr,
            showType:false,
            socketID:data.socketID
        },()=>{element.addHistory(data.message,data.create_at);});
      }
      //console.log('index_item',index_item);
  	})

  }
  addHistory(message,dateNow){
    // add-history
    clearTimeout(timeoutHis);
    const { id,friend_id } = element.props.navigation.state.params;
    const url = `${global.url_node}${'add-history'}`;
    const param = `${'id='}${id}&${'friend_id='}${friend_id}&${'message='}${message}&${'dateNow='}${dateNow}`;
    //console.log('(url,param)',url,param);
    postEncodeApi(url,param);
    
  }
  loadHistoryChat(page=null){
    const { id,name,yf_avatar,port_connect } = element.props.navigation.state.params;
    if(page===null) page=0;
    const url = `${global.url_node}${'conversation/'}${port_connect}${'?skip='}${page}${'&limit=20'}`;
    //console.log(url);
    getEncodeApi(url).then(hischat=>{
      let arr = [];
      let countID=0;
      let countDate='';
      //console.log(hischat.data.length);
      hischat.data.sort(function(a, b){return (a.create_at<b.create_at?-1:1)})
      hischat.data.map((e,i)=>{
        const countData = hischat.data[i+1];
        //console.log('countData');
        arr.push(<ListMsg name={name}
          showHour={countData===undefined || e.id!==countData.id || (e.id===countData.id && formatHour(e.create_at)!==formatHour(countData.create_at) )  ? true : false}
          checkDate={countDate} checkID={countID} data={e} index={i} userId={id} key={i} yf_avatar={yf_avatar} />);
          countID=e.id;
          countDate = e.create_at;
        //console.log('data[]',i+1,data[i+1]);
      });
      //arr = arr;
      element.setState({
          checkDate:countDate,
          checkID:countID,
          index_item: hischat.data.length,
          listData: arr,
          showType:false,
      });
      // setTimeout(()=>{
      //
      // },800)
    })
  }

  componentWillMount(){
    const { port_connect,id,yf_avatar,friend_id } = this.props.navigation.state.params;
    //console.log(this.props.myFriends,friend_id);
    if(checkFriendAccept(this.props.myFriends,friend_id)){
      this.sendMessage();
    }
  }

  sendMessage(){
    const { port_connect,id,yf_avatar,friend_id } = this.props.navigation.state.params;
    const { text } = this.state;
    let data = {
      group:port_connect,
      id,
      friend_id,
      message : text,
      urlhinh: yf_avatar,
      //create_at:Moment(new Date())
    }
    // if(text==='') data={
    //   friend_id:friend_id,
    //   notification:'Bạn chưa thể gửi tin nhắn cho người này. Vui lòng gửi yêu cầu kết bạn.'
    // };
    if(checkFriendAccept(this.props.myFriends,friend_id)){
      this.socket.emit('sendMessage',port_connect,data);
      this.setState({text:''});
    }


  }
  handleEnterText(showType){
    const { id,port_connect } = this.props.navigation.state.params;
    const data = {showType,id}
    this.socket.emit('handleEnterText',port_connect,data);
  }

  componentDidMount(){
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = (e) => {
    this.setState({activeKeyboard:e.endCoordinates.height+25});
  }

  _keyboardDidHide = () => {
    this.setState({activeKeyboard:25});
  }
  _onRefresh = () => {
    //console.log('_onRefresh');
  }
  render() {
    const { id,friend_id,yf_avatar,name,port_connect } = this.props.navigation.state.params;
    //console.log(id,friend_id,yf_avatar,name,port_connect);
    const { navigation } = this.props;
    const { listData,text,index_item,showType,myID,activeKeyboard,scrollHeight,visible } = this.state;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,bottomSend,txtInput,show,hide,
      wrapShowType
    } = styles;

    return (
      visible &&
      <Modal onRequestClose={() => null} transparent animationType={'none'} visible>
      <View style={container}>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>{
                  this.props.dispatch({type:'DETAIL_BACK',detailBack:'UpdateHistoryChat'});
                  //this.handleEnterText(false);
                  this.setState({visible:false},()=>{
                    navigation.goBack();
                  })
                }} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                  <Text style={titleCreate}> {`${name}`.toUpperCase()} </Text>
                <View></View>
            </View>
        </View>

        <ScrollView
        onContentSizeChange={(contentWidth, contentHeight)=>{
          //console.log('contentHeight',contentHeight);
          this.setState({scrollHeight:contentHeight},()=>{
            this.scrollView.scrollToEnd({animated: false});
          })
        }}
        horizontal={false}
        ref={(scrollView) => { this.scrollView = scrollView }}
        //scrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        //stickyHeaderIndices={[0]}
        >
        <View style={{width,marginTop: 70}}>
          {index_item>0 ? listData : <View key={0}></View>}
        </View>
          <View style={{height:activeKeyboard,width}}></View>
        </ScrollView>
        {showType && id!==myID &&
        <View style={[wrapShowType,{bottom:Platform.OS==='ios' ? activeKeyboard+50 : activeKeyboard+75}]}>
          <Text style={{fontSize:12,fontStyle:'italic',color:'#fff'}}>{name} đang nhập ...</Text>
        </View>}
        <View style={{
          width,
          backgroundColor:'#fff',
          borderColor:'#E1E7EC',
          borderTopWidth:1,
          position:'relative',
          zIndex:9999,bottom:Platform.OS==='ios'? activeKeyboard-25: activeKeyboard,
        }}>

          <View style={{flexDirection:'row',alignItems:'center',height:50,paddingTop:5}}>
              <TextInput underlineColorAndroid='transparent'
              placeholder={`${'Nhập nội dung ...'}`}
              onChangeText={(text) => {
                this.setState({text})
                if(text.length===1 && showType===false){
                  this.handleEnterText(true)
                }
                if(text.length===0){
                  this.handleEnterText(false)
                }
              }}
              onSubmitEditing={(event) => {
                if(text!==''){
                  this.sendMessage();
                }
              }} value={text} style={txtInput} />

              <TouchableOpacity onPress={()=>{
                if(text!==''){
                  this.sendMessage();
                  Keyboard.dismiss()
                }
              }}>
              <Image source={sendEmailIC} style={{width:20,height:20,marginBottom:3}} />
              </TouchableOpacity>
            </View>

            <View style={{paddingTop:0,paddingBottom:5,paddingLeft:15,paddingRight:15,flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity onPress={()=>{ }}>
            <Image source={pictureIC} style={{width:20,height:20}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ }}>
            <Image source={videoClipIC} style={{width:20,height:20}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ }}>
            <Image source={videoCallIC} style={{width:20,height:20}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ }}>
            <Image source={microIC} style={{width:20,height:20}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ }}>
            <Image source={musicIC} style={{width:20,height:20}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ }}>
            <Image source={attachIC} style={{width:20,height:20}} />
            </TouchableOpacity>
            </View>
        </View>

      </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {myFriends:state.myFriends}
}

export default connect(mapStateToProps)(Messenger);

export class ListMsg extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {data, userId,name, checkID, checkDate, showHour ,yf_avatar} = this.props;
    //console.log('userId',userId);
    //console.log('this.props',this.props);
    const {
      wrapAva,widthAva,radiusAva,wrapMsg,colorMsg,avatarRight,avatarLeft,
      msgLeft,msgRight,bgMe,show,hide,colorWhite,groupFirstLeft,wrapDate,
      lineDate,wrapDatePaging,groupTopRight,colorItemName,
      dateStyle,dateDirRight,dateDirLeft,
    } = styles;
    return(
      <View>
      <View style={{height: checkID!==0 && checkID!==data.id && formatDate(checkDate)===formatDate(data.create_at) ? 20 : 0}}></View>
      {data.message!==undefined && data.create_at!==undefined  ?
        <View style={{paddingLeft:10,paddingRight:10,marginBottom:7}}>
          <View style={[wrapDatePaging,formatDate(checkDate)!==formatDate(data.create_at) ? show :hide ]}>
            <View style={{borderRadius:10,backgroundColor:'#C5C4CE',padding:3,paddingLeft:7,paddingRight:7}}>
            <Text style={{color:'#fff',fontSize:12}}>{Moment(data.create_at).format('DD/MM/YYYY')}</Text>
            </View>
            <View style={lineDate}></View>
          </View>
          <View style={[userId===data.id ? avatarRight : avatarLeft,checkID===data.id && userId===data.id ? groupTopRight : '']}>
            <View style={widthAva}>
              <View style={[wrapAva,userId===data.id || checkID===data.id ? hide : show]}>
              <Image source={{uri: checkUrl(yf_avatar) ? `${yf_avatar}` : `${global.url_media}/${yf_avatar}`}} style={radiusAva} />
              </View>
            </View>

            <View style={[wrapDate,userId===data.id ? msgRight : msgLeft,  userId!==data.id ? groupFirstLeft : '']}>
              <View style={[wrapMsg,userId===data.id ? bgMe : '']}>
                <Text style={userId!==data.id && checkID!==data.id  ? [colorItemName,show] : hide}>{name}</Text>
                <Text style={userId===data.id ? colorWhite : colorMsg}>{data.message}</Text>
              </View>
              <View style={[showHour ? show : hide]}>
                <Text style={[dateStyle, userId===data.id ? dateDirRight : dateDirLeft]}>{formatHour(data.create_at)}</Text>
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
  container: {width,height},
  colorItemName:{color:'#606B85',fontSize:13},
  wrapShowType:{position:'absolute', zIndex:98,backgroundColor:'rgba(179, 181, 183, 0.45)',padding:10,paddingTop:5,paddingBottom:5,},
  contentWrap : { width,height,alignItems: 'center',justifyContent: 'flex-start',marginBottom:height/4,},
  colorMsg:{color:'#2F353F',lineHeight:22,fontSize:16},
  colorWhite:{color:'#fff',lineHeight:22,fontSize:16},
  wrapMsg:{
    borderColor:'#E1E7EC',
    borderWidth:1,
    borderRadius:8,
    backgroundColor:'#fff',
    padding:10,
    paddingTop:5,
    paddingBottom:5,
  },
  lineDate:{width:width-110,borderBottomWidth:1,borderColor:'#C5C4CE',position:'absolute',top:30,zIndex:-1},
  wrapDatePaging:{width,alignItems:'center',height:60,justifyContent:'center'},
  msgLeft:{left:0,},
  msgRight:{right:0},
  bgMe:{backgroundColor:'#3E4C6A'},
  radiusAva:{width:50,height:50,borderRadius:25},
  widthAva:{width:54,marginRight:5},
  dateStyle:{color:'#6587A8',fontSize:12,paddingTop:5},
  dateDirRight:{textAlign:'right',paddingRight:3,marginTop:-6},
  dateDirLeft:{textAlign:'left',paddingLeft:3,marginTop:-6},
  wrapAva:{
    width:54,height:54,
    borderRadius:27,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
  },
  wrapDate:{
    maxWidth:width-100,
    justifyContent:'center',
    marginTop:-5,
  },

  groupFirstLeft:{top:5},
  groupTopRight:{top:0},
  avatarRight:{
    flexDirection:'row',
    width:width-25,
    justifyContent:'space-between'
  },
  avatarLeft:{
    flexDirection:'row',width:width-25,alignItems:'flex-start',
  },

  wrapItems:{flexDirection:'row',width,alignItems:'center',padding:15,backgroundColor:'#fff',marginBottom:1},
  headCatStyle : {
    backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
    position:'absolute',zIndex:9999,width,alignSelf:'flex-start'
  },
  txtInput:{
    borderRadius:3,
    paddingLeft:15,paddingTop:0,paddingBottom:5,
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
    position:'relative',
    zIndex:9999,bottom:Platform.OS==='ios' ? 0 : 25,
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
