/* @flow */

import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity,Dimensions,TextInput,Modal,StyleSheet,Image,
  AsyncStorage,FlatList,TouchableWithoutFeedback
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

var timeoutColl;
export default class Collection extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:'',
      has_collection:false,
      listColl:[],
      checkList:{},
      update:true,
      isLoad:true,
      page:0,
    }
    //this.getData();
  }
  getData(page=null){
    this.setState({isLoad:false})
    if(page===null) page=0;
    const {userId} = this.props;
    const url =`${global.url}${'collection/get/user/'}${userId}${'?skip='}${page}${'&limit=20'}`;
    console.log(url);//this.props.hasCollection(checkList);
    timeoutColl = setTimeout(()=>{
      getApi(url).then(e=>{
        this.state.listColl= page===0?e.data:this.state.listColl.concat(e.data);
        this.state.isLoad=true;
        if(e.data.length<20 && page>0) this.state.isLoad=false;
        this.setState(this.state)
      }).catch(e=>{});
    },500);
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
           this.setState({name:'',page:0},()=>{
             this.getData();
           });
        }
      }).catch(e=>{});
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
        //this.getData();
      }
    });
  }
  componentWillUpdate(){
    const {userId} = this.props;
    if(userId!==0 && this.state.update){
      this.setState({update:false},()=>{
        clearTimeout(timeoutColl)
        this.getData();
      })
    }
  }
  render() {
    const {
      saveContentStyle, show, hide,
      txtInput,marBot,colorTitle,colorBlack,btnAdd,
      wrapItem,
     } = styles;
    const { name,listColl,checkList,has_collection,page,isLoad } = this.state;
    const { visible,userId,idContent,lang } = this.props;
    return (
      <Modal onRequestClose={() => null} transparent visible={visible}>
      <TouchableOpacity  onPress={()=>this.props.closeModal(has_collection)}
      style={[saveContentStyle, visible ? show : hide]}>
        <TouchableWithoutFeedback>
        <View style={{width:width-100,borderRadius:3,backgroundColor:'#fff',padding:15,marginBottom:7}}>
          <Text style={[colorTitle,marBot]}>{`${lang.create_new}`.toUpperCase()}</Text>

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
            <Text style={[colorTitle,marBot]}>{`${lang.add_collection}`.toUpperCase()}</Text>
            <FlatList
               keyExtractor={(item,index) => index.toString()}
               data={listColl}
               shouldItemUpdate={(props,nextProps)=>{
                 return props.item!==nextProps.item
               }}
               extraData={this.state}
               onEndReachedThreshold={0.5}
               onEndReached={()=> {
                 this.setState({page:page+20},()=>{
                   isLoad && this.getData(page);
                 })
               }}
               //style={{marginBottom:10}}
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
        </TouchableWithoutFeedback>
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
