/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
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
    const {listGroup} = this.props;
    const {navigate} = this.props.navigation;

    return (
      <View>
      {listGroup.length>0 ?
        <View>
        <Carousel
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          data={listGroup}
          renderItem={({item}) =>(
            <View style={[widthHafl,marRight]}
                key={item.id}>
                <TouchableOpacity
                onPress={()=> {navigate('DetailScr',{
                  idContent:item.id,lat:item.lat,lng:item.lng
                })}}
                style={[widthHafl,marRight]}>
                    <Image source={{uri :`${global.url_media}${item.avatar}`}} style={imgSpace}/>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=> {navigate('DetailScr',{
                  idContent:item.id,lat:item.lat,lng:item.lng
                })} }
                style={[widthHafl,marRight]}>
                    <Text style={colorText} numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
                    <Text style={txtAddrOver} numberOfLines={1}>{`${item.address}${', '}${item._district.name}${', '}${item._city.name}`}</Text>
                </View>
          )}
          sliderWidth={width}
          itemWidth={(width-50)/2}
          onSnapToItem={(index) => this.setState({ activeSlide: index }) }
          />

        </View>
          :
        <View></View>
      }
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
  marRight:{marginRight:10},
});
