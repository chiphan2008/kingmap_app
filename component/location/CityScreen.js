/* @flow */

import React, { Component } from 'react';
import { Platform, View, Text, Image, Button, StyleSheet, Dimensions, TouchableOpacity,AsyncStorage } from 'react-native';
import {Select, Option} from "react-native-chooser";
import {connect} from 'react-redux';
import getApi from '../api/getApi';
import checkLocation from '../api/checkLocation';

import global from '../global';
//import image
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
import bgMap from '../../src/icon/bg-map.jpg';
const {height, width} = Dimensions.get('window');

var com;
class CityScreen extends Component {
  constructor(props) {
    super(props);
    com = this;
    this.state = {
      listCountry : [],
      listCity : [],
      slCountry :{
          name : "Chọn quốc gia",
          id:-1,
      },
      slCity : {
        name: "Chọn tỉnh thành phố",
        id:-1,
      },
      latitude:'',longitude:'',
      position:{},
      callCountry:true,
    };


  }
  componentDidMount() {
    let _this = this;
    checkLocation().then(e=>{
      if(e.idCountry===undefined){
        _this.getCountry();
      }
    }).catch(error => console.log('err', error));
  }

  onSelectCountry(value, label) {
    console.log(value)
    this.setState({
      slCountry : {
          name : label,
          id:value,
      }
    });
    this.getCity(value);
  }
  onSelectCity(value, label) {
    this.setState({
      slCity : {
          name : label,
          id:value,
      }
    });
  }

  saveLocation(){
    if(this.state.slCountry.id !==-1 && this.state.slCity.id !==-1){
      const {slCountry,slCity,latitude,longitude,position} = com.state;
      AsyncStorage.setItem('@LocationKey:key', JSON.stringify({
                idCountry: slCountry.id,
                nameCountry: slCountry.name,
                idCity: slCity.id,
                nameCity: slCity.name,
                //latitude,longitude,position
            })).then(()=>{
              //this.props.dispatch({type:'STOP_START_UPDATE_STATE',updateState:true});
              let slLang={};
              if(this.state.slCountry.id==1){
                slLang={valueLang:'vn',labelLang :'VIE'};
              }else{
                slLang={valueLang:'en',labelLang :'ENG'};
              }

              this.props.dispatch({type:'UPDATE_LANG',slLang});
              AsyncStorage.setItem('@MyLanguage:key',JSON.stringify(slLang)).then(()=>{
                setTimeout(()=>{
                  this.props.screenProps(slLang,'home');
                  //this.props.navigation.navigate('MainScr');
                },700)
              });

          });


    }
  }
  getCountry(){
    console.log(`${global.url}${'countries'}`);
    getApi(`${global.url}${'countries'}`).then(arrCountry => {
      //console.log('arrCountry',arrCountry);
      com.setState({ listCountry: arrCountry.data });

    }).catch(err => console.log(err));
  }

  getCity(id_country){
    console.log(`${global.url}${'cities/'}${id_country}`);
    getApi(`${global.url}${'cities/'}${id_country}`)
    .then(arrCity => {
        this.setState({ listCity: arrCity.data });
    })
    .catch(err => console.log(err));
  }


  render() {
    const { width, height } = Dimensions.get('window');
    //console.log("this.props.CityScreen=",util.inspect(this.props.navigation,false,null));
    const {
      container, imgLogo, title, wrapper,bgImg,
      selectBox, selectBoxCountry, selectBoxCity, OptionItem,
      optionListStyle, optionListStyleCountry, optionListStyleCity,
      btn, btnPress, colorPress, colorNext, btnWrap, contentWrap,
    } = styles;
    //console.log('this.state', this.state)
    return (

      <View style={container}>
        <Image source={bgMap} style={bgImg} />
        <View style={wrapper}>
        <View  style={btnWrap}></View>
        <View style={contentWrap}>
              <Image style={imgLogo} source={LogoHome} />
              <Text style={title}>COUNTRY/ CITY</Text>
              <Select
                    extraData={this.state}
                    onSelect = {this.onSelectCountry.bind(this)}
                    defaultText  = {this.state.slCountry.name}
                    style = {[selectBox,selectBoxCountry]}
                    textStyle = {{color:'#5b89ab'}}
                    optionListStyle={[optionListStyle,optionListStyleCountry]}
                    transparent
                    indicatorColor="#5b89ab"
                    indicator="down"
                    indicatorSize={7}
                  >
                  {this.state.listCountry.length>0 ?
                    this.state.listCountry.map((e)=>{
                      return (
                      <Option value={e.id} key={e.id}>{e.name}</Option>
                    )})
                    :
                    <View></View>
                  }
              </Select>

              <Select
                    onSelect = {this.onSelectCity.bind(this)}
                    defaultText  = {this.state.slCity.name}
                    style = {[selectBox,selectBoxCity]}
                    textStyle = {{color:'#5b89ab'}}
                    optionListStyle={[optionListStyle,optionListStyleCity]}
                    transparent
                    indicatorColor="#5b89ab"
                    indicator="down"
                    indicatorSize={7}
                  >
                  {this.state.listCity.map((e)=>(
                    <Option value={e.id} key={e.id}>{e.name}</Option>
                  ))}

              </Select>
        </View>
        <View style={btnWrap}>

        <TouchableOpacity
            style={btn}
            onPress={()=>{this.saveLocation()}}
          >
            <Text style={ colorNext }>Next</Text>
            </TouchableOpacity>
        </View>
        </View>
  </View>

    );
  }
}

export default connect()(CityScreen);
const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignSelf: 'stretch',
  },
  bgImg : {
    width,
    height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  btnWrap : { flex : 1,alignItems: 'center' },
  contentWrap : { flex : 3,alignItems: 'center',justifyContent: 'center',},
  imgLogo : {
    width : 60,
    height : 60,
    marginBottom: 15,
  },
  title : {
    fontSize: 22,
    marginBottom: 20,
  },
  selectBox : {
    borderRadius : 5,
    borderWidth : 1,
    borderColor : "#e0e8ed",
    width: width - 50,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    alignSelf: 'stretch',
  },
  selectBoxCountry : {
    marginBottom: 10,
  },
  selectBoxCity : {
    marginBottom: 75,
  },
  OptionItem : {
    borderBottomColor: '#e0e8ed',
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  optionListStyle : {
    borderRadius : 5,
    width: width - 50,
    minHeight: 200,
    maxHeight: 200,
    borderColor : "#fff",
    borderWidth : 0,
    marginTop:15,
    backgroundColor: '#fff',
    shadowOffset:{  width: 2,  height: 2,  },
    shadowColor: '#ddd',
    shadowOpacity: .5,
  },
  optionListStyleCountry : {
    top: Platform.OS === 'ios' ? 113 : 125,
  },
  optionListStyleCity : {
    top: Platform.OS === 'ios' ? 172 : 185,
  },
  btn: {
    paddingTop:15,
    paddingBottom:15,
    borderRadius : 5,
    width: width - 50,
    borderWidth: 1,
    borderColor : "#D0021B",
  },
  btnPress: {
    paddingTop:15,
    paddingBottom:15,
    borderRadius : 5,
    width: width - 50,
    borderWidth: 1,
    borderColor : "#D0021B",
    backgroundColor: '#D0021B',
  },
  colorNext : {
    color: '#D0021B',
    textAlign: 'center',
  },
  colorPress : {
    color: '#fff',
    textAlign: 'center',
  },
});
