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
import {format_number} from '../../libs';
import Moment from 'moment';

import likeIcon from '../../../src/icon/ic-like.png';
import likeFullIcon from '../../../src/icon/ic-like-full.png';
import favoriteIcon from '../../../src/icon/ic-favorite.png';
import favoriteFullIcon from '../../../src/icon/ic-favorite-full.png';
import ImageViewer from './ImageViewer';

const {width,height} = Dimensions.get('window');

function formatDate(d){
  return Moment(d).format('DD/MM/YYYY');
}

export default class Discounts extends Component {
  constructor(props){
    super(props);
    this.state = {
      showDiscount: false,
      index:0
    }
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
      txtAddrOver,imgSpace,marRight,marRight5,favIC,show,hide
    } = styles;
    const { showDiscount, index } = this.state;
    const {listDiscounts,curLoc,lang} = this.props;
    const {navigate } = this.props.navigation;
    return (
      <View style={wrapContentDetail}>

        <View style={titleSpace}>
            <Text style={[colorNumPP,sizeTitle]}>{'Khuyến mãi'.toUpperCase()}{` (${listDiscounts.length})`}</Text>
        </View>

        <View>
          <FlatList
           horizontal extraData={this.state}
           showsHorizontalScrollIndicator={false}
           ListEmptyComponent={<Text style={{color:'#6587A8'}}>{lang.updating}</Text>}
           initialNumToRender={20}
           data={listDiscounts}  keyExtractor={(item,index) => index.toString()}
           renderItem={({item,index}) => (
             //index<20 &&
             <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                 <View style={[widthHafl,marRight]}>
                   <TouchableOpacity
                   onPress={()=>{
                    this.setState({showDiscount:true,index})
                     //navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang:lang.lang})
                   }}
                   >
                   <Image source={{uri :`${global.url_media}${item.image}`}} style={imgSpace}/>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>{}}>
                    <Text style={colorText} numberOfLines={2}>{item.name}</Text>
                    <Text style={txtAddrOver} numberOfLines={1}>{`${format_number(item.price)} ${item.currency}`}</Text>
                    <Text style={colorText} numberOfLines={1}>{item.description}</Text>
                   </TouchableOpacity>

                   <View style={{flexDirection:'row',marginTop:5,alignItems:'flex-end'}}>

                   </View>
                 </View>

             </View>
           )}
        />
        {showDiscount &&
          <ImageViewer
        visible={showDiscount}
        local={true}
        data={listDiscounts}
        index={index}
        closeModal={()=>this.setState({showDiscount:false,index:0})}
        />}
        </View>

        <View style={rowFlex}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapContentDetail:{flexWrap:'wrap',width,padding:10,paddingLeft:20,backgroundColor:'#fff'},
  rowFlex:{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},
  titleSpace:{flexDirection:'row',justifyContent:'space-between',paddingBottom:30,paddingLeft:0,paddingRight:0},
  colorText :{color:'#303B50',fontSize:17,marginTop:7},
  colorNumPP :{fontWeight: 'bold',color:'#2F353F'},
  sizeTitle:{fontSize:16},
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
  show : { display: 'flex',},
  hide : { display: 'none'},
});
