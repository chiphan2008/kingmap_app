/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,FlatList,
  TouchableWithoutFeedback,Alert
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

export default class GrantRight extends Component {
  constructor(props){
    super(props);
    this.state={
      desWork:'',
      valCTV:'',
      valTDL:'',
      idCountry:'',idCity:'',idDist:'',
      chooseDist:{},
      listUser:[],
      showArea:false,
      showAddCTV:false,
      itemCTVChoose:{},
      noDataUser:'',
    }
  }
  postContent(){
    const { desWork } = this.state;
    const { lang,itemChoose,userId } = this.props;
    if(desWork.trim()!=='' && itemChoose.id!==undefined){
      const arr = new FormData();
      arr.append('from_client',userId);
      arr.append('to_client',itemChoose.id);
      arr.append('content',desWork);
      postApi(`${global.url}${'static/giaoviec'}${'?lang='}${lang.lang}`,arr)
      .then(e=>{});
    }
    this.props.assignFunc();
  }
  searchUser(keyword){
    const { lang,itemChoose } = this.props;
    let url = `${global.url}${'static/find-client'}`;
    const arr = new FormData();
    itemChoose.id!==undefined && arr.append('daily_id',itemChoose.id);
    arr.append('keyword',keyword);

    postApi(url,arr).then(e => {
      //console.log(e);
        if(e.data.length===0) {this.state.noDataUser = lang.not_found;}
        this.state.listUser=e.data;
        this.state.valCTV='';
        this.setState(this.state);
    }).catch(err => console.log(err));
  }
  addCTV(){
    const { lang,itemChoose } = this.props;
    const { itemCTVChoose } = this.state;
    if(Object.entries(itemCTVChoose).length===0){
      Alert.alert(lang.notify,lang.plz_choose_coll);
    }else {
      let url = `${global.url}${'static/add-ctv'}`;
      const arr = new FormData();
      itemChoose.id!==undefined && arr.append('daily_id',itemChoose.id);
      Object.entries(itemCTVChoose).forEach(e=>{
        e[1] && arr.append('ctv_id[]',e[1]);
      })
      // console.log(url);
      // console.log(arr);
      postApi(url,arr).then(e => {
        //console.log(e);
        this.state.listUser=[];
        this.state.showAddCTV=false;
        this.state.valCTV='';
        this.setState(this.state,()=>{
          Alert.alert(lang.notify,e.data);
        });
      }).catch(err => console.log(err));
    }

  }
  getContent(){
    const {itemChoose,lang} = this.props;
    getApi(`${global.url}${'static/giaoviec/'}${itemChoose.id}${'?lang='}${lang.lang}`).then(arr => {
        this.setState({ desWork:(arr.data===null || arr.data[0].content===null)?'':arr.data[0].content });
    }).catch(err => console.log(err));
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
    const {valCTV,valTDL,desWork,showAddCTV,listUser,itemCTVChoose,noDataUser,showArea} = this.state;
    const { lang,isCeo,listAgency,itemChoose,noData } = this.props;
    return (
      <View style={wrapSetting}>
      <View>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>{this.props.closeModal()}}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                  <Text style={{marginTop:5,color:'#fff', fontWeight: 'bold'}}>{lang.assign.toUpperCase()}</Text>
                <View></View>
            </View>
        </View>

        <ScrollView>
        <View style={wrapWhite} >
            <View>
            <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{isCeo?`${lang.choose_agency}`:`${lang.choose_coll}`}</Text>
            </View>
            <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
                <TextInput underlineColorAndroid='transparent'
                style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                onSubmitEditing={() => {
                  if (this.state.valTDL.trim()!=='') {
                    const act = isCeo?'find-daily':'search-ctv';
                    this.props.searchContent(act,this.state.valTDL);
                    this.setState({valTDL:''});
                  }
                }}
                onChangeText={(valTDL) => this.setState({valTDL})}
                value={this.state.valTDL} />

                <TouchableOpacity style={{position:'absolute',top:20,right:5}}
                onPress={()=>{
                  if (this.state.valTDL.trim()!=='') {
                    const act = isCeo?'find-daily':'search-ctv';
                    this.props.searchContent(act,this.state.valTDL);
                    this.setState({valTDL:''});
                  }
                }}>
                  <Image style={{width:16,height:16,}} source={searchIC} />
                </TouchableOpacity>
            </View>

        </View>
        {itemChoose.avatar!==undefined &&
          <View onLayout={()=>{this.getContent()}}>
          <Text numberOfLines={1} style={{color:'#6791AF',paddingLeft:15,marginTop:10, fontWeight: 'bold'}}>{isCeo?`${lang.selected_agency}`.toUpperCase():`${lang.selected_coll}`.toUpperCase()}</Text>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:15}}>
            <View style={{flexDirection:'row',paddingBottom:15}}>
                <Image source={{uri:checkUrl(itemChoose.avatar) ? itemChoose.avatar : `${global.url_media}${itemChoose.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                <View style={{width:width-90}}>
                  <Text numberOfLines={1} style={colorlbl}>{itemChoose.full_name}</Text>
                  <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${itemChoose.address}`}</Text>
                </View>
                </View>
            </View>
         </View>}

