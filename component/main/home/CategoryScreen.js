/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity,FlatList,Alert} from 'react-native';
const {height, width} = Dimensions.get('window');

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

export class SubListCat extends Component{
  constructor(props) {
    super(props);

  }
  render(){
    const {name,tStyle,W,R,id,selected} = this.props;
    console.log('onSelected,id',selected,id);
    return (
      <TouchableOpacity onPress={this.props.onSelected}>
      <View style={selected===id ? R : W}>
      <Text style={tStyle}>#{name}</Text>
      </View>
      </TouchableOpacity>
    );
  }
}

export default class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curLocation:{
        latitude:0,
        longitude: 0,
        lat:0,
        lng: 0,
        latitudeDelta:  4,
        longitudeDelta: 1,
        latlng: '0,0',
      },
      selected:{},
      showInfoOver : false,
      id_subCat:null,
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


  }

  getCategory(idcat,idsub=null,loc){
    let url = `${global.url}${'content-by-category?category='}${idcat}${'&location='}${loc}${'&limit='}${'5000'}`;
    //console.log('url',url);
    if(idsub!==null) url += `${'&subcategory='}${idsub}`;
    getApi(url)
    .then(arrData => {
      //console.log('arrData',arrData);
        this.setState({ markers: arrData.data });
    })
    .catch(err => console.log(err));
  }

  getLoc(){
    //console.log('getloc',this.props.navigation.state.params.idCat);
    navigator.geolocation.getCurrentPosition(
          (position) => {
            //Alert.alert(position.coords.latitude.toString(),position.coords.latitude.toString());
            const id = this.props.navigation.state.params.idCat;
            const latlng = `${position.coords.latitude}${','}${position.coords.longitude}`;
            this.getCategory(id,null,latlng);
            this.setState({
              curLocation : {
                latitude:position.coords.latitude,
                longitude: position.coords.longitude,
                lat:position.coords.latitude,
                lng: position.coords.longitude,
                latitudeDelta:  0.0295,
                longitudeDelta: 0.0055,
                latlng:latlng,
              }
            });
            //console.log('this.props.navigation.state.params',this.props.navigation.state.params.idCat);
           },
           (error) => {
            getLocationByIP().then(e => {
              //Alert.alert(e.ip.toString());
            this.getCategory(this.props.navigation.state.params.idCat,`${e.latitude}${','}${e.longitude}`);
            this.setState({
              curLocation : {
                latitude:e.latitude,
                longitude: e.longitude,
                lat:e.latitude,
                lng: e.longitude,
                altitude: 7,
                latitudeDelta:  0.044422,
                longitudeDelta: 0.011121,
                latlng:`${e.latitude}${','}${e.longitude}`,
              }
            });
            });
          },
          {enableHighAccuracy: true, timeout: 3000, maximumAge: 3000}
    );
  }

  componentWillMount(){
   this.getLoc();
  }
  _onSelected(id,name,idCat){
    this.setState({id_subCat:id,name_subCat:name,
      selected: Object.assign(this.state.selected,{[id]:id}),
    });
    this.getCategory(idCat,id,this.state.curLocation.latlng);
    console.log('this.state.selected',this.state.selected[id]);
  }
  render() {

    const {navigate,goBack} = this.props.navigation;
    const { idCat, name_cat, sub_cat } = this.props.navigation.state.params;
    //console.log('sub_cat',sub_cat);
    //console.log("this.props.CategoryScreen=",util.inspect(this.props.navigation.state.key,false,null));
    const {
      container,
      headCatStyle, headContent,wrapIcRight,plusStyle,imgPlusStyle,
      popover,show,hide,overLayoutCat,shadown,colorText,listCatAll,listCatBG,listCatW,
      wrapContent,leftContent,rightContent,middleContent,imgContent,labelCat,
      imgFlatItem,catInfoOver,txtTitleOver,txtAddrOver,wrapInfoOver,
    } = styles;


    var timeout;
    return (
      <View style={container}>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=> goBack()}>
                <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center'}} >
                      <Text style={{color:'white',fontSize:16}}>{name_cat}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{
                  navigate('ListCatScr',{idCat,name_cat,id_subCat:this.state.id_subCat,name_subCat:this.state.name_subCat,sub_cat,latlng:this.state.curLocation.latlng});
                }}>
                <Image source={listIC} style={{width:16, height:20}} />
                </TouchableOpacity>
            </View>
        </View>

        <View style={{backgroundColor:'#fff',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity
        onPress={()=>{
         this.getCategory(idCat,null,this.state.curLocation.latlng)
         this.setState({id_subCat:null,name_subCat:''});
        }}
        style={[listCatAll,this.state.id_subCat===null ? listCatBG : '']}>
          <Text style={colorText}>#All</Text>
        </TouchableOpacity>

        <FlatList
           horizontal
           showsHorizontalScrollIndicator={false}
           keyExtractor={item => item.id}
           data={sub_cat}
           renderItem={({item}) => (

              <SubListCat
              onSelected={()=>this._onSelected(item.id,item.name,idCat)}
              selected={!!this.state.selected[item.id]}
              id={item.id}
              R={[listCatAll,listCatBG]}
              W={listCatAll}
              tStyle={colorText}
              name={item.name}
              />

        )} />
        </View>
        <MapView
            provider={PROVIDER_GOOGLE}
            style={{flex:1,position:'relative',zIndex:1}}
            region={this.state.curLocation }
            onRegionChange={()=>{clearTimeout(timeout);}}
            onRegionChangeComplete={(region)=>{
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
                  }
                });
                this.getCategory(idCat,this.state.id_subCat,`${region.latitude},${region.longitude}`);
              }, 2000);
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
            onPress={()=>navigate('DetailScr',{idContent:marker.id,lat:marker.lat,lng:marker.lng})}>
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
          radius={1000}
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
