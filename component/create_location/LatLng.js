/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import logoMap from '../../src/icon/Logo-map.png';
import global from '../global';
import styles from '../styles';
import getApi from '../api/getApi';
import getLocationByIP from '../api/getLocationByIP';

const {width,height} = Dimensions.get('window');
export default class LatLng extends Component {
  constructor(props){
    super(props);
    this.state={
      coords:[{latitude:0,longitude:0}],
      curLocation:{
        latitude:0,longitude:0,
        latitudeDelta:  0.008757,
        longitudeDelta: 0.010066,
      }
    }
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
              }
            });
            this.props.getLatLng(position.coords);
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
                  }
                });
                this.props.getLatLng(e);
            });
          },
          { timeout: 5000,maximumAge: 60000 },
    );
  }
  componentWillMount(){
    this.getLoc();
  }

  render() {

    const { headCatStyle, headContent,titleCreate } = styles;
    return (
      <View>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>this.props.closeModal()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                <Text style={titleCreate}> CHỌN VỊ TRÍ </Text>
                <View></View>
            </View>
        </View>
    <View style={{width,height}}>
      <MapView
          style={{flex:1,height,zIndex:10,alignSelf:'stretch'}}
          region={this.state.curLocation}
          customMapStyle={global.style_map_ios}
          showsPointsOfInterest={false}
          onPress={ (e) => {
            this.props.getLatLng(e.nativeEvent.coordinate);
            this.setState({curLocation:{
              latitude:e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              lat:e.nativeEvent.coordinate.latitude,
              lng: e.nativeEvent.coordinate.longitude,
              latitudeDelta:  0.008757,
              longitudeDelta: 0.010066,
            }});
          }}

          //onRegionChange={()=>this.onRegionChange()}
        >
        <MapView.Marker
          draggable
          coordinate={{
            latitude: Number(this.state.curLocation.latitude),
            longitude: Number(this.state.curLocation.longitude),
          }}
          onPress={ (event) => //console.log(event.nativeEvent.coordinate) }
          onDragEnd={(e) => {
            this.props.getLatLng(e.nativeEvent.coordinate);
            this.setState({curLocation:{
              latitude:e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              lat:e.nativeEvent.coordinate.latitude,
              lng: e.nativeEvent.coordinate.longitude,
              latitudeDelta:  0.008757,
              longitudeDelta: 0.010066,
            }});
          }}
          />

        </MapView>
        </View>
      </View>
    );
  }
}
