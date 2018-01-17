/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
  WebView,
} from 'react-native';
//
//import FacebookPlayer from 'react-facebook-player';
import global from '../../global';

const {width,height} = Dimensions.get('window');


export default class SpaceContent extends Component {
  constructor(props){
    super(props);

  }

  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      rowFlex,titleSpace,rowFlexImg,
      colorNumPP,sizeTitle,spaceContent,imgSpace,
    } = styles;
    const {listImgSpace,listImgMenu,listImgVideo,idContent} = this.props;
    const {navigate} = this.props.navigation;

    return (
      <View style={spaceContent}>
          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>KHÔNG GIAN ({listImgSpace.length})</Text>
              <TouchableOpacity
              onPress={()=>navigate('ListIMGScr',{
                idContent,
                spaceTab:'active',menuTab:'',videoTab:''})}
              >
              <Text>Xem tất cả >></Text>
              </TouchableOpacity>
          </View>
          {listImgSpace.length>0 ?
            <View style={rowFlexImg}>
            <Image source={{uri :`${global.url_media}${listImgSpace[0]}`}} style={imgSpace}/>
            <Image source={{uri :`${global.url_media}${listImgSpace[1]}`}} style={imgSpace}/>
            </View>
            :
            <View></View>
          }

          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>MENU ({listImgMenu.length})</Text>
              <TouchableOpacity
              onPress={()=>navigate('ListIMGScr',{
                idContent,
                spaceTab:'',menuTab:'active',videoTab:''})}
              >
              <Text>Xem tất cả >></Text>
              </TouchableOpacity>
          </View>
          {listImgMenu.length>0 ?
            <View style={rowFlexImg}>
            <Image source={{uri :`${global.url_media}${listImgMenu[0]}`}} style={imgSpace}/>
            <Image source={{uri :`${global.url_media}${listImgMenu[1]}`}} style={imgSpace}/>
            </View>
          :
          <View></View>
          }

          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>VIDEO</Text>
              <TouchableOpacity
              onPress={()=>navigate('ListIMGScr',{
                idContent,
                spaceTab:'',menuTab:'',videoTab:'active'})}
              >
              <Text>Xem tất cả >></Text>
              </TouchableOpacity>
          </View>
          {listImgVideo.length>0 ?
            <View style={rowFlexImg}>

            <WebView
              source={{uri: `${listImgVideo[0]}`}}
              style={imgSpace}
              javaScriptEnabled
            />
            { listImgVideo.length===2 ?
              <WebView
                source={{uri: `${listImgVideo[1]}`}}
                style={imgSpace}
                javaScriptEnabled
              />
              :
              <View></View>
            }
            </View>
            :
            <View></View>
          }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowFlexImg:{flexDirection:'row',marginBottom:20},
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
  spaceContent : {
      width: width - 20,paddingLeft:20
  },
});
