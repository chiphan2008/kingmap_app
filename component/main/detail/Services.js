/* @flow */
import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
} from 'react-native';
import global from '../../global';

const {width,height} = Dimensions.get('window');
import checkBlueIC from '../../../src/icon/ic-blue/ic-check-blue.png';
import checkGreenIC from '../../../src/icon/ic-green/ic-check.png';

export default class Services extends Component {
  constructor(props){
    super(props);

  }

  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      colorBlack,wrapService,rowFlex,widthHafl,
      colorTextPP,wrapContentDetail,colorHide,
      FlatList,
    } = styles;
    const {listServices,serviceContent} = this.props;

    return (
      <View style={wrapContentDetail}>
          <View style={wrapService}>
          {listServices.map((e,index) => {
              return (

                <View style={rowFlex} key={e.id_service_item}>
                  <View style={[widthHafl,rowFlex]} >
                    <Image source={`${serviceContent}`.includes(e.id_service_item) ? checkGreenIC : checkBlueIC} style={{width: 20,height: 20,marginRight:5}} />
                    <Text numberOfLines={2} style={`${serviceContent}`.includes(e.id_service_item) ? colorBlack : colorHide}>{e.name}</Text>
                  </View>
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
  rowFlex:{flexDirection:'row',padding:5,paddingRight:10},
  colorContent:{color:'#6587A8',overflow:'hidden',fontSize:15,},
  colorHide:{color:'#adc4d5',overflow:'hidden',fontSize:15,},
  widthHafl:{width:(width-50)/2},
  colorBlack:{color:'#303B50',overflow:'hidden',fontSize:15,},
  colorTextPP :{color:'#B8BBC0'},
  wrapContentDetail:{flexWrap:'wrap',padding:10,backgroundColor:'#fff'},
  wrapService:{
      justifyContent:'space-between',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flex: 1,
    },
});
