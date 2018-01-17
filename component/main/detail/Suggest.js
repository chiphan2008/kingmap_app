/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
} from 'react-native';
import global from '../../global';

import likeIcon from '../../../src/icon/ic-like.png';
import likeFullIcon from '../../../src/icon/ic-like-full.png';
import favoriteIcon from '../../../src/icon/ic-favorite.png';
import favoriteFullIcon from '../../../src/icon/ic-favorite-full.png';

const {width,height} = Dimensions.get('window');


export default class Suggest extends Component {
  constructor(props){
    super(props);

  }

  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      wrapContentDetail,rowFlex,titleSpace,
      colorText,colorNumPP,sizeTitle,widthHafl,
      txtAddrOver,imgSpace,
    } = styles;
    const {listSuggest} = this.props;
    const {navigate} = this.props.navigation;

    return (
      <View style={wrapContentDetail}>

        <View style={titleSpace}>
            <Text style={[colorNumPP,sizeTitle]}>KINGMAP GỢI Ý</Text>
        </View>

        {listSuggest.length>0 ?
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <View style={widthHafl}>
            <TouchableOpacity
            onPress={()=>navigate('DetailScr',{idContent:listSuggest[0].id,lat:listSuggest[0].lat,lng:listSuggest[0].lng,})}
            >
            <Image source={{uri :`${global.url_media}${listSuggest[0].avatar}`}} style={imgSpace}/>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>navigate('DetailScr',{idContent:listSuggest[0].id,lat:listSuggest[0].lat,lng:listSuggest[0].lng,})}
            >
            <Text style={colorText} numberOfLines={2}>{listSuggest[0].name}</Text>
            </TouchableOpacity>
            <Text style={txtAddrOver} numberOfLines={1}>{`${listSuggest[0].address}${', '}${listSuggest[0]._district.name}${', '}${listSuggest[0]._city.name}`}</Text>

            <View style={{flexDirection:'row',marginTop:5}}>
                <View style={{flexDirection:'row',paddingRight:10}}>
                  <Image style={{width:22,height:18,marginRight:5}} source={likeIcon} />
                  <Text>{listSuggest[0].like}</Text>
                </View>
                <View style={{paddingRight:10}}>
                  <Text> | </Text>
                </View>
                <View  style={{flexDirection:'row',paddingRight:10}}>
                  <Image style={{width:18,height:18,marginRight:5}} source={favoriteIcon} />
                  <Text>{listSuggest[0].vote}</Text>
                </View>
            </View>

          </View>

          <View style={widthHafl}>
          <TouchableOpacity
          onPress={()=>{navigate('DetailScr',{
            idContent:listSuggest[1].id,
            lat:listSuggest[1].lat,
            lng:listSuggest[1].lng,})}}
          >
            <Image source={{uri :`${global.url_media}${listSuggest[1].avatar}`}} style={imgSpace}/>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{navigate('DetailScr',{
              idContent:listSuggest[1].id,
              lat:listSuggest[1].lat,
              lng:listSuggest[1].lng,})}}
            >
            <Text style={colorText} numberOfLines={2}>{listSuggest[1].name}</Text>
            </TouchableOpacity>
            <Text style={txtAddrOver} numberOfLines={1}>{listSuggest[1].address}</Text>
            <View style={{flexDirection:'row',marginTop:5}}>
                <View style={{flexDirection:'row',paddingRight:10}}>
                  <Image style={{width:22,height:18,marginRight:5}} source={likeIcon} />
                  <Text>{listSuggest[1].like}</Text>
                </View>
                <View style={{paddingRight:10}}>
                  <Text> | </Text>
                </View>
                <View  style={{flexDirection:'row',paddingRight:10}}>
                  <Image style={{width:18,height:18,marginRight:5}} source={favoriteIcon} />
                  <Text>{listSuggest[1].vote}</Text>
                </View>
            </View>
          </View>

          </View>
          :
          <View></View>
        }

        <View style={rowFlex}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapContentDetail:{flexWrap:'wrap',padding:10,backgroundColor:'#fff'},
  rowFlex:{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},
  titleSpace:{flexDirection:'row',justifyContent:'space-between',padding:30,paddingLeft:0,paddingRight:20,},
  colorText :{color:'#303B50',fontSize:17,marginTop:7},
  colorNumPP :{fontWeight: 'bold',color:'#2F353F'},
  sizeTitle:{fontSize:20},
  widthHafl:{width:(width-40)/2,overflow:'hidden'},
  txtAddrOver:{color:'#6587A8',fontSize:14,overflow:'hidden',marginTop:5},
  imgSpace:{
    width:Platform.OS==='ios' ? 160 : 200,
    height:Platform.OS==='ios' ? 160 : 200,
    marginRight:20
  },
});
