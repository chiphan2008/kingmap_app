/* @flow */

import React, { Component } from 'react';
import {
  Keyboard, Platform, View, Text, StyleSheet, Dimensions,Image,AsyncStorage,
  TextInput, TouchableOpacity,FlatList,Alert, ActivityIndicator} from 'react-native';
const {height, width} = Dimensions.get('window');

import accessLocation from '../../api/accessLocation';
import getApi from '../../api/getApi';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import getLocationByIP from '../../api/getLocationByIP';
import global from '../../global';
import arrTest from '../../arrTest';
import styles from '../../styles';
import MapView, { PROVIDER_GOOGLE,ANIMATED_FIT } from 'react-native-maps';
import MapFullScreen from './MapFullScreen';

import sortDown from '../../../src/icon/ic-white/sort-down.png';
import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import listIC from '../../../src/icon/ic-white/ic-list.png';
import logoMap from '../../../src/icon/Logo-map.png';
import currentLocIC from '../../../src/icon/ic-current-location.png';
import addIC from '../../../src/icon/ic-add.png';
import minIC from '../../../src/icon/ic-min.png';
import listmapIC from '../../../src/icon/ic-listmap.png';
import fullScreenIC from '../../../src/icon/ic-full-screen.png';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import plusIC from '../../../src/icon/ic-home/ic-plus.png';
import sortDownIC from '../../../src/icon/ic-sort-down.png';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.state = {
      labelLoc : "Địa điểm",
      labelCat : "Danh mục",
      labelSer : "Dịch vụ",
      fitCoord:false,
      region:{},
      showFullScreen:false,
      curLocation:{},
      curLoc : {
        lat:this.props.navigation.state.params.lat || '',
        lng: this.props.navigation.state.params.lng || '',
      },
      id_district:'',
      id_cat:this.props.navigation.state.params.idCat || '',
      markers:[],
      keyword:this.props.navigation.state.params.keyword || '',
      lang:this.props.navigation.state.params.lang==='vn' ? lang_vn: lang_en,
    }
    Keyboard.dismiss();
  }

  getCategory(lat,lng){

    const {id_district,id_cat,keyword} = this.state;
    let url = `${global.url}${'search-content?'}${'distance=500'}`;
    //console.log('id_cat',id_cat);
    if(id_cat!==undefined || id_cat!=='')  url += `${'&category='}${id_cat}`;
    if(lat!=='' && lng!=='')
                            url += `${'&location='}${lat},${lng}`;
    if(keyword!==undefined || keyword.trim()!=='')
                            url += `${'&keyword='}${keyword}`;
    if(id_district!=='')       url += `${'&district='}${id_district}`;


    // if(id_sub!==null) url += `${'&subcategory='}${id_sub}`;
    // id_serv = id_serv.replace('-1,','');
    // if(id_serv!=='' && id_serv!=='-1'){
    //   url += `${'&service='}${id_serv}`;
    // }
    console.log('url',url);
    getApi(url)
      .then(arrData => {
        let data = [];
        arrData.data.forEach(e=>{
          let obj = {
            id: e.id,
            name: e.name,
            address: `${e.address}, ${e._district.name}, ${e._city.name}, ${e._country.name}`,
            latitude:e.latitude,
            longitude:e.longitude,
            marker:`${global.url_media}${e._category_type.marker}`
          }
          data.push(obj);
        })
        //console.log('getApi');
          this.setState({ markers: data,onchange:true,showInfoOver:true,
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
    //const { keyword } = this.props.navigation.state.params;
    navigator.geolocation.getCurrentPosition(
          (position) => {
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
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    );
  }

  findCurrentLoc(){
    navigator.geolocation.getCurrentPosition(
     ({coords}) => {
       const {latitude, longitude} = coords
       this.setState({
         curLoc: {
           latitude,
           longitude,
         },
         curLocation: {
           latitude,
           longitude,
           latitudeDelta:  0.008757,
           longitudeDelta: 0.010066,
         }
       },()=>{
         this.getCategory(latitude,longitude);
       })
     },
     (error) => {/*alert(JSON.stringify(error))*/},
     {enableHighAccuracy: true}
   )
  }
  onPressZoom(zoom) {
      const {latitude,longitude,lat,lng,latlng,latitudeDelta,longitudeDelta} = this.state.curLocation;
      this.setState({
        curLocation : {
          latitude,longitude,
          lat,lng,latlng,
          latitudeDelta: zoom==='zoom_in' ? latitudeDelta*1.1 : latitudeDelta/1.1,
          longitudeDelta: zoom==='zoom_in' ?  longitudeDelta*1.1 : longitudeDelta/1.1,
        }
      })
  }
  // componentWillMount(){
  //   const { lat,lng } = this.props.navigation.state.params;
  //   this.getCategory(lat,lng);
  // }


  componentWillMount() {
    //console.log('componentDidMount');
     navigator.geolocation.getCurrentPosition(
       ({coords}) => {
         let {latitude, longitude, altitude} = coords
         //latitude = Number(latitude).toFixed(6);
         //longitude = Number(latitude).toFixed(6);
         //console.log('coords',Number(latitude).toFixed(6), Number(longitude).toFixed(6));
         this.setState({
           curLoc: {
             latitude,
             longitude,
           },
           curLocation: {
             latitude,
             longitude,
             altitude,
             latitudeDelta: 0.005,
             longitudeDelta: 0.001,
           }
         },()=>{
           this.getCategory(latitude,longitude,);
         })
       },
       (error) => {/*alert('Error: Are location services on?')*/},
       {enableHighAccuracy: true}
     );
     this.watchID = navigator.geolocation.watchPosition(
       ({coords}) => {
         const {lat, long} = coords

         this.setState({
           curLoc: {
             lat,
             long
           }
         })
     });

   }
   componentWillUnmount() {
     //console.log('componentWillUnmount');
     navigator.geolocation.clearWatch(this.watchID);
   }

  render() {
    const {
      keyword, curLocation,markers,curLoc,lang,showFullScreen,
      labelLoc,labelSer,labelCat,fitCoord,id_cat
     } = this.state;
    //console.log(lang);
    const { navigate,goBack } = this.props.navigation;
    const { lat,lng } = this.props.navigation.state.params;
    const {
      container,imgLogoTop,inputSearch,
      headStyle, headContent,wrapIcRight,plusStyle,imgPlusStyle,serviceList,
      popover,show,hide,overLayoutCat,shadown,colorText,listCatAll,listCatBG,listCatW,
      wrapContent,leftContent,rightContent,middleContent,imgContent,
      filterFrame,selectBoxBuySell,widthLoc,btnMap,btnMapLoc,
      btnMapFull,btnMapZoom,btnZoom,btnList
    } = styles;

    let timeout;
    return (
      <View style={container}>
        <View style={headStyle}>
            <View style={headContent}>
            <TouchableOpacity
            onPress={()=>goBack()}
            >
            <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
            </TouchableOpacity>
                <Image source={logoTop} style={imgLogoTop} />
                <View></View>
            </View>
            <View style={{marginTop:Platform.OS==='ios' ? 7 : 10}}></View>

          <TextInput
          underlineColorAndroid='transparent' style={inputSearch}
          placeholder={lang.search.toString()}
          onChangeText={(keyword)=>this.setState({keyword})}
          onSubmitEditing={(event)=>{
            if(keyword.trim()!==''){
              this.getCategory(curLocation.latitude,curLocation.longitude);
            }
          }}
          value={keyword.toString()}   />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (keyword.trim()!=='') {
              Keyboard.dismiss();
              this.getCategory(curLocation.latitude,curLocation.longitude);
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>
        </View>
        {curLocation.longitude!==undefined ?
          <View>

          {/*<View style={{left:0,top:7,position:'absolute',alignItems:'center',width}}>
                  <View style={{width:width-40,flexDirection:'row',justifyContent:'space-between'}}>
                  <TouchableOpacity
                    onPress={()=>this.setState({ showLoc:!this.state.showLoc,listSubCat:{showList:false},listSerItem:{showList:false}, })}
                    style={[selectBoxBuySell,widthLoc]}>
                      <Text  numberOfLines={1} style={{color:'#303B50'}}>{labelLoc}</Text>
                      <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={()=>this.setState({ listSubCat:{showList:!listSubCat.showList},listSerItem:{showList:false}, showLoc:false})}
                    style = {[selectBoxBuySell,widthLoc]}>
                      <Text  numberOfLines={1} style={{color:'#303B50'}}>{labelCat}</Text>
                      <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                  </TouchableOpacity>

                  <TouchableOpacity
                  onPress={()=>this.setState({ listSubCat:{showList:false},listSerItem:{showList:!listSerItem.showList}, showLoc:false})}
                  style = {[selectBoxBuySell,widthLoc]}>
                      <Text numberOfLines={1} style={{color:'#303B50'}}>{labelSer}</Text>
                      <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                  </TouchableOpacity>
                </View>
          </View>*/}

          {/*<TouchableOpacity onPress={()=>navigate('ListCatScr',{keyword:this.state.valSearch,idCat:'',lat:curLoc.lat,lng:curLoc.lng,lang:lang.lang})} style={[btnMap,btnList]}>
            <Image source={listmapIC} style={{width:25,height:25}} />
          </TouchableOpacity>*/}

          <MapView
              provider={PROVIDER_GOOGLE}
              //showsUserLocation
              zoomEnabled
              onPanDrag={()=>{Keyboard.dismiss();}}
              ref={(ref) => { this.mapRef = ref }}
              //this.mapRef.fitToCoordinates(markers, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: false })
              style={{width,height:height-190,zIndex:-1}}
              region={curLocation}
              onPress={ (event) =>{
                const {latitude,longitude} = (event.nativeEvent.coordinate || curLocation);
                this.getCategory(latitude,longitude);
                Keyboard.dismiss();
              }}
              // onRegionChange={(region)=>{
              //   console.log('region',region);
              // }}
              onRegionChangeComplete={(region)=>{
                //console.log('region',markers);
                // const {latitude,longitude,longitudeDelta,latitudeDelta} = region;
                // this.setState({
                //   curLocation: {
                //     lat:latitude,lng:longitude,latlng:`${latitude},${longitude}`,
                //     latitude,longitude,longitudeDelta,latitudeDelta
                //   }
                // });
              }}
              customMapStyle={global.style_map}
              showsPointsOfInterest={false}

            >
            {markers.length>0 &&
              markers.map((marker,index) => (
              <MapView.Marker
                onLayout={()=>{
                  //console.log('marker.marker',marker.marker);
                  //if(index===markers.length-1) console.log('markers',markers);
                }}
                key={marker.id}
                coordinate={{
                  latitude: Number(marker.latitude),
                  longitude: Number(marker.longitude),
                }}
                image={{uri: Platform.OS==='android' ? marker.marker : null}}
              >
              {Platform.OS==='ios' &&
              <Image
              source={{uri:`${marker.marker}`}}
              style={{width:48,height:54}} />
              }
                <MapView.Callout onPress={()=>{navigate('DetailScr',{idContent:marker.id,lat:marker.latitude,lng:marker.longitude,curLoc,lang:lang.lang});}}
                >
                  <TouchableOpacity>
                  <View style={{height: 45,width: 300,alignItems:'center',borderRadius:3}}>
                  <Text numberOfLines={1} style={{fontWeight:'bold'}}>{marker.name}</Text>
                  <Text numberOfLines={1}>{`${marker.address}`}</Text>
                  </View>
                  </TouchableOpacity>
                </MapView.Callout>
              </MapView.Marker>
            )
          )}
          <MapView.Circle
          //onLayout={()=>this.setState({fitCoord:true})}
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


          </View>
        :
        <View style={{width,height:height-300,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color="#d0021b" />
        </View>
        }


          {/*<TouchableOpacity style={plusStyle}>
              <Image source={plusIC} style={imgPlusStyle} />
          </TouchableOpacity>*/}

          <TouchableOpacity style={[btnMap,btnMapLoc,curLocation.longitude!==undefined ? show :hide]}
          onPress={()=>{this.findCurrentLoc()}}>
          <Image source={currentLocIC} style={{width:22,height:22}} />
          </TouchableOpacity>

          <View style={[btnMap,btnMapZoom,curLocation.longitude!==undefined ? show :hide]}>
            <TouchableOpacity style={btnZoom}
            onPress={()=>this.onPressZoom('zoom_out')}>
            <Image source={addIC} style={{width:16,height:16}} />
            </TouchableOpacity>
            {/*<View style={{width:12,borderColor:'#999',borderBottomWidth:1}}></View>*/}
            <TouchableOpacity style={btnZoom}
            onPress={()=>this.onPressZoom('zoom_in')}>
            <Image source={minIC} style={{width:16,height:16}} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[btnMap,btnMapFull,curLocation.longitude!==undefined ? show :hide]}
          onPress={()=>{this.setState({showFullScreen:true})}}>
          <Image source={fullScreenIC} style={{width:22,height:22}} />
          </TouchableOpacity>

          <MapFullScreen
          closeModal={()=>this.setState({showFullScreen:false})}
          findCurrentLoc={()=>this.findCurrentLoc()}
          onPressZoom={(zoom)=>this.onPressZoom(zoom)}
          showFullScreen={showFullScreen}
          curLocation={curLocation}
          curLoc={curLoc}
          lang={lang}
          navigation={this.props.navigation}
          data={markers}
          getCategory={(latitude,longitude)=>this.getCategory(latitude,longitude)}
          />

      </View>
    );
  }
}
