/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,
  Platform,Dimensions,TouchableOpacity,
  Modal,Share,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

//
import global from '../../global';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';

import socialIC from '../../../src/icon/ic-white/ic-social.png';
import saveIC from '../../../src/icon/ic-white/ic-save.png';
import locationIC from '../../../src/icon/ic-white/ic-location.png';
import starIC from '../../../src/icon/ic-white/ic-star.png';
import starYellowIcon from '../../../src/icon/ic-yellow/ic-star.png';
import locationYellowIcon from '../../../src/icon/ic-yellow/ic-checkin.png';
import collectionYellowIcon from '../../../src/icon/ic-yellow/ic-save.png';
import {checkItemExists} from '../../libs';
const {width,height} = Dimensions.get('window');
export default class Header extends Component {
  constructor(props){
    super(props);
    this.state={
      showLike:1,
      showOption:false,
    }
  }
  socialShare(){
    console.log('this.props.url',this.props.url);
    const opt = Platform.OS==='ios' ?
    {
      message: this.props.title,
      url: this.props.url,
    }
    :
    {
      message: this.props.title + '\n' + this.props.url
    };
    Share.share( opt , {
        // Android only:
        dialogTitle: 'Share link',
        // iOS only:
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter'
        ]
      })
  }

  render() {
    const {
      headStyle,headContent,imgLogoTop,voteIC,
      inputSearch,wrapHeadBottom,colorWhite,imgCheckin,
      shareIC,imgSave,saveContentStyle,show,hide,
      actionSheetContent,actionSheetRadius,actionSheetWrap,
      pad15,colorTxt,line,marTop10
    } = styles;
    //console.log("this.props.navigation=",util.inspect(this.props.navigation,false,null));
    const {goBack,state} = this.props.navigation;
    const {showOption} = this.state;
    const {lang,curLoc,hasSaveLike,hasCheckin,hasCollection,title} = this.props;
    //console.log('lang',lang);
    return (
      <View>
      <View style={headStyle}>
          <View style={headContent}>
          <TouchableOpacity onPress={()=>{this.props.backList()}}>
          <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
          </TouchableOpacity>
              {/*<Image source={logoTop} style={imgLogoTop} />*/}
              <View style={{width:width-80,marginTop:3}}>
              <Text numberOfLines={1} style={{fontSize:16,color:'#fff'}}>{title}</Text>
              </View>
              <View></View>
          </View>
      </View>


      <View style={wrapHeadBottom}>
        <View style={[headContent]}>
            <TouchableOpacity onPress={()=>this.props.saveLike('save-like')}
            style={{alignItems:'center'}}>
                <Image source={hasSaveLike===0 ? starIC : starYellowIcon} style={voteIC} />
                <Text style={colorWhite}>{lang.like}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.props.saveLike('checkin');}} style={{alignItems:'center'}}>
                <Image source={hasCheckin===0 ? locationIC : locationYellowIcon} style={imgCheckin} />
                <Text style={colorWhite}>{lang.check_in}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems:'center'}}
            onPress={()=>this.socialShare()}>
                <Image source={socialIC} style={shareIC} />
                <Text style={colorWhite}>{lang.share}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.props.callCollect()}} style={{alignItems:'center'}}>
                <Image source={hasCollection.length===0 ? saveIC : collectionYellowIcon} style={imgCheckin} />
                <Text style={colorWhite}>{lang.collection}</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/*<Modal onRequestClose={() => null}transparent
      animationType={'slide'} visible={showOption}>
        <TouchableOpacity style={[actionSheetWrap]}
        onPress={()=>this.setState({showOption:false})}>
          <View style={[actionSheetContent,actionSheetRadius]}>

            <TouchableOpacity onPress={()=>{this.socialShare()}} style={pad15}>
            <Text style={colorTxt}>Email</Text>
            </TouchableOpacity>

            <View style={line}></View>
            <TouchableOpacity style={pad15}>
            <Text style={colorTxt}>Facbook</Text>
            </TouchableOpacity>

            <View style={line}></View>
            <TouchableOpacity style={pad15}>
            <Text style={colorTxt}>Twitter</Text>
            </TouchableOpacity>


          </View>
          <View style={[actionSheetContent,actionSheetRadius,marTop10]}>
            <TouchableOpacity onPress={()=>this.setState({showOption:false})} style={pad15}>
            <Text style={colorTxt}>{lang.cancel}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>*/}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  actionSheetRadius:{borderRadius:5},
  actionSheetContent:{width:width-30,backgroundColor:'#fff',alignItems:'center',overflow:'hidden'},
  actionSheetWrap:{justifyContent:'flex-end',paddingBottom: Platform.OS==='ios' ? 20 : 50,alignItems:'center',position:'absolute',zIndex:999,backgroundColor:'rgba(0,0,0,0.5)',width,height},
  pad15:{padding:15,width,alignItems:'center'},
  colorTxt :{color:'#5B8EDC',fontSize:16},
  line:{borderBottomWidth:1,borderBottomColor:'#E3E4E8',width},
  marTop15:{marginTop:15},
  marTop10:{marginTop:10},

  headStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,justifyContent:'center',
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  imgLogoTop : {
      width: 138,height: 25,
  },
  voteIC:{width:23,height:22,marginBottom:5},
  inputSearch : {
    marginTop: 8,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,
  },
  wrapHeadBottom:{height:65,backgroundColor:'#2F353F',alignItems:'center',justifyContent:'center'},
  colorWhite:{
    color:'#fff',
    fontSize:15,
  },
  imgCheckin:{width:20,height:23,marginBottom:5,},
  shareIC:{width:21,height:23,marginBottom:5},
  imgSave:{width:90,height:90,marginBottom:7},
  saveContentStyle:{
      position:'absolute',width,height,zIndex:100,backgroundColor:'rgba(0,0,0,0.7)',
      justifyContent:'center',alignItems:'center',
      alignSelf:'stretch',
  },
  show : { display: 'flex'},
  hide : { display: 'none'},
});
