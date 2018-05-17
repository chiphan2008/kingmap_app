/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,FlatList
} from 'react-native';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import cameraLargeIC from '../../src/icon/ic-create/ic-camera-large.png';
import closeLargeIC from '../../src/icon/ic-create/ic-close-large.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import checkIC from '../../src/icon/ic-check.png';
import uncheckIC from '../../src/icon/ic-uncheck.png';

const {width,height} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
import {checkUrl} from '../libs';

export default class UpdateMore extends Component {
  constructor(props){
    super(props);
    this.state = {
      showProductTab:true,
      showKMTab:false,
      showBrandTab:false,
      imgProduct:[],
      imgVideo:[],
      listVideo:[],
      imgKM:[],
      listLoc:[],
      txtVideoLink:'',
      txtErr:'',
      nameProduct:'',
      desProduct:'',
      priceProduct:'',
      arrLoc:{},
    }
  }
  uploadProduct(){
    ImagePicker.openPicker({
      multiple: false
    }).then(imgProduct => {
      //console.log(imgProduct);
      this.setState({imgProduct})
    }).catch(e=>console.log('e'));
  }
  uploadMenu(){
    ImagePicker.openPicker({
      multiple: true
    }).then(imgKM => {
      //console.log(imgKM);
      this.setState({imgKM})
    }).catch(e=>console.log('e'));
  }
  getData(id){
    const url = `${global.url}${'user/list-location/'}${id}`;
    getApi(url)
    .then(arrData => {
        this.setState({ listLoc: arrData.data });
    })
    .catch(err => console.log(err));
  }

  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,show,hide,colorWhite,titleErr,
      btnPress,colorNext,popoverLoc,centerVer,overLayout,pad10,colorlbl,
      imgShare
    } = styles;
    const {lang,visible,user_profile}= this.props;
    const {nameProduct,desProduct,priceProduct,imgProduct,listLoc,showLoc,arrLoc}= this.state;
    return (

      <Modal
      onRequestClose={() => null} transparent animationType={'slide'}
      visible={visible}
      >
      <View style={container}>

          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>{
                    //this.props.submitImage(this.state.imgProduct,this.state.imgKM,this.state.listVideo);
                    this.props.closeModal();
                  }}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> {lang.update} </Text>
                  <View></View>
              </View>

          </View>
          <View style={{
            flexDirection:'row',justifyContent:'space-between',paddingTop:0,padding:10,paddingLeft:20,paddingRight:20,
            backgroundColor: '#D0021B',}}>
          <TouchableOpacity
          onPress={()=>this.setState({showProductTab:true,showKMTab:false,showBrandTab:false})}>
              <Text style={[titleCreate,this.state.showProductTab ? titleActive : titleTab]}>{`${'SẢN PHẨM DV'}`.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>this.setState({showProductTab:false,showKMTab:true,showBrandTab:false})}>
              <Text style={[titleCreate,this.state.showKMTab ? titleActive : titleTab]}>{`${'KHUYẾN MÃI'}`.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{this.setState({showProductTab:false,showKMTab:false,showBrandTab:true});}}>
              <Text style={[titleCreate,this.state.showBrandTab ? titleActive : titleTab]}>{`${'CHI NHÁNH'}`.toUpperCase()}</Text>
          </TouchableOpacity>
          </View>

          {this.state.showProductTab &&
          <View style={[container,this.state.showProductTab ? show : hide]}>
          <View style={{flexDirection:'row',backgroundColor:'#FFFEFF',paddingLeft:15,paddingRight:15,paddingTop:30,paddingBottom:30,marginBottom:5}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={{padding:5,marginRight:10}}
                onPress={()=>this.uploadProduct()}>
                {imgProduct.path===undefined ?
                  <Image source={cameraLargeIC} style={{width:80,height:80}}/>
                  :
                  <Image style={{width:90,height:80,marginBottom:5,resizeMode: 'cover'}} source={{isStatic:true,uri:`${imgProduct.path}`}} />
                }
                </TouchableOpacity>
              </View>

              <View style={{justifyContent:'center',alignItems:'center'}}>
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(nameProduct) => this.setState({nameProduct})}
              placeholder={`${"Tên"}`} value={nameProduct}
              style={{
                paddingLeft:10,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(desProduct) => this.setState({desProduct})}
              placeholder={`${"Mô tả"}`} value={desProduct}
              style={{
                paddingLeft:10,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(priceProduct) => this.setState({priceProduct})}
              placeholder={`${"Giá"}`} value={priceProduct}
              style={{
                paddingLeft:10,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              </View>

          </View>

          </View>}

          <View style={[container,this.state.showKMTab ? show : hide]}>
          <View style={{flexDirection:'row',backgroundColor:'#FFFEFF',paddingLeft:15,paddingRight:15,paddingTop:30,paddingBottom:30,marginBottom:5}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={{padding:5,marginRight:10}}
                onPress={()=>this.uploadProduct()}>
                {imgProduct.path===undefined ?
                  <Image source={cameraLargeIC} style={{width:80,height:80}}/>
                  :
                  <Image style={{width:90,height:80,marginBottom:5,resizeMode: 'cover'}} source={{isStatic:true,uri:`${imgProduct.path}`}} />
                }
                </TouchableOpacity>
              </View>

              <View style={{justifyContent:'center',alignItems:'center'}}>
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(nameProduct) => this.setState({nameProduct})}
              placeholder={`${"Tên"}`} value={nameProduct}
              style={{
                paddingLeft:10,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(desProduct) => this.setState({desProduct})}
              placeholder={`${"Mô tả"}`} value={desProduct}
              style={{
                paddingLeft:10,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(priceProduct) => this.setState({priceProduct})}
              placeholder={`${"Giá"}`} value={priceProduct}
              style={{
                paddingLeft:10,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              </View>

          </View>

          </View>

          {this.state.showBrandTab &&
          <View style={[container,this.state.showBrandTab ? show : hide]}>
          <View style={{width:width/2,alignSelf:'center',marginTop:20}}>
            <TouchableOpacity onPress={()=>{this.getData(user_profile.id);this.setState({showLoc:true})}} style={btnPress}>
            <Text style={colorNext}> + {lang.add_brank} </Text>
            </TouchableOpacity>
          </View>
          </View>}

          {showLoc &&
            <View style={[popoverLoc,centerVer]}>
                <View style={[overLayout,pad10]}>
                <Text numberOfLines={1} style={colorlbl}>{'ĐỊA ĐIỂM CÙNG HỆ THỐNG'}</Text>
                <FlatList
                   extraData={this.state}
                   style={{marginTop:15}}
                   data={listLoc}
                   keyExtractor={(item,index) => index.toString()}
                   renderItem={({item,index}) =>(
                     <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                         <View style={{flexDirection:'row',maxWidth:width-110}}>
                             <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                             <View>
                               <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                               <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                             </View>
                         </View>
                         <TouchableOpacity onPress={()=>{this.chooseLoc(item.id,item,index)}}
                         style={arrLoc[item.id] ? show : hide }>
                           <Image source={checkIC} style={[imgShare]} />
                         </TouchableOpacity>
                     </View>
                   )} />

                </View>
            </View>
          }
        </View>
        </Modal>

    );
  }
}
