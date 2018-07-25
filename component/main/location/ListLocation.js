/* @flow */

import React, { Component } from 'react';
import {Keyboard,Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,Modal,ActivityIndicator,
  FlatList,
  //DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
const {height, width} = Dimensions.get('window');

import Rating from '../detail/Rating'
import styles from '../../styles';
import loginServer from '../../api/loginServer';
//import Geolocation from '../../api/Geolocation';
import getApi from '../../api/getApi';
//import getLocationByIP from '../../api/getLocationByIP';
import global from '../../global';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import SelectLocation from '../../main/location/SelectLocation';
import SelectService from '../../main/location/SelectService';
import SelectCategory from '../../main/location/SelectCategory';
import checkLocation from '../../api/checkLocation';
import checkLogin from '../../api/checkLogin';
import accessLocation from '../../api/accessLocation';

import upDD from '../../../src/icon/ic-white/ic-dropdown_up.png';
import sortDownIC from '../../../src/icon/ic-sort-down.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import likeIC from '../../../src/icon/ic-like.png';
import likeFullIcon from '../../../src/icon/ic-like-full.png';
import checkIC from '../../../src/icon/ic-green/ic-check.png';
import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import topIC from '../../../src/icon/ic-top.png';
import {remove,removeText} from '../../libs';
//import * as _ from 'lodash';

var timeout;
class ListLocation extends Component {
  constructor(props) {
    super(props);
    const {lang,idCat} = this.props.navigation.state.params || '';
    this.state = {
      keyword:'',
      kw:'',
      noData:'',
      lang: lang==='vn' ? lang_vn : lang_en,
      labelLoc : "Địa điểm",
      labelCat : "Danh mục",
      labelSer : "Dịch vụ",
      valueLoc : 0,
      valueCat : 0,
      valueSer : 0,
      curLoc:{},
      showLoc:false,
      listData:[],
      listSubCat:{
        arr:[],
        check:'',
        showList:false,
      },
      id_cat:idCat,
      showCat:false,
      showServie:false,
      idDist:null,
      id_city:'',
      id_sub:null,
      id_serv:'',
      isRefresh:true,
      page:0,
      pullToRefresh:false,
      user_id:0,
      isLoad:false,
      scrollToTop:false,
    }
    const {latitude,longitude} = this.props.yourCurLoc;
    latitude!=='' && this.getPosition(latitude,longitude);
    this.refresh();
    accessLocation();

  }


  onRefresh(skip=null){
    //console.log('refreshing')
    const { idDist,id_sub,id_serv,page,pullToRefresh,isRefresh } = this.state;
    const pos= skip!==null ? skip : page+20 ;
    //console.log('pullToRefresh',pullToRefresh);
    if(pullToRefresh){
      this.setState({ pullToRefresh: false, page: page+20 },()=>{
        this.getContentByDist(idDist,id_sub,id_serv,pos)
      });
    }

    }

  getContentByDist(id_district=null,id_sub,id_serv,skip=null){
    clearTimeout(timeout);this.setState({isLoad:true,noData:''});
    if(skip===null){
      skip = 0; this.setState({page:0})
    }
    const { keyword,kw,curLoc,id_cat,idDist } = this.state;
    const { yourCurLoc } =this.props;
    if(id_district===null) id_district=idDist;
    //const id_cat = this.props.navigation.state.params.idCat;
    var url = `${global.url}${'search-content?category='}${id_cat}${'&skip='}${skip}${'&limit=20'}${'&distance=25000'}`;
    if(id_district!==null) {
      url += `${'&district='}${id_district}`;
    }
    if(yourCurLoc.latitude!==undefined) {
      url += `${'&location='}${yourCurLoc.latitude},${yourCurLoc.longitude}`;
      //this.getPosition(curLoc.latitude,curLoc.longitude);
    }
    //if(curLoc.latitude!==undefined)
    if(keyword.trim()!=='' && kw!==keyword.trim()) url += `${'&keyword='}${keyword}`;
    else {
      url += `${'&keyword='}${keyword}`;
      if(id_sub!==null) url += `${'&subcategory='}${id_sub}`;
      //id_serv = id_serv.replace('-1,','');
      if(id_serv!=='') url += `${'&service='}${id_serv}`;
    }
    this.setState({ kw:keyword });

    console.log('-----url-----1',url);
    getApi(url)
    .then(arrData => {
      //console.log(arrData.data.length);
      this.state.listData= skip===0?arrData.data:this.state.listData.concat(arrData.data);
      this.state.isLoad=false;
      this.state.isRefresh=false;
      this.state.pullToRefresh=arrData.data.length<20?false:true;
      this.state.noData= arrData.data.length===0 ? this.state.lang.not_found : '' ;
      this.setState(this.state);
    })
    .catch(err => console.log(err));
  }

  saveLocation(){
    this.setState({isRefresh:false},()=>{
      checkLocation().then((e)=>{
        //console.log('isRefresh',this.state.isRefresh);
        this.getContentByDist(e.idDist,this.state.id_sub,this.state.id_serv);
        this.setState({showLoc:!this.state.showLoc,id_city:e.idCity,idDist:e.idDist,labelLoc:e.nameDist});
      });
    })

  }

   refresh(){
     checkLogin().then(e=>{
       if(e.id!==undefined){
         this.setState({user_id:e.id});
       }
     });
   }


  getPosition(lat,lng){
    const url = `${global.url}${'get-position?location='}${lat},${lng}`;
    //console.log('url',url);
    getApi(url).then(e=>{
      //console.log('e.data',e);
      const { isRefresh,id_sub,id_serv } = this.state;
      const { district,city,country } = e.data[0];
      if(isRefresh) this.getContentByDist(district,id_sub,id_serv,null);

      district!==0 && district!==undefined && this.setState({
        idDist:district,
      });
      const url1 = `${global.url}${'district/'}${district}`;
      //console.log(url1);
      getApi(url1).then(dist=>{
        //console.log('dist.data.name',dist.data[0].name);
          dist.data[0].name!=='' && dist.data[0].name!==undefined && this.setState({
            labelLoc:dist.data[0].name,
            id_city:city,
          });
      })
    })
  }

   componentWillMount(){
     this.props.isLogin && this.refresh();
     this.props.detailBack && this.setState({pullToRefresh:true},()=>{
       this.props.dispatch({type:'DETAIL_BACK',detailBack:false});
     });
   }

   componentDidMount(){
     const { labelCat } = this.props.navigation.state.params || '';
     //console.log('labelCat',labelCat);
     if(labelCat!==undefined) this.setState({labelCat});
     //if(service_items!==undefined) this.setState({service_items});
     //this.setState({pullToRefresh:true});
     //console.log('componentDidMount',this.props.updateState);
   }
  requestLogin(){
    const {navigate} = this.props.navigation;
    if(this.props.isLogin===false){
      navigate('LoginScr');
    }

  }
  saveLike(id){
    //console.log('like');
    const {user_id,page} = this.state;
    if(this.props.isLogin===false){ this.requestLogin();}else {
      getApi(`${global.url}${'like'}${'?content='}${id}${'&user='}${user_id}`).then(e=>{
          this.onRefresh(0);
        }
      );
    }

  }
  saveSubCate(id_cat,id_sub,labelCat,labelSubCat,service_items){
    if(labelSubCat!=='') labelCat=labelSubCat;
    this.setState({id_cat,id_sub,labelCat,service_items},()=>{
        this.getContentByDist(this.state.idDist,id_sub,this.state.id_serv);
    })
  }

  saveService(arr){
    clearTimeout(timeout);
    let labelSer=[],id_serv=[];
    arr.length>0 && arr.forEach(e=>{
      if(e[1]){
        if( !isNaN(parseFloat(e[0])) ){
          id_serv = id_serv.concat(e[1]);
        }else {
          labelSer = labelSer.concat(e[1]);
        }
      }
    });

    this.setState({
      labelSer:labelSer.length===0 ? 'Dịch vụ' :labelSer.toString(),
      id_serv: id_serv.length===0 ? '' : id_serv.toString(),
    },()=>{
      timeout = setTimeout(()=>{
        //this.getCategory();
        this.getContentByDist(this.state.idDist,this.state.id_sub,id_serv);
      },800)
    })

  }

  saveVote(rate,id){
    const {idDist,id_sub,id_serv,page,user_id}=this.state;
    if(this.props.isLogin===false){this.requestLogin();}else {
      const url =`${global.url}${'vote?content='}${id}${'&user='}${user_id}${'&point='}${rate}`;
      getApi(url).then(e=>{
        this.onRefresh(page);
      }
      );
    }
  }
  renderFooter = () => {
    if (!this.state.isLoad) return null;
    return (
    this.state.isLoad &&
    <View style={{alignItems:'center'}}>
      <ActivityIndicator color="#d0021b" size="large" />
    </View>)
  }
  componentDidUpdate(){
    if(this.props.updateState){
        this.props.dispatch({type:'STOP_START_UPDATE_STATE',updateState:false})
        const {latitude,longitude} = this.props.yourCurLoc;
        this.getPosition(latitude,longitude);
    }
  }
  render() {
    //console.log('pullToRefresh',this.state.pullToRefresh);
    const {
      keyword,lang,idDist,id_sub,id_serv,isRefresh,
      listData,scrollToTop,noData,showCat,id_cat
    } = this.state;
    const { goBack,navigate,state } = this.props.navigation;
    //console.log('this.props.navigation',this.props);
    const {idCat,sub_cat,serv_items} = this.props.navigation.state.params;
    //console.log('lang');
    //console.log('state.key-ListLoc',state.key);
    const {
      container,btnScrollTop,
      headStyle, filterFrame,wrapFilter,headContent,imgLogoTop,
      inputSearch,show,hide,colorTextPP,colorNumPP,
      selectBoxBuySell,widthLoc,optionListLoc,OptionItemLoc,
      wrapListLoc,padLoc,flatItemLoc,imgFlatItem,wrapFlatRight,
      txtTitleOverCat,txtAddrOverCat,flatlistItemCat,wrapInfoOver,
      imgUpCreate,imgUpLoc,imgUpSubCat,imgUpInfo,popoverLoc,
      padCreate,overLayout,imgInfo,overLayoutLoc,shadown,overLayoutSer,listCatOver,listOverService,colorText,
      favIC,marRight,marRight5,
    } = styles;
    //console.log('this.props.navigation',this.props.navigation);



    return (
      <View style={container} onLayout={()=>{
        console.log('render',this.props.updateState);
        if(this.props.updateState){
            const {latitude,longitude} = this.props.yourCurLoc;
            this.getPosition(latitude,longitude);
            this.props.dispatch({type:'STOP_START_UPDATE_STATE',updateState:false})
        }
      }}>
      {scrollToTop && <TouchableOpacity style={btnScrollTop}
      onPress={()=>{
        this.refs.listPro.scrollToOffset({x: 0, y: 0, animated: true});
        this.setState({scrollToTop:false});
      }}>
      <Image source={topIC} style={{width:40,height:40}} />
      </TouchableOpacity>}
      <View style={headStyle}>
          <View style={headContent}>
          <TouchableOpacity
          onPress={()=>goBack()}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          >
          <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
          </TouchableOpacity>
              <Image source={logoTop} style={imgLogoTop} />
              <View></View>
          </View>
          <View style={{marginTop:Platform.OS==='ios' ? 7 : 10}}></View>
        <TextInput
        underlineColorAndroid='transparent' style={inputSearch}
        placeholder={lang.search}
        onChangeText={(keyword)=>this.setState({keyword})}
        onSubmitEditing={(event)=>{
          if(keyword!==''){
            this.getContentByDist(idDist,id_sub,id_serv);
          }
        }}
        value={keyword} />

        <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
        onPress={()=>{
          if (keyword!=='') {
            Keyboard.dismiss();
            this.getContentByDist(idDist,id_sub,id_serv);
          }
        }}>
          <Image style={{width:16,height:16,}} source={searchIC} />
        </TouchableOpacity>

      </View>

        <View style={wrapFilter}>
                <View style={filterFrame}>
                <TouchableOpacity
                  onPress={()=>this.setState({ showLoc:!this.state.showLoc,showCat:false,showServie:false, })}
                  style={[selectBoxBuySell,widthLoc]}>
                    <Text  numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelLoc}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>this.setState({ showCat:true,showServie:false, showLoc:false})}
                  style = {[selectBoxBuySell,widthLoc]}>
                    <Text  numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelCat}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>

                <TouchableOpacity
                onPress={()=>this.setState({ showCat:false,showServie:!this.state.showServie, showLoc:false})}
                style = {[selectBoxBuySell,widthLoc]}>
                    <Text numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelSer}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>
              </View>
        </View>

        <View style={[wrapListLoc,padLoc]}>
              <FlatList
                     ref="listPro"
                     onScroll={(e) => {
                       //console.log('e.nativeEvent',e.nativeEvent);
                       if(e.nativeEvent.contentOffset!==undefined){
                         if(e.nativeEvent.contentOffset.y > 0 ){
                           this.state.scrollToTop===false && this.setState({scrollToTop: true});
                         }else {
                           this.setState({scrollToTop: false});
                         }
                       }


                     }}
                     style={{marginBottom:Platform.OS==='ios' ? 130 : 150}}
                     ListEmptyComponent={<Text>{noData==='' ? `${'Loading ...'}` : noData }</Text> }
                     shouldItemUpdate={(props,nextProps)=>{
                        return props.item!==nextProps.item
                     }}
                     //refreshing={isRefresh}
                     extraData={this.state}
                     onEndReachedThreshold={0.01}
                     onEndReached={() => {this.onRefresh()}}
                     ListFooterComponent={this.renderFooter}
                     data={listData}
                     keyExtractor={(item,index) => index.toString()}
                     renderItem={({item}) => (
                       <View style={flatlistItemCat}>
                           <TouchableOpacity
                           onPress={()=>{
                             this.setState({pullToRefresh:false},()=>{
                               navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc:this.state.curLoc,lang:lang.lang})
                               //console.log('lang2',lang);
                             })
                           }}>
                             <Image style={imgFlatItem} source={{uri:`${global.url_media}${item.thumb}`}} />
                           </TouchableOpacity>
                           <View style={wrapInfoOver}>
                             <View>
                               <TouchableOpacity
                               onPress={()=>{
                                 this.setState({pullToRefresh:false},()=>{
                                   navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc:this.state.curLoc,lang:lang.lang})
                                 })
                               }}>
                                   <Text style={txtTitleOverCat} numberOfLines={2}>{item.name}</Text>
                               </TouchableOpacity>
                                   <Text style={txtAddrOverCat} numberOfLines={1}>{`${item.address}${', '}${item._district.name}${', '}${item._city.name}${', '}${item._country.name}`}</Text>
                             </View>

                               <View style={{flexDirection:'row'}}>
                                   <View style={{flexDirection:'row',paddingRight:5}}>
                                      <TouchableOpacity onPress={()=>this.saveLike(item.id)}>
                                     <Image style={{width:22,height:18,marginRight:5}} source={item.like>0 ? likeFullIcon : likeIC} />
                                     </TouchableOpacity>
                                     <Text>{item.like}</Text>
                                   </View>
                                   <View style={{paddingRight:5}}>
                                     <Text> | </Text>
                                   </View>
                                   <View  style={{flexDirection:'row',paddingRight:10}}>
                                     <Rating rate={1} showVote={item.vote} styleIMG={favIC} />

                                     <Text>{item.vote}</Text>
                                   </View>
                               </View>

                           </View>
                       </View>
                     )}
                   />
        </View>


        <Modal onRequestClose={() => null} transparent visible={this.state.showLoc}>
        <TouchableOpacity
        onPress={()=>this.setState({showLoc:!this.state.showLoc})}
        style={[popoverLoc,padCreate]}>
          <Image style={[imgUpCreate,imgUpLoc]} source={upDD} />
          <View style={[overLayout,shadown]}>
              <SelectLocation
              id_city={this.state.id_city}
              saveLocation={this.saveLocation.bind(this)} />
          </View>
          </TouchableOpacity>
        </Modal>

        <SelectCategory
        visible={showCat}
        saveSubCate={this.saveSubCate.bind(this)}
        idCat={id_cat}
        closeModal={()=>this.setState({showCat:false})}
        />

        <SelectService
        visible={this.state.showServie}
        data={serv_items}
        saveService={this.saveService.bind(this)}
        closeModal={()=>this.setState({showServie:false})}
        />

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    yourCurLoc:state.yourCurLoc,
    isLogin:state.isLogin,
    detailBack:state.detailBack,
    updateState:state.updateState,
  }
}
export default connect(mapStateToProps)(ListLocation);
