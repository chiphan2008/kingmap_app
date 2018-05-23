/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,
  Dimensions,ScrollView,Alert,DeviceEventEmitter,
} from 'react-native';

import getApi from '../../api/getApi';
import checkLogin from '../../api/checkLogin';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import moreIC from '../../../src/icon/ic-create/ic-more.png';
import favoriteIC from '../../../src/icon/ic-favorite.png';
import closeIC from '../../../src/icon/ic-create/ic-close.png';
import closingIC from '../../../src/icon/ic-closing.png';
import openingIC from '../../../src/icon/ic-opening.png';
import requestIC from '../../../src/icon/ic-request.png';

const {width,height} = Dimensions.get('window');


export default class ListLocPer extends Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],
      isLogin:false,
      user_profile:{},
      showOption:false,
      id_content:'',
      idCat:'',
      moderation:'',
    }
    this.refresh();
  }
  refresh(){
    checkLogin().then(e=>{
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true});
        this.getData(e.id);
      }
    });
  }
  getData(id){
    const url = `${global.url}${'user/list-location/'}${id}`;
    //console.log(url);
    getApi(url)
    .then(arrData => {
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }
  deleteLocation(idContent){
    const url = `${global.url}${'user/delete-location/'}${idContent}`;
    console.log('url',url);
    getApi(url).then(e => {
      if(e.code===200) this.getData(this.state.user_profile.id);
    }).catch(err => console.log(err));
  }
  callPause(idContent){
    this.setState({showOption:false});
    const url = `${global.url}${'user/close-location/'}${idContent}`;
    getApi(url).then(e => {
      if(e.code===200) this.getData(this.state.user_profile.id);
    }).catch(err => console.log(err));

  }
  reOpen(idContent){
    this.setState({showOption:false});
    const url = `${global.url}${'user/open-location/'}${idContent}`;
    getApi(url).then(e=>{
      if(e.code===200) this.getData(this.state.user_profile.id);
    }).catch(err => console.log(err));
  }

  confirmDel(id){
    this.setState({showOption:false});
    const {lang} = this.props.navigation.state.params;
    Alert.alert(lang.notify,lang.confirm_loc_del,[
      {text: lang.cancel, style: 'cancel'},
      {text: lang.confirm, onPress: () => this.deleteLocation(id)},
    ],
   { cancelable: false } )
  }
  render() {
    const { lang,curLoc } = this.props.navigation.state.params;
    const { goBack,navigate } = this.props.navigation;
    const { showOption,id_content,idCat,moderation } = this.state;
    //console.log('lang',lang);
    const {
      container,headCatStyle,headContent,titleCreate,
      listCreate,show,hide,txt,txtTitleOverCat,marTop10,marTop15,
      actionSheetWrap,actionSheetContent,actionSheetRadius,line,pad15,
      colorTxt
    } = styles;
    return (
      <View style={container}>
        <ScrollView>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    DeviceEventEmitter.emit('goback',  {isLogin:true})
                    goBack();
                  }}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{lang.list_location.toUpperCase()} </Text>
                  <View></View>
              </View>
          </View>
          {this.state.listData.length > 0 &&
            this.state.listData.map((e)=>(
              <View key={e.id}>
                <View style={{backgroundColor:'#fff'}}>
                  <TouchableOpacity onPress={()=>{
                    navigate('DetailScr',{idContent:e.id,lat:e.lat,lng:e.lng,curLoc,lang:lang.lang})
                  }}>
                    <Image source={{uri:`${global.url_media}${e.avatar}`}} style={{width:width,minHeight:200,marginBottom:10}} />
                  </TouchableOpacity>


                    <View style={listCreate}>
                      <View style={{width:width-80}}>
                        <TouchableOpacity onPress={()=>{
                          //this.props.closeModal()
                          navigate('DetailScr',{idContent:e.id,lat:e.lat,lng:e.lng,curLoc,lang:lang.lang})
                        }}>
                          <Text numberOfLines={1} style={txtTitleOverCat}>{e.name}</Text>
                        </TouchableOpacity>
                          <Text numberOfLines={1} style={{color:'#6587A8',lineHeight:24}}>{`${e.address}, ${e._district.name}, ${e._city.name}, ${e._country.name}`}</Text>
                          {e.moderation==='request_publish' &&
                            <View style={{flexDirection:'row'}}>
                            <Image source={favoriteIC} style={{width:16,height:16,marginTop:2}} />
                            <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> ({e.vote}) | </Text>
                            <Image source={requestIC} style={{width:14,height:14,marginRight:3,marginTop:5}} />
                            <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> {`${lang.pending}`}</Text>
                            </View>

                          }
                          {e.moderation==='publish' &&
                            <View style={{flexDirection:'row'}}>
                            <Image source={favoriteIC} style={{width:16,height:16,marginTop:2}} />
                            <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> ({e.vote}) | </Text>
                            <Image source={openingIC} style={{width:14,height:14,marginRight:3,marginTop:5}} />
                            <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> {`${lang.opening}`}</Text>
                            </View>

                          }
                          {e.moderation==='un_publish' &&
                            <View style={{flexDirection:'row'}}>
                            <Image source={favoriteIC} style={{width:16,height:16,marginTop:2}} />
                            <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> ({e.vote}) | </Text>
                            <Image source={closingIC} style={{width:14,height:14,marginRight:3,marginTop:5}} />
                            <Text numberOfLines={1} style={{color:'#313B50',lineHeight:24}}> {`${lang.closing}`}</Text>
                            </View>

                          }


                      </View>
                      <TouchableOpacity onPress={()=>this.setState({
                        showOption:true,
                        id_content:e.id,
                        idCat:e.id_category,
                        moderation:e.moderation})}>
                        <Image source={moreIC} style={{width:20,height:20}} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height:14}}></View>
              </View>
            ))}

      </ScrollView>
      {showOption && <View style={actionSheetWrap} >
        <View style={[actionSheetContent,actionSheetRadius]}>
          <TouchableOpacity style={pad15}
          onPress={()=>{this.setState({showOption:false},()=>{
            navigate('FormCreateScr',{idContent:id_content,lang:lang.lang})
          })}}>
          <Text style={colorTxt}>{lang.edit}</Text>
          </TouchableOpacity>
          {moderation==='publish' &&
            <View>
            <View style={line}></View>
            <TouchableOpacity onPress={()=>this.callPause(id_content)} style={pad15}>
            <Text style={colorTxt}>{lang.pause}</Text>
            </TouchableOpacity>
            </View>

          }
          {moderation==='un_publish' &&
            <View>
            <View style={line}></View>
            <TouchableOpacity onPress={()=>this.reOpen(id_content)} style={pad15}>
            <Text style={colorTxt}>{lang.reopen}</Text>
            </TouchableOpacity>
            </View>

          }
          <View style={line}></View>
          <TouchableOpacity onPress={()=>this.confirmDel(id_content)} style={pad15}>
          <Text style={colorTxt}>{lang.delete}</Text>
          </TouchableOpacity>
        </View>
        <View style={[actionSheetContent,actionSheetRadius,marTop10]}>
          <TouchableOpacity onPress={()=>this.setState({showOption:false})} style={pad15}>
          <Text style={colorTxt}>{lang.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>}
      </View>
    );
  }
}
