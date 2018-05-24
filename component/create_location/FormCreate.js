/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,ScrollView,Modal,FlatList,AsyncStorage,
  BackHandler,Alert,ActivityIndicator,
} from 'react-native';
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
import AddProduct from './AddProduct';
import AddVideo from './AddVideo';
import OpenTime from './OpenTime';
//import la from '../api/checkLocation';
import ChooseArea from './ChooseArea';
import checkLogin from '../api/checkLogin';

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

import {hasNumber,getIndex,strtoarray,isEmail,checkSVG,checkKeyword} from '../libs';

var timeoutLatLng;
export default class FormCreate extends Component {
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
      open_from:'',
      open_to:'',
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
      img_video:[],
      //addGroupProduct:[],
      index:0,
      //listProduct:{},
      category_item:[],
      des_space:[],
      title_space:[],
      des_menu:[],
      title_menu:[],
      errArea:false,
      errMsg:'',
      id_ctv:'',
      idCountry:'',idCity:'',idDist:'',
      nameCountry:'',nameCity:'',nameDist:'',
      isLogin:false,
      showLoading:false,
      user_profile:{},
      showUpdate:false,
      showUpdateMore:false,
      editLoc:false,

    };
    checkLogin().then(e=>{
      //console.log(e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({user_profile:e,id_ctv:e.id_ctv,isLogin:true});
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
    const url = `${global.url}${'content/'}${idContent}`;
    console.log('url',url);
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
        console.log(e);
        this.setState({checkService: Object.assign(this.state.checkService,{[e]:e.toString()})});
      })
      content._category_items.forEach(e=>{
        this.setState({checkSubCat: Object.assign(this.state.checkSubCat,{[e.id]:e.id})});
      })
      setTimeout(()=>{
        this.setState({
          serv_items,
          txtName:content.name,
          txtAddress:content.address,
          ListOpenTime:content._date_open,
          txtDes:content.description,
          txtUserWifi:content.wifi,
          txtPassWifi:content.pass_wifi,
          txtPhone:content.phone,
          lat:content.lat,
          lng:content.lng,
          txtEmail:content.email,
          txtKW:content.keyword_ad,
          idCountry:content._country.id,idCity:content._city.id,idDist:content._district.id,
          nameCountry:content._country.name,nameCity:content._city.name,nameDist:content._district.name,
        },()=>{
          // console.log(this.state.idDist);
          // console.log(this.state.nameDist);
        });
      },1200)

    }).catch(err => {});
  }

  confirmPostData(){
    //console.log('confirmPostData1');
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
    if(this.state.txtKW.trim()==='' || strtoarray(this.state.txtKW,',').length<3 ){this.setState({errMsg:this.state.lang.enter_kw});return false;}
    //console.log('confirmPostData7');
    if(this.state.imgAvatar.path===undefined){this.setState({errMsg:this.state.lang.enter_avatar});return false;}
    //console.log('confirmPostData8');
    if(this.state.lat==='Lat 0.0' || this.state.lat===''){this.setState({errMsg:this.state.lang.enter_address_again});return false;}
    //console.log('confirmPostData9',isEmail(this.state.txtEmail));
    if(this.state.txtEmail!==''){if(!isEmail(this.state.txtEmail.trim())) {this.setState({errMsg:this.state.lang.email_format});return false;}}
    //console.log('confirmPostData10');
    this.setState({showLoading:true});
    const arr = new FormData();
    arr.append('name',this.state.txtName.trim());
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
    })
    arr.append('country',this.state.idCountry);
    arr.append('city',this.state.idCity);
    arr.append('district',this.state.idDist);
    arr.append('wifi',this.state.txtUserWifi.trim());
    arr.append('passwifi',this.state.txtPassWifi.trim());
    arr.append('phone',this.state.txtPhone.trim());
    arr.append('email',this.state.txtEmail.trim());

    arr.append(`avatar`, {
      uri:`${this.state.imgAvatar.path}`,
      name: `my_avatar.jpg`,
      type: `${this.state.imgAvatar.mime}`
    });
    arr.append('address',this.state.txtAddress.trim());
    arr.append('lat',this.state.lat);
    arr.append('lng',this.state.lng);
    strtoarray(this.state.txtKW,',').forEach((e)=>{
      arr.append('tag[]',e);
    });

    arr.append('description',this.state.txtDes);
    // //arr.append('code_invite',this.state.txtCode);
    arr.append('id_ctv',this.state.id_ctv);
    this.state.img_space.length>0 && this.state.img_space.forEach((e,index)=>{
      arr.append(`image_space[]`, {
        uri:`${e.path}`,
        name: `${index}_image_space.jpg`,
        type: `${e.mime}`
      });
      let title_space = this.state.title_space[index]===undefined ? '':this.state.title_space[index][1];
      let des_space = this.state.des_space[index]===undefined ? '':this.state.des_space[index][1];
      arr.append(`title_space[]`, title_space);
      arr.append(`des_space[]`, des_space);
    });

    this.state.img_menu.length>0 &&  this.state.img_menu.forEach((e,index)=>{
      arr.append(`image_menu[]`, {
        uri:`${e.path}`,
        name: `${index}_image_menu.jpg`,
        type: `${e.mime}`
      });
      let title_menu = this.state.title_menu[index]===undefined ? '':this.state.title_menu[index][1];
      let des_menu = this.state.des_menu[index]===undefined ? '':this.state.des_menu[index][1];
      arr.append(`title_menu[]`, title_menu);
      arr.append(`des_menu[]`, des_menu);
    })

    this.state.img_video.length>0 && this.state.img_video.forEach((e)=>{
      arr.append('link[]',e);
    })
    Object.entries(this.state.checkService).length>0 && Object.entries(this.state.checkService).forEach((e)=>{
      if(e[1]!==false){
        arr.append('service[]',e[1]);
      }
    });

    postApi(`${global.url}${'create-location'}`,arr).then((e)=>{
      this.setState({showLoading:false},()=>{
        if(e.code===200){
          Alert.alert(this.state.lang.notify,this.state.lang.create_success,[
            {text: '', style: 'cancel'},
            {text: 'OK', onPress: () => this.setState({idContent:e.data.content.id,showUpdate:true})}
          ],
         { cancelable: false })
        }else {
          Alert.alert(this.state.lang.notify,e.message)
        }
      });

    });

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
    //if(nameDist.trim()!=='' && nameDist.trim()!==undefined) {params += nameDist + ', ';}
    if(nameCity.trim()!=='' && nameCity.trim()!==undefined) {params += nameCity + ', ';}
    if(nameCountry.trim()!=='' && nameCountry.trim()!==undefined) {params += nameCountry;}
    //console.log('params',params);
    let url = `${'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCCCOoPlN2D-mfrYEMWkz-eN7MZnOsnZ44&sensor=true&address='}${params}`;
    console.log(url);
    getApi(url).then(e=>{

      let arrDataAddr = e.results[0].address_components;
      let arrDataLoc = e.results[0].geometry.location;
      //console.log(arrDataAddr,arrDataLoc);
      if(txtAddress.trim()!=='' && txtAddress.trim()!==undefined) this.state.txtAddress=`${arrDataAddr[0].long_name} ${arrDataAddr[1].long_name}`;
      this.state.lat=arrDataLoc.lat;
      this.state.lng=arrDataLoc.lng;
      timeoutLatLng = setTimeout(()=>{
        this.setState(this.state);
      },3000)

    })
  }

  render() {
    //console.log('navigation',this.props.navigation);
    const {navigate, goBack} = this.props.navigation;
    const { idCat,lang } = this.props.navigation.state.params;
    const {
      container,
      headCatStyle,headContent, wrapDistribute,wrapFilter,
      show,hide,hidden,colorlbl,listAdd,txtKV,btnMap,
      listCreate,titleCreate,imgCamera,colorErr,
      imgShare,imgInfo,marRight,wrapInputCreImg,wrapCreImg,widthLblCre,
      imgUpCreate,imgUpLoc,imgUpInfo,overLayout,listOverService,shadown,popoverLoc,padCreate,
      upDDLoc,upDDSubCat,selectBox,optionUnitStyle,clockTime,centerVer,pad10,txtNextItem,
    } = styles;

    const {idContent,showUpdateMore,showImgSpace,showProduct,showImgMenu,showVideo,sub_cat,nameCat, serv_items,} = this.state;

    return (
      <View style={container}>
      {showUpdateMore===false && <ScrollView >
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
              <Text style={titleCreate}> {idContent===undefined? this.state.lang.create_location:  this.state.lang.edit_location} </Text>
              <TouchableOpacity onPress={()=>this.confirmPostData()}>
                <Text style={titleCreate}>{this.state.lang.done}</Text>
              </TouchableOpacity>
          </View>
      </View>
    <View>
        <TouchableOpacity style={listCreate}
        onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
          <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
            <Image source={cateLocationIC} style={imgInfo} />
            </View>
              <View style={{paddingLeft:15,flexDirection:'row'}}>
                <Text style={colorlbl}>{this.state.lang.classify}</Text>
                <Text style={colorErr}>{' *'}</Text>
              </View>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={selectedIC} style={[imgShare,this.state.hasSubCat>0 ? show : hide]}/>
          <Text style={colorlbl}>{nameCat}</Text>
          <Image source={arrowNextIC} style={imgShare}/>
          </View>

        </TouchableOpacity>

        <TouchableOpacity style={listCreate} onPress={()=>this.setState({showService:!this.state.showService})}>
          <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
            <Image source={addonIC} style={imgInfo} />
            </View>
            <View style={{paddingLeft:15}}>
            <Text style={colorlbl}>{this.state.lang.utilities}</Text></View>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image source={selectedIC} style={[imgShare,this.state.hasService>0 ? show : hide]}/>
            <Image source={arrowNextIC} style={imgShare}/>
          </View>
        </TouchableOpacity>
        {/*<View style={{height:15}}></View>*/}


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
          <TextInput underlineColorAndroid='transparent'
            returnKeyType = {"next"} autoFocus = {true}
            onSubmitEditing={(event) => {this.refs.Address.focus();}}
            placeholder={`${this.state.lang.name_location}${' *'}`} style={wrapInputCreImg}
            onChangeText={(txtName) => this.setState({txtName})}
            value={this.state.txtName}
           />
          <View style={{width:15}}>
          <TouchableOpacity style={this.state.txtName!=='' ? show : hide} onPress={()=>{this.setState({txtName:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={locationIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
          onChangeText={(txtAddress) => { this.setState({txtAddress}) } }
          value={`${this.state.txtAddress}`} ref='Address' returnKeyType = {"next"}
          onBlur={()=>{
            if(this.state.txtAddress!==''){
              clearTimeout(timeoutLatLng);
              this.getLatLng()
            }
          }}
          onSubmitEditing={(event) => {  this.refs.Des.focus(); clearTimeout(timeoutLatLng);this.getLatLng();  }}
          placeholder={`${this.state.lang.address}${' *'}`} style={wrapInputCreImg} />
          <View style={{width:15}}>
          <TouchableOpacity style={this.state.txtAddress!=='' ? show : hide}
          onPress={()=>{this.setState({txtAddress:'',lat:'Lat 0.0',lng:'Lng 0.0',})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={listCreate}
        onPress={()=>this.setState({showOpenTime:!this.state.showOpenTime})}>
        <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
              <Image source={timeIC} style={imgInfo} />
            </View>
            <View style={{paddingLeft:15,flexDirection:'row'}}>
              <Text style={colorlbl}>{this.state.lang.open_time}</Text>
              <Text style={colorErr}>{' *'}</Text>
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
          numberOfLines={4}
          maxHeight={65}
          onChangeText={(txtDes) => this.setState({txtDes})}
          value={this.state.txtDes}
          ref='Des' returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.UserWifi.focus();  }}
          placeholder={this.state.lang.description} style={wrapInputCreImg} />
          <View style={{width:15}}>
          <TouchableOpacity style={this.state.txtDes!=='' ? show : hide} onPress={()=>{this.setState({txtDes:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={{padding:15,flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{flexDirection:'row'}}>
            <Text style={colorlbl}>{this.state.lang.choose_area}</Text>
            <Text style={colorErr}>{' *'}</Text>
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
          <TouchableOpacity style={this.state.txtUserWifi!=='' ? show : hide} onPress={()=>{this.setState({txtUserWifi:''})}}>
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
          <TouchableOpacity style={this.state.txtPassWifi!=='' ? show : hide} onPress={()=>{this.setState({txtPassWifi:''})}}>
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
            maxLength={11}
           />
          <View style={{width:15}}>
          <TouchableOpacity style={this.state.txtPhone!=='' ? show : hide} onPress={()=>{this.setState({txtPhone:''})}}>
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
          <TouchableOpacity style={this.state.txtEmail!=='' ? show : hide} onPress={()=>{this.setState({txtEmail:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
            <Image source={keywordsIC} style={imgInfo} />
          </View>

          <TextInput underlineColorAndroid='transparent'
          multiline numberOfLines={4} maxHeight={65}
          onChangeText={(text) => {
            //console.log(text);
            if(text.substr(-1)===','){
              if(!checkKeyword(text))  this.setState({txtKW:text})
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
            console.log(this.state.txtKW);
              if(checkKeyword(this.state.txtKW)){
                var arr = this.state.txtKW.split(',');
                arr.splice(-1);
                this.setState({txtKW:arr.toString()})
              }
          }}

          value={this.state.txtKW} ref='KW' returnKeyType = {"done"}
          placeholder={`${this.state.lang.keyword}${' (*)'}`} style={wrapInputCreImg} />

          <View style={{width:15}}>
            <TouchableOpacity style={this.state.txtKW!=='' ? show : hide} onPress={()=>{this.setState({txtKW:''})}}>
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
            <View style={{flexDirection:'row'}}>
            <Text>{Number(this.state.lat).toFixed(6)==='NaN' ? this.state.lat : Number(this.state.lat).toFixed(6)} - {Number(this.state.lng).toFixed(6)==='NaN' ? this.state.lng : Number(this.state.lng).toFixed(6)}</Text>
            </View>
        </View>



        <View style={{height:15}}></View>
        <View style={listCreate}>
            <View style={{flexDirection:'row'}}>
              <View style={widthLblCre}>
                <Image source={avatarIC} style={imgInfo} />
              </View>
              <View style={{paddingLeft:15,flexDirection:'row',alignItems:'center'}}>
                <Image source={{isStatic:true,uri:`${this.state.imgAvatar.path}`}} style={[imgInfo,marRight,this.state.imgAvatar.path!==undefined ? show : hide]}/>
                <Text style={colorlbl}>{this.state.lang.avatar}</Text>
                <Text style={colorErr}>{' *'}</Text>
              </View>
            </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={selectedIC} style={[imgShare,this.state.imgAvatar.path!==undefined ? show : hide]}/>
          <TouchableOpacity style={imgCamera}
          onPress={()=>this.uploadAvatar()}>
          <Image source={cameraIC} style={imgShare}/>
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
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
          <TouchableOpacity style={imgCamera}
          onPress={()=>{this.setState({showImgSpace:true})}}>
          <Image source={cameraIC} style={imgShare}/>
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
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
          <TouchableOpacity style={imgCamera}
          onPress={()=>{this.setState({showImgMenu:true})}}>
          <Image source={cameraIC} style={imgShare}/>
          </TouchableOpacity>
          </View>
        </View>

        <View style={listCreate}>
            <View style={{flexDirection:'row'}}>
              <View style={widthLblCre}>
                <Image source={videoIC} style={imgInfo} />
              </View>
              <View style={{paddingLeft:15}}>
                <Text style={colorlbl}>Video</Text>
                </View>
            </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image source={selectedIC} style={[imgShare,this.state.img_video.length>0 ? show : hide]}/>
            <TouchableOpacity style={imgCamera}
            onPress={()=>{this.setState({showVideo:true})}}>
            <Image source={movieIC} style={imgShare}/>
            </TouchableOpacity>
          </View>
        </View>


          <AddImgSpace
          submitImage={(img_space,title_space,des_space)=>{this.setState({img_space,title_space,des_space})}}
          visible={showImgSpace}
          closeModal={()=>this.setState({showImgSpace:false})} />

          <AddImgMenu
          submitImage={(img_menu,title_menu,des_menu)=>{this.setState({img_menu,title_menu,des_menu})}}
          visible={showImgMenu}
          closeModal={()=>this.setState({showImgMenu:false})} />

          <AddVideo
          lang={this.state.lang}
          submitImage={(img_video)=>this.setState({img_video})}
          visible={showVideo}
          closeModal={()=>this.setState({showVideo:false})} />



        {/*<View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={codeIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
          onChangeText={(txtCode) => this.setState({txtCode})}
          value={this.state.txtCode}
          ref='Code'
          returnKeyType = {"done"}
          placeholder={this.state.lang.referral_code} style={wrapInputCreImg} />
          <View style={{width:15}}>
          <TouchableOpacity style={this.state.txtCode!=='' ? show : hide} onPress={()=>{this.setState({txtCode:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>*/}
        <View style={{height:15}}></View>
      </View>

      </ScrollView>}

      <View style={[clockTime,this.state.showOpenTime ? show : hidden]}>
      <OpenTime
      lang={this.state.lang}
      closeModal={this.setOpenTime.bind(this)} />
      </View>
      {this.state.showUpdate &&
        <View style={[popoverLoc,centerVer]}>
            <View style={[overLayout,pad10]}>
              <View style={pad10}></View>
              <View style={{alignItems:'center',padding:15}}>
              <Text style={{color:'#6587A8',fontSize:17,textAlign:'center'}}>{`${this.state.lang.update_more}`}</Text>
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
                    <TouchableOpacity onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
                    <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                    </TouchableOpacity>
                    <Text style={titleCreate}> {this.state.lang.classify} </Text>
                    <View></View>
                </View>
            </View>

            {/*<View style={{flexDirection:'row',padding:15}}>
            <TextInput underlineColorAndroid='transparent'
            placeholder={this.state.lang.add_classify} style={{borderColor:'#DFE7ED',borderWidth:1,borderRadius:3,marginRight:10,padding:5,width:width-100,backgroundColor:'#fff'}} />
            <TouchableOpacity style={{backgroundColor:'#D0021B',borderRadius:3,padding:8,paddingLeft:18,paddingRight:18}}>
            <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>+</Text>
            </TouchableOpacity>
            </View>*/}
            <FlatList
               extraData={this.state}
               data={sub_cat}
               renderItem={({item}) =>(
                 <TouchableOpacity onPress={()=>{

                   if(this.state.checkSubCat[`${item.id}`]!==item.id){
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
                   <Image source={checkIC} style={[imgShare,this.state.checkSubCat[`${item.id}`]===item.id ? show : hide]} />
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
                      <TouchableOpacity onPress={()=>this.setState({showService:!this.state.showService})}>
                      <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                      </TouchableOpacity>
                      <Text style={titleCreate}> {this.state.lang.utilities} </Text>
                      <View></View>
                  </View>
              </View>

              {/*<View style={{flexDirection:'row',padding:15}}>
              <TextInput underlineColorAndroid='transparent'
              placeholder={this.state.lang.add_utilities} style={{borderColor:'#DFE7ED',borderWidth:1,borderRadius:3,marginRight:10,padding:5,width:width-100,backgroundColor:'#fff'}} />
              <TouchableOpacity style={{backgroundColor:'#D0021B',borderRadius:3,padding:8,paddingLeft:18,paddingRight:18}}>
              <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>+</Text>
              </TouchableOpacity>
              </View>*/}

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
