/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,ScrollView,Modal,FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import getLanguage from '../api/getLanguage';
import checkLocation from '../api/checkLocation';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import checkIC from '../../src/icon/ic-create/ic-check.png';
import closeIC from '../../src/icon/ic-create/ic-close.png';
import upDD from '../../src/icon/ic-white/ic-dropdown_up.png';

import cameraIC from '../../src/icon/ic-create/ic-camera.png';
import nameLocationIC from '../../src/icon/ic-create/ic-name-location.png';
import cateLocationIC from '../../src/icon/ic-create/ic-cate-location.png';
import emailIC from '../../src/icon/ic-create/ic-email.png';
import phoneIC from '../../src/icon/ic-create/ic-phone.png';
import timeIC from '../../src/icon/ic-create/ic-time.png';
import priceIC from '../../src/icon/ic-create/ic-price.png';
import locationIC from '../../src/icon/ic-create/ic-location.png';
import locationMapIC from '../../src/icon/ic-create/ic-location-map.png';
import avatarIC from '../../src/icon/ic-create/ic-avatar.png';
import galleryIC from '../../src/icon/ic-create/ic-gallery.png';
import addonIC from '../../src/icon/ic-create/ic-addon.png';
import descriptionIC from '../../src/icon/ic-create/ic-description.png';
import keywordsIC from '../../src/icon/ic-create/ic-keywords.png';
import codeIC from '../../src/icon/ic-create/ic-code.png';


