/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,FlatList
} from 'react-native';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import postApi from '../api/postApi';
import cameraLargeIC from '../../src/icon/ic-create/ic-camera-large.png';
import closeLargeIC from '../../src/icon/ic-create/ic-close-large.png';
import closeIC from '../../src/icon/ic-white/ic-close.png';
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
      listProduct:[],
      arrLoc:{},
      listLocChoose:[],
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
  createProduct(){
    const {nameProduct,desProduct,priceProduct,imgProduct} = this.state;
    const {content_id} = this.props;

    if(nameProduct===''||desProduct===''||priceProduct===''||imgProduct.path===undefined) return false;
    const arr = new FormData();
    arr.append('content_id','83597');
    arr.append('name',nameProduct);
    arr.append('des',desProduct);
    arr.append('price',priceProduct);
    arr.append(`image`, {
      uri:`${imgProduct.path}`,
      name: `my_image.jpg`,
      type: `${imgProduct.mime}`
    });
    postApi(`${global.url}${'product/create'}`,arr).then((e)=>{
      if(e.code===200){
        this.getListProduct();
      }
    });
  }
  getListProduct(){
    getApi(`${global.url}${'product/list/'}${this.props.content_id}`).then((e)=>{
      this.setState({listProduct:e.data});
    });
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
  updateListLoc = () => {
    var {arrLoc,listLocChoose,listLoc} = this.state;
    //console.log('arrLoc',Object.entries(arrLoc));
    var arr=[];
    listLoc.forEach(e=>{
      if(arrLoc[e.id]) arr.push(e);
      //console.log('listLocChooseAAA');
    })
    listLocChoose=arr;
    //console.log('listLocChoose',listLocChoose);
    this.setState(this.state,()=>{
      //console.log('updateListLoc1',this.state);
    });
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,show,hide,colorWhite,titleErr,
      btnPress,colorNext,popoverLoc,centerVer,overLayout,pad10,colorlbl,
      imgShare
    } = styles;
    const {lang,visible,user_profile}= this.props;
    var {nameProduct,desProduct,priceProduct,imgProduct,listLoc,showLoc,arrLoc,listLocChoose,listProduct}= this.state;
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
                paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(desProduct) => this.setState({desProduct})}
              placeholder={`${"Mô tả"}`} value={desProduct}
              style={{
                paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(priceProduct) => this.setState({priceProduct})}
              placeholder={`${"Giá"}`} value={priceProduct}
              style={{
                paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              </View>

          </View>
          <View style={{width:width/2,alignSelf:'center',marginTop:20}}>
            <TouchableOpacity onPress={()=>this.createProduct()} style={btnPress}>
            <Text style={colorNext}> + {'Thêm sản phẩm dịch vụ'} </Text>
            </TouchableOpacity>
          </View>
          <FlatList
             extraData={this.state}
             style={{marginTop:15,padding:15,width:width-30}}
             data={listProduct}
             keyExtractor={(item,index) => index.toString()}
             renderItem={({item,index}) =>(
               <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}
               onPress={()=>{

               }}>
                   <View style={{flexDirection:'row',maxWidth:width-110}}>
                       <Image source={{uri:checkUrl(item.thumb) ? item.thumb : `${global.url_media}${item.thumb}`}} style={{width:50,height:40,marginRight:10}} />
                       <View>
                         <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.price}`}</Text>
                       </View>
                   </View>
                     <Image source={arrLoc[item.id]?checkIC:uncheckIC} style={imgShare} />
               </TouchableOpacity>
             )} />

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
                paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
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
          <FlatList
             extraData={this.state}
             style={{padding:15,width}}
             data={listLocChoose}
             keyExtractor={(item,index) => index.toString()}
             renderItem={({item,index}) =>(
               <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}
               onPress={()=>{
                 if(arrLoc[item.id]){
                   arrLoc= Object.assign(arrLoc,{[item.id]:!item.id})
                 }else {
                   arrLoc= Object.assign(arrLoc,{[item.id]:item.id})
                 }
                 this.setState(this.state);
               }}>

                   <View style={{flexDirection:'row',maxWidth:width-110}}>
                       <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                       <View>
                         <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                       </View>
                   </View>
                     <Image source={arrLoc[item.id]?checkIC:uncheckIC} style={imgShare} />
               </TouchableOpacity>
             )} />

          </View>}

          {showLoc &&
            <View style={[popoverLoc,centerVer]}>
                {/*<TouchableOpacity onPress={()=>{this.setState({showLoc:false})}}
                style={{position:'absolute',top:15,right:15}}>
                  <Image source={closeIC} style={[imgShare]} />
                </TouchableOpacity>*/}
                <View style={[overLayout,pad10]}>
                <Text numberOfLines={1} style={colorlbl}>{'ĐỊA ĐIỂM CÙNG HỆ THỐNG'}</Text>
                <FlatList
                   extraData={this.state}
                   style={{marginTop:15,padding:15,width:width-30}}
                   data={listLoc}
                   keyExtractor={(item,index) => index.toString()}
                   renderItem={({item,index}) =>(
                     <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}
                     onPress={()=>{
                       if(arrLoc[item.id]){
                         arrLoc= Object.assign(arrLoc,{[item.id]:!item.id})
                       }else {
                         arrLoc= Object.assign(arrLoc,{[item.id]:item.id})
                       }
                       this.setState(this.state);
                     }}>
                         <View style={{flexDirection:'row',maxWidth:width-110}}>
                             <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                             <View>
                               <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                               <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                             </View>
                         </View>
                           <Image source={arrLoc[item.id]?checkIC:uncheckIC} style={imgShare} />
                     </TouchableOpacity>
                   )} />
                   <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
                       <TouchableOpacity style={{alignItems:'center',padding:7,borderWidth:1,borderRadius:4,borderColor:'#d0021b',minWidth:width/3}}
                       onPress={()=>{this.setState({showLoc:false,arrLoc:[]})}}>
                         <Text style={{color:'#d0021b',fontSize:16}}>{`${'Huỷ'}`}</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={{alignItems:'center',padding:7,borderRadius:4,backgroundColor:'#d0021b',marginLeft:10,minWidth:width/3}}
                       onPress={()=>{this.setState({showLoc:false},()=>{
                         this.updateListLoc();
                       })}}>
                         <Text style={{color:'#fff',fontSize:16}}>{`${'Done'}`}</Text>
                       </TouchableOpacity>
                   </View>
                </View>
            </View>
          }
        </View>
        </Modal>

    );
  }
}
