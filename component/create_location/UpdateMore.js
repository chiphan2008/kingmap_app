/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,Keyboard,
  TextInput,Dimensions,ScrollView,FlatList,Alert,
  TouchableWithoutFeedback,Platform,
} from 'react-native';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import postApi from '../api/postApi';
import checkLogin from '../api/checkLogin';
import lang_en from '../lang/en/language';
import lang_vn from '../lang/vn/language';
import cameraLargeIC from '../../src/icon/ic-create/ic-camera-large.png';
import closeLargeIC from '../../src/icon/ic-create/ic-close-large.png';
import removeIC from '../../src/icon/ic-create/ic-remove.png';
import closeIC from '../../src/icon/ic-white/ic-close.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import checkIC from '../../src/icon/ic-create/ic-check.png';
import uncheckIC from '../../src/icon/ic-uncheck.png';
import LogoHome from '../../src/icon/ic-home/Logo-home.png';

const {width,height} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
import {checkUrl,onlyNumber,format_number} from '../libs';

export default class UpdateMore extends Component {
  constructor(props){
    super(props);
    const {lang} = this.props;
    //console.log('lang.',lang.lang);
    this.state = {
      lang: lang.lang==='vn'?lang_vn:lang_en,
      lblPro: lang.lang==='vn'?lang_vn.title_add_pro:lang_en.title_add_pro,
      lblKM: lang.lang==='vn'?lang_vn.title_add_km:lang_en.title_add_km,
      showProductTab:true,
      showKMTab:false,
      showBrandTab:false,
      listLoc:[],
      txtVideoLink:'',
      txtErr:'',
      nameProduct:'',
      desProduct:'',
      priceProduct:'',
      imgProduct:{},
      nameKM:'',
      desKM:'',
      priceKM:'',
      imgKM:{},
      listProduct:[],
      listKM:[],
      listLocChoose:[],
      arrLoc:{},
      edit:false,
      product_id:'',
      discount_id:'',
      disable:false,
      page: 0,
      loadMore: true,
    }
    this.getList('product');

  }
  uploadProduct(route){
    ImagePicker.openPicker({
      multiple: false
    }).then(img => {
      //console.log(imgProduct);
      if(route==='product') this.state.imgProduct=img;
      if(route==='discount') this.state.imgKM=img;
      this.setState(this.state);
    }).catch(e=>console.log('e'));
  }
  createPKM(route){
    var {
      nameProduct,desProduct,priceProduct,imgProduct,
      nameKM,desKM,priceKM,imgKM,edit,lang,product_id,discount_id
    } = this.state;
    const {content_id} = this.props;
    const arr = new FormData();
    var name = route==='product'?nameProduct:nameKM;
    var des = route==='product'?desProduct:desKM;
    var price = route==='product'?priceProduct:priceKM;
    var img = route==='product'?imgProduct:imgKM;
    if(name===''||des===''||price===''||img.path===undefined || !onlyNumber(price)) {
      this.setState({disable:false},()=>{
        if(name===''){Alert.alert(lang.notify,lang.plz_name);return false;}
        if(des===''){Alert.alert(lang.notify,lang.plz_des);return false;}
        if(price===''){Alert.alert(lang.notify,lang.plz_price);return false;}
        if(img.path===undefined){Alert.alert(lang.notify,lang.choose_img);return false;}
        if(Platform.OS==='ios'&&!onlyNumber(price)){Alert.alert(lang.notify,lang.plz_format_price);return false;}
      })
    }else {
      arr.append('content_id',content_id);
      arr.append('name',name);
      arr.append('des',des);
      arr.append('price',price);
      product_id!=='' && arr.append('product_id',product_id);
      discount_id!=='' && arr.append('discount_id',discount_id);
      !checkUrl(img.path) && arr.append(`image`, {
        uri:`${img.path}`,
        name: `my_image.jpg`,
        type: `${img.mime}`
      });
      const act = edit?'edit':'create';
      // console.log(`${global.url}${route}/${act}`);
      // console.log('arr',arr);
      postApi(`${global.url}${route}/${act}`,arr).then((e)=>{
        console.log(e);
        if(e.code===200){
          this.setState({
            nameProduct:'',desProduct:'',priceProduct:'',imgProduct:{},
            nameKM:'',desKM:'',priceKM:'',imgKM:{},
            lblPro:lang.title_add_pro,
            lblKM:lang.title_add_km,
            edit:false,discount_id:'',discount_id:'',
            disable:false,
          },()=>{
            this.getList(route);
          });
        }
      });
    }

  }

