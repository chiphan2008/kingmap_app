/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
} from 'react-native';
import global from '../../global';

const {width,height} = Dimensions.get('window');
import checkBlueIC from '../../../src/icon/ic-blue/ic-check.png';
import checkGreenIC from '../../../src/icon/ic-green/ic-check.png';

export default class Services extends Component {
  constructor(props){
    super(props);

  }

  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      colorBlack,wrapService,rowFlex,widthHafl,
      colorTextPP,wrapContentDetail,colorContent,
    } = styles;
    const {listServices,serviceContent} = this.props;

    return (
      <View style={wrapContentDetail}>
          <View style={wrapService}>
          {listServices.map((e,index) => {
              return (
                  <View style={[rowFlex,widthHafl]} key={e.id_service_item}>
                    <Image source={`${serviceContent}`.includes(e.id_service_item) ? checkGreenIC : checkBlueIC} style={{width: 20,height: 20,marginRight:10}} />
                    <Text numberOfLines={2} style={`${serviceContent}`.includes(e.id_service_item) ? colorBlack : colorContent}>{e.name}</Text>
                  </View>
              )
            })
          }
          </View>
          <View style={rowFlex}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowFlex:{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},
  colorContent:{color:'#6587A8',overflow:'hidden',fontSize:15,},
  widthHafl:{width:(width-40)/2,overflow:'hidden'},
  colorBlack:{color:'#303B50',overflow:'hidden',fontSize:15,},
  colorTextPP :{color:'#B8BBC0'},
  wrapContentDetail:{flexWrap:'wrap',padding:10,backgroundColor:'#fff'},
  wrapService:{
    flexDirection: 'row',
      flexWrap: 'wrap',
      flex: 1,
    },
});
