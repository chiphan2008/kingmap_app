/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
  FlatList,
} from 'react-native';
//import Carousel from 'react-native-snap-carousel';
import Rating from './Rating';
import global from '../../global';
import getApi from '../../api/getApi';

import likeIcon from '../../../src/icon/ic-like.png';
import likeFullIcon from '../../../src/icon/ic-like-full.png';
import favoriteIcon from '../../../src/icon/ic-favorite.png';
import favoriteFullIcon from '../../../src/icon/ic-favorite-full.png';

const {width,height} = Dimensions.get('window');


export default class Suggest extends Component {
  constructor(props){
    super(props);

  }
  saveVote(rate,id_content){
    const {isLogin,userId} = this.props;
    if(isLogin){
      getApi(`${global.url}${'vote?content='}${id_content}${'&user='}${userId}${'&point='}${rate}`).then(e=>
        {this.props.refresh();}
      );
    }else {
      this.props.requestLogin();
    }
  }
  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      wrapContentDetail,rowFlex,titleSpace,
      colorText,colorNumPP,sizeTitle,widthHafl,
      txtAddrOver,imgSpace,marRight,marRight5,favIC,
    } = styles;
    const {listSuggest,curLoc,lang} = this.props;
    const {navigate } = this.props.navigation;
    //console.log('listSuggest',listSuggest.length);
    return (
      <View style={wrapContentDetail}>

        <View style={titleSpace}>
            <Text style={[colorNumPP,sizeTitle]}>{lang.kingmap_suggest.toUpperCase()}</Text>
        </View>

        <FlatList
           horizontal extraData={this.state}
           showsHorizontalScrollIndicator={false}
           initialNumToRender={20}
           data={listSuggest}  keyExtractor={(item,index) => index.toString()}
           renderItem={({item,index}) => (
             //index<20 &&
             <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                 <View style={[widthHafl,marRight]}>
                   <TouchableOpacity
                   onPress={()=>{
                     this.props.refresh(item.id)
                     //navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang})
                   }}
                   >
                   <Image source={{uri :`${global.url_media}${item.avatar}`}} style={imgSpace}/>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang})}
                   >
                   <Text style={colorText} numberOfLines={2}>{item.name}</Text>
                   </TouchableOpacity>
                   <Text style={txtAddrOver} numberOfLines={1}>{`${item.address}${', '}${item._district.name}${', '}${item._city.name}`}</Text>

                   <View style={{flexDirection:'row',marginTop:5,alignItems:'flex-end'}}>
                       <View style={{flexDirection:'row',paddingRight:5}}>
                         <Image style={{width:22,height:18,marginRight:5}} source={item.like>0 ? likeFullIcon :  likeIcon} />
                         <Text>{item.like}</Text>
                       </View>
                       <View style={{paddingRight:5}}>
                         <Text> | </Text>
                       </View>

                       <View style={{flexDirection:'row',paddingRight:5}}>
                          <Image source={item.vote>0 ? favoriteFullIcon : favoriteIcon } style={{width:19,height:18,marginRight:5}} />
                          <Text>{item.vote}</Text>
                       </View>

                       {/*<View  style={{flexDirection:'row',paddingRight:5}}>
                         <Image source={item.vote>0 ? favoriteFullIcon : favoriteIcon } style={favIC} />
                         <Text>{item.vote}</Text>
                       </View>*/}
                   </View>
                 </View>

             </View>
           )}
        />


        <View style={rowFlex}></View>
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
  favIC:{width:22,height:21,marginRight:2},
  imgSpace:{
    width:(width-50)/2,
    height:(width/3),
    marginRight:10
  },
  marRight5:{marginRight:5},
  marRight:{marginRight:10},
});
