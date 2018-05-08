/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,StyleSheet,Image,
  TouchableOpacity,Dimensions,Platform
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import global from '../../global';
import currentLocIC from '../../../src/icon/ic-current-location.png';
import minIC from '../../../src/icon/ic-min.png';
import addIC from '../../../src/icon/ic-add.png';
import normalScreenIC from '../../../src/icon/ic-normal-screen.png';
const {width,height} = Dimensions.get('window');

export default class MapFullScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      callout:{},
    }
  }
  render() {
    const {
      showFullScreen,
      curLocation,
      data,
      navigation,
      circleLoc,curLoc,lang,
    } = this.props;
    const {callout}=this.state;
    //console.log('curLocation',curLocation);
    const {btn,btnMap,btnMapZoom,btnMapFull,btnZoom,btnMapLoc,show,hide} = styles;
    return (
      <Modal visible={showFullScreen} transparent onRequestClose={() => null}>
      <View>
      {curLocation.latitude!==undefined ?

      <MapView
          provider={PROVIDER_GOOGLE}
          style={{width,height}}
          region={curLocation}
          onPress={ (event) => this.props.onPressMap(event)}
          onRegionChangeComplete={(region)=>{
            this.props.onRegionChangeComplete(region);
          }}
          customMapStyle={global.style_map}
          showsPointsOfInterest={false}
        >
        {data.map((marker,index) => (
          <MapView.Marker
            key={marker.id}
            coordinate={{
              latitude: Number(marker.latitude),
              longitude: Number(marker.longitude),
            }}
            image={Platform.OS!=='ios' ? {uri: marker.marker} : null}
            //ref={ref => { this.markerRef = ref; }}
            onPress={()=>{
              if(callout[marker.id] || callout[marker.id]===undefined){
                this.setState({ callout: {[marker.id]:false} });
              }else {
                this.setState({ callout: {[marker.id]:true} })
              }
            }}
          >
          {Platform.OS==='ios' && <Image source={{uri:`${marker.marker}`}} style={{width:48,height:54,position:'relative'}} />}
          <View style={callout[marker.id] || callout[marker.id]===undefined ? show : hide}>
            <MapView.Callout tooltip={callout[marker.id] || callout[marker.id]==undefined ? false : true}
            onPress={()=>{
              this.props.closeModal();
              if(!callout[marker.id])
              navigation.navigate('DetailScr',{idContent:marker.id,lat:marker.latitude,lng:marker.longitude,curLoc,lang:lang.lang});
            }}>
              <TouchableOpacity >
              <View style={{height: 45,width: 300,alignItems:'center',borderRadius:3}}>
              <Text numberOfLines={1} style={{fontWeight:'bold'}}>{marker.name}</Text>
              <Text numberOfLines={1}>{`${marker.address}`}</Text>
              </View>
              </TouchableOpacity>
            </MapView.Callout>
            </View>
          </MapView.Marker>
        )
      )}
        <MapView.Circle
          center={circleLoc}
          radius={500}
          lineCap="butt"
          strokeWidth={1}
          fillColor="rgba(0, 0, 0, 0.1))"
          strokeColor="rgba(0, 0, 0, 0))"/>
          <MapView.Marker
            coordinate={{
              latitude: Number(circleLoc.latitude),
              longitude: Number(circleLoc.longitude),
            }}
            />
        </MapView>
        :
        <View></View>
      }

        </View>

        <TouchableOpacity style={[btn,btnMapZoom,curLocation.latitude!==undefined ? show : hide]}
        onPress={()=>{this.props.findCurrentLoc()}}>
        <Image source={currentLocIC} style={{width:30,height:30}} />
        </TouchableOpacity>

        {/*<View style={[btn,btnMapZoom,curLocation.longitude!==undefined ? show :hide]}>
          <TouchableOpacity style={btnZoom}
          onPress={()=>this.props.onPressZoom('zoom_out')}>
          <Image source={addIC} style={{width:24,height:24}} />
          </TouchableOpacity>
          {<View style={{width:12,borderColor:'#999',borderBottomWidth:1}}></View>}
          <TouchableOpacity style={btnZoom}
          onPress={()=>this.props.onPressZoom('zoom_in')}>
          <Image source={minIC} style={{width:24,height:24}} />
          </TouchableOpacity>
        </View>*/}

        <TouchableOpacity style={[btn,btnMapFull,curLocation.latitude!==undefined ? show : hide]}
        onPress={()=>{this.props.closeModal()}}>
        <Image source={normalScreenIC} style={{width:30,height:30}} />
        </TouchableOpacity>

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  btn:{
    position:'absolute',zIndex:7,right:10,
    backgroundColor:'rgba(250,250,250,0.8)',
    padding:1},
  btnMapLoc:{bottom:122,},
  btnMapZoom:{bottom:50,},
  btnMapFull:{bottom:10,},
  btnZoom:{padding:3},
  show : { display: 'flex'},
  hide : { display: 'none'},
});
