/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,
  FlatList,Modal,Image,
} from 'react-native';
import styles from '../../styles';
import global from '../../global';
import getApi from '../../api/getApi';
import upDD from '../../../src/icon/ic-white/ic-dropdown_up.png';
import checkIC from '../../../src/icon/ic-green/ic-check.png';
import arrowNextIC from '../../../src/icon/ic-arrow-next.png';

export default class SelectCategory extends Component {
  constructor(props){
    super(props);
    this.state = {
      listCategory:[],
      listSubCat:[],
      show_cat:false,
      show_subcat:false,
    }
    const {idCat} = this.props;
    this.getCategory(idCat);
  }

  getCategory(idCat=null){
    const url = `${global.url}${'categories?language=vn'}${'&limit=100'}`;
    //console.log('url',url);
    let show_cat = idCat==='' ? true : false;
    getApi(url)
    .then(arrCategory => {
        let listSubCat = [];
        arrCategory.data.forEach((e)=>{
          if(e.id===idCat) {listSubCat = e.sub_category;}
        })
        this.setState({
          show_cat,listSubCat,
          show_subcat: !show_cat,
          listCategory: arrCategory.data
        });
    })
    .catch(err => console.log(err));
  }

  render() {
    const {
      popoverLoc,padCreate,imgUpCreate,imgUpSubCat,
      overLayout,shadown,listOverService,
      colorText,txtNextItem,imgInfo,show,hide
    } = styles;
    const { visible,idCat } = this.props;
    const { listCategory,listSubCat,show_cat,show_subcat } = this.state;

    return (
      <Modal onRequestClose={() => null} transparent visible={visible}>
      <TouchableOpacity
      onPress={()=>this.props.closeModal()}
      style={[popoverLoc,padCreate]}>
      <Image style={[imgUpCreate,imgUpSubCat]} source={upDD} />

          <View style={[overLayout,shadown,show_cat ? show : hide]}>

              <FlatList
                 extraData={this.state}
                 keyExtractor={(item, index) => index}
                 data={listCategory}
                 renderItem={({item}) => (
                  <View style={listOverService}>
                    <TouchableOpacity
                       onPress={()=>{
                         this.setState({
                           show_cat:false,
                           show_subcat:true,
                           listSubCat:item.sub_category
                         });
                        }}
                      style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
                      >
                         <Text style={colorText}>{item.name}</Text>
                         <Image style={{width:14,height:14}} source={arrowNextIC}/>
                     </TouchableOpacity>
                 </View>
              )} />
          </View>

          <View style={[overLayout,shadown,show_subcat ? show : hide]}>
              <View style={listOverService}>
                  <TouchableOpacity style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
                     onPress={()=>{
                       this.setState({show_cat:true,show_subcat:false})
                     }}>
                       <Text style={txtNextItem}>Chọn danh mục khác</Text>
                       <Image style={{width:14,height:14}} source={arrowNextIC}/>
                   </TouchableOpacity>
               </View>
              <FlatList
                 extraData={this.state}
                 keyExtractor={(item, index) => index}
                 data={listSubCat}
                 renderItem={({item}) => (
                  <View style={listOverService}>
                    <TouchableOpacity
                       onPress={()=>{

                      }}
                      style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
                      >
                         <Text style={colorText}>{item.name}</Text>
                         {/*<Image style={imgInfo} source={checkIC}/>*/}
                     </TouchableOpacity>
                 </View>
              )} />
          </View>

      </TouchableOpacity>
      </Modal>
    );
  }
}
