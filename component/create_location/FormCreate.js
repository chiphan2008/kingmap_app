/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,ScrollView,Modal,FlatList,
  Alert,ActivityIndicator,Keyboard, TouchableWithoutFeedback
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
//import * as _ from 'lodash';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
const {height, width} = Dimensions.get('window');
import language_vn from '../lang/vn/language';
import language_en from '../lang/en/language';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import postApi from '../api/postApi';
import getLanguage from '../api/getLanguage';
//import GroupProduct from './GroupProduct';
import UpdateMore from './UpdateMore';
import AddImgSpace from './AddImgSpace';
import AddImgMenu from './AddImgMenu';
//import AddProduct from './AddProduct';
import AddVideo from './AddVideo';
import OpenTime from './OpenTime';
//import la from '../api/checkLocation';
import ChooseArea from './ChooseArea';
import checkLogin from '../api/checkLogin';
import loginServer from '../api/loginServer';
//import LatLng from './LatLng';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import checkIC from '../../src/icon/ic-create/ic-check.png';
import closeIC from '../../src/icon/ic-create/ic-close.png';
import upDD from '../../src/icon/ic-white/ic-dropdown_up.png';

import cameraIC from '../../src/icon/ic-create/ic-camera.png';
import nameLocationIC from '../../src/icon/ic-create/ic-name-location.png';
import wifiIC from '../../src/icon/ic-create/ic-wifi.png';
import passwifiIC from '../../src/icon/ic-create/ic-passwifi.png';
import cateLocationIC from '../../src/icon/ic-create/ic-cate-location.png';
import emailIC from '../../src/icon/ic-create/ic-email.png';
import phoneIC from '../../src/icon/ic-create/ic-phone.png';
import timeIC from '../../src/icon/ic-create/ic-time.png';
import productIC from '../../src/icon/ic-create/ic-product.png';
import movieIC from '../../src/icon/ic-create/ic-movie.png';
import spaceIC from '../../src/icon/ic-create/ic-space.png';
//import priceIC from '../../src/icon/ic-create/ic-price.png';
import locationIC from '../../src/icon/ic-create/ic-location.png';
import locationMapIC from '../../src/icon/ic-create/ic-location-map.png';
import avatarIC from '../../src/icon/ic-create/ic-avatar.png';
import galleryIC from '../../src/icon/ic-create/ic-gallery.png';
import videoIC from '../../src/icon/ic-create/ic-video.png';
import addonIC from '../../src/icon/ic-create/ic-addon.png';
import groupProductIC from '../../src/icon/ic-create/ic-group-product.png';
import descriptionIC from '../../src/icon/ic-create/ic-description.png';
import keywordsIC from '../../src/icon/ic-create/ic-keywords.png';
import codeIC from '../../src/icon/ic-create/ic-code.png';
import selectedIC from '../../src/icon/ic-create/ic-selected.png';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import currentLocIC from '../../src/icon/ic-current-location.png';

import {hasNumber,getIndex,strtoarray,isEmail,checkSVG,checkKeyword} from '../libs';