  // componentWillUpdate(){
  //   this.state.update && this.setState({update:false},()=>{
  //     this.updateListLoc();
  //     this.getList('product');
  //
  //   })
  // }

  getList(route){
    Keyboard.dismiss();
    const {content_id} = this.props;
    getApi(`${global.url}${route}${'/list/'}${content_id}`).then((e)=>{
      if(route==='product') this.state.listProduct=e.data;
      if(route==='discount') this.state.listKM=e.data;
      this.setState(this.state);
    });
  }
  delProduct(route,id){
    //console.log(`${global.url}${'product/list/'}${'83597'}`);
    const {lang} = this.state;
    Alert.alert(lang.notify,route==='product'?lang.confirm_pro_del:lang.confirm_discount_del,[
      {text: lang.cancel, style: 'cancel'},
      {text: lang.confirm, onPress: () => {
        getApi(`${global.url}${route}${'/delete/'}${id}`).then((e)=>{
          this.getList(route);
        });
      }},
    ],
   { cancelable: false })
  }

  getOne(route,id){
    getApi(`${global.url}${route}${'/'}${id}`).then((e)=>{
      const row = e.data[0];
      if(route==='product'){
        this.setState({
          nameProduct:row.name,
          desProduct:row.description,
          priceProduct:parseInt(row.price).toString(),
          imgProduct:{path:`${global.url_media}${row.thumb}`},
          lblPro:this.state.lang.title_edit_pro,
          edit:true,
          product_id:id,
        });
      }else {
        this.setState({
          nameKM:row.name,
          desKM:row.description,
          priceKM:parseInt(row.price).toString(),
          imgKM:{path:`${global.url_media}${row.thumb}`},
          lblKM:this.state.lang.title_edit_km,
          edit:true,
          discount_id:id,
        });
      }
    });
  }

  getData(page=null){
    const {content_id} = this.props;
    let limit = 20;
    if(page===null) page = 0;
    const url = `${global.url}${'branch/list-content/'}${content_id}?skip=${page}&limit=${limit}`;
    console.log(url);
    getApi(url)
    .then(arrData => {
        this.setState({
          listLoc: page===0 ? arrData.data : this.state.listLoc.concat(arrData.data),
          page: page===0 ? 20 : this.state.page + 20,
          loadMore: arrData.data.length===20 ? true : false
        });
    })
    .catch(err => console.log(err));
  }

