/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,FlatList
} from 'react-native';
import SvgUri from 'react-native-svg-uri';
const {height, width} = Dimensions.get('window');

import {checkSVG} from '../libs';
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
    getApi(global.url+'categories?language='+lang+'&limit=500')
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
    //console.log('ChooseCat');
    const {navigate, goBack} = this.props.navigation;
    const { lang } = this.props.navigation.state.params;
    const {
      container,
      headCatStyle,headContent, wrapDistribute,shadown,wrapFilter,
      show,hide,colorTextPP,colorNumPP,
      flatItem,flatlistItem,imgFlatItemLoc,wrapFlatRight
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={closeIC} style={{width:20, height:20,marginTop:5}} />
              </TouchableOpacity>
               <Text style={{color:'white',fontSize:18,paddingTop:5}}> {this.state.lang.classify} </Text>
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
           extraData={this.state}
           data={this.state.listCategory}
           renderItem={({item}) =>(
             <TouchableOpacity
              onPress={()=>navigate('FormCreateScr',{idCat:item.id,nameCat:item.name,sub_cat:item.sub_category,serv_items:item.service_items,lang:this.state.selectLang.valueLang})}
              style={flatItem}>
              {checkSVG(item.image)?
                <SvgUri width="70" height="70" source={{uri:`${global.url_media}${item.image}`}} />
                :
                <Image style={imgFlatItemLoc} source={{uri:`${global.url_media}${item.image}`}} />
              }

                 <Text>{item.name}</Text>
             </TouchableOpacity>
           )}
           style={{marginBottom:Platform.OS==='ios' ? 0 : 170}}
           keyExtractor={item => item.id.toString()}
         />
         </View>
    </View>
  </View>

      </View>
    );
  }
}
