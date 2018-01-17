/* @flow */

import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Platform,AsyncStorage,
} from 'react-native';
import checkLocation from '../../api/checkLocation';
import global from '../../global';
import getApi from '../../api/getApi';

import arrowNextIC from '../../../src/icon/ic-arrow-next.png';
import checkIC from '../../../src/icon/ic-green/ic-check.png';


export default class SelectLocation extends Component {
  constructor(props){
    super(props);
    this.state = {showDistrict:true, showCountry:false, showCity:false,
      listDistrict:[],
      listCountry:[],
      listCity:[],
      showCheckCity:'',
      showCheckCountry:'',
      showCheckDistrict:'',
      idCountry:1,
      idCity:1,
    };
  }
  getCity(){
    checkLocation().then(e=>{
      getApi(`${global.url}${'cities/'}${e.idCountry}`)
      .then(arrCity => {
          this.setState({ listCity: arrCity.data });
      })
      .catch(err => console.log(err));
    });
  }

  getCountry(){
    getApi(`${global.url}${'countries'}`)
    .then(arrCountry => {
        this.setState({ listCountry: arrCountry.data });
    })
    .catch(err => console.log(err));
  }

  getDistrict(id_city){
    getApi(`${global.url}${'districts/'}${id_city}`)
    .then(arrDistrict => {
      //console.log('arrCity',arrCity);
        this.setState({ listDistrict: arrDistrict.data });
    })
    .catch(err => console.log(err));
  }


  componentWillMount(){
    checkLocation().then((e)=>{
      this.getDistrict(e.idCity);
      this.setState({showCheckCountry:e.idCountry, showCheckCity: e.idCity, showCheckDistrict: e.idDist});
    });
  }

  render() {
    //const {naviagte} = this.props.navigation;
      return (
        <View style={styles.container}>

         <View style={[styles.container, this.state.showDistrict ? styles.show : styles.hide]}>
           <TouchableOpacity
               onPress={()=>{
                 this.setState({showDistrict:false, showCountry:false, showCity:true,});
                 this.getCity();
               }}
               style={styles.listOver}>
           <Text style={styles.txtNextItem} >Chọn Tỉnh/TP khác <Image style={styles.imgNextLoc} source={arrowNextIC}/></Text>
           </TouchableOpacity>
           <FlatList
                ListEmptyComponent={<Text>Loading ...</Text>}
                data={this.state.listDistrict}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <View  style={styles.listItem}>
                  <TouchableOpacity
                     style={{justifyContent:'space-between',flexDirection:'row',}}
                     onPress={() => {
                          this.setState({showCheckDistrict:item.id});
                         AsyncStorage.setItem('@LocationKey:key', JSON.stringify({
                                   idCountry:this.state.showCheckCountry,
                                   idCity:this.state.showCheckCity,
                                   idDist:item.id,
                         }));
                         this.props.saveLocation();

                     }}
                   >
                  <Text style={styles.txtItem} >{item.name}</Text>
                  <Image style={[styles.imgCheck,this.state.showCheckDistrict===item.id ? styles.show : styles.hide]} source={checkIC}/>
                  </TouchableOpacity>
                  </View>
                )} />

         </View>

         <View style={[styles.container,this.state.showCountry ? styles.show : styles.hide]}>


           <FlatList
                ListEmptyComponent={<Text>Loading ...</Text>}
                data={this.state.listCountry}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <View  style={styles.listItem}>
                  <TouchableOpacity
                     style={{justifyContent:'space-between',flexDirection:'row',}}
                     onPress={()=>{
                       this.setState({showDistrict:false, showCountry:false, showCity:true,idCountry:item.id});
                       this.getCity();
                     }}
                   >
                  <Text style={styles.txtItem} >{item.name}</Text>
                  <Image style={[styles.imgCheck,this.state.showCheckCountry===item.id ? styles.show : styles.hide]} source={checkIC}/>
                  </TouchableOpacity>
                  </View>
                )} />

         </View>

         <View style={[styles.container,this.state.showCity ? styles.show : styles.hide]}>
         <TouchableOpacity
             onPress={()=>{
               this.setState({
                 showDistrict:false, showCountry:true, showCity:false,
                });
               this.getCountry();
             }}
             style={styles.listOver}>
         <Text style={styles.txtNextItem} >Chọn quốc gia khác<Image style={styles.imgNextLoc} source={arrowNextIC}/></Text>
         </TouchableOpacity>
           <FlatList
                ListEmptyComponent={<Text>Loading ...</Text>}
                data={this.state.listCity}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <View  style={styles.listItem}>
                  <TouchableOpacity
                     style={{justifyContent:'space-between',flexDirection:'row',}}
                     onPress={()=>{
                       this.setState({
                         showDistrict:true,showCountry:false,showCity:false,idCity:item.id,
                         showCheckCity:item.id,
                       });
                       this.getDistrict(item.id);
                       AsyncStorage.setItem('@LocationKey:key', JSON.stringify({
                                 idCountry:this.state.showCheckCountry,
                                 idCity:item.id,
                       }));
                     }}
                   >
                  <Text style={styles.txtItem} >{item.name}</Text>
                  <Image style={[styles.imgCheck,this.state.showCheckCity===item.id ? styles.show : styles.hide]} source={checkIC}/>
                  </TouchableOpacity>
                  </View>
                )} />

         </View>

        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FFFDFF',
    position:'relative',
    maxHeight:Platform.OS ==='ios' ? 340 : 370,
  },
  show:{display:'flex'},
  hide:{display:'none'},
  imgCheck:{
    width:20,height:20
  },
  imgNextLoc:{
    width:Platform.OS ==='ios' ? 12 : 30,
    height:Platform.OS ==='ios' ? 12 : 30,
  },
  listOver:{
    alignItems:'center',flexDirection:'row',
    padding:15,
    borderBottomColor:'#EEEDEE',
    borderBottomWidth:1,
  },
  listItem:{
    padding:15,
    paddingTop:20,
    paddingBottom:20,
    borderBottomColor:'#EEEDEE',
    borderBottomWidth:1,
  },
  txtItem:{
    color:'#2F353F',fontSize:17,
  },
  txtNextItem:{
    color:'#6587A8',fontSize:17,paddingRight:20,
  },
});
