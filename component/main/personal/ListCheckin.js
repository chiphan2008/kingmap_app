/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  Dimensions,ScrollView,
} from 'react-native';

import getApi from '../../api/getApi';
import checkLogin from '../../api/checkLogin';
import global from '../../global';
import styles from '../../styles';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import moreIC from '../../../src/icon/ic-create/ic-more.png';
import closeIC from '../../../src/icon/ic-create/ic-close.png';

const {width,height} = Dimensions.get('window');


export default class ListCheckin extends Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],
      isLogin:false,
      user_profile:{},
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
    const url = `${global.url}${'user/list-checkin/'}${id}`;
    getApi(url)
    .then(arrData => {
      //console.log('arrData',arrData);
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }

  delCheckin(id){
    const url = `${global.url}${'user/delete-checkin/'}${id}`;
    getApi(url)
    .then((e)=>{
      this.refresh();
    })
    .catch(err => console.log(err));
  }
  render() {
    const { navigation,lang,curLoc } = this.props;
    //console.log('curLoc',curLoc);
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,listCreate,widthLblCre,show,hide,
      imgInfo,wrapInputCreImg,marTop,colorTitle,txt,txtTitleOverCat
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
                  <TouchableOpacity onPress={()=>{
                      this.props.closeModal()
                      navigation.navigate('DetailScr',{idContent:e.id,lat:e.lat,lng:e.lng,curLoc,lang})
                  }}>
                    <TouchableOpacity style={{position:'absolute',top:5,right:5,zIndex:99}}
                    onPress={()=>this.delCheckin(e.id)}>
                    <Image source={closeIC} style={{width:20,height:20}} />
                    </TouchableOpacity>
                    <Image source={{uri:`${global.url_media}${e.avatar}`}} style={{width:width,minHeight:200,marginBottom:10}} />
                    </TouchableOpacity>
                    <View style={listCreate}>
                      <View style={{width:width-80}}>
                          <TouchableOpacity onPress={()=>{
                              this.props.closeModal()
                              navigation.navigate('DetailScr',{idContent:e.id,lat:e.lat,lng:e.lng,curLoc,lang})
                          }}>
                            <Text numberOfLines={1} style={txtTitleOverCat}>{e.name}</Text>
                          </TouchableOpacity>
                          <Text numberOfLines={1} style={{color:'#6587A8',lineHeight:24}}>{`${e.address}, ${e._district.name}, ${e._city.name}, ${e._country.name}`}</Text>
                      </View>
                      <View></View>
                    </View>
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
