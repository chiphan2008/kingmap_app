/* @flow */

import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity,Dimensions,TextInput,Modal,StyleSheet,Image,
  AsyncStorage,FlatList,
} from 'react-native';
import global from '../../global';
import getApi from '../../api/getApi';
import postApi from '../../api/postApi';
import uncheckIC from '../../../src/icon/ic-uncheck.png';
import checkIC from '../../../src/icon/ic-check.png';
const {width,height} = Dimensions.get('window');

const checkContent = async (idContent,arr) => {
  let arr1=[];
  if(arr.length===0) return false;
  arr.forEach(async (item) => {
     await arr1.push(item.id);
  });
  rs = arr1.includes(idContent);
  return rs;
};
export default class Collection extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:'',
      has_collection:false,
      listColl:[],
      checkList:{},
    }
    //this.getData();
  }
  getData(){
    const {userId} = this.props;
    const url =`${global.url}${'collection/get/user/'}${userId}`;
    //console.log(url);this.props.hasCollection(checkList);
    getApi(url).then(e=>{
      //console.log(e.data.length);
      this.setState({listColl:e.data})
    });
  }
  createColl(){
    const {userId} = this.props;
    const {name} = this.state;
    if(name.trim()!==''){
      const arr = new FormData();
      arr.append('user_id',userId);
      arr.append('name',name);
      postApi(`${global.url}${'collection/create'}`,arr).then((e)=>{
        if(e.code===200){
          this.getData(); this.setState({name:''});
        }
      });
    }
    //
  }

  addRemoveColl(route,collection_id){
    const {idContent} = this.props;
    const arr = new FormData();
    //const route = this.state.isExists ? 'remove' : 'add';
    arr.append('content_id',idContent);
    arr.append('collection_id',collection_id);
    postApi(`${global.url}${'collection/'}${route}`,arr).then((e)=>{
      if(e.code===200){
        this.getData();
      }
    });
  }
  componentWillMount(){
    this.getData();
    //console.log('aaa');
  }
  render() {
    const {
      saveContentStyle, show, hide,
      txtInput,marBot,colorTitle,colorBlack,btnAdd,
      wrapItem,
     } = styles;
    const { name,listColl,checkList,has_collection } = this.state;
    const { visible,userId,idContent } = this.props;
    return (
      <Modal onRequestClose={() => null} transparent visible={visible}>
      <TouchableOpacity onLayout={()=>this.getData()} onPress={()=>this.props.closeModal(has_collection)}
      style={[saveContentStyle, visible ? show : hide]}>
        <View style={{width:width-100,borderRadius:3,backgroundColor:'#fff',padding:15,marginBottom:7}}>
          <Text style={[colorTitle,marBot]}>{`${'Tạo mới'}`.toUpperCase()}</Text>

          <View style={{flexDirection:'row',marginBottom:10,justifyContent:'space-between'}}>
            <TextInput underlineColorAndroid={'transparent'} style={txtInput}
            value={name} onChangeText={(name)=>this.setState({name})}
            />
            <TouchableOpacity style={btnAdd}
            onPress={()=>{this.createColl()}}>
            <Text style={{color:'#fff',fontSize:20,fontWeight:'bold'}}>+</Text>
            </TouchableOpacity>
          </View>
          {listColl.length>0 ?
            <View style={{maxHeight:height/3}}>
            <Text style={[colorTitle,marBot]}>{`${'Thêm vào bộ sưu tập'}`.toUpperCase()}</Text>

            <FlatList
               keyExtractor={(item,index) => index.toString()}
               data={listColl}
               renderItem={({item}) => (
                 <TouchableOpacity style={[wrapItem,marBot]}
                 onLayout={()=>{
                   checkContent(idContent,item._contents).then(el=>{
                     this.setState({checkList: Object.assign(checkList,{[item.id]:el}),has_collection:el });
                   });
                 }}
                 onPress={()=>{
                   checkContent(idContent,item._contents).then(el=>{
                     this.setState({checkList: Object.assign(checkList,{[item.id]:!el}),has_collection:!el });
                     if(el){
                       this.addRemoveColl('remove',item.id)
                     }else {
                       this.addRemoveColl('add',item.id)
                     }
                   });
                 }}>
                   <Image source={checkList[item.id] ? checkIC : uncheckIC} style={{width:18,height:18,marginRight:7}} />
                   <Text style={colorBlack}>{item.name} - ({item._contents.length})</Text>
                 </TouchableOpacity>
            )} />

            </View>
          :
            <View></View>
          }

        </View>
      </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapItem:{flexDirection:'row',alignItems:'center'},
  btnAdd:{backgroundColor:'#d0021b',padding:5,paddingLeft:15,paddingRight:15,borderRadius:3},
  colorTitle:{color:'#6587A8',fontSize:18},
  colorBlack:{color:'#1D283D',fontSize:16},
  txtInput:{
    borderColor:'#E1E7EC',
    borderWidth:1,
    borderRadius:1,
    width:width-180,
    padding:5,
    borderRadius:3
  },
  saveContentStyle:{
      position:'absolute',width,height,zIndex:100,backgroundColor:'rgba(0,0,0,0.7)',
      justifyContent:'center',alignItems:'center',
      alignSelf:'stretch',
  },
  marBot:{marginBottom:10},
  show : { display: 'flex'},
  hide : { display: 'none'},
});
