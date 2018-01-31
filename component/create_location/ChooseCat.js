/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import language_vn from '../lang/vn/language';
import language_en from '../lang/en/language';

import closeIC from '../../src/icon/ic-white/ic-close.png';

export default class ChooseCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategory : [],
      selectLang: {
        valueLang : '',
      },
      lang:language_vn,
    }
  }

  getCategory(lang){
    getApi(global.url+'categories?language='+lang)
    .then(arrCategory => {
        this.setState({ listCategory: arrCategory.data });
    })
    .catch(err => console.log(err));
  }

  componentWillMount(){
    const { lang } = this.props.navigation.state.params;
    this.getCategory(lang);
      this.setState({
        selectLang: {
          valueLang : lang,

        },
        lang: lang==='vn' ? language_vn : language_en,
    })
  }

  render() {
    const {navigate, goBack} = this.props.navigation;
    const { lang } = this.props.navigation.state.params;
    const {
      container,
      headCatStyle,headContent, wrapDistribute,shadown,wrapFilter,
      show,hide,colorTextPP,colorNumPP,
      wrapListLoc,flatItem,flatlistItem,imgFlatItemLoc,wrapFlatRight
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={closeIC} style={{width:20, height:20,marginTop:5}} />
              </TouchableOpacity>
               <Text style={{color:'white',fontSize:18,paddingTop:5}}> Phân loại </Text>

              <View></View>
          </View>
      </View>
<View style={wrapFilter}>
    <View style={{marginBottom:15}}>
    <Text>{this.state.lang.choose_create}</Text>

    </View>
    <View style={[wrapDistribute,shadown]}>
    <View style={flatlistItem}>
        <FlatList
           numColumns={3}
           data={this.state.listCategory}
           renderItem={({item}) =>(
             <TouchableOpacity
              onPress={()=>navigate('FormCreateScr',{idCat:item.id,sub_cat:item.sub_category,serv_items:item.service_items,lang:this.state.selectLang})}
              style={flatItem}>
                 <Image style={imgFlatItemLoc} source={{uri:`${global.url_media}${item.image}`}} />
                 <Text>{item.name}</Text>
             </TouchableOpacity>
           )}
           keyExtractor={item => item.id}
         />
         </View>
    </View>
  </View>

      </View>
    );
  }
}
