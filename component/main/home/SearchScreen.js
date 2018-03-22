/* @flow */

import React, { Component } from 'react';
import {Keyboard, Platform, View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity,FlatList,Alert} from 'react-native';
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
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import plusIC from '../../../src/icon/ic-home/ic-plus.png';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curLocation:{
        latitude:this.props.navigation.state.params.lat,
        longitude: this.props.navigation.state.params.lng,
        lat:this.props.navigation.state.params.lat,
        lng: this.props.navigation.state.params.lng,
        latitudeDelta:  0.008757,
        longitudeDelta: 0.010066,
        latlng: '0,0',
      },
      curLoc : {
        latitude:this.props.navigation.state.params.lat,
        longitude: this.props.navigation.state.params.lng,
        lat:this.props.navigation.state.params.lat,
        lng: this.props.navigation.state.params.lng,
        latitudeDelta:  0.008757,
        longitudeDelta: 0.010066,
        latlng:`${this.props.navigation.state.params.lat},${this.props.navigation.state.params.lng}`,
      },
      markers:[{
        id : 1,
        lat:this.props.navigation.state.params.lat,
        lng: this.props.navigation.state.params.lng,
        name: '',
        _district:{name:''},
        _city:{name:''},
        _country:{name:''},
        _category_type:{marker:''},
        address:'',
        avatar:'',
      },],
      keyword:this.props.navigation.state.params.keyword,
    }

  }

  getCategory(keyword,lat,lng){
    let url = `${global.url}${'search-content?keyword='}${keyword}${'&limit=5000'}${'&distance=500'}`;
    if(lat!==0 && lng!==0) url += `${'&location='}${lat},${lng}`;
    //console.log('url',url);
      getApi(url)
      .then(arrData => {
          this.setState({ markers: arrData.data,onchange:true,showInfoOver:true,
            curLocation : {
              latitude:lat,
              longitude: lng,
              lat:lat,
              lng: lng,
              latitudeDelta:  0.008757,
              longitudeDelta: 0.010066,
              latlng:`${lat},${lng}`,
            },
           });
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
                latlng,
              },
              curLoc : {
                latitude:position.coords.latitude,
                longitude: position.coords.longitude,
                lat:position.coords.latitude,
                lng: position.coords.longitude,
                latitudeDelta:  0.008757,
                longitudeDelta: 0.010066,
                latlng:latlng,
              },
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
    const { keyword,lat,lng } = this.props.navigation.state.params;
    this.getCategory(keyword,lat,lng);
  }

  onSubmitEdit = (keyword,latitude,longitude) => {
    this.getCategory(keyword,latitude,longitude);
  }

  render() {
    const { keyword, curLocation } = this.state;
    const {navigate,goBack} = this.props.navigation;
    const { lang } = this.props.navigation.state.params;
    const {
      container,imgLogoTop,inputSearch,
      headStyle, headContent,wrapIcRight,plusStyle,imgPlusStyle,serviceList,
      popover,show,hide,overLayoutCat,shadown,colorText,listCatAll,listCatBG,listCatW,
      wrapContent,leftContent,rightContent,middleContent,imgContent,labelCat,
      imgFlatItem,catInfoOver,txtTitleOver,txtAddrOver,wrapInfoOver,serviceOver,
    } = styles;


    let timeout;
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
              this.onSubmitEdit(keyword,curLocation.latitude,curLocation.longitude);
            }
          }}
          value={keyword}   />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (keyword!=='') {
              Keyboard.dismiss();
              this.onSubmitEdit(keyword,curLocation.latitude,curLocation.longitude);
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>

        </View>

        <MapView
            provider={PROVIDER_GOOGLE}
            style={{width,height}}
            region={this.state.curLocation}
            onPress={ (event) =>{
              const {latitude,longitude} = (event.nativeEvent.coordinate || this.state.curLocation);
              this.getCategory(keyword,latitude,longitude);
            }}
            customMapStyle={global.style_map}
            showsPointsOfInterest={false}
          >
          {this.state.markers.map((marker,index) => (
            <MapView.Marker
              key={marker.id}
              coordinate={{
                latitude: Number(marker.lat),
                longitude: Number(marker.lng),
              }}
            >
            <Image source={{uri:`${global.url_media}${marker._category_type.marker}`}} style={{width:48,height:54,position:'relative'}} />
            <MapView.Callout onPress={()=>navigate('DetailScr',{idContent:marker.id,lat:marker.lat,lng:marker.lng,curLoc:this.state.curLoc,lang})}
            >
              <TouchableOpacity>
              <View style={{height: 45,width: 300,alignItems:'center',borderRadius:3}}>
              <Text numberOfLines={1} style={{fontWeight:'bold'}}>{marker.name}</Text>
              <Text numberOfLines={1}>{`${marker.address}${', '}${marker._district.name}${', '}${marker._city.name}${', '}${marker._country.name}`}</Text>
              </View>
              </TouchableOpacity>
            </MapView.Callout>

            </MapView.Marker>
          )
        )}
        <MapView.Circle
          center={this.state.curLocation}
          radius={500}
          lineCap="butt"
          strokeWidth={1}
          fillColor="rgba(0, 0, 0, 0.1))"
          strokeColor="rgba(0, 0, 0, 0))"/>
          <MapView.Marker
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
