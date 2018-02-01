/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,ScrollView,Modal,FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import getLanguage from '../api/getLanguage';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import cameraIC from '../../src/icon/ic-camera.png';
import checkIC from '../../src/icon/ic-green/ic-check.png';

export default class FormCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSubCat:false,
      checkSubCat:{},
      showService:false,
      checkService:{},
    }
  }



  render() {
    const {navigate, goBack} = this.props.navigation;
    const { idCat, sub_cat, serv_items, lang } = this.props.navigation.state.params;
    const {
      container,
      headCatStyle,headContent, wrapDistribute,shadown,wrapFilter,
      show,hide,colorlbl,listAdd,
      listCreate,titleCreate,imgCamera,
      imgShare,wrapInputCre,wrapInputCreImg,wrapCreImg,widthLblCre,
    } = styles;

    return (
      <View style={container}>
      <ScrollView>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:20, height:20,marginTop:5}} />
              </TouchableOpacity>
              <Text style={titleCreate}> TẠO ĐỊA ĐIỂM </Text>
              <TouchableOpacity>
                <Text style={titleCreate}>Done</Text>
              </TouchableOpacity>
          </View>
      </View>

    <View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Tên</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCre} />
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Phân loại</Text>
          </View>
          <View style={wrapInputCreImg}></View>
          <TouchableOpacity onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Địa chỉ</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCre} />
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Email</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          placeholder="------" style={wrapInputCre} />
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Thời gian</Text>
          </View>
          <View style={wrapInputCreImg}></View>
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Giá cả</Text>
          </View>
          <View style={wrapInputCreImg}></View>
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={{height:15}}></View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Hình ảnh</Text>
          </View>
          <View style={wrapCreImg}></View>
          <TouchableOpacity style={imgCamera}>
          <Image source={cameraIC} style={imgShare}/>
          </TouchableOpacity>
        </View>
        <View style={{height:15}}></View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Tiện nghi</Text>
          </View>
          <View style={wrapInputCreImg}></View>
          <TouchableOpacity onPress={()=>this.setState({showService:!this.state.showService})}>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Chi nhánh</Text>
          </View>
          <View style={wrapInputCreImg}></View>
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>

      </View>
      </ScrollView>
        <Modal
        onRequestClose={() => null}
        transparent
        animationType={'slide'}
        visible={this.state.showSubCat}
        >
          <View style={container}>

            <View style={headCatStyle}>
                <View style={headContent}>
                    <TouchableOpacity onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
                    <Image source={arrowLeft} style={{width:20, height:20,marginTop:5}} />
                    </TouchableOpacity>
                    <Text style={titleCreate}> Phân loại </Text>
                    <View></View>
                </View>
            </View>

            <View style={{flexDirection:'row',padding:15}}>
            <TextInput underlineColorAndroid='transparent'
            placeholder="Thêm phân loại" style={{borderColor:'#DFE7ED',borderWidth:1,borderRadius:3,marginRight:10,padding:5,width:width-100,backgroundColor:'#fff'}} />
            <TouchableOpacity style={{backgroundColor:'#D0021B',borderRadius:3,padding:8,paddingLeft:18,paddingRight:18}}>
            <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>+</Text>
            </TouchableOpacity>
            </View>

            <FlatList
                extraData={this.state}
               data={sub_cat}
               renderItem={({item}) =>(
                 <TouchableOpacity onPress={()=>{
                   if(this.state.checkSubCat[`${item.id}`]!==item.id){
                     this.setState({checkSubCat:Object.assign(this.state.checkSubCat,{[item.id]:item.id})})
                   }else{
                     this.setState({checkSubCat:Object.assign(this.state.checkSubCat,{[item.id]:!item.id})})
                   }

                 } }
                 style={listAdd}>
                   <Text style={colorlbl}>{item.name}</Text>
                   <Image source={checkIC} style={[imgShare,this.state.checkSubCat[`${item.id}`]===item.id ? show : hide]} />
                 </TouchableOpacity>
               )}
               keyExtractor={item => item.id}
             />
             <View style={{height:5}}></View>
          </View>
          </Modal>

          <Modal
          onRequestClose={() => null}
          transparent
          animationType={'slide'}
          visible={this.state.showService}
          >
            <View style={container}>

              <View style={headCatStyle}>
                  <View style={headContent}>
                      <TouchableOpacity onPress={()=>this.setState({showService:!this.state.showService})}>
                      <Image source={arrowLeft} style={{width:20, height:20,marginTop:5}} />
                      </TouchableOpacity>
                      <Text style={titleCreate}> TIỆN ÍCH </Text>
                      <View></View>
                  </View>
              </View>

              <View style={{flexDirection:'row',padding:15}}>
              <TextInput underlineColorAndroid='transparent'
              placeholder="Thêm tiện ích" style={{borderColor:'#DFE7ED',borderWidth:1,borderRadius:3,marginRight:10,padding:5,width:width-100,backgroundColor:'#fff'}} />
              <TouchableOpacity style={{backgroundColor:'#D0021B',borderRadius:3,padding:8,paddingLeft:18,paddingRight:18}}>
              <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>+</Text>
              </TouchableOpacity>
              </View>

              <FlatList
                  extraData={this.state}
                 data={serv_items}
                 renderItem={({item}) =>(
                   <TouchableOpacity onPress={()=>{
                     if(this.state.checkService[`${item.id}`]!==item.id){
                       this.setState({checkService:Object.assign(this.state.checkService,{[item.id]:item.id})})
                     }else{
                       this.setState({checkService:Object.assign(this.state.checkService,{[item.id]:!item.id})})
                     }

                   } }
                   style={listAdd}>
                     <Text style={colorlbl}>{item.name}</Text>
                     <Image source={checkIC} style={[imgShare,this.state.checkService[`${item.id}`]===item.id ? show : hide]} />
                   </TouchableOpacity>
                 )}
                 keyExtractor={item => item.id}
               />
               <View style={{height:5}}></View>
            </View>
            </Modal>

      </View>
    );
  }
}
