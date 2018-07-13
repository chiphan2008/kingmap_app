/* @flow */

import React, { Component } from 'react';
import {
  Platform, View, WebView, Text, StyleSheet,
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
      listSpace:[],
      listMenu:[],
      listVideo:[],
      arrImgModal:[],
      isModalSpaceOpened: false,
      isModalMenuOpened: false,
      index: 0 ,
      linkVideo:'',
      showModalVideo:false,
    }
  }


  getContent(idContent){
    //console.log('idContent',idContent);
    getApi(`${global.url}${'content/'}${idContent}`)
    .then(arrData => {
      this.setState({
        listVideo:arrData.data.link_video,
        listSpace:arrData.data.image_space,
        listMenu:arrData.data.image_menu,
      });
    })
    .catch(err => console.log(err));
  }

  componentDidMount(){
    const { idContent, spaceTab, menuTab, videoTab } = this.props.navigation.state.params;
    this.getContent(idContent);
    this.setState({
      showSpace : spaceTab,
      showMenu : menuTab,
      showVideo : videoTab,
    });
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

                <TouchableOpacity onPress={()=> goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                <Text style={{color:'white',fontSize:16}}>{lang.image.toUpperCase()}</Text>
                <View></View>
            </View>
        </View>
        <View style={{alignItems:'center'}}>
          <View style={{flexDirection:'row',width:width-40,paddingTop:10,paddingBottom:10,}}>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'active',showMenu:'',showVideo:''})} >
            <Text style={[marRight,this.state.showSpace==='active' ? titleTabActive : titleTab]}>{lang.space.toUpperCase()}</Text>
            </TouchableOpacity>
            <Text style={[marRight,titleTab]}> | </Text>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'',showMenu:'active',showVideo:''})} >
            <Text style={[marRight,this.state.showMenu==='active' ? titleTabActive : titleTab]}>{lang.image.toUpperCase()}</Text>
            </TouchableOpacity>
            <Text style={[marRight,titleTab]}> | </Text>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'',showMenu:'',showVideo:'active'})} >
            <Text style={[marRight,this.state.showVideo==='active' ? titleTabActive : titleTab]}>{'Video'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {this.state.showSpace==='active' &&
        <View style={[wrapListImage]}>
        <FlatList
           //horizontal
           numColumns={3}
           ListEmptyComponent={<Text style={{paddingLeft:20}}>{lang.updating}</Text>}
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item,index) => index}
           extraData={this.state}
           data={this.state.listSpace}
           renderItem={({item,index}) => (
             <TouchableOpacity key={index} onPress={() => {this.setState({
               isModalSpaceOpened:true,index})}}>
              <Image style={imgTab} source={{ uri: `${item.url}` }} />
             </TouchableOpacity>
        )} />
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
           keyExtractor={(item,index) => index}
           extraData={this.state}
           data={this.state.listMenu}
           renderItem={({item,index}) => (
             <TouchableOpacity key={index} onPress={() => {this.setState({isModalMenuOpened:true,index})}}>
              <Image style={imgTab} source={{ uri: `${item.url}` }} />
             </TouchableOpacity>
        )} />

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
           keyExtractor={(item,index) => index}
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
             source={{uri: getThumbVideo(item,'hdfhgdhghfhkd') }} />
             </TouchableOpacity>
        )} />

        <VideoViewer
        visible={showModalVideo}
        link={linkVideo}
        closeModal={()=>this.setState({showModalVideo:false})}
        />
        </View>




      </View>
    );
  }
}