export default class FormCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSubCat:false,
      checkSubCat:{},
      showService:false,
      checkService:{},
      idCountry:'',nameCountry:'',listCountry:[],showCountry:false,
      idCity:'',nameCity:'',listCity:[],showCity:false,
      idDist:'',nameDist:'Quận/Huyện',listDist:[],showDist:false,
      txtFromPrice:'',
      txtToPrice:'',
      txtName:'',
      txtPhone:'',
      txtEmail:'',
      txtAddress:'',
      txtDes:'',
      txtKW:'',
      txtCode:'',
    };
    checkLocation().then(e=>{
      this.setState({idCountry:e.idCountry, nameCountry:e.nameCountry,idCity:e.idCity, nameCity:e.nameCity, })
    });

  }


  handleFromPrice = (text) => {
    if (/^\d+$/.test(text)) {
      this.setState({ txtFromPrice: text });
    }
  }
  handleToPrice = (text) => {
    if (/^\d+$/.test(text)) {
      this.setState({ txtToPrice: text });
    }
  }

  getCountry(){
    getApi(`${global.url}${'countries'}`)
    .then(arrData => {
        this.setState({ listCountry:arrData.data });
    })
    .catch(err => console.log(err));
  }
  getCity(id){
    getApi(`${global.url}${'cities/'}${id}`)
    .then(arrData => {

        this.setState({ listCity:arrData.data });
    })
    .catch(err => console.log(err));
    //this.getDist();
  }
  getDist(id){
    getApi(`${global.url}${'districts/'}${id}`)
    .then(arrData => {
        this.setState({ listDist:arrData.data });
    })
    .catch(err => console.log(err));
  }

  render() {

    const {navigate, goBack} = this.props.navigation;
    const { idCat, nameCat, sub_cat, serv_items, lang } = this.props.navigation.state.params;
    const {
      container,
      headCatStyle,headContent, wrapDistribute,wrapFilter,
      show,hide,colorlbl,listAdd,txtKV,
      listCreate,titleCreate,imgCamera,itemKV,
      imgShare,imgInfo,wrapInputCreImg,wrapCreImg,widthLblCre,
      imgUpCreate,imgUpInfo,overLayout,listOverService,shadown,popoverLoc,padCreate,
      imgUpLoc,imgUpSubCat,
    } = styles;

    return (
      <View style={container}>
      <ScrollView>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
              </TouchableOpacity>
              <Text style={titleCreate}> TẠO ĐỊA ĐIỂM </Text>
              <TouchableOpacity>
                <Text style={titleCreate}>Done</Text>
              </TouchableOpacity>
          </View>
      </View>

    <View>
        <View style={{padding:15}}>
        <Text style={colorlbl}>Chọn khu vực</Text>
        </View>
        <View style={listCreate}>
            <TouchableOpacity
            onPress={()=>{ this.setState({ showCountry:true });this.getCountry() }}
            style={itemKV}>
              <Text numberOfLines={1} style={txtKV}>{this.state.nameCountry}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{this.setState({ showCity:true });this.getCity(this.state.idCountry)}}
            style={itemKV}>
              <Text numberOfLines={1} style={txtKV}>{this.state.nameCity}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{this.setState({ showDist:true }); this.getDist(this.state.idCity)}}
            style={itemKV}>
              <Text numberOfLines={1} style={txtKV}>{this.state.nameDist}</Text>
            </TouchableOpacity>
        </View>
        <View style={{padding:15}}>
        <Text style={colorlbl}>Thông tin chung</Text>
        </View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={nameLocationIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
          returnKeyType = {"next"}
          autoFocus = {true}
          returnKeyType={ "next" }
          onSubmitEditing={(event) => {  this.refs.Phone.focus();  }}
          placeholder="Tên địa điểm" style={wrapInputCreImg}
          onChangeText={(txtName) => this.setState({txtName})}
          value={this.state.txtName}
           />
          <TouchableOpacity style={this.state.txtName!=='' ? show : hide} onPress={()=>{this.setState({txtName:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={listCreate}
        onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
          <View style={widthLblCre}>
          <Image source={cateLocationIC} style={imgInfo} />
          </View>
          <View style={wrapInputCreImg}>
          <Text style={colorlbl}>Phân loại địa điểm</Text>
          </View>
          <Image source={arrowNextIC} style={imgShare}/>
        </TouchableOpacity>

        <View style={listCreate}>
          <View style={widthLblCre}>
            <Image source={phoneIC} style={imgInfo} />
          </View>
          <TextInput keyboardType={'phone-pad'} underlineColorAndroid='transparent'
          onChangeText={(txtPhone) => this.setState({txtPhone})}
          value={this.state.txtPhone}
          ref='Phone'
          returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.Email.focus();  }}
          placeholder="Điện thoại" style={wrapInputCreImg} />

          <TouchableOpacity style={this.state.txtPhone!=='' ? show : hide} onPress={()=>{this.setState({txtPhone:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
        <View style={widthLblCre}>
          <Image source={emailIC} style={imgInfo} />
        </View>
          <TextInput underlineColorAndroid='transparent'
          keyboardType={'email-address'}
          onChangeText={(txtEmail) => this.setState({txtEmail})}
          value={this.state.txtEmail}
          ref='Email'
          returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.FromPrice.focus();  }}
          placeholder="Email" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtEmail!=='' ? show : hide} onPress={()=>{this.setState({txtEmail:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
        <View style={widthLblCre}>
          <Image source={timeIC} style={imgInfo} />
        </View>
          <View style={wrapInputCreImg}>
            <Text style={colorlbl}>Thời gian mở cửa</Text>
          </View>
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
          <View style={{flexDirection:'row'}}>
          <View style={widthLblCre}>
          <Image source={priceIC} style={imgInfo} />
          </View>
          <Text style={colorlbl}>Mức giá</Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <TextInput underlineColorAndroid='transparent'
          placeholder="Giá từ"
          keyboardType={'numeric'}
          ref='FromPrice'
          returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.ToPrice.focus();  }}
          style={{borderBottomWidth:1,borderBottomColor:'#DFE7ED',padding:0,minWidth:90}}
          onChangeText={(txtFromPrice) => this.handleFromPrice(txtFromPrice)}
          value={this.state.txtFromPrice} />
          <Text style={colorlbl}> - </Text>
          <TextInput underlineColorAndroid='transparent'
          placeholder="Đến giá"
          keyboardType={'numeric'}
          ref='ToPrice'
          returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.Address.focus();  }}
          style={{borderBottomWidth:1,borderBottomColor:'#DFE7ED',padding:0,minWidth:90}}
          onChangeText={(txtToPrice) => this.handleToPrice(txtToPrice)}
          value={this.state.txtToPrice} />
          </View>
        </View>
        <View style={{height:15}}></View>


        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={locationIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
          onChangeText={(txtAddress) => this.setState({txtAddress})}
          value={this.state.txtAddress}
          ref='Address'
          returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.Des.focus();  }}
          placeholder="Địa chỉ" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtAddress!=='' ? show : hide} onPress={()=>{this.setState({txtAddress:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>

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
          ref='Des'
          returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.KW.focus();  }}
          placeholder="Nhập mô tả" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtDes!=='' ? show : hide} onPress={()=>{this.setState({txtDes:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
        <View style={widthLblCre}>
          <Image source={keywordsIC} style={imgInfo} />
        </View>
          <TextInput underlineColorAndroid='transparent'
          multiline
          numberOfLines={4}
          maxHeight={65}
          onChangeText={(txtDes) => this.setState({txtDes})}
          value={this.state.txtKW}
          ref='KW'
          returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.Code.focus();  }}
          placeholder="Nhập từ khoá" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtKW!=='' ? show : hide} onPress={()=>{this.setState({txtKW:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>

        <View style={{height:15}}></View>
        <View style={listCreate}>
          <View style={widthLblCre}>
            <Image source={avatarIC} style={imgInfo} />
          </View>
          <View style={wrapCreImg}>
            <Text style={colorlbl}>Ảnh đại diện</Text>
          </View>
          <TouchableOpacity style={imgCamera}>
          <Image source={cameraIC} style={imgShare}/>
          </TouchableOpacity>
        </View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={galleryIC} style={imgInfo} />
          </View>
          <View style={wrapInputCreImg}>
          <Text style={colorlbl}>Thêm hình ảnh</Text>
          </View>
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>
        <View style={{height:15}}></View>

        <TouchableOpacity style={listCreate} onPress={()=>this.setState({showService:!this.state.showService})}>
          <View style={widthLblCre}>
          <Image source={addonIC} style={imgInfo} />

          </View>
          <View style={wrapInputCreImg}>
          <Text style={colorlbl}>Tiện ích</Text></View>
          <Image source={arrowNextIC} style={imgShare}/>
        </TouchableOpacity>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Image source={codeIC} style={imgInfo} />
          </View>
          <TextInput underlineColorAndroid='transparent'
          onChangeText={(txtCode) => this.setState({txtCode})}
          value={this.state.txtCode}
          ref='Code'
          returnKeyType = {"done"}
          placeholder="Mã giới thiệu" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtCode!=='' ? show : hide} onPress={()=>{this.setState({txtCode:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>
        <View style={{height:15}}></View>

      </View>
      </ScrollView>
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
                    <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                    </TouchableOpacity>
                    <Text style={titleCreate}> Phân loại </Text>
                    <View></View>
                </View>
            </View>

            <View style={{flexDirection:'row',padding:15}}>
            <TextInput underlineColorAndroid='transparent'
            placeholder="Thêm phân loại" style={{borderColor:'#DFE7ED',borderWidth:1,borderRadius:3,marginRight:10,padding:5,width:width-100,backgroundColor:'#fff'}} />
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
                      <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                      </TouchableOpacity>
                      <Text style={titleCreate}> TIỆN ÍCH </Text>
                      <View></View>
                  </View>
              </View>

              <View style={{flexDirection:'row',padding:15}}>
              <TextInput underlineColorAndroid='transparent'
              placeholder="Thêm tiện ích" style={{borderColor:'#DFE7ED',borderWidth:1,borderRadius:3,marginRight:10,padding:5,width:width-100,backgroundColor:'#fff'}} />
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

            <Modal onRequestClose={() => null} transparent visible={this.state.showCountry}>
            <TouchableOpacity
            onPress={()=>this.setState({ showCountry:false }) }
            style={[popoverLoc,padCreate]}>
            <Image style={[imgUpCreate,imgUpLoc]} source={upDD} />
                <View style={[overLayout,shadown]}>
                <FlatList
                   extraData={this.state}
                   keyExtractor={(item, index) => index}
                   data={this.state.listCountry}
                   renderItem={({item}) => (
                  <View  style={listOverService}>
                  <TouchableOpacity
                      onPress={()=>this.setState({
                        idCountry:item.id,nameCountry:item.name,showCountry:false,
                        idCity:'',nameCity:'Tỉnh/TP',idDist:'',nameDist:'Quận/Huyện',
                       })}
                      style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',}} >
                       <Text style={colorlbl}>{item.name}</Text>
                   </TouchableOpacity>
                  </View>
                )} />
                </View>
            </TouchableOpacity>
            </Modal>

            <Modal onRequestClose={() => null} transparent visible={this.state.showCity}>
            <TouchableOpacity
            onPress={()=>this.setState({ showCity:false }) }
            style={[popoverLoc,padCreate]}>
            <Image style={[imgUpCreate,imgUpSubCat]} source={upDD} />
                <View style={[overLayout,shadown]}>
                <FlatList
                   extraData={this.state}
                   keyExtractor={(item, index) => index}
                   data={this.state.listCity}
                   renderItem={({item}) => (
                  <View  style={listOverService}>
                  <TouchableOpacity
                      onPress={()=>this.setState({
                        idCity:item.id,nameCity:item.name,showCity:false,
                        idDist:'',nameDist:'Quận/Huyện',
                       })}
                      style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',}} >
                       <Text style={colorlbl}>{item.name}</Text>
                   </TouchableOpacity>
                  </View>
                )} />
                </View>
            </TouchableOpacity>
            </Modal>

            <Modal onRequestClose={() => null} transparent visible={this.state.showDist}>
            <TouchableOpacity
            onPress={()=>this.setState({ showDist:false }) }
            style={[popoverLoc,padCreate]}>
            <Image style={[imgUpCreate,imgUpInfo]} source={upDD} />
                <View style={[overLayout,shadown]}>
                <FlatList
                   extraData={this.state}
                   keyExtractor={(item, index) => index}
                   data={this.state.listDist}
                   renderItem={({item}) => (
                  <View  style={listOverService}>
                  <TouchableOpacity
                      onPress={()=>this.setState({ idDist:item.id,nameDist:item.name,showDist:false })}
                      style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',}} >
                       <Text style={colorlbl}>{item.name}</Text>
                   </TouchableOpacity>
                  </View>
                )} />
                </View>
            </TouchableOpacity>
            </Modal>

      </View>
    );
  }
}
