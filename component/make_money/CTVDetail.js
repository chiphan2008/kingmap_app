/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,
  TextInput,Dimensions,ScrollView,
} from 'react-native';
import Moment from 'moment';
import {format_number} from '../libs';
import styles from '../styles';
import global from '../global';
import postApi from '../api/postApi';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import logoTop from '../../src/icon/ic-white/Logo-ngang.png';
const {width,height} = Dimensions.get('window');

export default class CTVDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      listData:{}
    }
  }
  componentWillMount(){
    this.getStatic();
  }
  getStatic(){
    const {ctv_id} = this.props.navigation.state.params;
    const month = Moment().format('MM');
    const year = Moment().format('YYYY');
    const arr = new FormData();
    arr.append('ctv_id',ctv_id);
    arr.append('month',month);
    arr.append('year',year);
    //console.log(arr);
    postApi(`${global.url}${'static'}`,arr)
    .then(arr => {
        this.setState({ listData:arr.data });
    }).catch(err => console.log(err));
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      imgLogoTop,colorlbl,wrapWhite,titleCoin,colorTitle
    } = styles;
    const {listData} = this.state;
    const {goBack} = this.props.navigation;
    const {avatar,name,address,lang} = this.props.navigation.state.params;
    return (
      <ScrollView>
        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Image source={logoTop} style={imgLogoTop} />
              <View></View>
              </View>
          </View>

          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:15}}>
              <View style={{flexDirection:'row',paddingBottom:15}}>
                  <Image source={{uri:avatar}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                  <View style={{width:width-90}}>
                    <Text numberOfLines={1} style={colorlbl}>{name}</Text>
                    <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${address}`}</Text>
                  </View>
              </View>
            </View>

            <View style={wrapWhite}>
              <View style={{width:width-30}}>
                <Text numberOfLines={1} style={colorTitle}>{`${lang.area_charge}`}</Text>
                {listData.area!==undefined &&listData.area.length>0 && listData.area.map(e=>{
                  return(<Text key={e.id.toString()} style={titleCoin}>{e.name}</Text>)
                })}
              </View>
            </View>

           {listData.static!==undefined && listData.static.length>0 &&
             <View style={wrapWhite}>
               <View style={{height:5}}></View>
               <FlatList
                extraData={this.state}
                data={listData.static}
                //style={{borderColor:'#E0E8ED',borderTopWidth:1,marginTop:5}}
                keyExtractor={(item,index) => index.toString()}
                renderItem={({item,index}) =>(
                  <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{color:'#2F3C51'}}>{item.name}</Text>
                    <Text style={{color:'#5782A4'}}>{item.value}</Text>
                 </View>
                )} />
           </View>}
           <View style={{height:5}}></View>

           <View style={wrapWhite}>
             <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
               <Text numberOfLines={1} style={colorTitle}>{`${lang.total_MM}`}</Text>
               <Text style={titleCoin}>{`${format_number(listData.total)}`}</Text>
             </View>
           </View>

        </View>
        </ScrollView>
    );
  }
}
