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
      listService:[],
      listIDSub: {},
      show_cat:false,
      show_subcat:false,
      id_sub:'',
      id_cat:'',
      labelCat:'',
      labelSubCat:'',
      selectAll: 0
    }
    const {idCat} = this.props;
    this.getCategory(idCat);
  }

  getCategory(idCat=null){
    const {lang} = this.props;
    const url = `${global.url}${`categories?language=${lang.lang}`}${'&limit=100'}`;
    //console.log('url',url);
    let show_cat = idCat==='' ? true : false;
    getApi(url)
    .then(arrCategory => {
        let listSubCat = [];
        let listService = [];
        let labelCat;
        arrCategory.data.forEach((e)=>{
          if(e.id===idCat) {
            listSubCat=listSubCat.concat(e.sub_category);
            listService=listService.concat(e.service_items);
            labelCat=e.name;
          }
        })
        //console.log('labelCat',labelCat);
        this.setState({
          show_cat,
          labelCat,
          listSubCat,
          listService,
          id_cat:idCat,
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
    const { visible,idCat,lang } = this.props;
    const {
      listCategory,listSubCat,listService,show_cat,show_subcat,
      id_cat,id_sub,labelCat,labelSubCat, selectAll, listIDSub } = this.state;

    return (
      <Modal onRequestClose={() => null} transparent visible={visible}>
      <TouchableOpacity
      onPress={()=>this.props.closeModal()}
      style={[popoverLoc,padCreate]}>
      <Image style={[imgUpCreate,imgUpSubCat]} source={upDD} />
          <View style={[overLayout,shadown,show_cat ? show : hide]}>
              <FlatList
                 extraData={this.state}
                 keyExtractor={(item, index) => index.toString()}
                 data={listCategory}
                 renderItem={({item}) => (
                  <View style={listOverService}>
                    <TouchableOpacity
                       onPress={()=>{
                         this.setState({
                           selectAll:0,
                           show_cat:false,show_subcat:true,
                           listSubCat:item.sub_category,
                           listService:item.service_items,
                           id_cat:item.id,
                           labelCat:item.name,
                         },()=>{
                           this.props.saveSubCate(item.id,item.name,[],listService);
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
                       this.setState({show_cat:true,show_subcat:false, listIDSub:[]})
                     }}>
                       <Text style={txtNextItem}>{lang.select_another_category}</Text>
                       <Image style={{width:14,height:14}} source={arrowNextIC}/>
                   </TouchableOpacity>
               </View>
              <FlatList
                 extraData={this.state}
                 keyExtractor={(item, index) => index.toString()}
                 data={listSubCat}
                 renderItem={({item}) => (
                  <View style={listOverService}>
                    <TouchableOpacity
                       onPress={()=>{
                        if(this.state.listIDSub[`${item.id}`]===item.id){
                          this.state.selectAll -=1;
                          this.state.listIDSub=Object.assign(this.state.listIDSub,{[item.id]:!item.id,[`${'name'}-${item.id}`]:!item.name})
                        }else {
                          this.state.selectAll +=1;
                          this.state.listIDSub=Object.assign(this.state.listIDSub,{[item.id]:item.id,[`${'name'}-${item.id}`]:item.name})
                        }
                        this.state.id_sub=item.id;
                         this.setState(this.state,()=>{
                           this.props.saveSubCate(id_cat,labelCat,Object.entries(listIDSub),listService);
                         })
                      }}
                      style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
                      >
                         <Text style={colorText}>{item.name}</Text>
                         <Image style={[imgInfo, listIDSub[`${item.id}`]===item.id ? show :hide ]} source={checkIC}/>
                     </TouchableOpacity>
                 </View>
              )} />

              <View style={listOverService}>
                  <TouchableOpacity style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
                     onPress={()=>{
                       this.state.selectAll!==0 && this.setState({selectAll:0,listIDSub:{}},()=>{
                         this.props.saveSubCate(id_cat,labelCat,[],listService);
                       })
                     }}>
                       <Text style={colorText}>{lang.all}</Text>
                       <Image style={[imgInfo, selectAll===0 ? show :hide ]} source={checkIC}/>
                   </TouchableOpacity>
               </View>

          </View>

      </TouchableOpacity>
      </Modal>
    );
  }
}
