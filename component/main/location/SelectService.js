/* @flow */
import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,
  FlatList,Modal,Image,
} from 'react-native';
import styles from '../../styles';
//import global from '../../global';
//import getApi from '../../api/getApi';
import upDD from '../../../src/icon/ic-white/ic-dropdown_up.png';
import checkIC from '../../../src/icon/ic-green/ic-check.png';
//import {remove} from '../../libs';

export default class SelectService extends Component {
  constructor(props){
    super(props);
    this.state = {
      showService:{},
      selectAll: false
    }
  }


  render() {
    const {
      popoverLoc,padCreate,imgUpCreate,imgUpInfo,
      overLayout,shadown,listOverService,
      colorText,txtNextItem,imgInfo,show,hide
    } = styles;
    const { visible,data, lang } = this.props;
    const { showService, selectAll } = this.state;
    return (
      data.length>0 &&
      <Modal onRequestClose={() => null} transparent visible={visible}>
      <TouchableOpacity onPress={()=>this.props.closeModal()} style={[popoverLoc,padCreate]}>
      <Image style={[imgUpCreate,imgUpInfo]} source={upDD} />
          <View style={[overLayout,shadown]}>
          <View style={listOverService}>
              <TouchableOpacity  style={{padding:15}}
                 onPress={()=>{

                   if(selectAll){
                    this.setState({showService:[], selectAll: false},()=>{
                      this.props.saveService([]);
                     //  this.props.closeModal();
                    })
                   } else {
                    let newArr = {};
                    data.forEach((item) => {
                      newArr = Object.assign(newArr,{[item.id]:item.id,[`${'name'}-${item.id}`]:item.name})
                    })
                     this.setState({showService: newArr , selectAll: true},()=>{
                       this.props.saveService(Object.entries(newArr));
                      //  this.props.closeModal();
                     })
                   }

                 }}>
                   <Text style={colorText}>{lang.all}</Text>
               </TouchableOpacity>
           </View>

          <FlatList
             extraData={this.state}
             keyExtractor={(item, index) => index.toString()}
             data={data}
             renderItem={({item}) => (
            <View style={listOverService}>
            <TouchableOpacity
               onPress={()=>{
                 if(showService[`${item.id}`]===item.id){
                     this.setState({
                         showService:Object.assign(showService,{[item.id]:!item.id,[`${'name'}-${item.id}`]:!item.name})
                     })
                 }else {
                   this.setState({
                       showService:Object.assign(showService,{[item.id]:item.id,[`${'name'}-${item.id}`]:item.name})
                   })
                 }
                 this.props.saveService(Object.entries(showService));
                }}
                style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
              >
                 <Text style={colorText}>{item.name}</Text>
                 <Image style={[imgInfo, showService[`${item.id}`]===item.id  ? show : hide]} source={checkIC}/>

             </TouchableOpacity>
             </View>
          )} />


          </View>
      </TouchableOpacity>
      </Modal>
    );
  }
}
