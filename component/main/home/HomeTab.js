/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput,
  Alert,TouchableOpacity,PermissionsAndroid, AsyncStorage, Modal } from 'react-native';
import RNSettings from 'react-native-settings';
const {height, width} = Dimensions.get('window');

import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';
import accessLocation from '../../api/accessLocation';

import global from '../../global';
import checkLogin from '../../api/checkLogin';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import styles from '../../styles.js';

import bgMap from '../../../src/icon/bg-map.png';
//import test from '../../../src/icon/test.svg';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';

import plusIC from '../../../src/icon/ic-home/ic-plus.png';
import closeIC from '../../../src/icon/ic-home/ic-close.png';

import logoHome from '../../../src/icon/ic-home/Logo-home.png';

import {Select, Option} from "react-native-chooser";

export default class HomeTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      Width_Layout:'',
      Height_Layout:'',
      listCategory : [],
      listStatus : [],
      lang : lang_vn,
      selectLang: {
        valueLang : "vn",
        labelLang : "VIE",
      },
      showInfo : false,
      showShare : false,
      showCreate : false,
      latitude: null,
      longitude: null,
      error: null,
      code_user:null,
      isLogin:false,
    };
    checkLogin().then(e=>{
      //console.log('e.length',e);
      e.id===undefined ? this.setState({isLogin:false}) :
      this.setState({code_user:e.phone,isLogin:true});
    })
    accessLocation();
    arrLang = [{name:'VIE',v:'vn'},{name:'ENG',v:'en'}];
  }

  getLang(){
    getLanguage().then((e) =>{
      if(e!==null){
          this.setState({
            selectLang:{
              valueLang:e.valueLang,
              labelLang:e.labelLang,
            }
          });
          e.valueLang==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
          this.getCategory(this.state.selectLang.valueLang);
     }
    });
  }

  onSelectLang(value, label) {
    AsyncStorage.setItem('@MyLanguage:key',JSON.stringify({valueLang:value,labelLang :label}));
    value==='vn' ?  this.setState({lang : lang_vn}) : this.setState({lang : lang_en});
    this.getCategory(value)
    this.setState({
      selectLang: {
        valueLang : value,
        labelLang : label,
      },
      showShare:false,
      showInfo:false,
    });
  }
  getCategory(lang){
    getApi(global.url+'modules?language='+lang)
    .then(arrCategory => {
        this.setState({ listCategory: arrCategory.data });
    })
    .catch(err => console.log(err));
  }
  getListStatus(){
    getApi(global.url+'get-static')
    .then(arrData => {
        this.setState({ listStatus: arrData.data });
    })
    .catch(err => console.log(err));
  }
  componentWillMount() {
      this.getLang();
      this.getListStatus();
      //this.getCategory(this.state.selectLang.valueLang);
  }


  render() {
    //console.log('isLogin',this.state.isLogin);
    const {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
    //console.log("this.props.Hometab=",util.inspect(this.state.listCategory,false,null));
    const {
      container, bgImg,colorlbl,
      headStyle, headContent,imgLogoTop,imgSocial, imgWidthGoogle, imgInfo,imgShare,wrapIcRight,FlatList,
      selectBox,optionListStyle,OptionItem,inputSearch,show,hide,colorTextPP,colorNumPP,marRight,itemCreate,
      wrapContent,imgContent,square,wrapCircle,logoCenter,circle1,circle2,circle3,circle4,circle5,circle6,circle7,circle8,labelCat,
      plusStyle,imgPlusStyle,popover,overLayout,listOver,popoverShare,popoverCreate,overLayoutShare,listOverShare,imgMargin,imgUpHome,imgUpInfo,imgUpShare
    } = styles;

    return (
      <View style={container} >

      <Image source={bgMap} style={bgImg} />
        <View style={headStyle}>
            <View style={headContent}>
            <TouchableOpacity onPress={()=> this.setState({showInfo:false,showShare:false}) } >
                <Image source={logoTop} style={imgLogoTop} />
            </TouchableOpacity>

            <Select
                  onClick={()=> this.setState({showInfo:false,showShare:false}) }
                  onSelect = {this.onSelectLang.bind(this)}
                  defaultText  = {this.state.selectLang.labelLang}
                  style = {selectBox}
                  textStyle = {{color:'#fff'}}
                  optionListStyle={optionListStyle}
                  indicatorColor="#fff"
                  indicator="down"
                  indicatorSize={7}
                  transparent
                >
                {arrLang.map((e,i)=>(
                    <Option style={OptionItem} key={i} value ={e.v}>{e.name}</Option>
                ))}
            </Select>

          </View>
          <TextInput underlineColorAndroid='transparent' placeholder={this.state.lang.search} style={inputSearch} />
          <Image style={{width:16,height:16,top:Platform.OS==='ios' ? -26 : -32,left:(width-80)/2}} source={searchIC} />
        </View>

        <View style={wrapContent}>
            <View style={square}>
            {
              this.state.listCategory.map((e)=>{
                //console.log(e.sub_category)
                //<Text style={labelCat}  >{e.name}</Text>

                switch (e.alias) {
                  case 'location':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle1]}
                          onPress={() => navigate('OtherCatScr',{name_module:e.name,lang:this.state.lang}) }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      </TouchableOpacity>)
                  case 'booking':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle2]}
                          onPress={() => navigate('CatScr') }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      </TouchableOpacity>);
                  case 'ads':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle3]}
                          onPress={() => navigate('CatScr') }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      </TouchableOpacity>);
                  case 'make-money':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle4]}
                          onPress={() => {
                            this.state.isLogin===false ? navigate('LoginScr',{backScr:'MainScr'}) :
                            navigate('MakeMoneyScr',{lang:this.state.lang,code_user:this.state.code_user});
                          } }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      </TouchableOpacity>);
                  case 'chat':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle5]}
                          onPress={() => navigate('CatScr') }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      </TouchableOpacity>);
                  case 'wallet':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle6]}
                          onPress={() => navigate('CatScr') }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      </TouchableOpacity>);
                  case 'khuyen-mai':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle6]}
                          //onPress={() => navigate('CatScr') }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      </TouchableOpacity>);
                  case 'rao-vat':
                      return (<TouchableOpacity
                          key={e.id}
                          style={[wrapCircle,circle7]}
                          onPress={() => navigate('CatScr') }
                          >
                        <Image style={imgContent} source={{uri:`${global.url_media}${e.image}`}} />
                      </TouchableOpacity>);

                  //default:

                }
              })
            }

              <TouchableOpacity
              onPress={()=>navigate('OtherCatScr')}
              style={[wrapCircle,logoCenter]}>
              <Image style={imgContent} source={logoHome} />
              <Text style={labelCat}>{this.state.lang.other}</Text>
              </TouchableOpacity>

            </View>
        </View>
        <TouchableOpacity
        onPress={()=>this.setState({showCreate:!this.state.showCreate,showInfo:false,showShare:false})}
        style={plusStyle}>
            <Image source={plusIC} style={[imgPlusStyle, this.state.showCreate===false ? show : hide]} />
        </TouchableOpacity>



        <Modal
        onRequestClose={() => null}
        transparent
        visible={this.state.showCreate}>
        <View style={popoverCreate}>

            <TouchableOpacity
            onPress={()=>{
              this.setState({showCreate:false});
              navigate('ChooseCatScr',{lang:this.state.lang.lang});
            }}
            style={itemCreate}>
              <Text style={colorlbl}>{this.state.lang.create_location}</Text>
            </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>this.setState({showCreate:!this.state.showCreate})}
        >
            <Image source={this.state.showCreate===false ? plusIC : closeIC} style={imgPlusStyle} />
        </TouchableOpacity>
        </View>
        </Modal>

      </View>
    );
  }
}
