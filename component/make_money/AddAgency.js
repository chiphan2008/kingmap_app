/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,FlatList,
  TouchableWithoutFeedback,Alert,Platform
} from 'react-native';
import ChooseArea from './ChooseArea';
import Moment from 'moment';
import {format_number,checkUrl} from '../libs';
import styles from '../styles';
import global from '../global';
import postApi from '../api/postApi';
import getApi from '../api/getApi';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import searchIC from '../../src/icon/ic-gray/ic-search.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import checkIC from '../../src/icon/ic-create/ic-check.png';
const {width,height} = Dimensions.get('window');

export default class AddAgency extends Component {
  constructor(props){
    super(props);
    this.state={
      valCTV:'',
      listUser:[],
      noDataUser:'',
      showAddCTV:false,
      itemCTVChoose:{},

    }
  }

  searchUser(keyword){
    const { lang } = this.props;
    let url = `${global.url}${'static/find-client-add-daily'}`;
    const arr = new FormData();
    arr.append('keyword',keyword);

    postApi(url,arr).then(e => {
      //console.log(e);
        if(e.data.length===0) {this.state.noDataUser = lang.not_found;}
        this.state.listUser=e.data;
        this.state.valCTV='';
        this.setState(this.state);
    }).catch(err => console.log(err));
  }

  postContent() {
    const { lang } = this.props;
    const { itemCTVChoose } = this.state;
    if(itemCTVChoose.id===undefined){
      Alert.alert(lang.notify,lang.plz_user);
    }else {
      let url = `${global.url}${'static/add-daily'}`;
      const arr = new FormData();
      itemCTVChoose.id!==undefined && arr.append('client_id',itemCTVChoose.id);

      // console.log(url);
      // console.log(arr);
      postApi(url,arr).then(e => {
        //console.log(e);
        this.state.listUser=[];
        this.state.showAddCTV=false;
        this.state.valCTV='';
        this.setState(this.state,()=>{
          Platform.OS==='android' ?
          Alert.alert(lang.notify,e.data,[
            {text: '', style: 'cancel'},
            {text: 'OK', onPress: () => this.props.assignArea(itemCTVChoose)}
          ],{ cancelable: false })
         :
         Alert.alert(lang.notify,e.data,[
           {text: 'OK', onPress: () => this.props.assignArea(itemCTVChoose)}
         ],{ cancelable: false })

        });
      }).catch(err => console.log(err));
    }

  }

  alertChooseAgency(){
    const { lang } = this.props;
    Alert.alert(lang.notify,lang.plz_choose_agency);
  }
  render() {
    const {
      wrapSetting,headCatStyle,headContent,
      wrapWhite,colorTitle,marTop,btnTransfer,colorlbl,
      overLayout,shadown,popoverLoc,padBuySell
    } = styles;
    const {valCTV,showAddCTV,listUser,itemCTVChoose,noDataUser} = this.state;
    const { lang,isCeo } = this.props;
    return (
      <View style={wrapSetting}>
      <ScrollView>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>{this.props.closeModal()}}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                  <Text style={{marginTop:5,color:'#fff', fontWeight: '600'}}>{lang.add_agency.toUpperCase()}</Text>
                <View></View>
            </View>
        </View>

        <View style={wrapWhite} >
            <View>
            <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{`${lang.select_user}`}</Text>
            </View>
            <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                <TextInput underlineColorAndroid='transparent'
                style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                onSubmitEditing={() => {
                  if (this.state.valCTV.trim()!=='') {
                    this.searchUser(valCTV);
                  }
                }}
                onChangeText={(valCTV) => this.setState({valCTV})}
                value={this.state.valCTV} />

                <TouchableOpacity style={{position:'absolute',top:Platform.OS==='ios'?16:20,right:5}}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress={()=>{
                  if (this.state.valCTV.trim()!=='') {
                    this.searchUser(valCTV);
                  }
                }}>
                  <Image style={{width:16,height:16,}} source={searchIC} />
                </TouchableOpacity>
            </View>

        </View>
        {itemCTVChoose.avatar!==undefined &&
          <View>
          <Text numberOfLines={1} style={{color:'#6791AF',paddingLeft:15,marginTop:10, fontWeight: 'bold'}}>
          {lang.selected_user.toUpperCase()}
          </Text>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:15}}>
            <View style={{flexDirection:'row',paddingBottom:15}}>
                <Image source={{uri:checkUrl(itemCTVChoose.avatar) ? itemCTVChoose.avatar : `${global.url_media}${itemCTVChoose.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                <View style={{width:width-90}}>
                  <Text numberOfLines={1} style={colorlbl}>{itemCTVChoose.full_name}</Text>
                  <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${itemCTVChoose.address}`}</Text>
                </View>
                </View>
            </View>
         </View>}

        <View style={{height:5}}></View>

        <View style={{alignItems:'center',marginTop:10,marginBottom:height/3}}>
          <TouchableOpacity onPress={()=>{this.postContent()}} style={[marTop,btnTransfer]} >
          <Text style={{color:'#fff', fontWeight: 'bold',fontSize:18}}>{`${lang.add_agency}`}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {(listUser.length>0 || noDataUser!=='') &&
        <View style={{position:'absolute'}}>
        <TouchableOpacity onPress={()=>this.setState({listUser:[],noDataUser:''})}
        style={[popoverLoc,padBuySell]}>
        <TouchableWithoutFeedback >
            <View style={[overLayout,shadown]}>
            <FlatList
             extraData={this.state}
             data={listUser}
             // onEndReachedThreshold={0.5}
             // onEndReached={() => {
             //   if(loadMore) this.setState({loadMore:false},()=>{
             //     this.searchContentPending(page)
             //   });
             // }}
             ListEmptyComponent={<Text style={{color:'#000',fontSize:16}}>{noDataUser}</Text>}
             style={{paddingLeft:15,paddingRight:15,marginTop:15,marginBottom:15,maxHeight:60*5}}
             keyExtractor={(item,index) => index.toString()}
             renderItem={({item,index}) =>(
               <TouchableOpacity onPress={()=>{
                 this.setState({itemCTVChoose:item,noDataUser:'',listUser:[]});
               }}
               style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                   <View style={{flexDirection:'row',paddingBottom:index===(listUser.length-1)?0:13,width:width-110}}>
                       <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                       <View style={{width:width-120}}>
                         <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                       </View>
                   </View>
                   {/*itemCTVChoose[item.id] && <Image source={checkIC} style={{width:20,height:20}} />*/}
                </TouchableOpacity>
             )} />
            </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </View>}



      </View>
    );
  }
}
