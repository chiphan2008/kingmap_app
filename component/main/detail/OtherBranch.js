/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,FlatList,
} from 'react-native';
//import Carousel, { Pagination } from 'react-native-snap-carousel';
import global from '../../global';

const {width,height} = Dimensions.get('window');


export default class OtherBranch extends Component {
  constructor(props){
    super(props);
    this.state={
      activeSlide:0,
    }
  }

  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      widthHafl,marRight,
      imgSpace,colorText,txtAddrOver,
    } = styles;
    const { listGroup,lang,curLoc } = this.props;
    const { navigate } = this.props.navigation;

    return (
      <View>
      <FlatList
         horizontal extraData={this.state}
         showsHorizontalScrollIndicator={false}
         data={listGroup}  keyExtractor={(item,index) => index.toString()}
         renderItem={({item,index}) => (
           <View style={[widthHafl,marRight]}
               key={item.id}>
               <TouchableOpacity
               onPress={()=> {navigate('DetailScr',{
                 idContent:item.id,lat:item.lat,lng:item.lng,lang:lang.lang,curLoc
               })}}
               style={[widthHafl,marRight]}>
                   <Image source={{uri :`${global.url_media}${item.avatar}`}} style={imgSpace}/>
               </TouchableOpacity>
               <TouchableOpacity
               onPress={()=> {navigate('DetailScr',{
                 idContent:item.id,lat:item.lat,lng:item.lng,lang:lang.lang,curLoc
               })} }
               style={[widthHafl,marRight]}>
                   <Text style={colorText} numberOfLines={2}>{item.name}</Text>
               </TouchableOpacity>
               <Text style={txtAddrOver} numberOfLines={1}>{`${item.address}${', '}${item._district.name}${', '}${item._city.name}`}</Text>
           </View>
         )}
      />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapContentDetail:{flexWrap:'wrap',padding:10,backgroundColor:'#fff'},
  rowFlex:{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},
  titleSpace:{flexDirection:'row',justifyContent:'space-between',paddingTop:30,paddingBottom:30,paddingLeft:0,paddingRight:0},
  colorText :{color:'#303B50',fontSize:17,marginTop:7},
  colorNumPP :{fontWeight: 'bold',color:'#2F353F'},
  sizeTitle:{fontSize:20},
  widthHafl:{width:(width-40)/2,overflow:'hidden'},
  txtAddrOver:{color:'#6587A8',fontSize:14,overflow:'hidden',marginTop:5},
  imgSpace:{
    width:(width-50)/2,
    height:(width/3),
    marginRight:10
  },
  marRight:{marginRight:10},
});