var timeoutLatLng;
class FormCreate extends Component {
  constructor(props) {
    super(props);
    const {lang,nameCat,idCat,serv_items,idContent} = this.props.navigation.state.params;
    this.getCategory(idCat,lang)
    this.state = {
      lang: lang==='vn' ? language_vn : language_en,
      sub_cat:[],nameCat, serv_items,
      showSubCat:false,
      showOpenTime:false,
      checkSubCat:{},
      hasSubCat:0,
      showService:false,
      checkService:{},
      hasService:0,
      idContent,
      lat:'Lat 0.0',
      lng:'Lng 0.0',
      txtUserWifi:'',
      txtPassWifi:'',
      from_hour:'',
      to_hour:'',
      ListOpenTime:[],
      txtName:'',
      txtPhone:'',
      txtEmail:'',
      txtAddress:'',
      txtDes:'',
      txtKW:'',
      txtCode:'',
      txtNameProduct:'',
      imgAvatar:{},
      lblUnit: 'VND',
      showProduct:false,
      showVideo:false,
      showImgSpace:false,
      showImgMenu:false,
      img_space:[],
      img_menu:[],
      link_video:[],
      img_video:[],
      //addGroupProduct:[],
      index:0,

      category_item:[],
      des_space:{},
      title_space:{},
      des_menu:{},
      title_menu:{},
      errArea:false,
      errMsg:'',
      ma_dinh_danh:'',
      idCountry:'',idCity:'',idDist:'',
      nameCountry:'',nameCity:'',nameDist:'',
      isLogin:false,
      showLoading:false,
      user_profile:{},
      showUpdate:false,
      showUpdateMore:false,
      editLoc:false,
      region:{},
      addrMarker:'',
    };
    checkLogin().then(e=>{
      //console.log('e11',e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        //console.log('e',e);
        //loginServer(e,'cxv');
        this.setState({user_profile:e,ma_dinh_danh:e.ma_dinh_danh,isLogin:true});
      }
    })
    //BackHandler.addEventListener('hardwareBackPress', ()=>this.setState({showSubCat:false}));
    //console.log('idContent',idContent);
    if(idContent!==undefined) {
      this.getContent(idContent);
    }
  }

  getCategory(id,lang){
    getApi(global.url+'category/'+id+'?language='+lang)
    .then(arrCategory => {
        this.setState({ sub_cat: arrCategory.data[0].sub_category });
    })
    .catch(err => console.log(err));
  }

  getContent(idContent){
    // console.log('idContent',idContent);
    const url = `${global.url}${'content-update/'}${idContent}`;
    //console.log('url',url);
    getApi(url)
    .then(arrData => {
      //console.log('arrData.data.content.lat',arrData.data.content.lat);
      const content = arrData.data.content;
      //console.log('content',content); checkSubCat
      var serv_items = [];
      arrData.data.list_service.forEach(e=>{
        let obj = {
          id:e.id_service_item,
          name:e.name
        }
        serv_items.push(obj);
      })
      arrData.data.service_content.forEach(e=>{
        this.setState({checkService: Object.assign(this.state.checkService,{[e]:e.toString()})});
      })
      content._category_items.forEach(e=>{
        this.setState({checkSubCat: Object.assign(this.state.checkSubCat,{[e.id]:e.id})});
      })
      let link_video=[],img_video=[];
      arrData.data.link_video.forEach(e=>{
        link_video.push(e.link);
        img_video.push(e.thumbnail);
      })
      arrData.data.image_space.forEach((e,index)=>{
        this.setState({
          title_space: Object.assign(this.state.title_space,{[`${'title_'}${e.id}`]:e.title}),
          des_space: Object.assign(this.state.des_space,{[`${'des_'}${e.id}`]:e.description})
        })
      })
      arrData.data.image_menu.forEach((e,index)=>{
        this.setState({
          title_menu: Object.assign(this.state.title_menu,{[`${'title_'}${e.id}`]:e.title}),
          des_menu: Object.assign(this.state.des_menu,{[`${'des_'}${e.id}`]:e.description})
        })
      })
      //console.log('content._category_items.length',content._category_items.length);
      setTimeout(()=>{
        this.setState({
          serv_items,
          imgAvatar:{
            path:`${global.url_media}${content.avatar}`
          },
          img_space:arrData.data.image_space,
          img_menu:arrData.data.image_menu,
          link_video,img_video,
          hasSubCat:content._category_items.length,
          region:{
            latitude:content.lat,
            longitude:content.lng,
            latitudeDelta:  0.004422,
            longitudeDelta: 0.001121,
          },
          addrMarker:`${content.address}, ${content._district.name}, ${content._city.name}, ${content._country.name}`,
          txtName:content.name,
          txtAddress:content.address,
          ListOpenTime:content._date_open_api,
          txtDes:content.description,
          txtUserWifi:content.wifi,
          txtPassWifi:content.pass_wifi,
          txtPhone:content.phone,
          lat:content.lat,
          lng:content.lng,
          txtEmail:content.email,
          txtKW:content.tag,
          idCountry:content._country.id,idCity:content._city.id,idDist:content._district.id,
          nameCountry:content._country.name,nameCity:content._city.name,nameDist:content._district.name,
          editLoc:true,
        },()=>{
          // console.log(this.state.idDist);
          // console.log(this.state.nameDist);
        });
      },1200)

    }).catch(err => {});
  }

  confirmPostData(){

    if(this.state.hasSubCat===0){this.setState({errMsg:this.state.lang.enter_classify});return false;}
    //console.log('confirmPostData2');
    if(this.state.txtName===''){this.setState({errMsg:this.state.lang.enter_name});return false;}
    //console.log('confirmPostData3');
    if(this.state.txtAddress===''){this.setState({errMsg:this.state.lang.enter_address});return false;}
    //console.log('confirmPostData4');
    if(this.state.ListOpenTime.length===0){this.setState({errMsg:this.state.lang.enter_time});return false;}
    //console.log('confirmPostData5');
    if(this.state.idCountry==='' || this.state.idCity==='' || this.state.idDist===''){
      this.setState({errArea:true});return false;
    }
    //console.log('confirmPostData6');
    if(this.state.txtKW===null || this.state.txtKW.trim()==='' || strtoarray(this.state.txtKW,',').length<3 ){this.setState({errMsg:this.state.lang.enter_kw});return false;}
    //console.log('confirmPostData7');
    if(this.state.imgAvatar.path===undefined){this.setState({errMsg:this.state.lang.enter_avatar});return false;}
    //console.log('confirmPostData8');
    if(this.state.lat==='Lat 0.0' || this.state.lat===''){this.setState({errMsg:this.state.lang.enter_address_again});return false;}
    //console.log('confirmPostData9',isEmail(this.state.txtEmail));
    if(this.state.txtEmail!=='' && this.state.txtEmail!==null){if(!isEmail(this.state.txtEmail.trim())) {this.setState({errMsg:this.state.lang.email_format});return false;}}
    //console.log('confirmPostData10');
    this.setState({showLoading:true});
    const arr = new FormData();
    this.state.editLoc && arr.append('id_content',this.state.idContent);
    this.state.user_profile.id!==undefined && arr.append('id_user',this.state.user_profile.id);
    this.state.txtName!==null && arr.append('name',this.state.txtName.trim());
    arr.append('id_category',this.props.navigation.state.params.idCat);
    Object.entries(this.state.checkSubCat).forEach((e)=>{
      if(e[1]!==false){
        arr.append('category_item[]',e[1]);
      }
    })
    this.state.ListOpenTime.forEach((e,index)=>{
      arr.append(`date_open[${index}][from_date]`,e.from_date);
      arr.append(`date_open[${index}][to_date]`,e.to_date);
      arr.append(`date_open[${index}][from_hour]`,e.from_hour);
      arr.append(`date_open[${index}][to_hour]`,e.to_hour);
      arr.append(`date_open[${index}][angle_from]`,e.angle_from);
      arr.append(`date_open[${index}][angle_to]`,e.angle_to);
    })
    arr.append('country',this.state.idCountry);
    arr.append('city',this.state.idCity);
    arr.append('district',this.state.idDist);
    this.state.txtUserWifi!==null && arr.append('wifi',this.state.txtUserWifi.trim());
    this.state.txtPassWifi!==null && arr.append('passwifi',this.state.txtPassWifi.trim());
    this.state.txtPhone!==null && arr.append('phone',this.state.txtPhone.trim());
    this.state.txtEmail!==null && arr.append('email',this.state.txtEmail.trim());

    this.state.imgAvatar.mime!==undefined && arr.append(`avatar`, {
      uri:`${this.state.imgAvatar.path}`,
      name: `my_avatar.jpg`,
      type: `${this.state.imgAvatar.mime}`
    });
    this.state.txtAddress!==null && arr.append('address',`${this.state.txtAddress.trim()}`);
    arr.append('lat',`${this.state.lat}`);
    arr.append('lng',`${this.state.lng}`);
    strtoarray(this.state.txtKW,',').forEach((e)=>{
      e.trim()!=='' && arr.append('tag[]',e);
    });

    arr.append('description',`${this.state.txtDes}`);
    // //arr.append('code_invite',this.state.txtCode);
    arr.append('ma_dinh_danh',this.state.ma_dinh_danh);
    this.state.img_space.length>0 && this.state.img_space.forEach((e,index)=>{
      e.path!==undefined &&  arr.append(`image_space[]`, {
        uri:`${e.path}`,
        name: `${index}_image_space.jpg`,
        type: `${e.mime}`
      });
      let title_space = this.state.title_space[`${'title_'}${index}`]===undefined ? '':this.state.title_space[`${'title_'}${index}`];
      let des_space = this.state.des_space[`${'des_'}${index}`]===undefined ? '':this.state.des_space[`${'des_'}${index}`];
      e.path!==undefined && arr.append(`title_space[]`, title_space);
      e.path!==undefined && arr.append(`des_space[]`, des_space);
    });

    this.state.img_menu.length>0 &&  this.state.img_menu.forEach((e,index)=>{
      e.path!==undefined && arr.append(`image_menu[]`, {
        uri:`${e.path}`,
        name: `${index}_image_menu.jpg`,
        type: `${e.mime}`
      });

      let title_menu = this.state.title_menu[`${'title_'}${index}`]===undefined ? '':this.state.title_menu[`${'title_'}${index}`];
      let des_menu = this.state.des_menu[`${'des_'}${index}`]===undefined ? '':this.state.des_menu[`${'des_'}${index}`];
      e.path!==undefined && arr.append(`title_menu[]`, title_menu);
      e.path!==undefined && arr.append(`des_menu[]`, des_menu);
    })

    this.state.link_video.length>0 && this.state.link_video.forEach((e)=>{
      arr.append('link[]',e);
    })
    Object.entries(this.state.checkService).length>0 && Object.entries(this.state.checkService).forEach((e)=>{
      if(e[1]!==false){
        arr.append('service[]',e[1]);
      }
    });
    const act = this.state.editLoc?'update-location':'create-location';
    console.log('arr',arr);
    // console.log('e',`${global.url}${act}`);
    postApi(`${global.url}${act}`,arr).then((e)=>{
      console.log('postApi-e',e);
      this.setState({showLoading:false,errMsg:''},()=>{
        this.state.showLoading===false && setTimeout(()=>{
          if(e.code===200){
            if(this.state.editLoc){
              this.props.dispatch({type:'DETAIL_BACK',detailBack:'UpdateLocation'});
              Platform.OS==='android' ?
              Alert.alert(this.state.lang.notify,this.state.lang.update_success,[
                {text: '', style: 'cancel'},
                {text: 'OK', onPress: () => this.props.navigation.goBack()}
              ],
             { cancelable: false })
             :
             Alert.alert(this.state.lang.notify,this.state.lang.update_success,[
               {text: 'OK', onPress: () => this.props.navigation.goBack()}
             ])
            }else {
              this.setState({idContent:e.data.content.id,showUpdate:true})
            }

          }else {
            Alert.alert(this.state.lang.notify,e.message)
          }
        },700)
      });

    }).catch(err=>console.log(err));

    //this.setState({showUpdate:true});
  }

  setOpenTime(ListOpenTime){
    //console.log('ListOpenTime',ListOpenTime);
    this.setState({ListOpenTime,showOpenTime:false});
  }


  uploadAvatar(){
    ImagePicker.openPicker({
      cropping: false
    }).then(image =>{
      this.setState({imgAvatar:image});
    }).catch(e=>console.log('e'));
  }
  getLatLng(){
    //console.log('addr');
    const { nameCountry,nameCity,nameDist,txtAddress } = this.state;
    //console.log('nameCountry,nameCity,nameDist,txtAddress',nameCountry,nameCity,nameDist,txtAddress);
    var params='';
    if(txtAddress.trim()!=='' && txtAddress!==undefined) {params += txtAddress + ', ';}
    if(nameDist.trim()!=='' && nameDist.trim()!==undefined) {params += nameDist + ', ';}
    //if(nameCity.trim()!=='' && nameCity.trim()!==undefined) {params += nameCity + ', ';}
    //if(nameCountry.trim()!=='' && nameCountry.trim()!==undefined) {params += nameCountry;}
    //console.log('params',params);
    let url = `${'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCCCOoPlN2D-mfrYEMWkz-eN7MZnOsnZ44&sensor=true&address='}${params}`;
    console.log(url);
    getApi(url).then(e=>{

      let arrDataLoc = e.results[0].geometry.location;
      const res = e.results[0].address_components;
      const newAddress = `${res[0].long_name} ${res[1].long_name}, ${res[2].long_name}, ${res[3].long_name}, ${res[4].long_name}`;
      timeoutLatLng = setTimeout(()=>{
        this.setState({addrMarker: newAddress})
        this.setRegion(arrDataLoc.lat,arrDataLoc.lng);
      },700)

    })
  }

  getAddress(lat,lng){
    let url = `${'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCCCOoPlN2D-mfrYEMWkz-eN7MZnOsnZ44&sensor=true&latlng='}${lat},${lng}`;
    //console.log(url);
    getApi(url).then(e=>{
      const res = e.results[0].address_components;
      const newAddress = `${res[0].long_name} ${res[1].long_name}, ${res[2].long_name}, ${res[3].long_name}, ${res[4].long_name}`;
      this.setState({
        addrMarker: newAddress,
      },()=>this.setRegion(lat,lng))
    })
  }
  setRegion = (latitude,longitude) => {
    this.setState({
      lat:latitude,lng:longitude,
      region:{
        latitude,longitude,
        latitudeDelta:  0.004422,
        longitudeDelta: 0.001121,
      }
    });
    //this.getAddress(yourCurLoc.latitude,yourCurLoc.longitude)
  }

  render() {
    //console.log('idContent',this.state.idContent);
    const {navigate, goBack} = this.props.navigation;
    const { idCat,lang } = this.props.navigation.state.params;
    const {
      wrapper,container,
      headCatStyle,headContent, wrapDistribute,wrapFilter,
      show,hide,hidden,colorlbl,listAdd,txtKV,btnMap,
      listCreate,titleCreate,imgCamera,colorErr,btnPress,colorNext,
      imgShare,imgInfo,marRight,wrapInputCreImg,wrapCreImg,widthLblCre,
      imgUpCreate,imgUpLoc,imgUpInfo,overLayout,listOverService,shadown,popoverLoc,padCreate,
      upDDLoc,upDDSubCat,selectBox,optionUnitStyle,clockTime,centerVer,pad10,txtNextItem,
    } = styles;

    const {
      idContent,showUpdateMore,showImgSpace,showProduct,showImgMenu,
      showVideo,sub_cat,nameCat, serv_items, showService,hasService,
      region,addrMarker
    } = this.state;

    return (
      <View>

      {(showUpdateMore === false || this.state.showOpenTime === false) &&
        <View style={wrapper}>
        <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
              <Text style={titleCreate}> {idContent===undefined? this.state.lang.create_location:  this.state.lang.edit_location} </Text>
              <TouchableOpacity onPress={()=>this.confirmPostData()}>
                <Text style={[titleCreate,{paddingRight:10}]}>{this.state.lang.done}</Text>
              </TouchableOpacity>
          </View>
      </View>

      <ScrollView keyboardShouldPersistTaps='handled'>
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
    <View>
        <TouchableOpacity style={listCreate}
        onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
          <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
            <Image source={cateLocationIC} style={imgInfo} />
            </View>
            <Text style={colorErr}>{'(*)'}</Text>
              <View style={{paddingLeft:15,flexDirection:'row'}}>
                <Text style={colorlbl}>{this.state.lang.classify}</Text>
              </View>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={selectedIC} style={[imgShare,this.state.hasSubCat>0 ? show : hide]}/>
          <Text style={colorlbl}>{nameCat}</Text>
          <Image source={arrowNextIC} style={imgShare}/>
          </View>

        </TouchableOpacity>

        <TouchableOpacity style={listCreate} onPress={()=>this.setState({showService:!showService})}>
          <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
            <Image source={addonIC} style={imgInfo} />
            </View>
            <View style={{paddingLeft:15}}>
            <Text style={colorlbl}>{this.state.lang.utilities}</Text></View>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image source={selectedIC} style={[imgShare,hasService>0 ? show : hide]}/>
            <Image source={arrowNextIC} style={imgShare}/>
          </View>
        </TouchableOpacity>


        <View style={{padding:15,flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={colorlbl}>{this.state.lang.info_general}</Text>
          <View style={this.state.errMsg!=='' ? show : hide}>
          <Text style={colorErr}>{this.state.errMsg}</Text>
          </View>
        </View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={nameLocationIC} style={imgInfo} />
          </View>
          <Text style={colorErr}>{'(*)'}</Text>
          <TextInput underlineColorAndroid='transparent'
            returnKeyType = {"next"} autoFocus = {true} autoCorrect={false}
            onSubmitEditing={(event) => {this.refs.Address.focus();}}
            placeholder={`${this.state.lang.name_location}`} style={wrapInputCreImg}
            onChangeText={(txtName) => this.setState({txtName})}
            value={this.state.txtName}
           />
          <View style={{width:15}}>
          <TouchableOpacity
          hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
          style={this.state.txtName!=='' && this.state.txtName!==null ? show : hide} onPress={()=>{this.setState({txtName:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={locationIC} style={imgInfo} />
          </View>
          <Text style={colorErr}>{'(*)'}</Text>
          <TextInput underlineColorAndroid='transparent' autoCapitalize={'none'} autoCorrect={false}
          onChangeText={(txtAddress) => { this.setState({txtAddress}) } }
          value={`${this.state.txtAddress}`}
          //ref={ref => this.input3 = ref}
          onFocus={() => this.refs.Address.focus()}
          ref='Address' returnKeyType = {"next"}
          onBlur={()=>{
            if(this.state.txtAddress!==''){
              clearTimeout(timeoutLatLng);
              this.getLatLng()
            }
          }}
          onSubmitEditing={(event) => {
            this.refs.Des.focus();
            if(this.state.txtAddress!==''){
              clearTimeout(timeoutLatLng);
              this.getLatLng()
            }
          }}
          placeholder={`${this.state.lang.address}`} style={wrapInputCreImg} />
          <View style={{width:15}}>
          <TouchableOpacity style={this.state.txtAddress!=='' && this.state.txtAddress!==null ? show : hide}
          onPress={()=>{this.setState({txtAddress:'',lat:'Lat 0.0',lng:'Lng 0.0',})}}
          hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={region.latitude!==undefined?show:hide}>
        {region.latitude!==undefined &&
            <MapView
              style={{width,height:width,zIndex:10,alignSelf:'stretch'}}
              region={region}
              onPress={(event)=>{
                const {latitude,longitude} = event.nativeEvent.coordinate;
                this.myMar.hideCallout();
                this.getAddress(latitude,longitude);

              }}
              //onReady={()=>{console.log('onReady');}}
              onRegionChange={()=>{
                this.myMar.showCallout();
              }}
              customMapStyle={global.style_map_ios}
              showsPointsOfInterest={false}
            >
            <MapView.Marker
              coordinate={{
                latitude: Number(region.latitude),
                longitude: Number(region.longitude),
              }}
              ref={(co) => { this.myMar = co}}
            >
            <MapView.Callout onLayout={()=>{
              Platform.OS==='android' && this.myMar.showCallout();
            }}>
            <View style={{height: 30,width: width-60,alignItems:'center',justifyContent:'center',borderRadius:3}}>
            <Text numberOfLines={1}>{`${addrMarker}`}</Text>
            </View>
            </MapView.Callout>

            </MapView.Marker>
            </MapView>}
            <TouchableOpacity style={{position:'absolute',zIndex:999,bottom:10,right:10,backgroundColor:'rgba(254,254,254,.8)'}}
            onPress={() => {
              const { latitude,longitude } = this.props.yourCurLoc;
              this.myMar.hideCallout();
              this.getAddress(latitude,longitude);

            }}>
              <Image source={currentLocIC} style={{width:30,height:30}} />
            </TouchableOpacity>
          </View>


        <TouchableOpacity style={listCreate}
        onPress={()=>this.setState({showOpenTime:!this.state.showOpenTime})}>
        <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
              <Image source={timeIC} style={imgInfo} />
            </View>
            <Text style={colorErr}>{'(*)'}</Text>
            <View style={{paddingLeft:15,flexDirection:'row'}}>
              <Text style={colorlbl}>{this.state.lang.open_time}</Text>
              <Text style={colorErr}></Text>
              </View>
          </View>
          <View style={{flexDirection:'row'}}>
          <Image source={selectedIC} style={[imgShare,this.state.ListOpenTime.length>0 ? show : hide]}/>
          <Image source={arrowNextIC} style={imgShare}/>
          </View>
        </TouchableOpacity>

        <View style={listCreate}>
        <View style={widthLblCre}>
          <Image source={descriptionIC} style={imgInfo} />
        </View>
          <TextInput underlineColorAndroid='transparent'
          multiline
          numberOfLines={5}
          maxHeight={85}
          maxLength={512}
          onChangeText={(txtDes) => this.setState({txtDes})}
          value={this.state.txtDes}
          ref='Des' returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.UserWifi.focus();  }}
          placeholder={this.state.lang.description} style={wrapInputCreImg} />
          <View style={{width:15}}>
          <TouchableOpacity
          hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
          style={this.state.txtDes!=='' && this.state.txtDes!==null ? show : hide} onPress={()=>{this.setState({txtDes:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
            <Image source={keywordsIC} style={imgInfo} />
          </View>
          <Text style={colorErr}>{'(*)'}</Text>
          <TextInput underlineColorAndroid='transparent' autoCorrect={false}
          multiline numberOfLines={8} maxHeight={120}
          onChangeText={(text) => {
            let formattedText = text.split(' ').join('');
            //if(formattedText.trim().substr(-1,1)===',') alert(formattedText.trim().substr(-1,1)===',');
            if(formattedText.trim().substr(-1,1)===','){
              if(!checkKeyword(formattedText))  this.setState({txtKW:text})
              else {
                var arr = this.state.txtKW.split(',');
                arr.splice(-1);
                this.setState({txtKW:arr.toString()})
              }
            }else {
              this.setState({txtKW:text})
            }
          }}
          onBlur={()=>{
              if(checkKeyword(this.state.txtKW)){
                var arr = this.state.txtKW.split(',');
                arr.splice(-1);
                this.setState({txtKW:arr.toString()})
              }
          }}
          value={this.state.txtKW} ref='KW' returnKeyType = {"done"}
          placeholder={`${this.state.lang.keyword}`} style={wrapInputCreImg} />

          <View style={{width:15}}>
            <TouchableOpacity
            hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
            style={this.state.txtKW!=='' && this.state.txtKW!==null ? show : hide} onPress={()=>{this.setState({txtKW:''})}}>
            <Image source={closeIC} style={imgShare} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{padding:15,flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{flexDirection:'row'}}>
            <Text style={colorErr}>{' (*) '}</Text>
            <Text style={colorlbl}>{this.state.lang.choose_area}</Text>
          </View>
        <View style={this.state.errArea ? show : hide}>
            <Text style={colorErr}>{this.state.lang.plz_choose_area}</Text>
          </View>
        </View>
        <ChooseArea
        setCountry={(idCountry)=>this.setState({idCountry})}
        setCity={(idCity)=>this.setState({idCity})}
        setDist={(idCountry,idCity,idDist,nameCountry,nameCity,nameDist)=>{this.setState({idCountry,idCity,idDist,nameCountry,nameCity,nameDist,errArea:false},()=>{
          this.getLatLng();
        })}}
        idCountry={this.state.idCountry}
        idCity={this.state.idCity}
        idDist={this.state.idDist}
        nameCountry={this.state.nameCountry}
        nameCity={this.state.nameCity}
        nameDist={this.state.nameDist}
        lang={this.state.lang}/>


        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={wifiIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
            returnKeyType = {"next"} ref='UserWifi'
            onSubmitEditing={(event) => {this.refs.PassWifi.focus();}}
            placeholder={this.state.lang.name_wifi} style={wrapInputCreImg}
            onChangeText={(txtUserWifi) => this.setState({txtUserWifi})}
            value={this.state.txtUserWifi}
           />
          <View style={{width:15}}>
          <TouchableOpacity
          hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
          style={this.state.txtUserWifi!=='' && this.state.txtUserWifi!==null ? show : hide} onPress={()=>{this.setState({txtUserWifi:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={passwifiIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
            returnKeyType = {"next"} ref='PassWifi'
            onSubmitEditing={(event) => {this.refs.Phone.focus();}}
            placeholder={this.state.lang.pass_wifi} style={wrapInputCreImg}
            onChangeText={(txtPassWifi) => this.setState({txtPassWifi})}
            value={this.state.txtPassWifi}
           />
          <View style={{width:15}}>
          <TouchableOpacity
          hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
          style={this.state.txtPassWifi!=='' && this.state.txtUserWifi!==null ? show : hide} onPress={()=>{this.setState({txtPassWifi:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={phoneIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
            returnKeyType = {"next"} ref='Phone' keyboardType={'numeric'}
            onSubmitEditing={(event) => {this.refs.Email.focus();}}
            placeholder={this.state.lang.phone} style={wrapInputCreImg}
            onChangeText={(txtPhone) => this.setState({txtPhone})}
            value={this.state.txtPhone}
            maxLength={20}
           />
          <View style={{width:15}}>
          <TouchableOpacity
          hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
          style={this.state.txtPhone!=='' && this.state.txtPhone!==null ? show : hide} onPress={()=>{this.setState({txtPhone:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={emailIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
            returnKeyType = {"next"} ref='Email'
            onSubmitEditing={(event) => {this.refs.KW.focus();}}
            placeholder={'Email'} style={wrapInputCreImg}
            onChangeText={(txtEmail) => this.setState({txtEmail})}
            value={this.state.txtEmail}
           />
          <View style={{width:15}}>
          <TouchableOpacity
          hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
          style={this.state.txtEmail!=='' && this.state.txtEmail!==null ? show : hide} onPress={()=>{this.setState({txtEmail:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>


        <View style={{height:15}}></View>

        <View style={listCreate}>
          <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
              <Image source={locationMapIC} style={imgInfo} />
            </View>
              <View style={{paddingLeft:15}}>
              <Text style={colorlbl}>{this.state.lang.location_map}</Text>
              </View>
          </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Text>{Number(this.state.lat).toFixed(6)==='NaN' ? this.state.lat : Number(this.state.lat).toFixed(6)} - {Number(this.state.lng).toFixed(6)==='NaN' ? this.state.lng : Number(this.state.lng).toFixed(6)}</Text>
            </View>
        </View>

        <View style={{height:15}}></View>
        <TouchableOpacity style={listCreate}
        onPress={()=>this.uploadAvatar()}>
            <View style={{flexDirection:'row'}}>
              <View style={widthLblCre}>
                <Image source={avatarIC} style={imgInfo} />
              </View>
              <Text style={colorErr}>{' (*)'}</Text>
              <View style={{paddingLeft:15,flexDirection:'row',alignItems:'center'}}>
                <Image source={{isStatic:true,uri:`${this.state.imgAvatar.path}`}} style={[imgInfo,marRight,this.state.imgAvatar.path!==undefined ? show : hide]}/>
                <Text style={colorlbl}>{this.state.lang.avatar}</Text>
              </View>
            </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={selectedIC} style={[imgShare,this.state.imgAvatar.path!==undefined ? show : hide]}/>
          <View style={imgCamera}>
          <Image source={cameraIC} style={imgShare}/>
          </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={listCreate}
        onPress={()=>{this.setState({showImgSpace:true})}}>
            <View style={{flexDirection:'row'}}>
              <View style={widthLblCre}>
                <Image source={spaceIC} style={imgInfo} />
              </View>
              <View style={{paddingLeft:15}}>
                <Text style={colorlbl}>{this.state.lang.space}</Text>
                </View>
            </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={selectedIC} style={[imgShare,this.state.img_space.length>0 ? show : hide]}/>
          <View style={imgCamera}>
          <Image source={cameraIC} style={imgShare}/>
          </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={listCreate}
        onPress={()=>{this.setState({showImgMenu:true})}}>
            <View style={{flexDirection:'row'}}>
              <View style={widthLblCre}>
                <Image source={galleryIC} style={imgInfo} />
              </View>
              <View style={{paddingLeft:15}}>
                <Text style={colorlbl}>{this.state.lang.image}</Text>
                </View>
            </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={selectedIC} style={[imgShare,this.state.img_menu.length>0 ? show : hide]}/>
          <View style={imgCamera}>
          <Image source={cameraIC} style={imgShare}/>
          </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={listCreate} onPress={()=>{this.setState({showVideo:true})}}>
            <View style={{flexDirection:'row'}}>
              <View style={widthLblCre}>
                <Image source={videoIC} style={imgInfo} />
              </View>
              <View style={{paddingLeft:15}}>
                <Text style={colorlbl}>Video</Text>
                </View>
            </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image source={selectedIC} style={[imgShare,this.state.link_video.length>0 ? show : hide]}/>
            <View style={imgCamera} >
            <Image source={movieIC} style={imgShare}/>
            </View>
          </View>

        </TouchableOpacity>


          <AddImgSpace
          submitImage={(img_space,title_space,des_space)=>{
            this.setState({img_space,title_space,des_space})
          }}
          visible={showImgSpace}
          img_space={this.state.img_space}
          title_space={this.state.title_space}
          des_space={this.state.des_space}
          lang={this.state.lang}
          editLoc={this.state.editLoc}
          closeModal={()=>this.setState({showImgSpace:false})} />

          <AddImgMenu
          submitImage={(img_menu,title_menu,des_menu)=>{
            //console.log(img_menu,title_menu,des_menu);
            this.setState({img_menu,title_menu,des_menu})
          }}
          visible={showImgMenu}
          img_menu={this.state.img_menu}
          title_menu={this.state.title_menu}
          des_menu={this.state.des_menu}
          lang={this.state.lang}
          editLoc={this.state.editLoc}
          closeModal={()=>this.setState({showImgMenu:false})} />

          <AddVideo
          lang={this.state.lang}
          editLoc={this.state.editLoc}
          submitImage={(link_video,img_video)=>{
            //console.log(link_video);
            this.setState({link_video,img_video})
          }}
          visible={showVideo}
          link_video={this.state.link_video}
          img_video={this.state.img_video}
          closeModal={()=>this.setState({showVideo:false})} />

        <View style={{height:15}}></View>
        {this.state.editLoc &&
          <View>
          <View style={{width:width-(width/4),alignSelf:'center',marginBottom:5}}>
            <TouchableOpacity onPress={()=>{this.setState({showUpdateMore:true})}} style={btnPress}>
            <Text style={colorNext}> {this.state.lang.update_general_info} </Text>
            </TouchableOpacity>
          </View>
          <View style={{height:30}}></View>
          </View>
        }
      </View>
      </TouchableWithoutFeedback>
      <View style={{height:30}}></View>

      </ScrollView>
    </View>}

    {this.state.showOpenTime && <OpenTime
    ListOpenTime={this.state.ListOpenTime}
    lang={this.state.lang}
    closeModal={this.setOpenTime.bind(this)} />}


      {this.state.showUpdate &&
        <View style={[popoverLoc,centerVer]}>
            <View style={[overLayout,pad10]}>
            <Image source={LogoHome} style={{width:45,height:45,zIndex:9999999,position:'absolute',top:10,right:(width/2)-30}}/>
              <View style={pad10}></View>
              <View style={{alignItems:'center',padding:15}}>
              <View style={{flexDirection:'row',paddingTop:20}}>
              <Image source={selectedIC} style={{width:22,height:22}}/>
              <Text style={{color:'#6587A8',fontSize:17,textAlign:'center'}}>
               {` ${this.state.lang.create_success}`.toUpperCase()}
              </Text>
              </View>
              <Text style={{color:'#6587A8',fontSize:15,textAlign:'center',fontStyle:'italic'}}>
              {`${this.state.lang.approve_location}${'\n\n'}`}
              </Text>
              <Text style={{color:'#6587A8',fontSize:16,textAlign:'center',fontWeight:'500'}}>
              {`${this.state.lang.update_more}`}
              </Text>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
                  <TouchableOpacity style={{alignItems:'center',padding:7,borderWidth:1,borderRadius:4,borderColor:'#d0021b',minWidth:width/3}}
                  onPress={()=>{this.props.navigation.navigate('MainScr')}}>
                    <Text style={{color:'#d0021b',fontSize:16}}>{`${this.state.lang.later}`}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{alignItems:'center',padding:7,borderRadius:4,backgroundColor:'#d0021b',marginLeft:10,minWidth:width/3}}
                  onPress={()=>{this.setState({showUpdateMore:true,showUpdate:false})}}>
                    <Text style={{color:'#fff',fontSize:16}}>{`${this.state.lang.update}`}</Text>
                  </TouchableOpacity>
              </View>

              <View style={pad10}></View>

            </View>
        </View>
      }

      {this.state.showUpdateMore &&
        <UpdateMore
        user_profile={this.state.user_profile}
        lang={this.state.lang.lang}
        content_id={idContent}
        lang={this.state.lang}
        visible={this.state.showUpdateMore}
        editLoc={this.state.editLoc}
        updateModal={()=>{this.setState({showUpdateMore:false});}}
        closeModal={()=>{this.setState({showUpdateMore:false});goBack();}}
        />
      }
        {this.state.showSubCat && <Modal
        onRequestClose={()=>null} transparent
        animationType={'slide'}
        visible={this.state.showSubCat}
        >
          <View style={container}>
            <View style={headCatStyle}>
                <View style={headContent}>
                    <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
                    <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                    </TouchableOpacity>
                    <Text style={titleCreate}> {this.state.lang.classify} </Text>
                    <View></View>
                </View>
            </View>

            <FlatList
               extraData={this.state}
               data={sub_cat}
               renderItem={({item}) =>(
                 <TouchableOpacity onPress={()=>{

                   if(this.state.checkSubCat[item.id]!==item.id){
                     this.state.hasSubCat +=1;
                     this.state.checkSubCat=Object.assign(this.state.checkSubCat,{[item.id]:item.id});
                   }else{
                     this.state.hasSubCat -=1;
                     this.state.checkSubCat=Object.assign(this.state.checkSubCat,{[item.id]:!item.id});
                   }
                   this.setState(this.state)
                 }}
                 style={listAdd}>
                   <Text style={colorlbl}>{item.name}</Text>
                   <Image source={checkIC} style={[imgShare,this.state.checkSubCat[item.id]===item.id ? show : hide]} />
                 </TouchableOpacity>
               )}
               keyExtractor={item => item.id.toString()}
             />
             <View style={{height:5}}></View>
          </View>
          </Modal>}

          {this.state.showService && <Modal
          onRequestClose={() => null}
          transparent
          animationType={'slide'}
          visible={this.state.showService}
          >
            <View style={container}>
              <View style={headCatStyle}>
                  <View style={headContent}>
                      <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={()=>this.setState({showService:!this.state.showService})}>
                      <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                      </TouchableOpacity>
                      <Text style={titleCreate}> {this.state.lang.utilities} </Text>
                      <View></View>
                  </View>
              </View>


              <FlatList
                extraData={this.state}
                 data={serv_items}
                 renderItem={({item}) =>(
                   <TouchableOpacity onPress={()=>{
                     console.log('this.state.checkService',this.state.checkService);
                     if(this.state.checkService[`${item.id}`]!==item.id){
                       this.state.hasService +=1;
                       this.state.checkService=Object.assign(this.state.checkService,{[item.id]:item.id});
                     }else{
                       this.state.hasService -=1;
                       this.state.checkService=Object.assign(this.state.checkService,{[item.id]:!item.id});
                     }
                     this.setState(this.state);
                   } }
                   style={listAdd}>
                     <Text style={colorlbl}>{item.name}</Text>
                     <Image source={checkIC} style={[imgShare,this.state.checkService[`${item.id}`]===item.id ? show : hide]} />
                   </TouchableOpacity>
                 )}
                 keyExtractor={item => item.id.toString()}
               />
               <View style={{height:5}}></View>
            </View>
            </Modal>}

            {this.state.showLoading &&
            <Modal onRequestClose={() => null} transparent
            visible={this.state.showLoading} >
              <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.6)'}}>
                <ActivityIndicator size="large" color="#d0021b" />
              </View>
            </Modal>}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {yourCurLoc:state.yourCurLoc}
}

export default connect(mapStateToProps)(FormCreate);
