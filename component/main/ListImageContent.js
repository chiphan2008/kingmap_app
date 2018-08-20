/* @flow */
import React, { Component } from 'react';
import {
  View, WebView, Text, StyleSheet, ScrollView,
  Dimensions, Image, TextInput, TouchableOpacity,
  Modal,FlatList} from 'react-native';
const {height, width} = Dimensions.get('window');

//import ImageCarousel from 'react-native-image-carousel';
import ImageViewer from './detail/ImageViewer';
import VideoViewer from './detail/VideoViewer';
import global from '../global';
import getApi from '../api/getApi';
import styles from '../styles';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import logoMap from '../../src/icon/Logo-map.png';
import plusIC from '../../src/icon/ic-home/ic-plus.png';
import closeIC from '../../src/icon/ic-white/ic-close.png';
import {getThumbVideo} from '../libs';

export default class ListImageContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSpace : '',
      showMenu : '',
      showVideo : '',
      showProducts: '',
      listSpace:[],
      listMenu:[],
      listVideo:[],
      listProduct: [],
      arrImgModal:[],
      isModalSpaceOpened: false,
      isModalMenuOpened: false,
      index: 0 ,
      linkVideo:'',
      showModalVideo:false,
      page: 1,
      loadMore: true
    }
  }


  getContent(idContent, type=null, page=null){
    //console.log('idContent',idContent);
    //console.log(`${global.url}${'content/'}${idContent}`);
    const {moderation} = this.props.navigation.state.params;
    // const act = moderation==='request_publish' ? 'content-update/' : 'content/';
    // console.log('`${global.url}${act}${idContent}`',`${global.url}${act}${idContent}`)
    if(page===null) page=0;
    const url = `${global.url}content/image-${type}/${idContent}?skip=${page}&limit=20`;
    
    getApi(url)
    .then(arrData => {
      // console.log(arrData);
      if(type === 'space',arrData){
        arrData.data!==undefined && this.setState({
          listSpace:page === 0 ? arrData.data : this.state.listSpace.concat(arrData.data),
          page: page===0?20:this.state.page+20,
          loadMore: arrData.data.length===20?true:false
        });
      }
      if(type === 'menu'){
        arrData.data!==undefined && this.setState({
          listMenu:page === 0 ? arrData.data : this.state.listMenu.concat(arrData.data),
          page: page===0?20:this.state.page+20,
          loadMore: arrData.data.length===20?true:false
        }, ()=> {});
      } 
      if(type === 'video'){
        arrData.data!==undefined && this.setState({
          listVideo:page === 0 ? arrData.data : this.state.listVideo.concat(arrData.data),
          page: page===0?20:this.state.page+20,
          loadMore: arrData.data.length===20?true:false
        });
      } 
      if(type === 'product') {
        arrData.data!==undefined && this.setState({
          listProduct:page === 0 ? arrData.data : this.state.listProduct.concat(arrData.data),
          page: page===0?20:this.state.page+20,
          loadMore: arrData.data.length===20?true:false
        });
      }
    })
    .catch(err => console.log(err));
  }

  componentDidMount(){
    const { idContent, spaceTab, menuTab, videoTab, productTab, type } = this.props.navigation.state.params;
    this.getContent(idContent, type);
    this.setState({
      showSpace : spaceTab,
      showMenu : menuTab,
      showVideo : videoTab,
      showProducts: productTab
    });
    videoTab==='active' && this.gotoEndScroll();
  }
  gotoEndScroll = (contentWidth, contentHeight) => {

      this.state.showSpace==='active' &&  this.scrollView.scrollTo({x: 0, y: 0, animated: true})

      this.state.showProducts==='active' &&  this.scrollView.scrollToEnd({animated: false});
  }

  render() {

    const {navigate,goBack} = this.props.navigation;
    const { idContent, spaceTab, menuTab, videoTab,lang } = this.props.navigation.state.params;
    const { arrImgModal,showModalVideo,linkVideo } = this.state;
    const {
      container,
      headCatStyle, headContent,plusStyle,imgPlusStyle,
      marRight,titleTabActive,titleTab,wrapListImage,imgTab,
      popover,show,hide,overLayoutCat,shadown,colorText,listCatOver,
      wrapContent,leftContent,rightContent,middleContent,imgContent,labelCat,

    } = styles;
    //onRegionChange={this.onRegionChange}
    return (
      <View style={container}>
        <View style={headCatStyle}>
            <View style={headContent}>

                <TouchableOpacity onPress={()=> goBack()}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                <Text style={{color:'white',fontSize:16,marginTop:5}}>{lang.image.toUpperCase()}</Text>
                <View></View>
            </View>
        </View>
        <View style={{alignItems:'center'}}>
          <ScrollView
          horizontal
          onContentSizeChange={this.gotoEndScroll.bind(this)}
          ref={(scrollView) => { this.scrollView = scrollView }}
          showsHorizontalScrollIndicator={false}
          style={{flexDirection:'row',width:width-40,paddingTop:10,paddingBottom:10,}}
          >
            <TouchableOpacity onPress={()=> this.setState({showSpace:'active',showMenu:'',showVideo:'', showProducts: ''},()=>{
              this.getContent(idContent,'space',0)
              this.gotoEndScroll();
            })} >
            <Text style={[marRight,this.state.showSpace==='active' ? titleTabActive : titleTab]}>{lang.space.toUpperCase()}</Text>
            </TouchableOpacity>
            <Text style={[marRight,titleTab]}> | </Text>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'',showMenu:'active',showVideo:'',showProducts: ''}, ()=>{
              this.getContent(idContent,'menu',0)
            })} >
            <Text style={[marRight,this.state.showMenu==='active' ? titleTabActive : titleTab]}>{lang.image.toUpperCase()}</Text>
            </TouchableOpacity>
            <Text style={[marRight,titleTab]}> | </Text>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'',showMenu:'',showVideo:'active', showProducts:''},()=>{
              this.getContent(idContent,'video',0)
              // this.gotoEndScroll();
            })} >
            <Text style={[marRight,this.state.showVideo==='active' ? titleTabActive : titleTab]}>{'Video'.toUpperCase()}</Text>
            </TouchableOpacity>
            <Text style={[marRight,titleTab]}> | </Text>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'',showMenu:'',showVideo:'', showProducts: 'active'},()=>{
              this.getContent(idContent,'product',0)
              this.gotoEndScroll();
            })} >
            <Text style={[marRight,this.state.showProducts==='active' ? titleTabActive : titleTab]}>{lang.products_services.toUpperCase()}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {this.state.showSpace==='active' &&
        <View style={[wrapListImage]}>
        <FlatList
           //horizontal
           numColumns={3}
           ListEmptyComponent={<Text style={{paddingLeft:20}}>{lang.updating}</Text>}
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item,index) => index.toString()}
           extraData={this.state}
           data={this.state.listSpace}
           renderItem={({item,index}) => (
             <TouchableOpacity key={index} onPress={() => {this.setState({
               isModalSpaceOpened:true,index})}}>
              <Image style={imgTab} source={{ uri: `${item.url}` }} />
             </TouchableOpacity>
        )} 
         onEndReachedThreshold={0.5}
         onEndReached={() => {
          if(this.state.loadMore) this.setState({loadMore:false},()=>{
            this.getContent(idContent, 'space', page=null)
          });
         }}/>
        {this.state.isModalSpaceOpened &&
          <ImageViewer
          visible={this.state.isModalSpaceOpened}
          data={this.state.listSpace}
          index={this.state.index}
          closeModal={()=>this.setState({isModalSpaceOpened:false,index:0})}
          />
        }
        </View>}

        {this.state.showMenu==='active' &&
          <View style={[wrapListImage]}>
        <FlatList
           //horizontal
           numColumns={3}
           ListEmptyComponent={<Text style={{paddingLeft:20}}>{lang.updating}</Text>}
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item,index) => index.toString()}
           extraData={this.state}
           data={this.state.listMenu}
           renderItem={({item,index}) => (
             <TouchableOpacity key={index} onPress={() => {this.setState({isModalMenuOpened:true,index})}}>
              <Image style={imgTab} source={{ uri: `${item.url}` }} />
             </TouchableOpacity>
        )} 
        onEndReachedThreshold={0.5}
        onEndReached={() => {
         if(this.state.loadMore) this.setState({loadMore:false},()=>{
           this.getContent(idContent, 'menu', page=null)
         });
        }}/>

           {this.state.isModalMenuOpened &&
             <ImageViewer
               visible={this.state.isModalMenuOpened}
               data={this.state.listMenu}
               index={this.state.index}
               closeModal={()=>this.setState({isModalMenuOpened:false,index:0,arrImgModal:[]})}
               />
            }

        </View>}

        <View style={[wrapListImage,this.state.showVideo==='active' ? show : hide]}>

        <FlatList
           //horizontal
           //numColumns={3}
           ListEmptyComponent={<Text style={{paddingLeft:20}}>{lang.updating}</Text>}
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item,index) => index.toString()}
           extraData={this.state}
           data={this.state.listVideo}
           renderItem={({item,index}) => (
             <TouchableOpacity
             onPress={()=>{
               this.setState({showModalVideo:true,linkVideo:item})
             }}>
             <Image
             //style={{width:(width-50)/2,height:width/3,marginRight:10,resizeMode: 'cover'}}
             style={{width,height:width/2,marginBottom:10}}
             source={{uri: item.thumbnail }} />
             </TouchableOpacity>
        )} 
        onEndReachedThreshold={0.5}
        onEndReached={() => {
         if(this.state.loadMore) this.setState({loadMore:false},()=>{
           this.getContent(idContent, 'video', page=null)
         });
        }}/>

        <VideoViewer
        visible={showModalVideo}
        link={linkVideo}
        closeModal={()=>this.setState({showModalVideo:false})}
        />
        </View>
        
        {this.state.showProducts==='active' &&
          <View style={[wrapListImage]}>
        <FlatList
           //horizontal
           numColumns={3}
           ListEmptyComponent={<Text style={{paddingLeft:20}}>{lang.updating}</Text>}
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item,index) => index.toString()}
           extraData={this.state}
           data={this.state.listProduct}
           renderItem={({item,index}) => (
             <TouchableOpacity key={index} onPress={() => {this.setState({isModalMenuOpened:true,index})}}>
              <Image style={imgTab} source={{ uri: `${item.image}` }} />
             </TouchableOpacity>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
         if(this.state.loadMore) this.setState({loadMore:false},()=>{
           this.getContent(idContent, 'product', page=null)
         });
        }}/>
        {this.state.isModalMenuOpened &&
             <ImageViewer
               visible={this.state.isModalMenuOpened}
               data={this.state.listProduct}
               index={this.state.index}
               closeModal={()=>this.setState({isModalMenuOpened:false,index:0,arrImgModal:[]})}
               />
            }
        </View>
        }



      </View>
    );
  }
}
