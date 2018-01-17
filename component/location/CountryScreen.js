/* @flow */

import React, { Component } from 'react';
import { View, Text, Image, Button, StyleSheet, Dimensions } from 'react-native';
import {Select, Option} from "react-native-chooser";
import LogoHome from '../../src/icon/ic-home/Logo-home.png';
const {height, width} = Dimensions.get('window');

export default class CountryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueCountry : "Vietname",
    }
  }
  onSelectCountry(value, label) {
    this.setState({
      valueCountry : value
    });
  }

  render() {
    const {
      container, imgLogo, title,
      selectBoxCountry, selectBoxCity, OptionItem, optionListStyle,
      btnSkip, btnNext, btnWrap
    } = styles;
    return (
      <View style={container}>
        <Image style={imgLogo} source={LogoLarge} />
        <Text style={title}>COUNTRY/ CITY</Text>
        <Select
              onSelect = {this.onSelectCountry.bind(this)}
              defaultText  = {this.state.valueCountry}
              style = {selectBoxCountry}
              textStyle = {{color:'#5b89ab'}}
              optionListStyle={optionListStyle}
              transparent
              indicatorColor="#5b89ab"
              indicator="down"
              indicatorSize={7}
            >
            <Option style={OptionItem} value = {{name : "azhar"}}>Azhar</Option>
            <Option style={OptionItem} value = "johnceena">Johnceena</Option>
            <Option style={OptionItem} value = "undertaker">Undertaker</Option>
            <Option style={OptionItem} value = "Daniel">Daniel</Option>
            <Option style={OptionItem} value = "Roman">Roman</Option>
            <Option style={OptionItem} value = "Stonecold">Stonecold</Option>
            <Option style={OptionItem} value = "Rock">Rock</Option>
            <Option style={OptionItem} value = "Sheild">Sheild</Option>
            <Option style={OptionItem} value = "Orton">Orton</Option>
        </Select>

        <View style={btnWrap}>
          <Text style={btnSkip} >Skip</Text>
          <Text style={btnNext} >Next</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgLogo : {
    width : 60,
    height : 60,
    marginBottom: 15,
  },
  title : {
    fontSize: 22,
    marginBottom: 20,
  },
  selectBoxCountry : {
    borderRadius : 5,
    borderWidth : 1,
    borderColor : "#e0e8ed",
    width: width - 50,
    marginBottom: 50,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
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
    height: 200,
    top: 132,
    borderColor : "#fff",
    marginTop:20,
    backgroundColor: '#fff',
    shadowOffset:{  width: 2,  height: 2,  },
    shadowColor: '#ddd',
    shadowOpacity: .5,
  },
  btnWrap : {
    flexDirection: 'row',
    width: width - 50,
    justifyContent: 'space-between',
  },
  btnSkip : {
    padding:10,
    color: '#D0021B',
    borderWidth: 1,
    borderColor : "#D0021B",
    borderRadius : 5,
    width : (width - 80)/2,
    textAlign: 'center',
  },
  btnNext : {
    padding:10,
    color: '#fff',
    borderWidth: 1,
    borderColor : "#fff",
    backgroundColor: '#D0021B',
    borderRadius : 5,
    overflow: 'hidden',
    width : (width - 80)/2,
    textAlign: 'center',
  },
});
