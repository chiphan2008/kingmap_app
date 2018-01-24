/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import logoMap from '../../../src/icon/Logo-map.png';
import global from '../../../component/global';
import getApi from '../../../component/api/getApi';

const {width,height} = Dimensions.get('window');
export default class MapContent extends Component {
  constructor(props){
    super(props);
    this.state={
      coords:[{latitude:0,longitude:0}],
    }
  }
  getDirection(){
      //console.log(this.props.curLoc.latlng);
      const mode = 'driving'; // 'walking';
      const origin = this.props.curLoc.latlng;
      const destination = this.props.region.latlng;
      //const APIKEY = 'AIzaSyCUNFe8ZC0csUZzlTHRQFPp7PjiAtQ6Z0M';
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}`;
      getApi(url).then(e=> {
          this.setState({
                  coords: this.decode(e.routes[0].overview_polyline.points) // definition below
              });
      }).catch();
  }
  decode(t,e){
    for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){
      a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;
      while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})
  }
  render() {

    return (
    <View onLayout={()=>this.getDirection()} style={{width,height:height/2}}>
      <MapView
          style={{flex:1,height:height/2,zIndex:10,alignSelf:'stretch'}}
          region={this.props.region}
          customMapStyle={global.style_map_ios}
          showsPointsOfInterest={false}
        >
        <MapView.Marker
          coordinate={{
            latitude: Number(this.props.curLoc.latitude),
            longitude: Number(this.props.curLoc.longitude),
          }}
          />
        <MapView.Polyline
          coordinates={this.state.coords}
          strokeWidth={4}
          strokeColor='#BE2827'
          />
        <MapView.Marker
          coordinate={{
            latitude: Number(this.props.region.latitude),
            longitude: Number(this.props.region.longitude),
          }}
          >
          <Image source={logoMap} style={{width:57,height:50}} />
        </MapView.Marker>
        </MapView>
      </View>
    );
  }
}
