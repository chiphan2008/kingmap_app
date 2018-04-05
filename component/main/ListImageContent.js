/* @flow */

import React, { Component } from 'react';
import {Platform, View, WebView, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity,ScrollView,Modal} from 'react-native';
const {height, width} = Dimensions.get('window');

//import ImageCarousel from 'react-native-image-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import global from '../global';
import getApi from '../api/getApi';
import styles from '../styles';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import logoMap from '../../src/icon/Logo-map.png';
import plusIC from '../../src/icon/ic-home/ic-plus.png';
import closeIC from '../../src/icon/ic-white/ic-close.png';


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
      isModalSpaceOpened: false,
      isModalMenuOpened: false,
      currentImageIndex: 0 ,
    }
  }


  getContent(idContent){
    //console.log('idContent',idContent);
    getApi(`${global.url}${'content/'}${idContent}`)
    .then(arrData => {
      //console.log('arrData',arrData.data.link_video);
      var arrSpace = [];
      var arrMenu = [];
      this.setState({
        listVideo:arrData.data.link_video,
      });
      //arrData.data.image_space.map(e=>arrSpace.push({url:`${global.url_media}${e}`}));
      //arrData.data.image_menu.map(e=>arrMenu.push({url:`${global.url_media}${e}`}));
        this.setState({
          listSpace:arrSpace,
          listMenu:arrMenu,
        });

    })
    .catch(err => console.log(err));
  }
  openModalSpace(index) {
     this.setState({isModalSpaceOpened: true, currentImageIndex: index });
  }
  openModalMenu(index) {
     this.setState({isModalMenuOpened: true, currentImageIndex: index });
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
    const { idContent, spaceTab, menuTab, videoTab } = this.props.navigation.state.params;

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

                <TouchableOpacity onPress={()=> goBack()}>
                <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                </TouchableOpacity>
                <Text style={{color:'white',fontSize:16}}>Hình ảnh</Text>
                <View></View>
            </View>
        </View>
        <View style={{alignItems:'center'}}>
          <View style={{flexDirection:'row',width:width-40,paddingTop:10,paddingBottom:10,}}>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'active',showMenu:'',showVideo:''})} >
            <Text style={[marRight,this.state.showSpace==='active' ? titleTabActive : titleTab]}>{'Không gian'.toUpperCase()}</Text>
            </TouchableOpacity>
            <Text style={[marRight,titleTab]}> | </Text>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'',showMenu:'active',showVideo:''})} >
            <Text style={[marRight,this.state.showMenu==='active' ? titleTabActive : titleTab]}>{'Menu'.toUpperCase()}</Text>
            </TouchableOpacity>
            <Text style={[marRight,titleTab]}> | </Text>
            <TouchableOpacity onPress={()=> this.setState({showSpace:'',showMenu:'',showVideo:'active'})} >
            <Text style={[marRight,this.state.showVideo==='active' ? titleTabActive : titleTab]}>{'Video'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView>

        <View style={[wrapListImage,this.state.showSpace==='active' ? show : hide]}>

        {this.state.listSpace.map((e,index) => (
          <TouchableOpacity key={index} onPress={() => {this.openModalSpace(index)}}>
           <Image
             resizeMode="cover"
             style={imgTab}
             source={{ uri: `${e.url}` }}
           />
         </TouchableOpacity>
        ))}

       <Modal onRequestClose={() => null} visible={this.state.isModalSpaceOpened} transparent={true}>
       <TouchableOpacity
       onPress={()=>this.setState({isModalSpaceOpened:false,currentImageIndex:0})}
       style={{position:'absolute',padding:10,alignSelf:'flex-end',zIndex:9999}}>
       <Image source={closeIC} style={{width:18,height:18}} />
       </TouchableOpacity>
        <ImageViewer imageUrls={this.state.listSpace} index={this.state.currentImageIndex}/>
        </Modal>
        </View>

        <View style={[wrapListImage,this.state.showMenu==='active' ? show : hide]}>
          {this.state.listMenu.map((e,index) => (
            <TouchableOpacity key={index} onPress={() => {this.openModalMenu(index)}}>
             <Image
               resizeMode="cover"
               style={imgTab}
               source={{ uri: `${e.url}` }}
             />
           </TouchableOpacity>

          ))}
          <Modal onRequestClose={() => null} visible={this.state.isModalMenuOpened} transparent={true}>
          <TouchableOpacity
          onPress={()=>this.setState({isModalMenuOpened:false,currentImageIndex:0})}
          style={{position:'absolute',padding:10,alignSelf:'flex-end',zIndex:9999}}>
          <Image source={closeIC} style={{width:18,height:18}} />
          </TouchableOpacity>
           <ImageViewer imageUrls={this.state.listMenu} index={this.state.currentImageIndex}/>
           </Modal>
        </View>

        <View style={[wrapListImage,this.state.showVideo==='active' ? show : hide]}>
          {this.state.listVideo.map((e,index) => (
            <View key={index}>
              <WebView
                source={{uri: `${e}`}}
                style={imgTab}
                javaScriptEnabled
              />
            </View>
          ))}

        </View>
        </ScrollView>
      </View>
    );
  }
}
