/* @flow */

import React, { Component } from 'react';
import {
  Keyboard, Platform, View, Text, StyleSheet, Dimensions,Image,AsyncStorage,
  TextInput, TouchableOpacity,FlatList,Alert, ActivityIndicator,Modal} from 'react-native';
const {height, width} = Dimensions.get('window');

import accessLocation from '../../api/accessLocation';
import getApi from '../../api/getApi';
import checkLocation from '../../api/checkLocation';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import getLocationByIP from '../../api/getLocationByIP';
import global from '../../global';
import arrTest from '../../arrTest';
import styles from '../../styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapFullScreen from './MapFullScreen';
import SelectLocation from '../../main/location/SelectLocation';
import SelectCategory from '../../main/location/SelectCategory';
import SelectService from '../../main/location/SelectService';

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
import upDD from '../../../src/icon/ic-white/ic-dropdown_up.png';
import checkIC from '../../../src/icon/ic-green/ic-check.png';

var timeout,timeoutZoom,timeoutPosition,timeoutCurPos;
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
      showLoc:false,
      showSer:false,
      showCat:false,
      curLocation:{},
      circleLoc:{},
      curLoc : {
        lat:this.props.navigation.state.params.lat || '',
        lng: this.props.navigation.state.params.lng || '',
      },
      id_district:'',
      id_city:'',
      id_country:'',
      id_cat:this.props.navigation.state.params.idCat || '',
      id_sub:'',
      id_serv:'',
      markers:[],
      service_items:[],
      kw:'',
      keyword:this.props.navigation.state.params.keyword || '',
      lang:this.props.navigation.state.params.lang==='vn' ? lang_vn: lang_en,
      initLoad:false,
      showNotFound:false,
      callout:{},
      onClick:false,
    }
    Keyboard.dismiss();
    accessLocation();
  }

  getCategory(lat=null,lng=null){
    const {id_district,id_cat,id_sub,id_serv,keyword,kw,curLoc} = this.state;
    let url = `${global.url}${'search-content?'}${'distance=500'}`;
    if(lat===null || lng===null) {
      url += `${'&district='}${id_district}`;
      lat = curLoc.latitude; lng = curLoc.longitude;
    }else {
      url += `${'&location='}${lat},${lng}`;
    }


    if(keyword!==undefined && keyword.trim()!=='' && keyword.trim()!==kw){
      url += `${'&keyword='}${keyword}`;
    }else {
      if(keyword.trim()===kw) url += `${'&keyword='}${keyword}`;
      if(id_cat!==undefined || id_cat!=='')  url += `${'&category='}${id_cat}`;
      if(id_sub!=='')  url += `${'&subcategory='}${id_sub}`;
      if(id_serv!=='') url += `${'&service='}${id_serv}`;
    }

    this.setState({ kw: keyword });

    console.log('url',url);
    getApi(url)
      .then(arrData => {
        if(arrData.data.length===0 ){
          if(this.state.initLoad===false){
            this.setState({
              markers: [],initLoad:true,showNotFound:true,
              curLocation : {
                latitude:lat,
                longitude: lng,
                lat,lng,
                latitudeDelta:  0.008757,
                longitudeDelta: 0.010066,
                latlng:`${lat},${lng}`,
              },
              // circleLoc: {
              //   latitude:curLoc.latitude,
              //   longitude:curLoc.longitude,
              // },
            });
            return;
          }
          this.setState({
            markers: arrData.data,initLoad:true,showNotFound:true,
          });
          return;
        }
        let data = [];
        let line = 0;
        lat=arrData.data[0].latitude;
        lng=arrData.data[0].longitude;
        let line1 = arrData.data[0].line;
        arrData.data.forEach(e=>{
          line = e.line;
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

          this.setState({ markers: data,onchange:true,showInfoOver:true,initLoad:true,
            curLocation : {
              latitude:lat,
              longitude: lng,
              lat:lat,
              lng: lng,
              latitudeDelta: isNaN(line-line1) || (line-line1)<500 ? 0.008757 : (line-line1)*0.008757/500,
              longitudeDelta: isNaN(line-line1) || (line-line1)<500 ? 0.010066 : (line-line1)*0.010066/500,
              latlng:`${lat},${lng}`,
            },
            // circleLoc: {
            //   latitude:curLoc.latitude,
            //   longitude:curLoc.longitude,
            // },

           });
      })
      .catch(err => console.log(err));
  }

  saveLocation(){
    checkLocation().then((e)=>{
      this.setState({showLoc:false,id_city:e.idCity,id_district:e.idDist,labelLoc:e.nameDist},()=>{
        this.getCategory();
      });
    });
  }
  saveSubCate(id_cat,id_sub,labelCat,labelSubCat,service_items){
    if(labelSubCat!=='') labelCat=labelSubCat;
    this.setState({id_cat,id_sub,labelCat,service_items},()=>{
        this.getCategory();
    })
  }
  saveService(arr){
    clearTimeout(timeout);
    let labelSer=[],id_serv=[];
    arr.length>0 && arr.forEach(e=>{
      if(e[1]){
        if( !isNaN(parseFloat(e[0])) ){
          id_serv = id_serv.concat(e[1]);
        }else {
          labelSer = labelSer.concat(e[1]);
        }
      }
    });

    this.setState({
      labelSer:labelSer.length===0 ? 'Dịch vụ' :labelSer.toString(),
      id_serv: id_serv.length===0 ? '' : id_serv.toString(),
    },()=>{
      timeout = setTimeout(()=>{
        this.getCategory();
      },800)
    })

  }

  getLoc(){
    //console.log('getLoc');
    //const { keyword } = this.props.navigation.state.params;
    navigator.geolocation.getCurrentPosition(
          (position) => {
            //console.log('position',position);
                const {latitude,longitude} = position.coords;
                //this.getPosition(latitude,longitude);
                this.setState({
                  curLoc : { latitude,longitude, },
                  circleLoc : { latitude,longitude },
                  onClick:false,
                },()=>{
                  //this.getPosition(latitude,longitude);
                  this.getCategory(latitude,longitude);
                });

           },
           (error) => {
            getLocationByIP().then(e=>{
              const {latitude,longitude} = e;
              //this.getPosition(latitude,longitude);
              this.setState({
                curLoc : { latitude,longitude, },
                circleLoc : { latitude,longitude, },
                onClick:false,
              },()=>{
                //this.getPosition(latitude,longitude);
                this.getCategory(latitude,longitude); });
            });//enableHighAccuracy: true,
          },
          { timeout: 5000,maximumAge: 60000 }
          //enableHighAccuracy: true,
    );
  }

  findCurrentLoc(){
    clearTimeout(timeoutCurPos);
    navigator.geolocation.getCurrentPosition(
     ({coords}) => {
       const {latitude, longitude} = coords
       timeoutCurPos = setTimeout(()=>{
         this.setState({
           // curLocation : {
           //   latitude,longitude,
           //   lat:latitude,lng:longitude,
           //   latlng:`${latitude},${longitude}`,
           //   latitudeDelta: 0.008757 ,
           //   longitudeDelta: 0.010066,
           // },
           curLoc : { latitude,longitude, },
           circleLoc : { latitude,longitude, },
           onClick:true,
         },()=>{
           //this.getPosition(latitude,longitude);
           this.getCategory(latitude,longitude)
         });
       },1000)

     },
     (error) => {
       getLocationByIP().then(e=>{
         const {latitude,longitude} = e;
         timeoutCurPos = setTimeout(()=>{
           this.setState({
             curLocation : {
               latitude,longitude,
               lat:latitude,lng:longitude,
               latlng:`${latitude},${longitude}`,
               latitudeDelta: 0.008757 ,
               longitudeDelta: 0.010066,
             },
             curLoc : { latitude,longitude, },
             circleLoc : { latitude,longitude, },
             onClick:true,
           },()=>{
             //this.getPosition(latitude,longitude);
             this.getCategory(latitude,longitude)
           });
         },1000)
       });
     }, { timeout: 5000,maximumAge: 60000 }
   )
  }
  onPressZoom(zoom) {
    //console.log(zoom);
      clearTimeout(timeoutZoom);
      const {latitude,longitude,lat,lng,latlng,latitudeDelta,longitudeDelta} = this.state.curLocation;
      let latDelta = zoom==='zoom_in' ? latitudeDelta*1.8 : latitudeDelta/1.8;
      let lngDelta = zoom==='zoom_in' ?  longitudeDelta*1.8 : longitudeDelta/1.8;
      //console.log(latDelta);
      timeoutZoom = setTimeout(()=>{
        latDelta > 0.002 && latDelta < 100 && this.setState({
          curLocation : {
            latitude,longitude,
            lat,lng,latlng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          },
          onClick:true,
        })
      },500)
  }
  // componentWillMount(){
  //   const { lat,lng } = this.props.navigation.state.params;
  //   this.getCategory(lat,lng);
  // }

  getPosition(lat,lng){
    var _this = this;
    clearTimeout(timeoutPosition);
    const url = `${global.url}${'get-position?location='}${lat},${lng}`;
    //console.log('url',url);
    getApi(url).then(e=>{
      const { district,city,country } = e.data[0];
      //district!==0 && district!==undefined && _this.setState({id_district:district,},()=>{});
      const url1 = `${global.url}${'district/'}${district}`;
      //console.log('district',district);
      district!==0 && getApi(url1).then(dist=>{
        timeoutPosition = setTimeout(function () {
          dist.data[0].name!=='' && dist.data[0].name!==undefined && _this.setState({
            labelLoc:dist.data[0].name,
            id_city:city,
            id_district:district,
            id_country:country,
          });
        }, 1500);
      })
    })
  }
  componentDidMount(){
    const { labelCat,service_items } = this.props.navigation.state.params || '';
    //console.log('labelCat',labelCat);
    //console.log('lat,lng',latitude,longitude );
    //if(lat!=='' || lat!==undefined) this.getPosition(lat,lng);
    if(labelCat!==undefined) this.setState({labelCat});
    if(service_items!==undefined) this.setState({service_items});
  }
  _onRegionChangeComplete = (region) => {
    region.latitudeDelta > 0.002 && this.setState({ curLocation:region, });
    if(this.state.onClick===false) {
      this.getPosition(region.latitude,region.longitude);
      this.setState({ onClick:true });
    }
  }
  _onPressMap = (event) => {
    const {latitude,longitude} = (event.nativeEvent.coordinate || this.state.curLocation);
    this.setState({
      circleLoc: {
        latitude,longitude,
      },
      onClick:true,
    },()=>{
      this.getPosition(latitude,longitude);
      this.getCategory(latitude,longitude);
    })
    Keyboard.dismiss();
  }

  render() {
    const {
      keyword, curLocation,markers,curLoc,lang,showFullScreen,
      labelLoc,labelSer,labelCat,fitCoord,id_cat,circleLoc,
      showNotFound,showLoc,showCat,showSer,service_items,callout,onClick
     } = this.state;
    //console.log(';showNotFound',showNotFound);
    const { navigate,goBack } = this.props.navigation;
    const { lat,lng } = this.props.navigation.state.params;
    const {
      container,imgLogoTop,inputSearch,
      headStyle, headContent,wrapIcRight,plusStyle,imgPlusStyle,serviceList,
      popover,show,hide,overLayoutCat,shadown,colorText,listCatAll,listCatBG,listCatW,
      wrapContent,leftContent,rightContent,middleContent,imgContent,
      filterFrame,selectBoxBuySell,widthLoc,btnMap,btnMapLoc,
      btnMapFull,btnMapZoom,btnZoom,btnList,listOverService,
      imgUpCreate,imgUpLoc,overLayout,popoverLoc,padCreate,imgUpInfo,
    } = styles;


    //let timeoutZoom;
    return (
      <View style={container}>
        <View style={headStyle}>
            <View style={headContent}>
            <TouchableOpacity onPress={()=>goBack()}>
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
              this.setState({onClick:false},()=>{
                this.getCategory(curLocation.latitude,curLocation.longitude);
              })

            }
          }}
          value={keyword.toString()}   />

          <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
          onPress={()=>{
            if (keyword.trim()!=='') {
              Keyboard.dismiss();
              this.setState({onClick:false},()=>{
                this.getCategory(curLocation.latitude,curLocation.longitude);
              })
            }
          }}>
            <Image style={{width:16,height:16,}} source={searchIC} />
          </TouchableOpacity>
        </View>
        {curLocation.longitude!==undefined ?
          <View>
          {<View style={{left:0,top:7,position:'absolute',alignItems:'center',width}}>
                  <View style={{width:width-40,flexDirection:'row',justifyContent:'space-between'}}>
                  <TouchableOpacity
                    onPress={()=>this.setState({ showLoc:true,showCat:false,showSer:false })}
                    style={[selectBoxBuySell,widthLoc]}>
                      <Text  numberOfLines={1} style={{color:'#303B50'}}>{labelLoc}</Text>
                      <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={()=>this.setState({ showLoc:false,showCat:true,showSer:false })}
                    style = {[selectBoxBuySell,widthLoc]}>
                      <Text  numberOfLines={1} style={{color:'#303B50'}}>{labelCat}</Text>
                      <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                  </TouchableOpacity>

                  <TouchableOpacity
                  onPress={()=>{
                    if(id_cat!==''){
                      this.setState({ showLoc:false,showCat:false,showSer:true })
                    }else {
                      Alert.alert(lang.notify,lang.plz_choose_cat)
                    }

                  }}
                  style = {[selectBoxBuySell,widthLoc]}>
                      <Text numberOfLines={1} style={{color:'#303B50'}}>{labelSer}</Text>
                      <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                  </TouchableOpacity>
                </View>
          </View>}

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
              style={{width,height,zIndex:-1}}
              region={curLocation}
              onPress={this._onPressMap}
              onRegionChangeComplete={this._onRegionChangeComplete}
              customMapStyle={global.style_map}
              showsPointsOfInterest={false}

            >
            {markers.length>0 &&
              markers.map((marker,index) => (
                <View key={marker.id}>

              <MapView.Marker
                key={marker.id}
                coordinate={{
                  latitude: Number(marker.latitude),
                  longitude: Number(marker.longitude),
                }}
                centerOffset={{
                  x: Number(marker.latitude),
                  y: Number(marker.longitude),
                }}
                image={ Platform.OS==='android' ? {uri:`${marker.marker}`} : null}
                //calloutOpen={false}
                //ref={ref => { this.markerRef = ref }}
                onPress={()=>{
                  if(callout[marker.id] || callout[marker.id]===undefined){
                    this.setState({ callout: {[marker.id]:false} });
                  }else {
                    this.setState({ callout: {[marker.id]:true} })
                  }
                }} >
              {Platform.OS==='ios' &&
              <Image
                //resizeMode="contain"
                source={{uri:`${marker.marker}`}}
                style={{width:48,height:54,resizeMode:"cover"}} />}

                <View style={callout[marker.id] || callout[marker.id]===undefined ? show : hide}>
                  <MapView.Callout tooltip={callout[marker.id] || callout[marker.id]==undefined ? false : true}
                  onPress={()=>{
                    if(!callout[marker.id])
                    navigate('DetailScr',{idContent:marker.id,lat:marker.latitude,lng:marker.longitude,curLoc,lang:lang.lang});
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
              </View>
            )
          )}
          {circleLoc.latitude!==undefined &&
            <MapView.Circle
            center={circleLoc}
            radius={500}
            lineCap="butt"
            strokeWidth={1}
            fillColor="rgba(0, 0, 0, 0.1))"
            strokeColor="rgba(0, 0, 0, 0))"/>}
            {circleLoc.latitude!==undefined &&
              <MapView.Marker
              coordinate={{
                latitude: Number(circleLoc.latitude),
                longitude: Number(circleLoc.longitude),
              }}
              />}
            </MapView>

            </View>
        :
        <View onLayout={()=>this.getLoc()} style={{width,height:height-300,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color="#d0021b" />
        </View>
        }

          {/*<TouchableOpacity style={plusStyle}>
              <Image source={plusIC} style={imgPlusStyle} />
          </TouchableOpacity>*/}

          <TouchableOpacity style={[btnMap,btnMapZoom,curLocation.longitude!==undefined ? show :hide]}
          onPress={()=>{this.findCurrentLoc()}}>
          <Image source={currentLocIC} style={{width:30,height:30}} />
          </TouchableOpacity>

          {/*<View style={[btnMap,btnMapZoom,curLocation.longitude!==undefined ? show :hide]}>
            <TouchableOpacity style={btnZoom}
            onPress={()=>this.onPressZoom('zoom_out')}>
            <Image source={addIC} style={{width:24,height:24}} />
            </TouchableOpacity>
            {<View style={{width:12,borderColor:'#999',borderBottomWidth:1}}></View>}
            <TouchableOpacity style={btnZoom}
            onPress={()=>this.onPressZoom('zoom_in')}>
            <Image source={minIC} style={{width:24,height:24}} />
            </TouchableOpacity>
          </View>*/}

          <TouchableOpacity style={[btnMap,btnMapFull,curLocation.longitude!==undefined ? show :hide]}
          onPress={()=>{this.setState({showFullScreen:true})}}>
          <Image source={fullScreenIC} style={{width:30,height:30}} />
          </TouchableOpacity>

          <MapFullScreen
          closeModal={()=>this.setState({showFullScreen:false})}
          findCurrentLoc={()=>this.findCurrentLoc()}
          onPressZoom={(zoom)=>this.onPressZoom(zoom)}
          showFullScreen={showFullScreen}
          curLocation={curLocation}
          circleLoc={circleLoc}
          curLoc={curLoc}
          onRegionChangeComplete={ this._onRegionChangeComplete}
          lang={lang}
          navigation={this.props.navigation}
          data={markers}
          onPressMap={(event)=>this._onPressMap(event)}
          />

          <Modal transparent onRequestClose={() => null}
          visible={showNotFound}
          >
            <View onLayout={()=>{
              setTimeout(()=>{
                this.setState({showNotFound:false})
              },2000)
            }} style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.3)'}}>
                <View style={{borderRadius:5, backgroundColor:'#FFF',padding:20}}>
                  <Text style={{fontSize:18,color:'#333'}}>{lang.not_found}</Text>
                </View>
            </View>
          </Modal>

          <Modal onRequestClose={() => null} transparent visible={showLoc}>
          <TouchableOpacity
          onPress={()=>this.setState({showLoc:!this.state.showLoc})}
          style={[popoverLoc,padCreate]}>
            <Image style={[imgUpCreate,imgUpLoc]} source={upDD} />
            <View style={[overLayout,shadown]}>
                <SelectLocation
                saveLocation={this.saveLocation.bind(this)}
                id_country={this.state.id_country}
                id_city={this.state.id_city}
                //id_district={this.state.id_district}
                />
            </View>
            </TouchableOpacity>
          </Modal>

          <SelectCategory
          visible={showCat}
          saveSubCate={this.saveSubCate.bind(this)}
          idCat={id_cat}
          closeModal={()=>this.setState({showCat:false})}
          />

          <SelectService
          visible={showSer}
          data={service_items}
          saveService={this.saveService.bind(this)}
          closeModal={()=>this.setState({showSer:false})}
          />

      </View>
    );
  }
}
