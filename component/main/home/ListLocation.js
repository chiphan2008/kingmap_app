/* @flow */

import React, { Component } from 'react';
import {Keyboard,Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,Modal,
  FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import styles from '../../styles';
import getApi from '../../api/getApi';
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
import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

export default class ListLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword:'',
      lang: this.props.navigation.state.params.lang==='vn' ? lang_vn : lang_en,
      labelLoc : "Địa điểm",
      labelCat : "Danh mục",
      labelSer : "Dịch vụ",
      valueLoc : 0,
      valueCat : 0,
      valueSer : 0,
      curLocation : {
        latlng:'',
      },
      curLoc:{},
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
      id_serv:'-1',

    }

  }

  getCategory(idcat,loc){
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

    const { keyword,curLocation } = this.state;
    if(keyword!==''){
      url += `${'&keyword='}${keyword}`;
    }
    if(id_district===null){
      url += `${'&location='}${curLocation.latlng}`;
    }else {
      url += `${'&district='}${id_district}`;
    }

    if(id_sub!==null) url += `${'&subcategory='}${id_sub}`;
    id_serv = id_serv.replace('-1,','');
    if(id_serv!=='' && id_serv!=='-1'){
      this.setState({id_serv});
      url += `${'&service='}${id_serv}`;
    }
    console.log('-----url-----',url);
    getApi(url)
    .then(arrData => {
      //console.log('count',arrData.data.length);
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
      //console.log('position');
            const latlng = `${position.coords.latitude}${','}${position.coords.longitude}`;
            this.getCategory(id,latlng);
            this.setState({
              curLocation : {
                latlng:latlng,
              },
              curLoc:{
                latlng:latlng,
                latitude:`${position.coords.latitude}`,
                longitude:`${position.coords.longitude}`,
              }
            });
           },
           (error) => {
             console.log('error',id);
             getLocationByIP().then(e => {
               this.setState({
                 curLoc:{
                   latlng:`${e.latitude},${e.longitude}`,
                   latitude:`${e.latitude}`,
                   longitude:`${e.longitude}`,
                 }
               });
               this.getCategory(id,`${e.latitude},${e.longitude}`)});
             //console.log('ip',ip.latitude);
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    );
  }

  render() {
    console.log('ListLocation');
    const { keyword,lang,idDist,id_sub,id_serv } = this.state;
    const { goBack,navigate } = this.props.navigation;
    const {idCat,sub_cat,serv_items} = this.props.navigation.state.params;
    //console.log('lang',lang);
    const {
      container,
      headStyle, filterFrame,wrapFilter,headContent,imgLogoTop,
      inputSearch,show,hide,colorTextPP,colorNumPP,
      selectBoxLoc,optionListLoc,OptionItemLoc,
      wrapListLoc,flatItemLoc,imgFlatItem,wrapFlatRight,
      txtTitleOverCat,txtAddrOverCat,flatlistItemCat,wrapInfoOver,
      imgUpCreate,imgUpLoc,imgUpSubCat,imgUpInfo,popoverLoc,padCreate,overLayout,imgInfo,overLayoutLoc,shadown,overLayoutSer,listCatOver,listOverService,colorText
    } = styles;
    //console.log('lang',this.props.lang);
    return (
      <View style={container}>

      <View style={headStyle}>
          <View style={headContent}>
          <TouchableOpacity
          onPress={()=>goBack()}
          >
          <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
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
                  onPress={()=>this.setState({ showLoc:!this.state.showLoc,listSubCat:{showList:false},listSerItem:{showList:false}, })}
                  style={selectBoxLoc}>
                    <Text  numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelLoc}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>this.setState({ listSubCat:{showList:!this.state.listSubCat.showList},listSerItem:{showList:false}, showLoc:false})}
                  style = {selectBoxLoc}>
                    <Text  numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelCat}</Text>
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
                     style={{marginBottom:190}}
                     ListEmptyComponent={<Text>Loading ...</Text>}
                     data={this.state.listData}
                     keyExtractor={item => item.id}
                     renderItem={({item}) => (
                       <View style={flatlistItemCat}>
                           <TouchableOpacity
                           onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc:this.state.curLoc,lang})}
                           >
                             <Image style={imgFlatItem} source={{uri:`${global.url_media}${item.avatar}`}} />
                           </TouchableOpacity>
                           <View style={wrapInfoOver}>
                             <View>
                               <TouchableOpacity
                               onPress={()=>navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc:this.state.curLoc,lang})}
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
        style={[popoverLoc,padCreate]}>
          <Image style={[imgUpCreate,imgUpLoc]} source={upDD} />
          <View style={[overLayout,shadown]}>
              <SelectLocation saveLocation={this.saveLocation.bind(this)} />
          </View>
          </TouchableOpacity>
          </Modal>

        <Modal onRequestClose={() => null} transparent visible={this.state.listSubCat.showList}>
        <TouchableOpacity
        onPress={()=>this.setState({listSubCat:{showList:!this.state.listSubCat.showList}})}
        style={[popoverLoc,padCreate]}>
        <Image style={[imgUpCreate,imgUpSubCat]} source={upDD} />
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
                  this.setState({listSubCat:{showList:!this.state.listSubCat.showList},id_sub:null,labelCat:'Danh mục'});
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
        style={[popoverLoc,padCreate]}>
        <Image style={[imgUpCreate,imgUpInfo]} source={upDD} />
            <View style={[overLayout,shadown]}>

            <FlatList
               extraData={this.state}
               keyExtractor={(item, index) => index}
               data={serv_items}
               renderItem={({item}) => (
              <View  style={listOverService}>
              <TouchableOpacity
                 onPress={()=>{
                  let idServ;
                  const arr = JSON.parse(`[${this.state.id_serv}]`);

                  if(this.state.id_serv==='-1'){ idServ=`-1,${item.id}`; }else{
                    if(arr.includes(item.id)){
                      remove(arr, item.id);idServ = arr.toString();
                      if(idServ==='') idServ='-1,';
                      }else {
                      idServ= `${this.state.id_serv},${item.id}`;
                    }
                  }
                  //console.log('idServ',idServ);
                  let lblArr;
                  if(this.state.labelSer!=='Dịch vụ'){
                    if( `${this.state.labelSer}`.includes(`${item.name}`) ){
                      lblArr = `${this.state.labelSer}`.replace(`,${item.name}`,'');
                      lblArr = `${this.state.labelSer}`.replace(`${item.name},`,'');
                      if( lblArr ===item.name) lblArr='Dịch vụ';
                    }else {
                      lblArr =`${this.state.labelSer},${item.name}`;
                    }
                  }
                  let labelSer = this.state.labelSer==='Dịch vụ' ? item.name : lblArr;
                  this.getContentByDist(this.state.idDist,this.state.id_sub,idServ);

                  if(this.state.showServie[`${item.id}`]!==item.id)
                    this.setState({
                      showServie: Object.assign(this.state.showServie,{[item.id]:item.id}), labelSer
                    });
                    //if(`${this.state.labelSer}`.includes(labelServ)) this.setState({labelSer:labelServ});
                  else
                    this.setState({
                      showServie: Object.assign(this.state.showServie,{[item.id]:!item.id}),labelSer
                    });
                  }}
                  style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
                >
                   <Text style={colorText}>{item.name}</Text>
                   <Image style={[imgInfo, this.state.showServie[`${item.id}`]===item.id  ? show : hide]} source={checkIC}/>

               </TouchableOpacity>
               </View>
            )} />

            <View style={listOverService}>
                <TouchableOpacity  style={{padding:15}}
                   onPress={()=>{
                    this.getContentByDist(this.state.idDist,this.state.id_sub,'-1,');
                    this.setState({listSerItem:{showList:!this.state.listSerItem.showList},id_serv:'-1',labelSer:'Dịch vụ'});
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
