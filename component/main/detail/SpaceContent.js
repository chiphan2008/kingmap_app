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
import {getThumbVideo, format_number} from '../../libs';
const {width,height} = Dimensions.get('window');


export default class SpaceContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      index:0,
      showImageMenu:false,
      showImgSpace:false,
      showVideo:false,
      showImageProduct: false,
      linkVideo:{},
      listImgProduct: []
    }
  }
  getListImg(){
    const {listProduct} = this.props;
    let listImgProduct = [];
    console.log('listProduct',listProduct)
    listProduct.map((item) => {
      return listImgProduct.push({url :`${global.url_media}${item.image}`,description:item.description,name:item.name,id:item.id,price: item.price,currency:item.currency});
    })
    this.setState({listImgProduct: listImgProduct})
  }

  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      rowFlex,titleSpace,rowFlexImg,show,hide,widthHafl,colorText,
      colorNumPP,sizeTitle,spaceContent,imgSpace,txtAddrOver,
    } = styles;
    const {listImgSpace,listImgMenu,listImgVideo,idContent,lang,moderation,listProduct} = this.props;
    const {navigate} = this.props.navigation;
    const {showImgSpace,showImageMenu,index,showVideo,linkVideo,listImgProduct,showImageProduct} = this.state;
    // console.log('listProduct', listProduct)
    return (
      <View style={spaceContent}>
          <View style={titleSpace}>
              <Text style={[colorNumPP,sizeTitle]}>{lang.space.toUpperCase()} ({listImgSpace.length})</Text>
              <TouchableOpacity
              style={[listImgSpace.length>0 ? show : hide, {justifyContent: 'center'}]}
              onPress={()=>navigate('ListIMGScr',{
                idContent,moderation,type: 'space',
                spaceTab:'active',menuTab:'',videoTab:'',productTab: '',lang})
              }>
              <Text style={{color:'#6587A8', fontSize: 13}}>{lang.view_all} >></Text>
              </TouchableOpacity>
          </View>
          <FlatList
             horizontal
             //pagingEnabled
             ListEmptyComponent={<Text style={{color:'#6587A8'}}>{lang.updating}</Text>}
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
              style={[listImgMenu.length>0 ? show : hide, {justifyContent: 'center'}]}
              onPress={()=>navigate('ListIMGScr',{
                idContent,moderation,type: 'menu',
                spaceTab:'',menuTab:'active',videoTab:'',productTab: '',lang})}
              >
              <Text style={{color:'#6587A8', fontSize: 13}}>{lang.view_all} >></Text>
              </TouchableOpacity>
          </View>

          <FlatList
             horizontal
             //pagingEnabled
             ListEmptyComponent={<Text style={{color:'#6587A8'}}>{lang.updating}</Text>}
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
              style={[listImgVideo.length>0 ? show : hide, {justifyContent: 'center'}]}
              onPress={()=>navigate('ListIMGScr',{
                idContent,moderation,spaceTab:'',type: 'video', menuTab:'',videoTab:'active',productTab: '',lang})}
              >
              <Text style={{color:'#6587A8', fontSize: 13}}>{lang.view_all} >></Text>
              </TouchableOpacity>
          </View>

          <FlatList
             horizontal
             //pagingEnabled
             ListEmptyComponent={<Text style={{color:'#6587A8'}}>{lang.updating}</Text>}
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
               source={{uri: item.thumbnail }} />
               </TouchableOpacity>
          )} />

          <View style={[titleSpace, {}]}>
              <Text style={[colorNumPP,sizeTitle]}>{lang.products_services.toUpperCase()} ({listProduct.length})</Text>
              <TouchableOpacity
              style={[listProduct.length>0 ? show : hide, {justifyContent: 'center'}]}
              onPress={()=>navigate('ListIMGScr',{
                idContent,moderation,spaceTab:'',type: 'product', menuTab:'',videoTab:'',productTab: 'active',lang})}
              >
              <Text style={{color:'#6587A8', fontSize: 13}}>{lang.view_all} >></Text>
              </TouchableOpacity>
          </View>

          <FlatList
             horizontal
             //pagingEnabled
             ListEmptyComponent={<Text style={{color:'#6587A8'}}>{lang.updating}</Text>}
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item,index) => index.toString()}
             extraData={this.state}
             data={listProduct}
             renderItem={({item,index}) => (
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10, paddingRight: 5}}>
                <View style={[widthHafl]}>
                  <TouchableOpacity
                  onPress={()=>{ this.setState({showImageProduct: true,index}, () => {
                    this.setState({listImgProduct: []});
                    this.getListImg();
                  })}}
                  >
                  <Image source={{uri :`${global.url_media}${item.image}`}} style={[imgSpace]}/>
                  </TouchableOpacity>
                  <Text style={colorText} numberOfLines={2}>{item.name}</Text>
                  <Text style={txtAddrOver} numberOfLines={1}>{`${format_number(item.price)} ${item.currency}`}</Text>
                </View>

              </View>
          )} />
          {showImageProduct &&
            <ImageViewer
          visible={showImageProduct}
          data={listImgProduct}
          index={index}
          closeModal={()=>this.setState({showImageProduct:false,index:0})}
          />}

          <VideoViewer
          visible={showVideo}
          link={linkVideo}
          closeModal={()=>this.setState({showVideo:false,linkVideo:{} })}
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
  sizeTitle:{fontSize:16},
  widthHafl:{width:(width-30)/2,overflow:'hidden'},
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
