/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,ScrollView,Modal,FlatList,AsyncStorage,
  BackHandler,Alert,
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
import GroupProduct from './GroupProduct';
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

import {hasNumber,getIndex,strtoarray} from '../libs';

var timeoutLatLng;
export default class FormCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: this.props.navigation.state.params.lang==='vn' ? language_vn : language_en,
      showSubCat:false,
      showOpenTime:false,
      checkSubCat:{},
      showService:false,
      checkService:{},

      lat:'Lat 0.0',
      lng:'Lng 0.0',
      txtUserWifi:'',
      txtPassWifi:'',
      open_from:'',
      open_to:'',
      ListOpenTime:[],
      txtName:'',
      txtPhone:'',
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
      addGroupProduct:[],
      index:0,
      listProduct:{},
      category_item:[],
      des_space:[],
      title_space:[],
      des_menu:[],
      title_menu:[],
      errArea:false,
      errMsg:'',
      id_ctv:'',
      idCountry:'',idCity:'',idDist:'',
      isLogin:false,
    };
    checkLogin().then(e=>{
      //console.log(e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        this.setState({id_ctv:e.id_ctv,isLogin:true});
      }
    })
    //BackHandler.addEventListener('hardwareBackPress', ()=>this.setState({showSubCat:false}));
  }
  postData(){
    if(this.state.idCountry==='' || this.state.idCity==='' || this.state.idDist===''){
      this.setState({errArea:true});return false;
    }
    if(this.state.txtName===''){this.setState({errMsg:this.state.lang.enter_name});return false;}
    if(this.state.txtAddress===''){this.setState({errMsg:this.state.lang.enter_address});return false;}
    if(this.state.ListOpenTime.length===0){this.setState({errMsg:this.state.lang.enter_time});return false;}
    if(Object.entries(this.state.checkSubCat).length===0){this.setState({errMsg:this.state.lang.enter_classify});return false;}
    //if(this.state.txtFromPrice===''){this.setState({errMsg:this.state.lang.enter_price_from});return false;}
    //if(this.state.txtToPrice===''){this.setState({errMsg:this.state.lang.enter_price_to});return false;}
    if(this.state.imgAvatar.path===undefined){this.setState({errMsg:this.state.lang.enter_avatar});return false;}

    const arr = new FormData();
    arr.append('name',this.state.txtName);
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
    arr.append('wifi',this.state.txtUserWifi);
    arr.append('passwifi',this.state.txtPassWifi);
    arr.append('phone',this.state.txtPhone);

    arr.append(`avatar`, {
      uri:`${this.state.imgAvatar.path}`,
      name: `my_avatar.jpg`,
      type: `${this.state.imgAvatar.mime}`
    });
    arr.append('address',this.state.txtAddress);
    arr.append('lat',this.state.lat);
    arr.append('lng',this.state.lng);
    strtoarray(this.state.txtKW,',').forEach((e)=>{
      arr.append('tag[]',e);
    });

    arr.append('description',this.state.txtDes);
    // //arr.append('code_invite',this.state.txtCode);
    arr.append('id_ctv',this.state.id_ctv);
    this.state.img_space.forEach((e,index)=>{
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

    this.state.img_menu.forEach((e,index)=>{
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

    this.state.img_video.forEach((e)=>{
      arr.append('link[]',e);
    })
    Object.entries(this.state.checkService).forEach((e)=>{
      if(e[1]!==false){
        arr.append('service[]',e[1]);
      }
    });

    // Object.entries(this.state.listProduct).forEach((e)=>{
    //   //console.log('=Object.entries',e);
    //   let group = e[0];
    //   arr.append(`product[${group}][group_name]`,e[1].group_name);
    //   Object.entries(e[1]).forEach((r)=>{
    //     if(r[0]!=='group_name' && r[0]!=='idGroup'){
    //       arr.append(`product[${group}][${r[0]}][id]`,r[0]);
    //       arr.append(`product[${group}][${r[0]}][name]`,r[1].name);
    //       arr.append(`product[${group}][${r[0]}][price]`,r[1].price);
    //       arr.append(`product[${group}][${r[0]}][currency]`,r[1].currency);
    //       if(r[1].image.path!==undefined){
    //           arr.append(`product[${group}][${r[0]}][image]`, {
    //           uri:`${r[1].image.path}`,
    //           name: `${r[0]}_my_product.jpg`,
    //           type: `${r[1].image.mime}`
    //         });
    //       }
    //     }
    //   });
    //
    // });

    console.log('arr',arr);
    console.log('arr',`${global.url}${'create-location'}`);
    postApi(`${global.url}${'create-location'}`,arr).then((e)=>{
      console.log('e',e);
      if(e.code===200){
        this.props.navigation.navigate('MainScr');
      }else {
        Alert.alert(this.state.lang.notify,e.message)
      }
    });
  }

  setOpenTime(ListOpenTime){
    //console.log('ListOpenTime',ListOpenTime);
    this.setState({ListOpenTime,showOpenTime:false});
  }

  getIndexProduct(element,id){
    //console.log('element[id].idGroup==id',element[id].idGroup==id);
    return element[id].idGroup==id;
  }
  submitProduct(id,e){
    this.setState({listProduct: Object.assign(this.state.listProduct,{[id]:e})});
  }

  insertGroup() {
    this.state.addGroupProduct.push(
          <GroupProduct
            //listProduct={this.state.product}
            submitProduct={this.submitProduct.bind(this)}
            removeGroup={this.removeGroup.bind(this)}
            indexGroup={this.state.index}
            key={this.state.index} />)
    this.setState({
        index: this.state.index + 1,
        addGroupProduct: this.state.addGroupProduct
    })
  }
  getIndex(element,id){
    return element.key==id;
  }

  removeGroup(id){
    const index = this.state.addGroupProduct.findIndex((e)=>this.getIndex(e,id));
    delete this.state.listProduct[id];
    this.setState({
        listProduct: this.state.listProduct
    });
    if(Object.keys(this.state.listProduct).length===0){
      this.setState({
          index: 0,
          listProduct:{}
      });
    }
    if(index!==-1){
      this.state.addGroupProduct.splice(index, 1);
      this.setState({
          addGroupProduct: this.state.addGroupProduct
      })
    }
  }

  uploadAvatar(){
    ImagePicker.openPicker({
      cropping: false
    }).then(image =>{
      this.setState({imgAvatar:image});
    }).catch(e=>console.log('e'));
  }
  getLatLng(addr){
    let url = `${'https://maps.googleapis.com/maps/api/geocode/json?&address='}${addr}`;
    getApi(url).then(e=>{

      let arrDataAddr = e.results[0].address_components;
      let arrDataLoc = e.results[0].geometry.location;
      //console.log(arrDataAddr,arrDataLoc);
      this.setState({
        txtAddress: `${arrDataAddr[0].long_name} ${arrDataAddr[1].long_name}`,
        lat:arrDataLoc.lat,
        lng:arrDataLoc.lng,
      })

    })
  }

  render() {
    //console.log('navigation',this.props.navigation);
    const {navigate, goBack} = this.props.navigation;
    const { idCat, nameCat, sub_cat, serv_items,lang } = this.props.navigation.state.params;
    const {
      container,
      headCatStyle,headContent, wrapDistribute,wrapFilter,
      show,hide,hidden,colorlbl,listAdd,txtKV,
      listCreate,titleCreate,imgCamera,colorErr,
      imgShare,imgInfo,wrapInputCreImg,wrapCreImg,widthLblCre,
      imgUpCreate,imgUpLoc,imgUpInfo,overLayout,listOverService,shadown,popoverLoc,padCreate,
      upDDLoc,upDDSubCat,selectBox,optionUnitStyle,clockTime,
    } = styles;

    const {showImgSpace,showProduct,showImgMenu,showVideo} = this.state;

    return (
      <View style={container}>
      <ScrollView >
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
              <Text style={titleCreate}> {this.state.lang.create_location} </Text>
              <TouchableOpacity onPress={()=>this.postData()}>
                <Text style={titleCreate}>{this.state.lang.done}</Text>
              </TouchableOpacity>
          </View>
      </View>
    <View>
        <View style={{padding:15,flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={colorlbl}>{this.state.lang.choose_area}</Text>
          <View style={this.state.errArea ? show : hide}>
            <Text style={colorErr}>{this.state.lang.plz_choose_area}</Text>
          </View>
        </View>
        <ChooseArea
        setCountry={(idCountry)=>this.setState({idCountry})}
        setCity={(idCity)=>this.setState({idCity})}
        setDist={(idCountry,idCity,idDist)=>this.setState({idCountry,idCity,idDist,errArea:false})}
        lang={this.state.lang}/>

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
            placeholder={this.state.lang.name_location} style={wrapInputCreImg}
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
          value={this.state.txtAddress} ref='Address' returnKeyType = {"next"}
          onBlur={()=>{
            if(this.state.txtAddress!==''){
              clearTimeout(timeoutLatLng);
              this.getLatLng(this.state.txtAddress)
            }
          }}
          onSubmitEditing={(event) => {  this.refs.Des.focus(); clearTimeout(timeoutLatLng);this.getLatLng(this.state.txtAddress);  }}
          placeholder={this.state.lang.address} style={wrapInputCreImg} />
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
            <View style={{paddingLeft:15}}>
              <Text style={colorlbl}>{this.state.lang.open_time}</Text>
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
            onSubmitEditing={(event) => {this.refs.KW.focus();}}
            placeholder={this.state.lang.phone} style={wrapInputCreImg}
            onChangeText={(txtPhone) => this.setState({txtPhone})}
            value={this.state.txtPhone}
           />
          <View style={{width:15}}>
          <TouchableOpacity style={this.state.txtPhone!=='' ? show : hide} onPress={()=>{this.setState({txtPhone:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={listCreate}
        onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
          <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
            <Image source={cateLocationIC} style={imgInfo} />
            </View>
              <View style={{paddingLeft:15}}>
                <Text style={colorlbl}>{this.state.lang.classify}</Text>
              </View>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={selectedIC} style={[imgShare,Object.entries(this.state.checkSubCat).length>0 ? show : hide]}/>
          <Text style={colorlbl}>{nameCat}</Text>
          <Image source={arrowNextIC} style={imgShare}/>
          </View>

        </TouchableOpacity>

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

        <View style={listCreate}>
          <View style={widthLblCre}>
            <Image source={keywordsIC} style={imgInfo} />
          </View>

          <TextInput underlineColorAndroid='transparent'
          multiline numberOfLines={4} maxHeight={65}
          onChangeText={(txtKW) => this.setState({txtKW})}
          value={this.state.txtKW} ref='KW' returnKeyType = {"done"}
          //onSubmitEditing={(event) => {  this.refs.Code.focus();  }}
          placeholder={this.state.lang.keyword} style={wrapInputCreImg} />

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
                <Image source={avatarIC} style={imgInfo} />
              </View>
              <View style={{paddingLeft:15}}>
                <Text style={colorlbl}>{this.state.lang.avatar}</Text>
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
          submitImage={(img_video)=>this.setState({img_video})}
          visible={showVideo}
          closeModal={()=>this.setState({showVideo:false})} />

        <View style={{height:15}}></View>



        <TouchableOpacity style={listCreate} onPress={()=>this.setState({showService:!this.state.showService})}>
          <View style={{flexDirection:'row'}}>
            <View style={widthLblCre}>
            <Image source={addonIC} style={imgInfo} />
            </View>
            <View style={{paddingLeft:15}}>
            <Text style={colorlbl}>{this.state.lang.utilities}</Text></View>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image source={selectedIC} style={[imgShare,Object.entries(this.state.checkService).length>0 ? show : hide]}/>
            <Image source={arrowNextIC} style={imgShare}/>
          </View>
        </TouchableOpacity>

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

      </ScrollView>

      <View style={[clockTime,this.state.showOpenTime ? show : hidden]}>
      <OpenTime
      lang={this.state.lang}
      closeModal={this.setOpenTime.bind(this)} />
      </View>

        <Modal
        onRequestClose={() => null}
        transparent
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

            <View style={{flexDirection:'row',padding:15}}>
            <TextInput underlineColorAndroid='transparent'
            placeholder={this.state.lang.add_classify} style={{borderColor:'#DFE7ED',borderWidth:1,borderRadius:3,marginRight:10,padding:5,width:width-100,backgroundColor:'#fff'}} />
            <TouchableOpacity style={{backgroundColor:'#D0021B',borderRadius:3,padding:8,paddingLeft:18,paddingRight:18}}>
            <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>+</Text>
            </TouchableOpacity>
            </View>
            <FlatList
               extraData={this.state}
               data={sub_cat}
               renderItem={({item}) =>(
                 <TouchableOpacity onPress={()=>{
                   if(this.state.checkSubCat[`${item.id}`]!==item.id){
                     this.setState({checkSubCat:Object.assign(this.state.checkSubCat,{[item.id]:item.id})})
                   }else{
                     this.setState({checkSubCat:Object.assign(this.state.checkSubCat,{[item.id]:!item.id})})
                   }

                 } }
                 style={listAdd}>
                   <Text style={colorlbl}>{item.name}</Text>
                   <Image source={checkIC} style={[imgShare,this.state.checkSubCat[`${item.id}`]===item.id ? show : hide]} />
                 </TouchableOpacity>
               )}
               keyExtractor={item => item.id}
             />
             <View style={{height:5}}></View>
          </View>
          </Modal>

          <Modal
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

              <View style={{flexDirection:'row',padding:15}}>
              <TextInput underlineColorAndroid='transparent'
              placeholder={this.state.lang.add_utilities} style={{borderColor:'#DFE7ED',borderWidth:1,borderRadius:3,marginRight:10,padding:5,width:width-100,backgroundColor:'#fff'}} />
              <TouchableOpacity style={{backgroundColor:'#D0021B',borderRadius:3,padding:8,paddingLeft:18,paddingRight:18}}>
              <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>+</Text>
              </TouchableOpacity>
              </View>

              <FlatList
                extraData={this.state}
                 data={serv_items}
                 renderItem={({item}) =>(
                   <TouchableOpacity onPress={()=>{
                     if(this.state.checkService[`${item.id}`]!==item.id){
                       this.setState({checkService:Object.assign(this.state.checkService,{[item.id]:item.id})})
                     }else{
                       this.setState({checkService:Object.assign(this.state.checkService,{[item.id]:!item.id})})
                     }

                   } }
                   style={listAdd}>
                     <Text style={colorlbl}>{item.name}</Text>
                     <Image source={checkIC} style={[imgShare,this.state.checkService[`${item.id}`]===item.id ? show : hide]} />
                   </TouchableOpacity>
                 )}
                 keyExtractor={item => item.id}
               />
               <View style={{height:5}}></View>
            </View>
            </Modal>

            {/*<Modal
            onRequestClose={() => null}
            transparent
            animationType={'slide'}
            visible={this.state.showProduct}
            >
              <View style={container}>
                <View style={headCatStyle}>
                    <View style={headContent}>
                        <TouchableOpacity onPress={()=>this.setState({showProduct:!this.state.showProduct})}>
                        <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                        </TouchableOpacity>
                        <Text style={titleCreate}> {this.state.lang.add_product_more} </Text>
                        <View></View>
                    </View>
                </View>

                <View style={{flexDirection:'row',padding:15,justifyContent:'center'}}>
                <TouchableOpacity
                onPress={()=>this.insertGroup()}
                style={{backgroundColor:'#D0021B',borderRadius:3,padding:8,paddingLeft:18,paddingRight:18}}>
                <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>+ {this.state.lang.add_group}</Text>
                </TouchableOpacity>
                </View>
                <ScrollView>
                  {this.state.addGroupProduct}
                </ScrollView>

              </View>
              </Modal>*/}


      </View>
    );
  }
}
