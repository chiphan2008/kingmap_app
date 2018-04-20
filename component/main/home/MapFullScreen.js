/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,StyleSheet,Image,
  TouchableOpacity,Dimensions
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
  }
  render() {
    const {
      showFullScreen,
      curLocation,
      data,
      navigation,
      curLoc,lang,
    } = this.props;
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
          onPress={ (event) =>{
            const {latitude,longitude} = (event.nativeEvent.coordinate || curLocation);
            this.props.getCategory(latitude,longitude);
          }}
          customMapStyle={global.style_map}
          showsPointsOfInterest={false}
        >
        {data.map((marker,index) => (
          <MapView.Marker
            key={marker.id}
            coordinate={{
              latitude: Number(marker.lat),
              longitude: Number(marker.lng),
            }}
          >
          <Image source={{uri:`${global.url_media}${marker._category_type.marker}`}} style={{width:48,height:54,position:'relative'}} />
          <MapView.Callout onPress={()=>{
            this.props.closeModal();
            navigation.navigate('DetailScr',{idContent:marker.id,lat:marker.lat,lng:marker.lng,curLoc,lang});
        }}
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
          center={curLocation}
          radius={500}
          lineCap="butt"
          strokeWidth={1}
          fillColor="rgba(0, 0, 0, 0.1))"
          strokeColor="rgba(0, 0, 0, 0))"/>
          <MapView.Marker
            coordinate={{
              latitude: Number(curLocation.latitude),
              longitude: Number(curLocation.longitude),
            }}
            />
        </MapView>
        :
        <View></View>
      }

        </View>

        <TouchableOpacity style={[btn,btnMapLoc,curLocation.latitude!==undefined ? show : hide]}
        onPress={()=>{this.props.findCurrentLoc()}}>
        <Image source={currentLocIC} style={{width:22,height:22}} />
        </TouchableOpacity>

        <View style={[btn,btnMapZoom,curLocation.longitude!==undefined ? show :hide]}>
          <TouchableOpacity style={btnZoom}
          onPress={()=>this.props.onPressZoom('zoom_out')}>
          <Image source={addIC} style={{width:16,height:16}} />
          </TouchableOpacity>
          {/*<View style={{width:12,borderColor:'#999',borderBottomWidth:1}}></View>*/}
          <TouchableOpacity style={btnZoom}
          onPress={()=>this.props.onPressZoom('zoom_in')}>
          <Image source={minIC} style={{width:16,height:16}} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[btn,btnMapFull,curLocation.latitude!==undefined ? show : hide]}
        onPress={()=>{this.props.closeModal()}}>
        <Image source={normalScreenIC} style={{width:22,height:22}} />
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
  btnMapLoc:{bottom:92,},
  btnMapZoom:{bottom:40,},
  btnMapFull:{bottom:10,},
  btnZoom:{padding:3},
  show : { display: 'flex'},
  hide : { display: 'none'},
});
