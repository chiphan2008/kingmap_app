/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity,FlatList} from 'react-native';
const {height, width} = Dimensions.get('window');

import getApi from '../../api/getApi';
import global from '../../global';
//import arrTest from '../../arrTest';
import styles from '../../styles';

import sortDown from '../../../src/icon/ic-white/sort-down.png';
import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import likeIC from '../../../src/icon/ic-like.png';
import favoriteIC from '../../../src/icon/ic-favorite.png';
//import logoMap from '../../../src/icon/Logo-map.png';

export default class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCat : false,

      curLocation:{
        latlng: '',
      },
      listData:[],
      nameSubCat: '',
      markers:[{
        id : 1,
        lat: 10.780843591000904,
        lng: 106.67830749999996,
        name: '',
        _district:{name:''},
        _city:{name:''},
        _country:{name:''},
        _category_type:{marker:''},
        address:'',
        avatar:'',
      },],
    };


  }

  getCategory(idcat,idsub=null,name_subCat,loc){
    this.setState({nameSubCat:name_subCat,showCat:false});
    let url = `${global.url}${'content-by-category?category='}${idcat}${'&location='}${loc}`;
    if(idsub!==null) url += `${'&subcategory='}${idsub}`;
    getApi(url)
    .then(arrData => {
      //console.log('parseFloat(marker.lat)',arrTest.data)
        //if(arrData.data.length === 0) arrData.data = this.state.markers;
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }


  render() {

    const {navigate, goBack} = this.props.navigation;
    const { idCat, id_subCat, name_cat, sub_cat, name_subCat,latlng } = this.props.navigation.state.params;
    //console.log("this.props.CategoryScreen=",util.inspect(this.props.navigation.state.key,false,null));
    const {
      container,
      headCatStyle, headContent,plusStyle,
      popover,show,hide,overLayoutCat,shadown,colorText,listCatOver,
      imgFlatItem,catInfoOver,txtTitleOverCat,txtAddrOverCat,wrapInfoOver,
      titleSubCat,wrapFlatList,flatlistItemCat
    } = styles;
    //onRegionChange={this.onRegionChange}
    return (
      <View onLayout={()=>this.getCategory(idCat,id_subCat,name_subCat,latlng)} style={container}>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=> goBack()}>
                <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                </TouchableOpacity>

                <TouchableOpacity
                      style={{alignItems:'center'}}
                      onPress={()=>this.setState({showCat :!this.state.showCat,showInfoOver:false})}
                      >
                      <Text style={{color:'white',fontSize:16}}>{name_cat}</Text>
                      <Image source={sortDown} style={{width:14, height:14}} />
                </TouchableOpacity>
                <View></View>
            </View>
        </View>

        <TouchableOpacity onPress={()=>this.setState({showCat:!this.state.showCat})} style={[popover, this.state.showCat ? show : hide]}>
            <View style={[overLayoutCat,shadown]}>
            <FlatList
               keyExtractor={item => item.id}
               ListEmptyComponent={<Text>Loading ...</Text>}
               data={sub_cat}
               renderItem={({item}) => (
                 <TouchableOpacity
                   onPress={()=>{ this.getCategory(idCat,item.id,item.name,this.state.curLocation.latlng) }}
                   style={listCatOver}>
                     <Text style={colorText}>{item.name}</Text>
                 </TouchableOpacity>
               )} />

            </View>
        </TouchableOpacity>

        <View>
          <Text style={titleSubCat}>{this.state.nameSubCat.toUpperCase()}</Text>
            <View style={wrapFlatList}>
            <FlatList
               keyExtractor={item => item.id}
               data={this.state.listData}
               renderItem={({item}) => (
                  <View style={flatlistItemCat}>
                      <TouchableOpacity
                        onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng})}
                      >
                        <Image style={imgFlatItem} source={{uri:`${global.url_media}${item.avatar}`}} />
                      </TouchableOpacity>
                      <View style={wrapInfoOver}>
                        <View>
                          <TouchableOpacity
                          onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng})}
                          >
                              <Text style={txtTitleOverCat} numberOfLines={2}>{item.name}</Text>
                          </TouchableOpacity>
                              <Text style={txtAddrOverCat} numberOfLines={1}>{`${item.address}${', '}${item._district.name}${', '}${item._city.name}${', '}${item._country.name}`}</Text>
                        </View>

                          <View style={{flexDirection:'row'}}>
                              <View style={{flexDirection:'row',paddingRight:10}}>
                                <Image style={{width:22,height:18,marginRight:5}} source={likeIC} />
                                <Text>{item.like}</Text>
                              </View>
                              <View style={{paddingRight:10}}>
                                <Text> | </Text>
                              </View>
                              <View  style={{flexDirection:'row',paddingRight:10}}>
                                <Image style={{width:18,height:18,marginRight:5}} source={favoriteIC} />
                                <Text>{item.vote}</Text>
                              </View>
                          </View>

                      </View>
                  </View>
               )}

             />
             </View>
          </View>

      </View>
    );
  }
}