         <View style={wrapWhite} >
           <View>
           <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{`${lang.choose_area}`}</Text>
           </View>
           <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}></View>
           <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between'}}
          onPress={()=>{
            if(!isCeo){
              this.props.showKV();
            }else {
              if(itemChoose.id===undefined){
                this.alertChooseAgency();
              }else {
                this.setState({showArea:true});
              }
            }
          }}>
          <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{`${lang.area}`}</Text>
          <Image source={arrowNextIC} style={{width:18,height:18}}/>
          </TouchableOpacity>
       </View>
       {isCeo &&
         <ChooseArea
         visible={showArea} lang={lang} itemChoose={itemChoose}
         closeModal={()=>this.setState({showArea:false})}
         chooseDist={(listDist)=>{
           console.log('listDist',listDist);
           this.props.chooseDist(listDist)}}
         />
       }
        {isCeo && <View>
          <View style={{height:5}}></View>
          <View style={wrapWhite}>
            <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between'}}
            onPress={()=>{
              if(itemChoose.id===undefined){
                this.alertChooseAgency();
              }else {
                this.setState({showAddCTV:!showAddCTV})
              }
            }}>
               <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{`${lang.add_coll}`}</Text>
               <Image source={arrowNextIC} style={{width:18,height:18}}/>
           </TouchableOpacity>
             {showAddCTV && <View style={{paddingTop:10,marginTop:10,borderColor:'#E0E8ED',borderTopWidth:1}}>
               <TextInput underlineColorAndroid='transparent'
                 style={{width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5}}
                 onSubmitEditing={() => {
                   if (this.state.valCTV.trim()!=='') {
                     this.searchUser(this.state.valCTV);
                   }
                 }}
                 onChangeText={(valCTV) => this.setState({valCTV})}
                 value={this.state.valCTV} />

                 <TouchableOpacity style={{position:'absolute',top:20,right:5}}
                 onPress={()=>{
                   if (this.state.valCTV.trim()!=='') {
                     this.searchUser(this.state.valCTV);
                   }
                 }}>
                   <Image style={{width:16,height:16,}} source={searchIC} />
                 </TouchableOpacity>
             </View>}
          </View>
        </View>}

        <View style={{height:5}}></View>
        <View style={wrapWhite} >
            <View>
            <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{`${lang.des_work}`}</Text>
            </View>
            <TextInput underlineColorAndroid='transparent'
            maxHeight={65} multiline numberOfLines={4}
            placeholder={lang.enter_des}
            style={{marginTop:5,width:width-30,backgroundColor:'#EDEDED',borderRadius:3,padding:5,textAlignVertical:'top'}}
            onChangeText={(desWork) => this.setState({desWork})}
            value={this.state.desWork} />
       </View>

        <View style={{alignItems:'center',marginTop:10,marginBottom:height/3}}>
          <TouchableOpacity onPress={()=>{
            Alert.alert(
              this.props.lang.notify,
              'Bạn có chắc muốn phân quyền?',
              [
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {text: 'OK', onPress: () => {this.postContent()}},
              ],
              { cancelable: false }
            )
            }} style={[marTop,btnTransfer]} >
          <Text style={{color:'#fff', fontWeight: 'bold',fontSize:18}}>{`${lang.assign}`}</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>

      </View>

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
             style={{paddingLeft:15,paddingRight:15,marginTop:15}}
             keyExtractor={(item,index) => index.toString()}
             renderItem={({item,index}) =>(
               <TouchableOpacity onPress={()=>{
                 if(itemCTVChoose[item.id]){
                   this.state.itemCTVChoose=Object.assign(this.state.itemCTVChoose,{[item.id]:!item.id});
                 }else {
                   this.state.itemCTVChoose=Object.assign(this.state.itemCTVChoose,{[item.id]:item.id});
                 }
                 this.setState(this.state);
               }}
               style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                   <View style={{flexDirection:'row',paddingBottom:13,width:width-110}}>
                       <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                       <View style={{width:width-120}}>
                         <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                       </View>
                   </View>
                   {itemCTVChoose[item.id] && <Image source={checkIC} style={{width:20,height:20}} />}
                </TouchableOpacity>
             )} />
             {listUser.length>0 &&
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingBottom:15}}>
                 <TouchableOpacity style={{alignItems:'center',padding:7,borderRadius:4,backgroundColor:'#d0021b',marginLeft:10,minWidth:width/3}}
                 onPress={()=>{this.addCTV()}}>
                   <Text style={{color:'#fff',fontSize:16}}>{`${lang.add_coll}`}</Text>
                 </TouchableOpacity>
             </View>}
            </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </View>}

      {(listAgency.length>0 || noData!=='') &&
      <TouchableOpacity onPress={()=>this.props.hidePopup()}
      style={{position:'absolute',width,height,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.7)'}}>
      <TouchableWithoutFeedback>
      <View style={{
        width:width-30,
        maxHeight:listAgency.length>4? 69*4:60*(listAgency.length+1),
        backgroundColor:'#fff',
        padding:15,borderRadius:5
      }}>
       <FlatList
       extraData={this.state}
       data={listAgency}
       ListEmptyComponent={<Text style={{color:'#000',fontSize:16}}>{noData}</Text>}
       keyExtractor={(item,index) => index.toString()}
       renderItem={({item,index}) =>(
         <TouchableOpacity onPress={()=>{this.props.chooseUser(item)}}
         style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
             <View style={{flexDirection:'row',marginBottom:(listAgency.length-1)===index?0:15}}>
                 <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                 <View style={{width:width-120}}>
                   <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                   <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                 </View>
             </View>
          </TouchableOpacity>
       )} />
       </View>
       </TouchableWithoutFeedback>
       </TouchableOpacity>
     }

      </View>
    );
  }
}
