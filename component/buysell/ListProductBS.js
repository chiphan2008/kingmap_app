/* @flow */

import React, { Component } from 'react';
import {Keyboard,Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,Modal, FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import Moment from 'moment';
import styles from '../styles';
import getApi from '../api/getApi';
import checkLocation from '../api/checkLocation';
import global from '../global';
import lang_vn from '../lang/vn/language';
import lang_en from '../lang/en/language';
import SelectLocation from '../main/location/SelectLocation';

import searchIC from '../../src/icon/ic-gray/ic-search.png';
import likeIC from '../../src/icon/ic-like.png';
import favoriteIC from '../../src/icon/ic-favorite.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import sortDownIC from '../../src/icon/ic-sort-down.png';
import upDD from '../../src/icon/ic-white/ic-dropdown_up.png';

export default class ListProductBS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelLoc : "Địa điểm",
      labelCat : this.props.navigation.state.params.cat_name,
      idCountry:null,
      idCity:null,
      idDist:null,
      subtype:null,
      showLoc:false,
      showSubCat:false,
      isRefresh:false,
      page:0,
      pullToRefresh:true,
      listData:[],
    }

  }

  getData(country=null,city=null,district=null,subtype=null,skip=null){
    this.setState({pullToRefresh:false});
    //get-list?kind=mua&raovat_type=1
    if(skip===null){
      skip=0; this.setState({page:0});
    }
    const { kind, raovat_type } = this.props.navigation.state.params;

    let url = `${global.url}${'raovat/get-list?kind='}${kind}${'&raovat_type='}${raovat_type}&skip=${skip}&limit=20`;
    if(subtype!==null)  url += `${'&subtype='}${subtype}`;
    if(district!==null)  url += `${'&district='}${district}`;
    if(city!==null)  url += `${'&city='}${city}`;
    if(country!==null)  url += `${'&country='}${country}`;
    console.log('url',url);
    getApi(url).then(arrData => {
      if(skip===0){
        this.state.listData = arrData.data;
      }else {
        this.setState({ listData: this.state.listData.concat(arrData.data) });
      }
      this.state.isRefresh=false;
      if(arrData.data.length<20) this.state.pullToRefresh=false;
      else this.state.pullToRefresh=true;
      this.setState(this.state);
    })
    .catch(err => console.log(err));
  }

  onRefresh(){
    //console.log('refreshing')
    const { idCountry,idCity,idDist,subtype,page,pullToRefresh } = this.state;
    const pos=page+20;
    if(pullToRefresh){
      this.setState({ isRefresh: true, page: page+20 }, function() {
        this.getData(idCountry,idCity,idDist,subtype,pos)
      });
    }
  }

  saveLocation(){
    //console.log('saveLocation');
    //let district;
    checkLocation().then((e)=>{
      // if(e.idDist===0) district=null;
      // else district=e.idDist;
      this.getData(e.idCountry,e.idCity,e.idDist,this.state.subtype,null);
      this.setState({
        showLoc:!this.state.showLoc,
        idCountry:e.idCountry,
        idCity:e.idCity,
        idDist:e.idDist,
        labelLoc:e.nameDist});
    });
  }

  componentWillMount() {
    this.getData();
  }
  render() {
    //console.log('ListLocation');
    const { listData,showLoc,showSubCat,idCountry,idCity,idDist,isRefresh } = this.state;
    const { goBack,navigate } = this.props.navigation;
    const { cat_name,subtypes,user_id } = this.props.navigation.state.params;
    //console.log('lang',lang);
    const {
      container,
      headCatStyle, headContent,titleCreate,
      wrapFilter,filterFrame,selectBoxBuySell,widthBuySell,
      popoverLoc,padBuySell,imgUpBuySell,imgUpLoc,
      overLayout,shadown,imgUpInfo,listOverService,
      inputSearch,show,hide,colorTextPP,colorNumPP,
      wrapListLoc,padLoc,flatItemLoc,imgFlatItem,wrapFlatRight,
      txtTitleOverCat,txtAddrOverCat,flatlistItemCat,wrapInfoOver,
      colorText
    } = styles;
    //console.log('lang',this.props.lang);
    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${cat_name}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>


      <View style={wrapFilter}>
              <View style={filterFrame}>
              <TouchableOpacity style={[selectBoxBuySell,widthBuySell]}
              onPress={()=>this.setState({showLoc:true})}>
                  <Text  numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelLoc}</Text>
                  <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
              </TouchableOpacity>

              <TouchableOpacity style = {[selectBoxBuySell,widthBuySell]}
              onPress={()=>this.setState({showSubCat:true})}>
                  <Text  numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelCat}</Text>
                  <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
              </TouchableOpacity>

            </View>
      </View>

      <View style={[wrapListLoc,padLoc]}>
            <FlatList
                   //style={{marginBottom:190}}
                   ListEmptyComponent={<Text>Loading ...</Text>}
                   refreshing={isRefresh}
                   onEndReachedThreshold={0.5}
                   onEndReached={() => this.onRefresh()}
                   data={listData}
                   keyExtractor={item => item.id.toString()}
                   renderItem={({item}) => (
                     <View style={flatlistItemCat}>
                         <TouchableOpacity onPress={()=>navigate('DetailBuySellScr',{id_raovat:item.id})}>
                           {item._images[0]!==undefined && <Image style={imgFlatItem} source={{uri:`${global.url_media}${item._images[0].link}`}} />}
                         </TouchableOpacity>

                         <View style={wrapInfoOver}>
                           <TouchableOpacity onPress={()=>navigate('DetailBuySellScr')} >
                               <Text style={txtTitleOverCat} numberOfLines={2}>{item.name}</Text>
                           </TouchableOpacity>

                           <View>
                           <Text style={{color:'#d0021b',fontWeight:'bold'}} numberOfLines={1}>{item.price}đ</Text>
                           <Text style={txtAddrOverCat} numberOfLines={1}>Ngày đăng: {Moment(item.date_post).format('DD/MM/YYYY')}</Text>

                           </View>
                         </View>
                     </View>
                   )}
                 />
      </View>

      <Modal onRequestClose={() => null} transparent visible={showLoc}>
        <TouchableOpacity
        onPress={()=>this.setState({showLoc:false})}
        style={[popoverLoc,padBuySell]}>
          <View style={[overLayout,shadown]}>
              <SelectLocation showAll saveLocation={this.saveLocation.bind(this)} />
          </View>
          <Image style={[imgUpBuySell,imgUpLoc]} source={upDD} />
        </TouchableOpacity>
      </Modal>

      <Modal onRequestClose={() => null} transparent visible={showSubCat}>
        <TouchableOpacity
        onPress={()=>this.setState({showSubCat:false})}
        style={[popoverLoc,padBuySell]}>
          <View style={[overLayout,shadown]}>
          <FlatList
             keyExtractor={item => item.id.toString()}
             data={subtypes}
             renderItem={({item}) => (
               <View style={listOverService}>
                 <TouchableOpacity
                 onPress={()=>{
                   this.setState({showSubCat:false,subtype:item.id,labelCat:item.name});
                   this.getData(idCountry,idCity,idDist,item.id,null)}}
                 style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
                  >
                      <Text style={colorText}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
          )} />
          <View style={listOverService}>
            <TouchableOpacity
            onPress={()=>{
              this.setState({showSubCat:false,subtype:null,labelCat:cat_name});
              this.getData(idCountry,idCity,idDist,null)}}
            style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
             >
                 <Text style={colorText}>Tất cả</Text>
             </TouchableOpacity>
           </View>
          </View>
          <Image style={[imgUpBuySell,imgUpInfo]} source={upDD} />

        </TouchableOpacity>
      </Modal>


      </View>
    );
  }
}
