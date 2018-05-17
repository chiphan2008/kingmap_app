/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,
  Dimensions,ScrollView,Alert,FlatList,
  TextInput,DeviceEventEmitter,
} from 'react-native';

import getApi from '../../api/getApi';
import postApi from '../../api/postApi';
import checkLogin from '../../api/checkLogin';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import moreIC from '../../../src/icon/ic-create/ic-more.png';
import removeIC from '../../../src/icon/ic-create/ic-remove.png';
import editIC from '../../../src/icon/ic-create/ic-edit.png';
import editBlueIC from '../../../src/icon/ic-blue/ic-edit.png';
import saveBlueIC from '../../../src/icon/ic-blue/ic-save.png';
import doneIC from '../../../src/icon/ic-create/ic-done.png';
import closeIC from '../../../src/icon/ic-create/ic-close.png';

const {width,height} = Dimensions.get('window');


export default class Collection extends Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],
      isLogin:false,
      showEdit:false,
      showPopup:{},
      showInput:{},
      user_profile:{},
      name_coll:'',
      isFocus:false,
    }
    checkLogin().then(e=>{
      //console.log('checkLogin',e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,isLogin:true});
        this.getData(e.id);
      }
    });
  }

  getData(id){
    const url = `${global.url}${'collection/get/user/'}${id}`;
    getApi(url)
    .then(arrData => {
      //console.log('arrData',arrData);
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }
  delCollection(idCollection){
    const arr = new FormData();
    arr.append('collection_id',idCollection);
    arr.append('user_id',this.state.user_profile.id);
    const url = `${global.url}${'collection/delete'}`;

    postApi(url,arr).then(e => {
      if(e.code===200){
        this.getData(this.state.user_profile.id);
      }
    }).catch(err => console.log(err));

  }

  editCollection(idCollection){
    console.log();
    const arr = new FormData();
    arr.append('collection_id',idCollection);
    arr.append('name',this.state.name_coll);
    arr.append('user_id',this.state.user_profile.id);
    const url = `${global.url}${'collection/edit'}`;
    console.log(arr);
    postApi(url,arr).then(e => {
      if(e.code===200){
        this.setState({name_coll:'',},()=>{
          this.getData(this.state.user_profile.id);
        })
      }
    }).catch(err => console.log(err));

  }

  removeContentInCol(id_collection,id_content){
    const arr = new FormData();
    arr.append('collection_id',id_collection);
    arr.append('content_id',id_content);
    const url = `${global.url}${'collection/remove'}`;

    postApi(url,arr).then(e => {
      if(e.code===200){
        this.getData(this.state.user_profile.id);
      }
    }).catch(err => console.log(err));

  }
  confirmDel(id,id_content=null,route){
    //console.log(id);
    const {lang} = this.props.navigation.state.params;
    if(route==='delete'){
      Alert.alert(lang.notify,lang.confirm_collection_del,[
        {text: lang.cancel, style: 'cancel'},
        {text: lang.confirm, onPress: () => this.delCollection(id)},
      ],
     { cancelable: false } )
    }
    if(route==='remove'){
      Alert.alert(lang.notify,lang.confirm_loc_col_del,[
        {text: lang.cancel, style: 'cancel'},
        {text: lang.confirm, onPress: () => this.removeContentInCol(id,id_content)},
      ],
     { cancelable: false } )
    }

  }
  render() {
    const { showPopup,showInput,showEdit,isFocus,name_coll } = this.state;
    const { lang,curLoc } = this.props.navigation.state.params;
    const { goBack,navigate } = this.props.navigation;
    //console.log('visible',visible);
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,show,hide,popup,
      imgInfo,wrapInputCreImg,marTop,colorTitle,txt,txtTitleOverCat,
      closeCollection,
    } = styles;
    return (
        <ScrollView style={container}>
        <View style={{paddingBottom:80}}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    DeviceEventEmitter.emit('goback',  {isLogin:true})
                    goBack();
                  }}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{lang.collection.toUpperCase()} </Text>
                  <View></View>
              </View>
          </View>
          {this.state.listData.length > 0 ?
            this.state.listData.map((e)=>(
              <View key={e.id}>
                <View style={{backgroundColor:'#fff'}}>

                    <View style={listCreate}>
                      <View style={{width:width-105,flexDirection:'row',alignItems:'center'}}>
                           <View style={isFocus && showInput[e.id] ? show : hide}>
                             <TextInput underlineColorAndroid='transparent' autoFocus={isFocus}
                               onSubmitEditing={(event) => {}}
                               style={{padding:5,fontSize:18,maxWidth:width-(width/3)}} value={name_coll}
                               onChangeText={(name_coll) => this.setState({name_coll})}
                              />
                           </View>
                           <View style={showInput[e.id] ? hide : show}>
                           <Text numberOfLines={1} style={txtTitleOverCat}>{e.name} ({e._contents.length})</Text>
                           </View>
                          <TouchableOpacity style={{padding:5}}
                          onPress={()=>{
                            if(isFocus){
                              this.editCollection(e.id);
                              this.setState({isFocus:false,showInput:Object.assign(showInput,{[e.id]:!e.id})});

                            }else {
                              this.setState({
                                isFocus:true,name_coll:e.name,
                                showInput:Object.assign(showInput,{[e.id]:e.id})})
                            }
                          }}>
                            <Image source={isFocus && showInput[e.id] ? saveBlueIC : editBlueIC} style={{width:15,height:15}} />
                          </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={()=>{
                        if(showPopup[e.id]===e.id){
                        this.setState({showPopup: {[e.id]:!e.id} })
                        }else {
                        this.setState({showPopup: {[e.id]:e.id} })
                        }
                      }}>
                      <Image source={moreIC} style={{width:20,height:20}} />
                      </TouchableOpacity>
                      <View style={[popup ,showPopup[e.id] ? show : hide]}>
                        <TouchableOpacity onPress={()=>{this.confirmDel(e.id,null,'delete');
                        this.setState({showPopup: {[e.id]:!e.id} }) }}>
                          <Image source={removeIC} style={{width:20,height:20}} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.setState({showEdit:!showEdit,})}>
                          <Image source={showPopup[e.id] && showEdit===false ? editIC : doneIC} style={{width:20,height:20}} />
                        </TouchableOpacity>
                      </View>
                    </View>



                    <FlatList
                       horizontal
                       showsHorizontalScrollIndicator={false}
                       extraData={this.state}
                       keyExtractor={item => item.id.toString()}
                       data={e._contents}
                       renderItem={({item}) => (
                         <View style={{marginRight:0,padding:10,width:(width)/2}}>
                           <TouchableOpacity onPress={()=>{
                               navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang})
                           }}>
                           <Image source={{uri:`${global.url_media}${item.avatar}`}} style={{width:width/2,minHeight:width/3,marginBottom:10}} />
                           </TouchableOpacity>
                           <TouchableOpacity onPress={()=>{
                               navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang})
                           }}>
                           <Text style={{color:'#2F353F',fontSize:16}} numberOfLines={2}>{item.name}</Text>
                           </TouchableOpacity>
                           {showPopup[e.id] && showEdit && <TouchableOpacity onPress={()=>this.confirmDel(e.id,item.id,'remove')}
                           style={[closeCollection]}>
                           <Image source={closeIC} style={{width:18,height:18}} />
                           </TouchableOpacity>}
                         </View>
                       )}
                    />

                </View>
                <View style={{height:14}}></View>
              </View>
            ))
            :
            <View></View>
          }



          </View>
      </ScrollView>
    );
  }
}
