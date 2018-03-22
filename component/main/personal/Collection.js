/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  Dimensions,ScrollView,Alert,FlatList,
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
      user_profile:{},
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
    const {lang} = this.props;
    if(route==='delete'){
      Alert.alert(lang.notify,lang.confirm_collection_del,[
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this.delCollection(id)},
      ],
     { cancelable: false } )
    }
    if(route==='remove'){
      Alert.alert(lang.notify,lang.confirm_loc_col_del,[
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this.removeContentInCol(id,id_content)},
      ],
     { cancelable: false } )
    }

  }
  render() {
    const { showPopup,showEdit } = this.state;
    const { lang,navigation,curLoc } = this.props;
    //console.log('lang',lang);
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,show,hide,popup,
      imgInfo,wrapInputCreImg,marTop,colorTitle,txt,txtTitleOverCat,
      closeCollection,
    } = styles;
    return (
      <Modal
      onRequestClose={() => null}
      transparent
      animationType={'slide'}
      visible={this.props.visible}
      >

        <ScrollView style={[container, this.props.visible ? show : hide]}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{this.props.closeModal();}}>
                  <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}>{this.props.labelTitle.toUpperCase()} </Text>
                  <View></View>
              </View>
          </View>
          {this.state.listData.length > 0 ?
            this.state.listData.map((e)=>(
              <View key={e.id}>
                <View style={{backgroundColor:'#fff'}}>

                    <View style={listCreate}>
                      <View style={{width:width-105}}>
                          <Text numberOfLines={1} style={txtTitleOverCat}>{e.name.toUpperCase()} ({e._contents.length})</Text>
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
                       extraData={this.state}
                       keyExtractor={item => item.id}
                       data={e._contents}
                       renderItem={({item}) => (
                         <View>
                           <TouchableOpacity onPress={()=>{
                               this.props.closeModal()
                               navigation.navigate('DetailScr',{idContent:e.id,lat:e.lat,lng:e.lng,curLoc,lang})
                           }}>
                           <Image source={{uri:`${global.url_media}${item.avatar}`}} style={{width:width/3,minHeight:100,marginBottom:10}} />
                           </TouchableOpacity>
                           <TouchableOpacity onPress={()=>this.confirmDel(e.id,item.id,'remove')}
                           style={[closeCollection,showPopup[e.id] && showEdit ? show : hide ]}>
                           <Image source={closeIC} style={{width:16,height:16}} />
                           </TouchableOpacity>
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




      </ScrollView>
    </Modal>
    );
  }
}
