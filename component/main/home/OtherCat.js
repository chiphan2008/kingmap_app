/* @flow */

import React, { Component } from 'react';
import {Keyboard,Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,FlatList,
} from 'react-native';
import SvgUri from 'react-native-svg-uri';
const {height, width} = Dimensions.get('window');

import {checkSVG} from '../../libs';
import styles from '../../styles';
import global from '../../global';
import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';

import closeIC from '../../../src/icon/ic-white/ic-close.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import infoIC from '../../../src/icon/ic-white/ic-analysis.png';
import socialIC from '../../../src/icon/ic-white/ic-social.png';


export default class OtherCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategory : [],
      selectLang: {
        valueLang : '',
        labelLang : '',
      },
    }
    Keyboard.dismiss();
  }

  getCategory(lang){
    getApi(global.url+'categories?language='+lang+'&limit=100')
    .then(arrCategory => {
      //console.log('arrCategory',arrCategory.data);
        this.setState({ listCategory: arrCategory.data });
    })
    .catch(err => console.log(err));
  }

  componentWillMount(){
    getLanguage().then((e) => {this.getCategory(e.valueLang);
      this.setState({selectLang: {
        valueLang : e.valueLang,
        labelLang : e.labelLang,
      },})
    });
  }

  render() {
    //console.log('OtherCat');
    const {navigate, goBack} = this.props.navigation;
    const { curLoc } = this.props.navigation.state.params || {};
    //console.log(curLoc);
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
              <TouchableOpacity style={{alignItems:'center'}}>
                    <Text style={{color:'white',fontSize:18,paddingTop:5}}> Phân loại </Text>
              </TouchableOpacity>
              <View></View>
          </View>
      </View>
<View style={wrapFilter}>
    <View style={[wrapDistribute,shadown]}>
    <View style={flatlistItem}>
        <FlatList
           numColumns={3}
           data={this.state.listCategory}
           renderItem={({item}) =>(
             <TouchableOpacity
              onPress={()=>navigate('SearchScr',{keyword:'',idCat:item.id,labelCat:item.name,service_items:item.service_items,lang:this.state.selectLang.valueLang,curLoc})}
              style={flatItem}>
                {checkSVG(item.image)?
                  <SvgUri width="70" height="70" source={{uri:`${global.url_media}${item.image}`}} />
                  :
                  <Image style={imgFlatItemLoc} source={{uri:`${global.url_media}${item.image}`}} />
                }
                 <Text style={{textAlign:'center'}} numberOfLines={2}>{item.name}</Text>
             </TouchableOpacity>
           )}
           style={{marginBottom:110}}
           keyExtractor={item => item.id}
         />
         </View>
    </View>
  </View>

      </View>
    );
  }
}
