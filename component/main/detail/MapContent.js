/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,Modal
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import logoMap from '../../../src/icon/Logo-map.png';
import normalScreenIC from '../../../src/icon/ic-normal-screen.png';
import fullScreenIC from '../../../src/icon/ic-full-screen.png';

import global from '../../../component/global';
import getApi from '../../../component/api/getApi';

const {width,height} = Dimensions.get('window');
export default class MapContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      coords:[],
      showFullScreen:false,
    }
  }
  getDirection(){
      //console.log('this.props.region.latlng',this.props.region.latlng);
      const {latitude,longitude} = this.props.curLoc;
      const mode = 'driving'; // 'walking';
      const origin = `${latitude},${longitude}`;
      const destination = this.props.region.latlng;
      const {distance} = this.props;
      //const APIKEY = 'AIzaSyCUNFe8ZC0csUZzlTHRQFPp7PjiAtQ6Z0M';
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}`;
      //console.log(url);
      getApi(url).then(e=> {
        if(e.routes[0].overview_polyline!==undefined){
          this.setState({
                  coords: this.decode(e.routes[0].overview_polyline.points) // definition below
            });
        }
      }).catch(e=>{});


  }
  decode(t,e){
    for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){
      a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;
      while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})
  }
  // componentDidMount(){
  //   const { curLoc,region,distance } = this.props;
  //   console.log('curLoc,region,distance',curLoc,region,distance);
  //   if(curLoc.latitude!==undefined && region.latitude!==undefined && distance<100000){
  //     this.getDirection()
  //   }
  // }
  render() {
    const { curLoc,region,distance } = this.props;
    const {showFullScreen} = this.state;

    //console.log('region',region);
    return (
    <View style={{width,height:height/2}}
    onLayout={()=>{
      if(curLoc.latitude!==undefined && region.latitude!==undefined && distance<100000){
        this.getDirection()
      }
    }}>
      {region.latitude!==undefined &&
        <MapView
          style={{flex:1,height:height/2,zIndex:10,alignSelf:'stretch'}}
          region={region}
          customMapStyle={global.style_map_ios}
          showsPointsOfInterest={false}
        >

        {curLoc.latlng!==undefined &&
          <MapView.Marker coordinate={{latitude: Number(curLoc.latitude),longitude: Number(curLoc.longitude)}} />}

        {this.state.coords[0]!==undefined &&
            <MapView.Polyline coordinates={this.state.coords} strokeWidth={4} strokeColor='#BE2827' />
        }
        <MapView.Marker
          coordinate={{
            latitude: Number(region.latitude),
            longitude: Number(region.longitude),
          }}
          image={ Platform.OS==='android' ? logoMap : null}
          >
          {Platform.OS==='ios' && <Image source={logoMap} style={{width:57,height:50}} />}
        </MapView.Marker>
        </MapView>}
        <TouchableOpacity onPress={()=>{
          this.setState({showFullScreen:true});
        }} style={{position:'absolute',zIndex:999,bottom:10,right:10,backgroundColor:'rgba(254,254,254,.8)'}}>
        <Image source={fullScreenIC} style={{width:30,height:30}} />
        </TouchableOpacity>

        <Modal visible={showFullScreen} transparent onRequestClose={() => null}>
        {region.latitude!==undefined &&
          <MapView
            style={{flex:1,height:height/2,zIndex:10,alignSelf:'stretch'}}
            region={region}
            customMapStyle={global.style_map_ios}
            showsPointsOfInterest={false}
          >

          {curLoc.latitude!==undefined &&
            <MapView.Marker coordinate={{latitude: Number(curLoc.latitude),longitude: Number(curLoc.longitude)}} />}

          {this.state.coords[0]!==undefined &&
              <MapView.Polyline coordinates={this.state.coords} strokeWidth={4} strokeColor='#BE2827' />
          }
          <MapView.Marker
            coordinate={{
              latitude: Number(region.latitude),
              longitude: Number(region.longitude),
            }}
            image={ Platform.OS==='android' ? logoMap : null}
            >
            {Platform.OS==='ios' && <Image source={logoMap} style={{width:57,height:50}} />}
          </MapView.Marker>
          </MapView>}

          <TouchableOpacity style={{position:'absolute',zIndex:999,bottom:10,right:10,backgroundColor:'rgba(254,254,254,.8)'}}
          onPress={()=>{this.setState({showFullScreen:false});}}>
          <Image source={normalScreenIC} style={{width:30,height:30}} />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
