/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,FlatList,DeviceEventEmitter
} from 'react-native';
import Moment from 'moment';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import moreIC from '../../src/icon/ic-create/ic-more.png';
import {checkUrl} from '../libs';
const {width,height} = Dimensions.get('window');

export default class ManageBuySell extends Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[]
    }
  }
  getData(){
    const {user_id} = this.props.navigation.state.params;
    const url = `${global.url}${'raovat/get-list?id_user='}${user_id}`
    getApi(url).then(arrData => {
      this.setState({listData:arrData.data})
    }).catch(err => console.log(err));
  }
  componentDidMount(){
    DeviceEventEmitter.addListener('goback', (e)=>{
      if(e.isLogin) this.getData();
    })
    this.getData();
  }

  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      imgShare,colorlbl,
    } = styles;
    const {goBack,navigate} = this.props.navigation;
    const {sub_module,user_id,lang,name_module} = this.props.navigation.state.params;
    return (
      <View style={container}>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                  <Text style={titleCreate}> {sub_module} </Text>
                <View></View>
            </View>

        </View>
        <View style={{backgroundColor:'#fff'}}>
        <FlatList
           extraData={this.state}
           style={{marginTop:15,paddingBottom:15,paddingLeft:15,paddingRight:15,width}}
           data={this.state.listData}
           keyExtractor={(item,index) => index.toString()}
           renderItem={({item,index}) =>(
             <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}
             >
                 <TouchableOpacity style={{flexDirection:'row',maxWidth:width-50}}
                 onPress={()=>{}}>
                     <Image source={{uri:checkUrl(item._images[0].link) ? item._images[0].link : `${global.url_media}${item._images[0].link}`}} style={{width:50,height:40,marginRight:10}} />
                     <View style={{minWidth:width-50}}>
                       <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                       <Text numberOfLines={1} style={{fontSize:12}}>{Moment(item.created_at).format('DD/MM/YYYY')}</Text>
                       
                     </View>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>{
                   navigate('CreateBuySellScr',{id:item.id,user_id,sub_module:'Sửa tin',lang,name_module});
                 }}>
                   <Image source={moreIC} style={imgShare} />
                </TouchableOpacity>
             </View>
           )} />
           </View>
        <View style={{height:5}}></View>
      </View>
    );
  }
}
