/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,TextInput,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import styles from '../styles';
import photoIC from '../../src/icon/ic-create/ic-photo.png';

export default class ListItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list:{},
      id:0,
      name:'',
      price:'',
      currency:'VND',
      imgProd:{},
    }
  }
  uploadImgProd(idGroup,idList){
    ImagePicker.openPicker({
      cropping: false
    }).then(imgProd =>{
      this.setState({imgProd});
      if(this.state.name!=='' && this.state.price !==''){
        this.props.onListSubmit(idGroup,idList,{
          ['name']:this.state.name,
          ['price']:this.state.price,
          ['currency']:this.state.currency,
          ['image']:imgProd,
        });
      }
    }).catch(e=>console.log('e'));
  }
  render(){
    const {listCreate,colorWhite,imgInfo} = styles;
    const {idGroup, idList} = this.props;
    //console.log('idList',idGroup, idList);
    return(
      <View style={listCreate}>
          <View style={{flexDirection:'row'}}>
          <TextInput underlineColorAndroid='transparent'
          placeholder="Tên"
          returnKeyType = {"next"}
          onSubmitEditing={(event) => {  this.refs.Price.focus();  }}
          onChangeText={(text)=>this.setState({name:text})}
          value={this.state.name}
          onBlur={()=>{this.props.onListSubmit(idGroup,idList,{
            ['name']:this.state.name,
            ['price']:this.state.price,
            ['currency']:this.state.currency,
            ['image']:this.state.imgProd,
          }) }}
          style={{width:90,padding:0,marginLeft:15,borderBottomWidth:1,fontSize:16}}
           />

           <TextInput underlineColorAndroid='transparent'
           placeholder="Giá"
           ref='Price'
           onChangeText={(text)=>this.setState({price:text})}
           value={this.state.price}
           onBlur={()=>{this.props.onListSubmit(idGroup,idList,{
             ['name']:this.state.name,
             ['price']:this.state.price,
             ['currency']:this.state.currency,
             ['image']:this.state.imgProd,
           })}}
           returnKeyType = {"done"}
           keyboardType={'numeric'}
           style={{width:90,padding:0,marginLeft:15,borderBottomWidth:1,fontSize:16}}
            />

           <TouchableOpacity style={{width:50,backgroundColor:'#313B50',borderRadius:3,padding:5,marginLeft:7,alignItems:'center',marginRight:7}}
           onPress={()=>{this.setState({currency: this.state.currency==='VND' ? 'USD' : 'VND'});
                       this.props.onListSubmit(idGroup,idList,{
                         ['name']:this.state.name,
                         ['price']:this.state.price,
                         ['currency']:this.state.currency,
                         ['image']:this.state.imgProd,
                       })
                     }}>
           <Text style={colorWhite}>{this.state.currency}</Text>
           </TouchableOpacity>

           <TouchableOpacity
           onPress={()=>this.uploadImgProd(idGroup,idList)}
           style={{alignSelf:'center'}}>
           <Image source={photoIC} style={imgInfo}/>
           </TouchableOpacity>
        </View>
      </View>
    );
  }
}
