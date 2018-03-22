/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import getApi from '../api/getApi';
import global from '../global';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData:[],
    };
    this.getData();
  }
  getData(){
    const url = `${global.url_node}${'person'}`;
    getApi(url).then(e=>{
      this.setState({listData:e.person})
    })
  }

  render() {
    const { lang,name_module } = this.props.navigation.state.params;
    const { navigation } = this.props;
    const { listData } = this.state;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapItems,colorName,
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${name_module}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>

        <View style={contentWrap}>
        {listData.length>0 ?
          <View>

          <FlatList
             extraData={this.state}
             keyExtractor={(item, index) => index}
             data={listData}
             renderItem={({item}) => (

               <TouchableOpacity style={wrapItems}>
                 <Image source={{uri:`${global.url_media}/${item.urlhinh}`}} style={{width:50,height:50,borderRadius:25,marginRight:7}} />
                 <Text style={colorName}>{item.name}</Text>
               </TouchableOpacity>
          )} />
          </View>

          :
          <View></View>
        }

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,

  },
  contentWrap : { width,height:height-155,alignItems: 'center',justifyContent: 'center'},
  wrapItems:{flexDirection:'row',width,alignItems:'center',padding:15,backgroundColor:'#fff',marginBottom:1},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  colorName:{color:'#2F3540',fontSize:16}
})