  delBranch(id){
    //console.log(`${global.url}${'product/list/'}${'83597'}`);
    const {lang} = this.state;
    const {content_id} = this.props;
    Alert.alert(lang.notify,lang.confirm_branch_del,[
      {text: lang.cancel, style: 'cancel'},
      {text: lang.confirm, onPress: () => {
        var arr = new FormData;
        arr.append('content_id',content_id);
        arr.append('content_id_other',id);
        postApi(`${global.url}${'branch/remove'}`,arr).then((e)=>{
          this.updateListLoc()
        });
      }},
    ],
   { cancelable: false })

  }
  addListLoc = () => {
    if(Object.entries(this.state.arrLoc).length===0) return;
    const {content_id} = this.props;
    var arr = new FormData;
    arr.append('content_id',content_id);
    this.state.listLoc.forEach(e=>{
      if(this.state.arrLoc[e.id])arr.append('arr_content[]',e.id);
    })
    //console.log(arr);
    postApi(`${global.url}${'branch/add'}`,arr).then((e)=>{
      this.updateListLoc();
    })
  }
  updateListLoc = (page=null) => {
    const {content_id} = this.props;
    if(page===null) page = 0;
    const url = `${global.url}${'branch/list/'}${content_id}?skip=${page}&limit=20`;
    //console.log(url)
    getApi(url).then(arrData => {
      //console.log('arrData',arrData)
        this.setState({
          page: page === 0 ? 20 : this.state.page + 20,
          loadMore: arrData.data.length === 20 ? true : false,
          listLocChoose: page === 0 ? arrData.data : this.state.listLocChoose.concat(arrData.data)
        });
    })
    .catch(err => console.log(err));
  }
  render() {
    const {
      container,headCatStyle,headContent,titleTabPro,titleCreate,
      titleTab,titleActive,show,hide,colorWhite,titleErr,
      btnPress,colorNext,popoverLoc,centerVer,overLayout,pad10,colorlbl,
      imgShare
    } = styles;
    const {visible,user_profile,editLoc}= this.props;
    var {
      nameProduct,desProduct,priceProduct,imgProduct,listLoc,showLoc,arrLoc,listLocChoose,listProduct,listKM,
      nameKM,desKM,priceKM,imgKM,disable,lang,loadMore, page
    }= this.state;
    //console.log('listLocChoose', listLocChoose)
    return (

      <Modal
      onRequestClose={() => null} transparent //animationType={'slide'}
      visible={visible}
      >
      <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
      <View style={container}>

          <View style={headCatStyle}>
              <View style={headContent}>

                  {editLoc ?
                  <TouchableOpacity onPress={()=>{
                    this.props.updateModal();
                  }} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                  :
                  <View><Text>   </Text></View>
                  }
                  <Text style={titleCreate}> {lang.update} </Text>

                  {editLoc ?
                    <View></View>
                  :
                  <TouchableOpacity onPress={()=>{this.props.closeModal();}}>
                    <Text style={titleCreate}>{lang.done}</Text>
                  </TouchableOpacity>
                  }

              </View>

          </View>
          <View style={{
            flexDirection:'row',justifyContent:'space-between',paddingTop:0,paddingBottom:10,paddingLeft:15,paddingRight:15,
            backgroundColor: '#D0021B',}}>
          <TouchableOpacity
          onPress={()=>{this.getList('product');this.setState({showProductTab:true,showKMTab:false,showBrandTab:false})}}>
              <Text style={[titleTabPro,this.state.showProductTab ? titleActive : titleTab]}>{`${lang.product_service}`.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{this.getList('discount');this.setState({showProductTab:false,showKMTab:true,showBrandTab:false})}}>
              <Text style={[titleTabPro,this.state.showKMTab ? titleActive : titleTab]}>{`${lang.discount}`.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{this.updateListLoc();this.setState({showProductTab:false,showKMTab:false,showBrandTab:true});}}>
              <Text style={[titleTabPro,this.state.showBrandTab ? titleActive : titleTab]}>{`${lang.branch}`.toUpperCase()}</Text>
          </TouchableOpacity>
          </View>

          {this.state.showProductTab &&
          <View style={[container,this.state.showProductTab ? show : hide]}>
          <View style={{flexDirection:'row',backgroundColor:'#FFFEFF',paddingLeft:15,paddingRight:15,paddingTop:30,paddingBottom:30,marginBottom:5}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={{padding:5,marginRight:10}}
                onPress={()=>this.uploadProduct('product')}>
                {imgProduct.path===undefined ?
                  <Image source={cameraLargeIC} style={{width:80,height:80}}/>
                  :
                  <Image style={{width:90,height:80,marginBottom:5,resizeMode: 'cover'}} source={{isStatic:true,uri:`${imgProduct.path}`}} />
                }
                </TouchableOpacity>
              </View>

              <View style={{justifyContent:'center',alignItems:'center'}}>
              <TextInput autoCorrect={false} autoCapitalize={'none'}
              underlineColorAndroid='transparent'
              onChangeText={(nameProduct) => this.setState({nameProduct})}
              placeholder={`${lang.name}`} value={nameProduct}
              style={{
                paddingLeft:0,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput autoCorrect={false} autoCapitalize={'none'}
              underlineColorAndroid='transparent'
              onChangeText={(desProduct) => this.setState({desProduct})}
              placeholder={`${lang.des}`} value={desProduct}
              style={{
                paddingLeft:0,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput autoCorrect={false} autoCapitalize={'none'}
              underlineColorAndroid='transparent'
              onChangeText={(priceProduct) => {
                if(Platform.OS!=='ios'){
                  if(priceProduct==='' || (onlyNumber(priceProduct) && priceProduct.substr(0,1)>0))
                  this.setState({priceProduct})
                }else {
                  this.setState({priceProduct})
                }
              }}
              keyboardType={'numeric'} maxLength={9}
              placeholder={`${lang.price}`} value={this.state.priceProduct}
              style={{
                paddingLeft:0,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              </View>

          </View>
          <View style={{width:width-(width/4),alignSelf:'center',marginTop:20}}>
            <TouchableOpacity disabled={disable} onPress={()=>{this.setState({disable:true},()=>{
              this.createPKM('product');
            })}} style={btnPress}>
            <Text style={colorNext}> {this.state.lblPro} </Text>
            </TouchableOpacity>
          </View>
          <FlatList
             extraData={this.state}
             style={{marginTop:15,paddingBottom:15,paddingLeft:15,paddingRight:15,width}}
             data={listProduct}
             keyExtractor={(item,index) => index.toString()}
             renderItem={({item,index}) =>(
               <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}
               >
                   <TouchableOpacity style={{flexDirection:'row',maxWidth:width-65}}
                   onPress={()=>this.getOne('product',item.id)}>
                       <Image source={{uri:checkUrl(item.thumb) ? item.thumb : `${global.url_media}${item.thumb}`}}
                       style={{width:50,height:40,marginRight:10}} />
                       <View style={{minWidth:width-65}}>
                         <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${format_number(item.price)} ${item.currency}`}</Text>
                       </View>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>this.delProduct('product',item.id)}
                   hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                     <Image source={removeIC} style={imgShare} />
                  </TouchableOpacity>
               </View>
             )} />

          </View>}

          <View style={[container,this.state.showKMTab ? show : hide]}>
          <View style={{flexDirection:'row',backgroundColor:'#FFFEFF',paddingLeft:15,paddingRight:15,paddingTop:30,paddingBottom:30,marginBottom:5}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={{padding:5,marginRight:10}}
                onPress={()=>this.uploadProduct('discount')}>
                {imgKM.path===undefined ?
                  <Image source={cameraLargeIC} style={{width:80,height:80}}/>
                  :
                  <Image style={{width:90,height:80,marginBottom:5,resizeMode: 'cover'}} source={{isStatic:true,uri:`${imgKM.path}`}} />
                }
                </TouchableOpacity>
              </View>

              <View style={{justifyContent:'center',alignItems:'center'}}>
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(nameKM) => this.setState({nameKM})}
              placeholder={`${lang.name}`} value={nameKM.toString()}
              style={{
                paddingLeft:0,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(desKM) => this.setState({desKM})}
              placeholder={`${lang.des}`} value={desKM}
              style={{
                paddingLeft:0,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              <TextInput
              underlineColorAndroid='transparent'
              onChangeText={(priceKM) => {
                if(Platform.OS!=='ios'){
                  if(priceKM==='' || (onlyNumber(priceKM) && priceKM.substr(0,1)>0) )
                  this.setState({priceKM})
                }else {
                  this.setState({priceKM})
                }
              }}
              keyboardType={'numeric'} maxLength={9}
              placeholder={`${lang.price}`} value={priceKM}
              style={{
                paddingLeft:0,paddingTop:5,paddingBottom:5,fontSize:16,width:width-150,borderBottomWidth:1,borderColor:'#E1E7EC',marginRight:10}}
                />
              </View>

          </View>
          <View style={{width:width-(width/4),alignSelf:'center',marginTop:20}}>
            <TouchableOpacity disabled={disable} onPress={()=>{this.setState({disable:true},()=>{
              this.createPKM('discount')
            })}} style={btnPress}>
            <Text style={colorNext}> {this.state.lblKM} </Text>
            </TouchableOpacity>
          </View>

          <FlatList
             extraData={this.state}
             style={{marginTop:15,paddingBottom:15,paddingLeft:15,paddingRight:15,width}}
             data={listKM}
             keyExtractor={(item,index) => index.toString()}
             renderItem={({item,index}) =>(
               <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}
               >
                   <TouchableOpacity style={{flexDirection:'row',maxWidth:width-65}}
                   onPress={()=>this.getOne('discount',item.id)}>
                       <Image source={{uri:checkUrl(item.thumb) ? item.thumb : `${global.url_media}${item.thumb}`}} style={{width:50,height:40,marginRight:10}} />
                       <View style={{minWidth:width-65}}>
                         <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${format_number(item.price)} ${item.currency}`}</Text>
                       </View>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>this.delProduct('discount',item.id)}
                   hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                     <Image source={removeIC} style={imgShare} />
                  </TouchableOpacity>
               </View>
             )} />
          </View>

          {this.state.showBrandTab &&
          <View style={[container,this.state.showBrandTab ? show : hide]}>
          <View style={{width:width*0.8,alignSelf:'center',marginTop:20}}>
            <TouchableOpacity onPress={()=>{this.getData();this.setState({showLoc:true})}} style={btnPress}>
            <Text style={colorNext}> + {lang.add_branch} </Text>
            </TouchableOpacity>
          </View>

          {listLocChoose.length>0 &&
            <View style={{backgroundColor:'#fff',marginTop:15,marginBottom:10,paddingTop:15}}>
            <FlatList
             extraData={this.state}
             data={listLocChoose}
             style={{marginBottom: 60}}
             keyExtractor={(item,index) => index.toString()}
             renderItem={({item,index}) =>(
               <TouchableWithoutFeedback>
               <View style={{flexDirection:'row',justifyContent:'center',}}>
                   <View style={{flexDirection:'row',paddingBottom:15}}>
                       <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                       <View style={{width:width-110}}>
                         <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                         <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                       </View>
                   </View>
                   <TouchableOpacity onPress={()=>{this.delBranch(item.id)}}
                   hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                     <Image source={removeIC} style={imgShare} />
                  </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
             )}
             onEndReachedThreshold={0.5}
             onEndReached={() => {
               if(loadMore) this.setState({loadMore: false}, () => {
                 this.updateListLoc(page);
               })
             }}/>
            </View>
           }

          </View>}

          {showLoc &&

            <View style={[popoverLoc,centerVer]}>
                
                <View style={[overLayout,pad10]}>
                <Image source={LogoHome} style={{height:45,width:45,marginBottom:10}} />
                <Text numberOfLines={1} style={{color:'#2A2D37',fontSize:17}}>{lang.add_branch.toUpperCase()}</Text>
                <FlatList
                   extraData={this.state}
                   style={{marginTop:15,width:width-30,paddingBottom:15,paddingLeft:5,paddingRight:5}}
                   data={listLoc}
                   keyExtractor={(item,index) => index.toString()}
                   renderItem={({item,index}) =>(
                     <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10, marginTop: 5, marginLeft: 5, marginRight: 5}}
                     onPress={()=>{
                       if(arrLoc[item.id]){
                         arrLoc= Object.assign(arrLoc,{[item.id]:!item.id})
                       }else {
                         arrLoc= Object.assign(arrLoc,{[item.id]:item.id})
                       }
                       this.setState(this.state);
                     }}>
                         <View style={{flexDirection:'row',maxWidth:width-135}}>
                             <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                             <View>
                               <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                               <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                             </View>
                         </View>
                           <Image source={arrLoc[item.id]?checkIC:uncheckIC} style={[imgShare,{width:24,height:24}]} />
                     </TouchableOpacity>
                   )}
                   onEndReachedThreshold={0.5}
                   onEndReached={() => {
                     if(loadMore) this.setState({loadMore: false}, () => {
                       console.log('load more', page)
                      this.getData(page)
                     })
                   }} />
                   <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                       <TouchableOpacity style={{alignItems:'center',padding:7,borderWidth:1,borderRadius:4,borderColor:'#d0021b',minWidth:width/3}}
                       onPress={()=>{this.setState({showLoc:false,arrLoc:[], page: 0, loadMore: true})}}>
                         <Text style={{color:'#d0021b',fontSize:16}}>{`${lang.cancel}`}</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={{alignItems:'center',padding:7,borderRadius:4,backgroundColor:'#d0021b',marginLeft:10,minWidth:width/3}}
                       onPress={()=>{this.setState({showLoc:false, page: 0, loadMore: true},()=>{
                         this.addListLoc();
                       })}}>
                         <Text style={{color:'#fff',fontSize:16}}>{`${lang.done}`}</Text>
                       </TouchableOpacity>
                   </View>
                </View>
            </View>
          }
        </View>
        </TouchableWithoutFeedback>
        </Modal>

    );
  }
}
