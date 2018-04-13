/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
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
      txtAddrOver,imgSpace,marRight,
    } = styles;
    const {listSuggest,curLoc,lang} = this.props;
    const {navigate } = this.props.navigation;

    return (
      <View style={wrapContentDetail}>

        <View style={titleSpace}>
            <Text style={[colorNumPP,sizeTitle]}>KINGMAP GỢI Ý</Text>
        </View>
        {listSuggest.length>0 ?
          <Carousel
            activeSlideAlignment={'start'}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            data={listSuggest}
            renderItem={({item,index}) =>(
              index<20 &&
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:50}}>
                  <View style={[widthHafl,marRight]}>
                    <TouchableOpacity
                    onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang})}
                    >
                    <Image source={{uri :`${global.url_media}${item.avatar}`}} style={imgSpace}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc,lang})}
                    >
                    <Text style={colorText} numberOfLines={2}>{item.name}</Text>
                    </TouchableOpacity>
                    <Text style={txtAddrOver} numberOfLines={1}>{`${item.address}${', '}${item._district.name}${', '}${item._city.name}`}</Text>

                    <View style={{flexDirection:'row',marginTop:5}}>
                        <View style={{flexDirection:'row',paddingRight:10}}>
                          <Image style={{width:22,height:18,marginRight:5}} source={likeIcon} />
                          <Text>{item.like}</Text>
                        </View>
                        <View style={{paddingRight:10}}>
                          <Text> | </Text>
                        </View>
                        <View  style={{flexDirection:'row',paddingRight:10}}>
                          <Image style={{width:18,height:18,marginRight:5}} source={favoriteIcon} />
                          <Text>{item.vote}</Text>
                        </View>
                    </View>

                  </View>

              </View>
            )}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            />

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
    width:(width-50)/2,
    height:(width/3),
    marginRight:10
  },
  marRight:{marginRight:10},
});
