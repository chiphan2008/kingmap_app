/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,FlatList,
} from 'react-native';
import SvgUri from 'react-native-svg-uri';
const {height, width} = Dimensions.get('window');

import {checkSVG} from '../../libs';
import styles from '../../styles';
import global from '../../global';
import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';

import closeIC from '../../../src/icon/ic-white/ic-close.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import infoIC from '../../../src/icon/ic-white/ic-analysis.png';
import socialIC from '../../../src/icon/ic-white/ic-social.png';

var timeoutCat;
export default class LocationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategory : [],
      selectLang: {
        valueLang : '',
        labelLang : '',
      },
      lang:lang_vn,
    }
  }

  getCategory(lang){
    //console.log(global.url+'categories?language='+lang+'&limit=100');
    getApi(global.url+'categories?language='+lang+'&limit=100')
    .then(arrCategory => {
      //console.log('arrCategory1',arrCategory);
      timeoutCat = setTimeout(()=>{
        this.setState({ listCategory: arrCategory.data });
      },1000)

    })
    .catch(err => console.log(err));
  }

  componentWillMount(){
    getLanguage().then((e) => {
      clearTimeout(timeoutCat);
      //console.log(e.valueLang);
      this.getCategory(e.valueLang);
      this.setState({
        selectLang: {
          valueLang : e.valueLang,
          labelLang : e.labelLang,
        },
        lang: e.valueLang==='vn'?lang_vn:lang_en
    })
    });
  }

  render() {
    const {navigate, goBack} = this.props.navigation;
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
              <View></View>
              <TouchableOpacity
                  style={{alignItems:'center'}}
                  onPress={()=>this.setState({showCat :!this.state.showCat})}
                  >
                    <Text style={{color:'white',fontSize:18,paddingTop:5}}> {this.state.lang.classify} </Text>
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
                      onPress={()=>navigate('ListLocScr',{idCat:item.id,labelCat:item.name,sub_cat:item.sub_category,serv_items:item.service_items,lang:this.state.selectLang.valueLang})}
                      style={flatItem}>
                      {checkSVG(item.image)?
                        <SvgUri width="70" height="70" source={{uri:`${global.url_media}${item.image}`}} />
                        :
                        <Image style={imgFlatItemLoc} source={{uri:`${global.url_media}${item.image}`}} />
                      }

                         <Text>{item.name}</Text>
                     </TouchableOpacity>
                   )}
                   keyExtractor={item => item.id}
                   style={{marginBottom:Platform.OS==='ios' ? 130 : 165,}}
                 />
                 </View>
            </View>
          </View>

      </View>
    );
  }
}
