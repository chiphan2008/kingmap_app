/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,
  ScrollView,Modal,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import {Select, Option} from "react-native-chooser";

//import styles from '../styles';
import global from '../global';

import searchIC from '../../src/icon/ic-gray/ic-search.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import dollarIC from '../../src/icon/ic-dollar.png';


export default class RequestTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCode:false,
      choose_loc:global.choose_loc,
    }
  }


  render() {
    const { lang,title,code_user } = this.props.navigation.state.params;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      headLocationStyle, inputSearch,wrapWhite,marTop,titleKcoin,
      selectBox,selectBoxCity,optionListStyle,optionListStyleCity,
      imgInfo,colorTitle,wrapContent,wrapInput,btnTransfer,
      popoverLoc,overLayout,txtInput,txtAlign,btnFinish,titleVer,
    } = styles;

    return (
      <View style={container}>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${title}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>
      <ScrollView >
        <View style={contentWrap}>

            <View style={[wrapContent]}>
            <View style={marTop}>
            <Text style={colorTitle}>Nhập số tiền</Text>
              <TextInput underlineColorAndroid='transparent'
              returnKeyType = {"next"}
              autoFocus = {true}
              onSubmitEditing={(event) => {  this.refs.name.focus();  }}
              placeholder={''} style={wrapInput}
              onChangeText={(txtName) => this.setState({txtName})}
              />
            </View>

            <View style={marTop}>
              <Text style={{color:'#6587A8',fontSize:16}}>{`${'tài khoản nhận tiền'}`.toUpperCase()}</Text>
              <Text style={colorTitle}>Họ và tên</Text>
              <TextInput underlineColorAndroid='transparent'
              returnKeyType = {"next"}
              ref='name'
              onSubmitEditing={(event) => {  this.refs.bank.focus();  }}
              placeholder={''} style={wrapInput}
              onChangeText={(txtName) => this.setState({txtName})}
              />
            </View>

            <View style={marTop}>
              <Text style={colorTitle}>Tên ngân hàng</Text>
              <TextInput underlineColorAndroid='transparent'
              returnKeyType = {"next"}
              ref='bank'
              onSubmitEditing={(event) => {  this.refs.branch.focus();  }}
              placeholder={''} style={wrapInput}
              onChangeText={(txtName) => this.setState({txtName})}
              />
            </View>
            <View style={marTop}>
              <Text style={colorTitle}>Chi nhánh</Text>
              <TextInput underlineColorAndroid='transparent'
              returnKeyType = {"next"}
              ref='branch'
              onSubmitEditing={(event) => {  this.refs.stk.focus();  }}
              placeholder={''} style={wrapInput}
              onChangeText={(txtName) => this.setState({txtName})}
              />
            </View>
            <View style={marTop}>
              <Text style={colorTitle}>Số tài khoản</Text>
              <TextInput underlineColorAndroid='transparent'
              returnKeyType = {"done"}
              ref='stk'
              placeholder={''} style={wrapInput}
              onChangeText={(txtName) => this.setState({txtName})}
              />
            </View>

            <View style={marTop}></View>
            <TouchableOpacity onPress={()=>this.setState({showCode:true})} style={[marTop,btnTransfer]}>
              <Text style={titleCreate}>{`${'Rút tiền'}`.toUpperCase()}</Text>
            </TouchableOpacity>
            <View style={{height:60}}></View>
          </View>
        </View>
        </ScrollView >

        <Modal onRequestClose={() => null} transparent visible={this.state.showCode}>
        <View style={popoverLoc}>
            <View style={overLayout}>
              <Text style={titleVer}>{`${'Xác nhận rút tiền'}`.toUpperCase()}</Text>
              <View style={{flexDirection:'row',marginTop:10}}>
                <TextInput underlineColorAndroid='transparent' keyboardType={'numeric'} autoFocus onSubmitEditing={(event) => {this.refs.One.focus();}} style={txtInput} returnKeyType={"next"} maxLength = {1}  selectionColor='#5b89ab' placeholderTextColor="#ddd" />
                <TextInput underlineColorAndroid='transparent' keyboardType={'numeric'} ref='One' onSubmitEditing={(event) => {this.refs.Two.focus();}} style={txtInput} returnKeyType={"next"} maxLength = {1}  selectionColor='#5b89ab' placeholderTextColor="#ddd" />
                <TextInput underlineColorAndroid='transparent' keyboardType={'numeric'} ref='Two' onSubmitEditing={(event) => {this.refs.Three.focus();}} style={txtInput} returnKeyType={"next"} maxLength = {1}  selectionColor='#5b89ab' placeholderTextColor="#ddd" />
                <TextInput underlineColorAndroid='transparent' keyboardType={'numeric'} ref='Three'                                         style={txtInput} returnKeyType={"done"} maxLength = {1}  selectionColor='#5b89ab' placeholderTextColor="#ddd" />
              </View>
              <Text style={[marTop,txtAlign]}>Mã xác nhận sẽ được gửi vào số <Text style={{fontWeight:'bold',fontSize:16}}>0906880119</Text>{code_user} {"\n"} Vui lòng kiểm tra và xác nhận.</Text>
              <TouchableOpacity style={[btnTransfer,btnFinish,marTop]}>
                <Text style={{color:'#fff',fontWeight:'bold',fontSize:16}}>{`${'Xác nhận'}`.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
            {/*onPress={()=>this.setState({ showCode:false }) }*/}
        </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,

  },
  titleVer : {
    fontSize: 22,
    marginTop: 10,
    color:'#1E1F29',
  },
  txtInput:{
    borderColor : "#6587A8",
    padding:0,
    borderRadius : 5,
    width: 50,
    height: 50,
    borderWidth: 1,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    textAlign: 'center',
    marginRight:5,
  },
  txtAlign:{textAlign:'center',color:'#6587A8'},
  btnFinish:{width:width/3},
  btnTransfer:{alignItems:'center',justifyContent:'center',backgroundColor:'#d0021b',padding:10,borderRadius:5},
  wrapContent: {
    width:width-30,
  },
  popoverLoc : {
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:8,
  },
  overLayout:{
    backgroundColor:'#fff',width:width-30,borderRadius:5,padding:15,alignItems:'center'
  },
  wrapInput:{
    backgroundColor:'#fff',borderColor:'#E1E7EC',borderWidth:1,borderRadius:5,marginTop:8,
    padding:Platform.OS==='ios' ? 15 : 10 },
  marTop:{marginTop:20},
  wrapWhite:{
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems:'center',
    padding:15,
    marginBottom:1,
    width
  },

  colorTitle:{color:'#2F353F'},
  imgInfo:{width:32,height:32,marginRight:10},
  contentWrap : { width,height,alignItems: 'center',justifyContent: 'flex-start',marginBottom:height/4,},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },
  selectBox : {
    borderRadius : 5,
    borderWidth : 1,
    borderColor : "#e0e8ed",
    width: width - 38,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    //alignSelf: 'stretch',
  },
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  titleKcoin:{color:'white',fontSize:24,fontWeight:'bold',paddingTop:5},
  selectBoxCity : {
    marginBottom: 0,
  },
  OptionItem : {
    borderBottomColor: '#e0e8ed',
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  optionListStyle : {
    borderRadius : 5,
    width: width - 38,
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
    top: Platform.OS === 'ios' ? -97 : -176,
  },

  headLocationStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 25 : 10, alignItems: 'center',height: 75,
      position:'relative',zIndex:5,
  },
  inputSearch : {
    marginTop: 3,width:width-40,backgroundColor:'#fff',borderRadius:5,padding:10,paddingRight:70,
  },
})
