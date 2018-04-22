/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
  WebView,Modal,FlatList,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
//
//import FacebookPlayer from 'react-facebook-player';
import global from '../../global';
import closeIC from '../../../src/icon/ic-white/ic-close.png';

const {width,height} = Dimensions.get('window');


export default class SpaceContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      index:0,
      showImageMenu:false,
      showImgSpace:false,
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
    const {showImgSpace,showImageMenu,index} = this.state;

    return (
      <View style={spaceContent}>
          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>{lang.space.toUpperCase()} ({listImgSpace.length})</Text>
              <TouchableOpacity
              style={listImgSpace.length>0 ? show : hide}
              onPress={()=>navigate('ListIMGScr',{
                idContent,
                spaceTab:'active',menuTab:'',videoTab:'',lang})}
              >
              <Text>{lang.view_all} >></Text>
              </TouchableOpacity>
          </View>
          <FlatList
             horizontal
             ListEmptyComponent={<Text>{lang.updating}</Text>}
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item,index) => index}
             extraData={this.state}
             data={listImgSpace}
             renderItem={({item,index}) => (
               <View style={rowFlexImg}>
                 <TouchableOpacity onPress={()=> this.setState({index,showImgSpace:true})} >
                     <Image source={{uri :`${item.url}`}} style={imgSpace}/>
                 </TouchableOpacity>
               </View>
          )} />

          <Modal onRequestClose={() => null} visible={showImgSpace} transparent>
            <TouchableOpacity onPress={()=>this.setState({showImgSpace:false})}
            style={{position:'absolute',padding:10,alignSelf:'flex-end',zIndex:9999}}>
              <Image source={closeIC} style={{width:18,height:18}} />
            </TouchableOpacity>
            <ImageViewer
            imageUrls={listImgSpace}
            index={index} enableImageZoom saveToLocalByLongPress={false}
            onChange={(index) => console.log(index)}
            enableSwipeDown />
          </Modal>

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
             ListEmptyComponent={<Text>{lang.updating}</Text>}
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item,index) => index}
             extraData={this.state}
             data={listImgMenu}
             renderItem={({item,index}) => (
               <View style={rowFlexImg}>
                 <TouchableOpacity onPress={()=> this.setState({index,showImageMenu:true})} >
                     <Image source={{uri :`${item.url}`}} style={imgSpace}/>
                 </TouchableOpacity>
               </View>
          )} />

            <Modal onRequestClose={() => null} visible={showImageMenu} transparent>
              <TouchableOpacity onPress={()=>this.setState({showImageMenu:false})}
              style={{position:'absolute',padding:10,alignSelf:'flex-end',zIndex:9999}}>
                <Image source={closeIC} style={{width:18,height:18}} />
              </TouchableOpacity>
              <ImageViewer imageUrls={listImgMenu} index={index}
              onChange={(index) => this.setState({ index })}
              enableImageZoom saveToLocalByLongPress={false}/>
            </Modal>


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
             ListEmptyComponent={<Text>{lang.updating}</Text>}
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item,index) => index}
             extraData={this.state}
             data={listImgVideo}
             renderItem={({item,index}) => (
               <View style={rowFlexImg}>
                 <WebView

                    source={{uri: `${item}`}}
                    style={imgSpace}
                    javaScriptEnabled
                    domStorageEnabled
                    automaticallyAdjustContentInsets={false}
                    decelerationRate="normal"
                    //onNavigationStateChange={this.onNavigationStateChange}
                    //onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                 />
               </View>
          )} />
          <View style={{height:30}}></View>

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
