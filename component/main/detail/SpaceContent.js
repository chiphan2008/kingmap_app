/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
  WebView,Modal,FlatList,
} from 'react-native';
import ImageViewer from './ImageViewer';
import VideoViewer from './VideoViewer';
//
//import FacebookPlayer from 'react-facebook-player';
import global from '../../global';
import {getThumbVideo} from '../../libs';
const {width,height} = Dimensions.get('window');


export default class SpaceContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      index:0,
      showImageMenu:false,
      showImgSpace:false,
      showVideo:false,
      linkVideo:'',
    }
  }

  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      rowFlex,titleSpace,rowFlexImg,show,hide,
      colorNumPP,sizeTitle,spaceContent,imgSpace,
    } = styles;
    const {listImgSpace,listImgMenu,listImgVideo,idContent,lang} = this.props;
    const {navigate} = this.props.navigation;
    const {showImgSpace,showImageMenu,index,showVideo,linkVideo} = this.state;

    return (
      <View style={spaceContent}>
          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>{lang.space.toUpperCase()} ({listImgSpace.length})</Text>
              <TouchableOpacity
              style={listImgSpace.length>0 ? show : hide}
              onPress={()=>navigate('ListIMGScr',{
                idContent,
                spaceTab:'active',menuTab:'',videoTab:'',lang})
              }>
              <Text>{lang.view_all} >></Text>
              </TouchableOpacity>
          </View>
          <FlatList
             horizontal
             //pagingEnabled
             ListEmptyComponent={<Text>{lang.updating}</Text>}
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item,index) => index.toString()}
             extraData={this.state}
             data={listImgSpace}
             renderItem={({item,index}) => (
               <View style={rowFlexImg}>
                 <TouchableOpacity onPress={()=> this.setState({index,showImgSpace:true})} >
                     <Image source={{uri :`${item.url}`}} style={imgSpace}/>
                 </TouchableOpacity>
               </View>
          )} />


          {showImgSpace &&
            <ImageViewer
          visible={showImgSpace}
          data={listImgSpace}
          index={index}
          closeModal={()=>this.setState({showImgSpace:false,index:0})}
          />}

          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>{lang.image.toUpperCase()} ({listImgMenu.length})</Text>
              <TouchableOpacity
              style={listImgMenu.length>0 ? show : hide}
              onPress={()=>navigate('ListIMGScr',{
                idContent,
                spaceTab:'',menuTab:'active',videoTab:'',lang})}
              >
              <Text>{lang.view_all} >></Text>
              </TouchableOpacity>
          </View>

          <FlatList
             horizontal
             //pagingEnabled
             ListEmptyComponent={<Text>{lang.updating}</Text>}
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item,index) => index.toString()}
             extraData={this.state}
             data={listImgMenu}
             renderItem={({item,index}) => (
               <View style={rowFlexImg}>
                 <TouchableOpacity onPress={()=> this.setState({index,showImageMenu:true})} >
                     <Image source={{uri :`${item.url}`}} style={imgSpace}/>
                 </TouchableOpacity>
               </View>
          )} />

          {showImageMenu &&
            <ImageViewer
          visible={showImageMenu}
          data={listImgMenu}
          index={index}
          closeModal={()=>this.setState({showImageMenu:false,index:0})}
          />}




          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>VIDEO ({listImgVideo.length})</Text>
              <TouchableOpacity
              style={listImgVideo.length>0 ? show : hide}
              onPress={()=>navigate('ListIMGScr',{
                idContent, spaceTab:'',menuTab:'',videoTab:'active',lang})}
              >
              <Text>{lang.view_all} >></Text>
              </TouchableOpacity>
          </View>

          <FlatList
             horizontal
             //pagingEnabled
             ListEmptyComponent={<Text>{lang.updating}</Text>}
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item,index) => index.toString()}
             extraData={this.state}
             data={listImgVideo}
             renderItem={({item,index}) => (
               <TouchableOpacity style={rowFlexImg}
               onPress={()=>{
                 this.setState({showVideo:true,linkVideo:item})
               }}>
               <Image style={{width:(width-50)/2,height:width/3,marginRight:10,resizeMode: 'cover'}}
               source={{uri: getThumbVideo(item) }} />
               </TouchableOpacity>
          )} />

          <VideoViewer
          visible={showVideo}
          link={linkVideo}
          closeModal={()=>this.setState({showVideo:false,linkVideo:''})}
          />

          <View style={{height:30}}></View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowFlexImg:{flexDirection:'row',marginBottom:20},
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
  spaceContent : {
      width: width - 20,paddingLeft:20
  },
  show : { display: 'flex'},
  hide : { display: 'none'},
});
