/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,Modal
} from 'react-native';
import {connect} from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import logoMap from '../../../src/icon/Logo-map.png';
import normalScreenIC from '../../../src/icon/ic-normal-screen.png';
import fullScreenIC from '../../../src/icon/ic-full-screen.png';

//import getLocationByIP from '../../api/getLocationByIP';
import global from '../../global';
import getApi from '../../api/getApi';

const {width,height} = Dimensions.get('window');

class MapContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      coords:[],
      showFullScreen:false,
      direct:this.props.region,
    }
  }
  getDirection(){
      //console.log('this.props.region.latlng',this.props.region.latlng);
      const {latitude,longitude} = this.props.yourCurLoc;

      const mode = 'driving'; // 'walking';
      const origin = `${latitude},${longitude}`;
      const destination = this.props.region.latlng;
      const {distance} = this.props;
      if(this.state.direct===destination) return;
      this.setState({direct:this.props.region.latlng})
      //const APIKEY = 'AIzaSyCCCOoPlN2D-mfrYEMWkz-eN7MZnOsnZ44';
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}`;
      //console.log(url);
      latitude!==undefined && getApi(url).then(e=> {
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

  render() {
    const { yourCurLoc,region,distance,lang } = this.props;
    const {showFullScreen,direct} = this.state;
    //console.log(yourCurLoc);
    //console.log('lang',lang);
    //console.log('region',region.latlng);
    //console.log('yourCurLoc',yourCurLoc.latitude,yourCurLoc.longitude);
    return (
      <View>
    {yourCurLoc.latitude!==undefined ?
    <View style={{width,height:height/2}} >
      {region.latitude!==undefined &&
        <MapView
          style={{flex:1,height:height/2,zIndex:10,alignSelf:'stretch'}}
          region={region}
          onRegionChangeComplete={()=>{
            this.getDirection();
          }}
          customMapStyle={global.style_map_ios}
          showsPointsOfInterest={false}
        >

        {yourCurLoc.latitude!==undefined &&
          <MapView.Marker coordinate={{latitude: Number(yourCurLoc.latitude),longitude: Number(yourCurLoc.longitude)}} />}

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

          {yourCurLoc.latitude!==undefined &&
            <MapView.Marker coordinate={{latitude: Number(yourCurLoc.latitude),longitude: Number(yourCurLoc.longitude)}}>
            </MapView.Marker>
          }

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
      :
      <View onLayout={()=>this.findLoc()}></View>
    }
    </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {yourCurLoc:state.yourCurLoc}
}
export default connect(mapStateToProps)(MapContent);
