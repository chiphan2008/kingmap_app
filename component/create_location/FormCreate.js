/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,ScrollView,Modal,FlatList,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import getLanguage from '../api/getLanguage';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import cameraIC from '../../src/icon/ic-camera.png';
import checkIC from '../../src/icon/ic-green/ic-check.png';
import closeIC from '../../src/icon/ic-home/ic-close.png';

export default class FormCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSubCat:false,
      checkSubCat:{},
      showService:false,
      checkService:{},

      txtName:'',
      txtPhone:'',
      txtEmail:'',
      txtAddress:'',

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
      imgShare,wrapInputCreImg,wrapCreImg,widthLblCre,
    } = styles;

    return (
      <View style={container}>
      <ScrollView>
      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
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
          placeholder="- - - - - -" style={wrapInputCreImg}
          onChangeText={(txtName) => this.setState({txtName})}
          value={this.state.txtName}
           />

          <TouchableOpacity style={this.state.txtName!=='' ? show : hide} onPress={()=>{this.setState({txtName:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={listCreate}
        onPress={()=>this.setState({showSubCat:!this.state.showSubCat})}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Phân loại</Text>
          </View>
          <View style={wrapInputCreImg}></View>
          <Image source={arrowNextIC} style={imgShare}/>
        </TouchableOpacity>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Điện thoại</Text>
          </View>
          <TextInput keyboardType={'phone-pad'} underlineColorAndroid='transparent'
          onChangeText={(txtPhone) => this.setState({txtPhone})}
          value={this.state.txtPhone}
          placeholder="- - - - - -" style={wrapInputCreImg} />

          <TouchableOpacity style={this.state.txtPhone!=='' ? show : hide} onPress={()=>{this.setState({txtPhone:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>

        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Email </Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          keyboardType={'email-address'}
          onChangeText={(txtEmail) => this.setState({txtEmail})}
          value={this.state.txtEmail}
          placeholder="- - - - - -" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtEmail!=='' ? show : hide} onPress={()=>{this.setState({txtEmail:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
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
          <Text style={colorlbl}>Quốc gia </Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          onChangeText={(txtAddress) => this.setState({txtAddress})}
          value={this.state.txtAddress}
          placeholder="- - - - - -" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtAddress!=='' ? show : hide} onPress={()=>{this.setState({txtAddress:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Tỉnh/TP</Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          onChangeText={(txtAddress) => this.setState({txtAddress})}
          value={this.state.txtAddress}
          placeholder="- - - - - -" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtAddress!=='' ? show : hide} onPress={()=>{this.setState({txtAddress:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Quận/Huyện </Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          onChangeText={(txtAddress) => this.setState({txtAddress})}
          value={this.state.txtAddress}
          placeholder="- - - - - -" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtAddress!=='' ? show : hide} onPress={()=>{this.setState({txtAddress:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Địa chỉ </Text>
          </View>
          <TextInput underlineColorAndroid='transparent'
          onChangeText={(txtAddress) => this.setState({txtAddress})}
          value={this.state.txtAddress}
          placeholder="- - - - - -" style={wrapInputCreImg} />
          <TouchableOpacity style={this.state.txtAddress!=='' ? show : hide} onPress={()=>{this.setState({txtAddress:''})}}>
          <Image source={closeIC} style={imgShare} />
          </TouchableOpacity>
        </View>


        <View style={{height:15}}></View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Ảnh đại diện</Text>
          </View>
          <View style={wrapCreImg}></View>
          <TouchableOpacity style={imgCamera}>
          <Image source={cameraIC} style={imgShare}/>
          </TouchableOpacity>
        </View>
        <View style={listCreate}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Thêm hình</Text>
          </View>
          <View style={wrapInputCreImg}></View>
          <TouchableOpacity>
          <Image source={arrowNextIC} style={imgShare}/>
          </TouchableOpacity>
        </View>
        <View style={{height:15}}></View>

        <TouchableOpacity style={listCreate} onPress={()=>this.setState({showService:!this.state.showService})}>
          <View style={widthLblCre}>
          <Text style={colorlbl}>Tiện nghi</Text>
          </View>
          <View style={wrapInputCreImg}></View>
          <Image source={arrowNextIC} style={imgShare}/>
        </TouchableOpacity>

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
                    <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
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
                      <Image source={arrowLeft} style={{width:16, height:16,marginTop:5}} />
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
