/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,FlatList,Modal,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import language_vn from '../lang/vn/language';
import language_en from '../lang/en/language';

import closeIC from '../../src/icon/ic-white/ic-close.png';
import checkIC from '../../src/icon/ic-green/ic-check.png';
import sortDownIC from '../../src/icon/ic-sort-down.png';
import upDD from '../../src/icon/ic-white/ic-dropdown_up.png';

export default class ChooseCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData : [],
      checkSubCat:{},
      labelCat:'Danh mục',
      idCat:'',
      showCat:false,
      sub_cat:[],
      selectLang: {
        valueLang : '',
      },
      lang:language_vn,
      //raovat_type:'',
    }
  }

  getCategory(id_sub=null){
    var url;
    if(id_sub===null){
      url = `${global.url}${'raovat-type'}`;
    }else {
      url = `${global.url}${'raovat-type'}/${id_sub}`;
    }
    console.log(url);
    getApi(url).then(arrData => {
      if(id_sub===null){
        this.setState({ listData: arrData.data });
      }else {
        this.setState({ sub_cat: arrData.data[0]._subtypes });
      }
    })
    .catch(err => console.log(err));
  }

  componentWillMount(){
    //const { lang } = this.props.navigation.state.params;
    this.getCategory();
      // this.setState({
      //     selectLang: {
      //       valueLang : lang,
      //
      //     },
      //     lang: lang==='vn' ? language_vn : language_en,
      // })
  }

  render() {
    //const {navigate, goBack} = this.props.navigation;
    const {listData,checkSubCat,sub_cat,showCat,labelCat,idCat} = this.state;
    const {visible} = this.props;
    const {
      container,
      headCatStyle,headContent, wrapDistribute,shadown,
      show,hide,flatItem,flatlistItem,imgFlatItemLoc,wrapFlatRight,
      listAdd,colorlbl,imgShare,wrapListLoc,padLoc,wrapFilter,filterFrame,
      selectBoxBuySell,widthSubType,
      overLayout,popoverLoc,padBuySell,imgUpBuySell,imgUpInfo,colorText,listOverService
    } = styles;

    return (
      <Modal
      onRequestClose={() => null} transparent
      animationType={'slide'}
      visible={visible}
      >
      <View style={container}>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>{
                this.props.submitCat(idCat,labelCat,checkSubCat);
                this.props.closeModal();
              }}>
              <Image source={closeIC} style={{width:20, height:20,marginTop:5}} />
              </TouchableOpacity>
               <Text style={{color:'white',fontSize:18,paddingTop:5}}> Danh mục </Text>
              <View></View>
          </View>
      </View>

      <View style={wrapFilter}>
              <View style={filterFrame}>
              <TouchableOpacity style={[selectBoxBuySell,widthSubType]}
              onPress={()=>this.setState({showCat:true})}>
                  <Text  numberOfLines={1} style={{color:'#303B50'}}>{labelCat}</Text>
                  <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
              </TouchableOpacity>
            </View>
      </View>

      <Modal onRequestClose={() => null} transparent visible={showCat}>
        <TouchableOpacity
        onPress={()=>this.setState({showCat:false})}
        style={[popoverLoc,padBuySell]}>
          <View style={[overLayout,shadown]}>
          <FlatList
             keyExtractor={item => item.id.toString()}
             data={listData}
             renderItem={({item}) => (
               <View style={listOverService}>
                 <TouchableOpacity style={listAdd}
                 onPress={()=>{
                   this.getCategory(item.id);
                   this.setState({labelCat:item.name,idCat:item.id,showCat:false
                   })}}>
                      <Text style={colorText}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
          )} />
          </View>
          <Image style={[imgUpBuySell,imgUpInfo]} source={upDD} />

        </TouchableOpacity>
      </Modal>

      <View style={[wrapListLoc]}>
      <FlatList
         extraData={this.state}
         keyExtractor={item => item.id.toString()}
         data={sub_cat}
         renderItem={({item}) =>(
           <View style={listOverService}>
           <TouchableOpacity style={listAdd}
           onPress={()=>{
             if(checkSubCat[`${item.id}`]!==item.id){
               this.setState({checkSubCat:Object.assign(checkSubCat,{[item.id]:item.id})})
             }else{
               this.setState({checkSubCat:Object.assign(checkSubCat,{[item.id]:!item.id})})
             }
           }}>
             <Text style={colorlbl}>{item.name}</Text>
             <Image source={checkIC} style={[imgShare,checkSubCat[`${item.id}`]===item.id ? show : hide]} />
           </TouchableOpacity>
           </View>
         )}
       />
       <View style={{height:5}}></View>
       </View>

      </View>
    </Modal>
    );
  }
}
