/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,
  FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import styles from '../../styles';
import global from '../../global';
import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';

import closeIC from '../../../src/icon/ic-white/ic-close.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import infoIC from '../../../src/icon/ic-white/ic-analysis.png';
import socialIC from '../../../src/icon/ic-white/ic-social.png';


export default class Hometab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategory : [],
    }
  }

  getCategory(lang){
    getApi(global.url+'categories?language='+lang)
    .then(arrCategory => {
      //console.log('arrCategory',arrCategory);
        this.setState({ listCategory: arrCategory.data });
    })
    .catch(err => console.log(err));
  }

  componentWillMount(){
    getLanguage().then((e) => this.getCategory(e.valueLang));
  }

  render() {
    //console.log('distribute');
    const {navigate,goBack} = this.props.navigation;
    const {name_module, lang} = this.props.navigation.state.params;
    //console.log('DistributeTab');
    //console.log("this.props.DistributeTab=",util.inspect(this.props.navigation,false,null));
    const {
      container,
      headCatStyle,headContent, wrapDistribute,shadown, wrapFilter,
      show,hide,colorTextPP,colorNumPP,
      wrapListLoc,flatItem,flatlistItem,imgFlatItemLoc,wrapFlatRight

    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={closeIC} style={{width:20, height:20}} />
              </TouchableOpacity>
              <TouchableOpacity
                    style={{alignItems:'center'}}
                    onPress={()=>this.setState({showCat :!this.state.showCat})}
                    >
                    <Text style={{color:'white',fontSize:18}}>{name_module}</Text>
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
             onPress={()=>navigate('CatScr',{idCat:item.id,idSub:item.sub_category[0].id,sub_cat:item.sub_category,serviceItem:item.service_items,name_cat:item.name,lang})}
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
