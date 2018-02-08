/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,TextInput,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles';
import ListItems from './ListItems';
import nameProductIC from '../../src/icon/ic-create/ic-name-product.png';

export default class GroupProduct extends Component {
    constructor(props) {
      super(props)
      this.state={
        txtNameProduct:'',
        addItemProduct:[<ListItems idGroup={this.props.indexGroup} key={0} />],
        index_item:1,
        txtVal:{},
        product:[],
      }
    }
    insertItem(){
      this.state.addItemProduct.push(<ListItems idGroup={this.props.indexGroup} key={this.state.index_item} />)
      this.setState({
          index_item: this.state.index_item + 1,
          addItemProduct: this.state.addItemProduct
      })
    }
    render(){
      const { listCreate,widthLblCre,imgInfo,wrapInputCreImg,colorWhite } =styles;
      const { indexGroup } =this.props;
      //console.log('this.state.product',this.state.product);
      //console.log("product",this.state.product);
      return (
        <View>
          <View style={listCreate}>
              <View style={widthLblCre}>
              <Image source={nameProductIC} style={imgInfo} />
              </View>
              <TextInput underlineColorAndroid='transparent'
              onBlur={()=>{
                //console.log('this.state.onBlur',this.state.txtVal)
                this.props.submitProduct(indexGroup,{[indexGroup]:this.state.txtVal});
               }}
              onChangeText={(text) => this.setState({txtVal:{['idGroup']:indexGroup,['group_name']:text} })}
              placeholder={`${"Tên nhóm"}`} style={wrapInputCreImg}
              />

              <TouchableOpacity style={{width:15}}
              onPress={()=>this.props.removeGroup(this.props.indexGroup)}>
                <Text style={{fontWeight:'bold',fontSize:18,transform:[{ rotate: '45deg'}]}}>+</Text>
              </TouchableOpacity>
          </View>

          <View>

          {this.state.addItemProduct}
          </View>
          <View style={{height:10}}></View>
          <TouchableOpacity style={{alignItems:'center',alignSelf:'center',width:115}}
          onPress={()=>this.insertItem()}>
              <Text style={{fontWeight:'bold',fontSize:18,color:'#d0021b'}}>+ Thêm mục</Text>
          </TouchableOpacity>

          <View style={{height:10}}></View>

        </View>
      );
    }
  }
