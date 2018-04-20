/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity,FlatList,Alert} from 'react-native';
const {height, width} = Dimensions.get('window');

import accessLocation from '../../api/accessLocation';
import getApi from '../../api/getApi';
import getLocationByIP from '../../api/getLocationByIP';
import global from '../../global';
import arrTest from '../../arrTest';
import styles from '../../styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import sortDown from '../../../src/icon/ic-white/sort-down.png';
import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import listIC from '../../../src/icon/ic-white/ic-list.png';
import logoMap from '../../../src/icon/Logo-map.png';
import plusIC from '../../../src/icon/ic-home/ic-plus.png';

export default class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curLocation:{
        latitude:0,
        longitude: 0,
        lat:0,
        lng: 0,
        latitudeDelta:  0.008757,
        longitudeDelta: 0.010066,
        latlng: '0,0',
      },
      curLoc:{},
      onchange:false,
      showInfoOver : true,
      showServOver : false,
      id_subCat:this.props.navigation.state.params.idSub,
      id_service:null,
      name_subCat:'Tất cả',
      markers:[{
        id : 1,
        lat: 0,
        lng: 0,
        name: '',
        _district:{name:''},
        _city:{name:''},
        _country:{name:''},
        _category_type:{marker:''},
        address:'',
        avatar:'',
      },],
    }
    accessLocation();

  }

  getCategory(idcat,idsub=null,idservice=null,loc){
    let url = `${global.url}${'search-content?category='}${idcat}${'&location='}${loc}${'&limit=5000'}${'&distance=500'}`;
    if(idsub===null) idsub=this.state.id_subCat;
    url += `${'&subcategory='}${idsub}`;
    if(idservice!==null){
      const item=this.state.id_service===null ? idservice : `${this.state.id_service},${idservice}`;
      //console.log('[this.state.id_service].indexOf(idservice)',`${this.state.id_service}`.indexOf(idservice));
      if ( `${this.state.id_service}`.indexOf(idservice)===-1 ){
        this.setState({id_service: item})
        url += `${'&service='}${item}`;
      }else{
        url += `${'&service='}${this.state.id_service}`;
      }

    }

      getApi(url)
      .then(arrData => {
          this.setState({ markers: arrData.data,onchange:true,showInfoOver:true });
      })
      .catch(err => console.log(err));
  }

  getLoc(){
    navigator.geolocation.getCurrentPosition(
          (position) => {
            //console.log('position');
            const latlng = `${position.coords.latitude}${','}${position.coords.longitude}`;
            this.setState({
              curLocation : {
                latitude:position.coords.latitude,
                longitude: position.coords.longitude,
                lat:position.coords.latitude,
                lng: position.coords.longitude,
                latitudeDelta:  0.008757,
                longitudeDelta: 0.010066,
                latlng:latlng,
              },
              curLoc : {
                latitude:position.coords.latitude,
                longitude: position.coords.longitude,
                lat:position.coords.latitude,
                lng: position.coords.longitude,
                latitudeDelta:  0.008757,
                longitudeDelta: 0.010066,
                latlng:latlng,
              }
            });
           },
           (error) => {
             //console.log('getLocationByIP');
            getLocationByIP().then((e) => {
                this.setState({
                  curLocation : {
                    latitude:e.latitude,
                    longitude: e.longitude,
                    lat:e.latitude,
                    lng: e.longitude,
                    latitudeDelta:  0.008757,
                    longitudeDelta: 0.010066,
                    latlng:`${e.latitude}${','}${e.longitude}`,
                  },
                  curLoc : {
                    latitude:e.latitude,
                    longitude: e.longitude,
                    lat:e.latitude,
                    lng: e.longitude,
                    latitudeDelta:  0.008757,
                    longitudeDelta: 0.010066,
                    latlng:`${e.latitude}${','}${e.longitude}`,
                  }
                });
            });
          },
          {enableHighAccuracy: true, timeout: 3000, maximumAge: 3000}
    );
  }

  componentWillMount(){
    //console.log('componentWillMount');
   this.getLoc();
  }

  _onSelectSub(idCat,id,name,timeout){
    //console.log('_onSelectSub');
    clearTimeout(timeout);
    this.setState({id_subCat:id,name_subCat:name,showServOver:true});
    if(this.state.onchange){
      this.getCategory(idCat,id,null,this.state.curLocation.latlng);
    }
  };
  _onSelectServ(idCat,idsub,id,timeout){
    //console.log('_onSelectServ');
    clearTimeout(timeout);
    if(this.state.onchange){
      this.getCategory(idCat,idsub,id,this.state.curLocation.latlng);
    }
  };

  render() {
    //console.log('render',this.state.markers.length);
    const {navigate,goBack} = this.props.navigation;
    const { idCat, name_cat, sub_cat, serviceItem, lang } = this.props.navigation.state.params;
    //console.log('lang',lang);
    //console.log("this.props.CategoryScreen=",util.inspect(this.props.navigation.state.key,false,null));
    const {
      container,
      headCatStyle, headContent,wrapIcRight,plusStyle,imgPlusStyle,serviceList,
      popover,show,hide,overLayoutCat,shadown,colorText,listCatAll,listCatBG,listCatW,
      wrapContent,leftContent,rightContent,middleContent,imgContent,labelCat,
      imgFlatItem,catInfoOver,txtTitleOver,txtAddrOver,wrapInfoOver,serviceOver,
    } = styles;


    let timeout;
    return (
      <View style={container}>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=> goBack()}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center'}} >
                      <Text style={{color:'white',fontSize:16}}>{name_cat}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{
                  navigate('ListCatScr',{idCat,name_cat,id_subCat:this.state.id_subCat,name_subCat:this.state.name_subCat,id_service:this.state.id_service,sub_cat,latlng:this.state.curLocation.latlng,lang});
                }}>
                <Image source={listIC} style={{width:16, height:20}} />
                </TouchableOpacity>
            </View>
        </View>
        <View style={[serviceOver,this.state.showInfoOver ? show : hide]}>
        <View style={{backgroundColor:'#fff',flexDirection:'row',justifyContent:'center',alignItems:'center',}}>


        <FlatList
           horizontal
           extraData={this.state}
           showsHorizontalScrollIndicator={false}
           keyExtractor={item => item.id}
           data={sub_cat}
           renderItem={({item}) => (
             <TouchableOpacity onPress={()=>{this._onSelectSub(idCat,item.id,item.name,timeout)}}>
             <View style={[listCatAll,this.state.id_subCat===item.id ? listCatBG : '']}>
             <Text style={colorText}>{item.name}</Text>
             </View>
             </TouchableOpacity>

        )} />
        </View>

        <View style={[serviceList,this.state.showServOver ? show : hide]}>
        <TouchableOpacity
        onPress={()=>{
          this.getCategory(idCat,this.state.id_subCat,null,this.state.curLocation.latlng);
          this.setState({id_service:null});
        }}
        style={[listCatAll,listCatBG]}>
          <Text style={colorText}>{lang.all}</Text>
        </TouchableOpacity>

        <FlatList
           horizontal
           extraData={this.state}
           showsHorizontalScrollIndicator={false}
           keyExtractor={item => item.id}
           data={serviceItem}
           renderItem={({item}) => (
             <TouchableOpacity onPress={()=>{this._onSelectServ(idCat,this.state.id_subCat,item.id,timeout)}}>
             <View style={[listCatAll,listCatBG]}>
             <Text style={colorText}>{`${this.state.id_service}`.includes(item.id) ? '#' : ''}{item.name}</Text>
             </View>
             </TouchableOpacity>

        )} />
        </View>

        </View>

        <MapView
            moveOnMarkerPress={false}
            provider={PROVIDER_GOOGLE}
            style={{flex:1,position:'relative',zIndex:1}}
            region={this.state.curLocation}
            onRegionChange={clearTimeout(timeout)}
            onRegionChangeComplete={(region)=>{
              //console.log('onRegionChangeComplete');
              if(this.state.curLocation.lng!==0){
              timeout = setTimeout(()=>{
                this.setState({
                  curLocation : {
                    latitude:region.latitude,
                    longitude: region.longitude,
                    lat:region.latitude,
                    lng: region.longitude,
                    latitudeDelta:region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                    latlng:`${region.latitude},${region.longitude}`,
                  },
                  onchange:false,
                  showInfoOver:false,
                  showServOver:false,
                });
                this.getCategory(idCat,this.state.id_subCat,this.state.id_service,`${region.latitude},${region.longitude}`);
              }, 2000);
            }
            }}
            customMapStyle={global.style_map}
            showsPointsOfInterest={false}
          >
          {this.state.markers.map((marker,index) => {
            return (
            <MapView.Marker
              key={marker.id}
              coordinate={{
                latitude: Number(marker.lat),
                longitude: Number(marker.lng),
              }}

            >
            <Image source={{uri:`${global.url_media}${marker._category_type.marker}`}} style={{width:48,height:54}} />

            <MapView.Callout
            onPress={()=>navigate('DetailScr',{idContent:marker.id,lat:marker.lat,lng:marker.lng,curLoc:this.state.curLoc,lang})}>
              <TouchableOpacity >
              <View style={{height: 45,width: 300,alignItems:'center',borderRadius:3}}>
              <Text numberOfLines={1} style={{fontWeight:'bold'}}>{marker.name}</Text>
              <Text numberOfLines={1}>{`${marker.address}${', '}${marker._district.name}${', '}${marker._city.name}${', '}${marker._country.name}`}</Text>
              </View>
              </TouchableOpacity>
            </MapView.Callout>

            </MapView.Marker>
          )
        })}
        <MapView.Circle
          center={this.state.curLocation}
          radius={500}
          lineCap="butt"
          strokeWidth={1}
          fillColor="rgba(0, 0, 0, 0.1))"
          strokeColor="rgba(0, 0, 0, 0))"/>

          <MapView.Marker
            draggable
            coordinate={{
              latitude: Number(this.state.curLocation.latitude),
              longitude: Number(this.state.curLocation.longitude),
            }}
            />

          </MapView>
          <TouchableOpacity style={plusStyle}>
              <Image source={plusIC} style={imgPlusStyle} />
          </TouchableOpacity>

      </View>
    );
  }
}
