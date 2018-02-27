/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,Modal,
  FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import styles from '../../styles';
import getApi from '../../api/getApi';
import getLanguage from '../../api/getLanguage';
import getLocationByIP from '../../api/getLocationByIP';
import global from '../../global';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import SelectLocation from '../../main/location/SelectLocation';
import checkLocation from '../../api/checkLocation';

import upDD from '../../../src/icon/ic-white/ic-dropdown_up.png';
import sortDownIC from '../../../src/icon/ic-sort-down.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import likeIC from '../../../src/icon/ic-like.png';
import favoriteIC from '../../../src/icon/ic-favorite.png';
import checkIC from '../../../src/icon/ic-green/ic-check.png';


export default class ListLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: {},
      labelLoc : "Địa điểm",
      labelCat : "Danh mục",
      labelSer : "Dịch vụ",
      valueLoc : 0,
      valueCat : 0,
      valueSer : 0,
      curLocation : {
        latlng:'',
      },
      showLoc:false,
      listData:[],
      listSubCat:{
        arr:[],
        check:'',
        showList:false,
      },
      listSerItem:{
        arr:[],
        check:'',
        showList:false,
      },
      showServie:{},
      idDist:null,
      id_sub:null,
      id_serv:null,
      markers:[{
        id : 1,
        lat: 10.780843591000904,
        lng: 106.67830749999996,
        name: '',
        _district:{name:''},
        _city:{name:''},
        _country:{name:''},
        _category_type:{marker:''},
        address:'',
        avatar:'',
      },],
    }
    getLanguage().then((e)=>{
      e.valueLang==='en' ? this.setState({lang:lang_en}) : this.setState({lang:lang_vn});
    });
  }

  getCategory(idcat,loc){
    //console.log('idcat,loc',idcat,loc);
    const url = global.url+'content-by-category?category='+idcat+'&location='+loc;
    //console.log('url',url);
    getApi(url)
    .then(arrData => {
      //console.log('arrData',arrData);
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }

  getContentByDist(id_district,id_sub,id_serv){
    const id_cat = this.props.navigation.state.params.idCat;
    var url = `${global.url}${'search-content?category='}${id_cat}`;
    if(id_district===null){
      url += `${'&location='}${this.state.curLocation.latlng}`;
    }else {
      url += `${'&district='}${id_district}`;
    }

    if(id_sub!==null)      url += `${'&subcategory='}${id_sub}`;
    if(id_serv!==null){
      this.setState({id_serv: id_serv});
      url += `${'&service='}${id_serv}`;
    }
    //console.log('-----url-----',url);
    getApi(url)
    .then(arrData => {
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }

  saveLocation(){
    checkLocation().then((e)=>{
      //console.log('saveLocation',e);
      this.getContentByDist(e.idDist,this.state.id_sub,this.state.id_serv);
      this.setState({showLoc:!this.state.showLoc,idDist:e.idDist,labelLoc:e.nameDist});
    });
  }

  componentDidMount() {
    const id = this.props.navigation.state.params.idCat;
    navigator.geolocation.getCurrentPosition((position) => {
            const latlng = `${position.coords.latitude}${','}${position.coords.longitude}`;
            this.getCategory(id,latlng);
            this.setState({
              curLocation : {
                latlng:latlng,
              }
            });
           },
           (error) => {
             //console.log('error',id);
             getLocationByIP().then(e => this.getCategory(id,`${e.latitude}${','}${e.longitude}`));
             //console.log('ip',ip.latitude);
          },
          {enableHighAccuracy: true, timeout: 3000, maximumAge: 3000}
    );
  }

  render() {
    const {navigate,setParams} = this.props.navigation;
    const {idCat,sub_cat,serv_items,lang} = this.props.navigation.state.params;
    //console.log("this.props.ListLocation=",util.inspect(this.props.navigation,false,null));
    const {
      container,
      headLocationStyle, filterFrame,wrapFilter,
      inputSearch,show,hide,colorTextPP,colorNumPP,
      selectBoxLoc,optionListLoc,OptionItemLoc,
      wrapListLoc,flatItemLoc,imgFlatItem,wrapFlatRight,
      txtTitleOverCat,txtAddrOverCat,flatlistItemCat,wrapInfoOver,
      imgUp,imgUpLoc,imgUpSubCat,imgUpInfo,popoverLoc,paddingLoc,overLayout,imgInfo,overLayoutLoc,shadown,overLayoutSer,listCatOver,listOverService,colorText
    } = styles;
    //console.log('lang',this.props.lang);
    return (
      <View style={container}>

        <View style={headLocationStyle}>
          <TextInput underlineColorAndroid='transparent' placeholder={this.state.lang.search} style={inputSearch} />
          <Image style={{width:16,height:16,top:Platform.OS==='ios' ? -26 : -32,left:(width-80)/2}} source={searchIC} />
        </View>

        <View style={wrapFilter}>

                <View style={filterFrame}>
                <TouchableOpacity
                  onPress={()=>this.setState({ showLoc:!this.state.showLoc,listSubCat:{showList:false},listSerItem:{showList:false}, })}
                  style={selectBoxLoc}>
                    <Text style={{color:'#303B50'}}>{this.state.labelLoc}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>this.setState({ listSubCat:{showList:!this.state.listSubCat.showList},listSerItem:{showList:false}, showLoc:false})}
                  style = {selectBoxLoc}>
                    <Text style={{color:'#303B50'}}>{this.state.labelCat}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>

                <TouchableOpacity
                onPress={()=>this.setState({ listSubCat:{showList:false},listSerItem:{showList:!this.state.listSerItem.showList}, showLoc:false})}
                style = {selectBoxLoc}>
                    <Text numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelSer}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>
              </View>
        </View>

        <View style={wrapListLoc}>
              <FlatList
                     style={{marginBottom:100}}
                     ListEmptyComponent={<Text>Loading ...</Text>}
                     data={this.state.listData}
                     keyExtractor={item => item.id}
                     renderItem={({item}) => (
                       <View style={flatlistItemCat}>
                           <TouchableOpacity
                           onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc:{latitude:item.lat,longitude:item.lng},lang})}
                           >
                             <Image style={imgFlatItem} source={{uri:`${global.url_media}${item.avatar}`}} />
                           </TouchableOpacity>
                           <View style={wrapInfoOver}>
                             <View>
                               <TouchableOpacity
                               onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng})}
                               >
                                   <Text style={txtTitleOverCat} numberOfLines={2}>{item.name}</Text>
                               </TouchableOpacity>
                                   <Text style={txtAddrOverCat} numberOfLines={1}>{`${item.address}${', '}${item._district.name}${', '}${item._city.name}${', '}${item._country.name}`}</Text>
                             </View>

                               <View style={{flexDirection:'row'}}>
                                   <View style={{flexDirection:'row',paddingRight:10}}>
                                     <Image style={{width:22,height:18,marginRight:5}} source={likeIC} />
                                     <Text>{item.like}</Text>
                                   </View>
                                   <View style={{paddingRight:10}}>
                                     <Text> | </Text>
                                   </View>
                                   <View  style={{flexDirection:'row',paddingRight:10}}>
                                     <Image style={{width:18,height:18,marginRight:5}} source={favoriteIC} />
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
        style={[popoverLoc,paddingLoc]}>
          <Image style={[imgUp,imgUpLoc]} source={upDD} />
          <View style={[overLayout,shadown]}>
              <SelectLocation saveLocation={this.saveLocation.bind(this)} />
          </View>
          </TouchableOpacity>
          </Modal>

        <Modal onRequestClose={() => null} transparent visible={this.state.listSubCat.showList}>
        <TouchableOpacity
        onPress={()=>this.setState({listSubCat:{showList:!this.state.listSubCat.showList}})}
        style={[popoverLoc,paddingLoc]}>
        <Image style={[imgUp,imgUpSubCat]} source={upDD} />
            <View style={[overLayoutLoc,shadown]}>

            <FlatList
               keyExtractor={item => item.id}
               data={sub_cat}
               renderItem={({item}) => (
                 <TouchableOpacity
                 onPress={()=>{
                   this.getContentByDist(this.state.idDist,item.id,this.state.id_serv);
                   this.setState({listSubCat:{showList:!this.state.listSubCat.showList},id_sub:item.id,labelCat:item.name});
               }}
                 style={listCatOver}>
                   <Text style={colorText}>{item.name}</Text>
               </TouchableOpacity>
            )} />

            <TouchableOpacity
                onPress={()=>{
                  this.getContentByDist(this.state.idDist,null,this.state.id_serv);
                  this.setState({listSubCat:{showList:!this.state.listSubCat.showList},id_sub:null});
              }}
                style={listCatOver}>
                  <Text style={colorText}>Tất cả</Text>
          </TouchableOpacity>

            </View>
        </TouchableOpacity>
        </Modal>

        <Modal onRequestClose={() => null} transparent visible={this.state.listSerItem.showList}>
        <TouchableOpacity
        onPress={()=>this.setState({listSerItem:{showList:!this.state.listSerItem.showList}})}
        style={[popoverLoc,paddingLoc]}>
        <Image style={[imgUp,imgUpInfo]} source={upDD} />
            <View style={[overLayout,shadown]}>

            <FlatList
               extraData={this.state}
               keyExtractor={(item, index) => index}
               data={serv_items}
               renderItem={({item}) => (
              <View  style={listOverService}>
              <TouchableOpacity
                 onPress={()=>{
                  let idServ = this.state.id_serv===null ? item.id : `${this.state.id_serv}${', '}${item.id}`;
                  let labelServ = this.state.labelSer==='Dịch vụ' ? item.name : `${this.state.labelSer}${','}${item.name}`;
                  this.getContentByDist(this.state.idDist,this.state.id_sub,idServ);

                  if(this.state.showServie[`${item.id}`]!==item.id)
                    this.setState({ showServie: Object.assign(this.state.showServie,{[item.id]:item.id}),labelSer:labelServ });
                    //if(`${this.state.labelSer}`.includes(labelServ)) this.setState({labelSer:labelServ});

                  else
                    this.setState({showServie: Object.assign(this.state.showServie,{[item.id]:!item.id})});
                  }}
                  style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',}}
                >
                   <Text style={colorText}>{item.name}</Text>
                   <Image style={[imgInfo, this.state.showServie[`${item.id}`]===item.id  ? show : hide]} source={checkIC}/>

               </TouchableOpacity>
               </View>
            )} />

            <View style={listOverService}>
                <TouchableOpacity
                   onPress={()=>{
                    this.getContentByDist(this.state.idDist,this.state.id_sub,null);
                    this.setState({listSerItem:{showList:!this.state.listSerItem.showList},id_serv:null,labelSer:'Dịch vụ'});
                    }}
                  >
                     <Text style={colorText}>Tất cả</Text>
                 </TouchableOpacity>
             </View>

            </View>
        </TouchableOpacity>
        </Modal>

      </View>
    );
  }
}
