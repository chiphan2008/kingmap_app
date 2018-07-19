/* @flow */

import React, { Component } from 'react';
import {Keyboard,Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,FlatList,ActivityIndicator,
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
//import * as _ from 'lodash';

export default class OtherCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategory : [],
      selectLang: {
        valueLang : '',
        labelLang : '',
      },
      loadMore:false,
      page:0,
    }
    Keyboard.dismiss();
  }

  getCategory(page = null){
    const { valueLang } = this.state.selectLang;
    const limit = 20;
    const skip = page===null?0:page;
    let url = `${global.url}${'categories?language='}${valueLang}${'&skip='}${skip}${'&limit='}${limit}`;
    //console.log(url);
    getApi(url).then(arrCategory => {
        this.state.listCategory = skip===0?arrCategory.data:this.state.listCategory.concat(arrCategory.data);
        this.state.page = skip+limit;
        this.state.loadMore = arrCategory.data.length<limit?false:true;
        this.setState(this.state);
    }).catch(err => console.log(err));
  }

  componentDidMount(){
    getLanguage().then((e) => {
      this.setState(
        {selectLang:
          {
            valueLang : e.valueLang,
            labelLang : e.labelLang,
          },
        },()=>{this.getCategory()})
    });
  }

  render() {
    //console.log('OtherCat');
    const {navigate, goBack} = this.props.navigation;
    const {page, loadMore} = this.state;
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
              <TouchableOpacity onPress={()=>goBack()}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
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
           extraData={this.state}
           bounces={false}
           onEndReachedThreshold={0.01}
           onEndReached={() => {
            this.state.loadMore && this.setState({loadMore:false},()=>{
              this.getCategory(page);
            });
           }}
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
           style={{marginBottom:Platform.OS!=='ios'?110:75}}
           keyExtractor={item => item.id.toString()}

           ListFooterComponent={() => {
            return (
              <View>
                {this.state.loadMore && <ActivityIndicator size="large" color="#d0021b" />}
              </View>
            )
          }}
         />
         </View>
    </View>
  </View>

      </View>
    );
  }
}
