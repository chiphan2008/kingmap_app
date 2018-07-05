/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,Modal,
  TextInput,Dimensions,ScrollView,FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import Moment from 'moment';
import {format_number} from '../libs';
import styles from '../styles';
import global from '../global';
import postApi from '../api/postApi';
import getApi from '../api/getApi';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import logoTop from '../../src/icon/ic-white/Logo-ngang.png';
import checkIC from '../../src/icon/ic-check.png';
import plusIC from '../../src/icon/ic-plus.png';

const {width,height} = Dimensions.get('window');

export default class CTVDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      listData:{},
      showArea:false,
      content:'',
    }
  }
  componentWillMount(){
    this.getStatic();
    this.getContent();
  }
  getContent(){
    const {daily_id,ctv_id,content_id,lang} = this.props.navigation.state.params;
    const userId = daily_id!==''?daily_id:ctv_id;
    getApi(`${global.url}${'static/giaoviec/'}${userId}${'?lang='}${lang.lang}`).then(arr => {
        this.setState({ content:arr.data[0].content===null?'':arr.data[0].content });
    }).catch(err => console.log(err));
  }
  getStatic(){
    const {ceo_id,daily_id,ctv_id,content_id,lang} = this.props.navigation.state.params;
    const month = Moment().format('MM');
    const year = Moment().format('YYYY');
    const arr = new FormData();
    ctv_id!=='' && arr.append('ctv_id',ctv_id);
    daily_id!=='' && arr.append('daily_id',daily_id);
    //ceo_id!=='' && arr.append('ceo_id',ceo_id);
    content_id!==undefined && arr.append('content_id',content_id);
    arr.append('month',month);
    arr.append('year',year);

    postApi(`${global.url}${'static'}${'?lang='}${lang.lang}`,arr)
    .then(arr => {
        this.setState({ listData:arr.data });
    }).catch(err => console.log(err));
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      imgLogoTop,colorlbl,wrapWhite,titleCoin,colorTitle,
      popoverLoc,overLayout,shadown,listOverService,imgShare
    } = styles;
    const {listData,showArea,content} = this.state;
    const {goBack} = this.props.navigation;
    const {avatar,name,address,lang,ctv_id,content_id} = this.props.navigation.state.params;
    return (
      <ScrollView>
        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Image source={logoTop} style={imgLogoTop} />
              <View></View>
              </View>
          </View>

            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:15}}>
              <View style={{flexDirection:'row',paddingBottom:15}}>
                  <Image source={{uri:avatar}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                  <View style={{width:width-90}}>
                    <Text numberOfLines={1} style={colorlbl}>{name}</Text>
                    <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${address}`}</Text>
                  </View>
              </View>
            </View>

              {content_id===undefined && <View>
                  <View style={wrapWhite}>
                    <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                      <View>
                        <Text numberOfLines={1} style={colorTitle}>{`${lang.area_charge}`}</Text>
                        <Text style={titleCoin}>{listData.area!==undefined && format_number(listData.area.length)}</Text>
                      </View>
                      <TouchableOpacity onPress={()=>{
                        listData.area.length>0 &&
                        this.setState({showArea:true})}}>
                      <Image source={plusIC} style={{width:35,height:35}} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{height:5}}></View>
                  </View> }

                 <View style={wrapWhite}>
                   <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                     <Text numberOfLines={1} style={colorTitle}>{`${lang.total_MM}`}</Text>
                     <Text style={titleCoin}>{`${format_number(listData.total)}`}</Text>
                   </View>
                 </View>
                 <View style={{height:5}}></View>
                 {listData.static!==undefined && listData.static.length>0 &&
                   <View style={wrapWhite}>
                     <View style={{height:5}}></View>
                     <FlatList
                      extraData={this.state}
                      data={listData.static}
                      //style={{borderColor:'#E0E8ED',borderTopWidth:1,marginTop:5}}
                      keyExtractor={(item,index) => index.toString()}
                      renderItem={({item,index}) =>(
                        <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                          <Text style={{color:'#2F3C51'}}>{item.name}</Text>
                          <Text style={{color:'#5782A4'}}>{format_number(item.value)}</Text>
                       </View>
                      )} />
                 </View>}

        </View>

        {content_id===undefined &&
          <View>
          <View style={{height:5}}></View>
          <View style={wrapWhite} >
              <View>
              <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${lang.assign_work}`}:</Text>
              <Text style={{color:'#2F353F',fontSize:16,lineHeight:22}}>{content}</Text>
              </View>
         </View>
        </View>}

        <View style={{height:15}}></View>

        {showArea &&
        <Modal onRequestClose={() => null} transparent visible={showArea} >
        <View style={popoverLoc}>
        <TouchableOpacity
        onPress={()=>this.setState({showArea:false})} style={{justifyContent:'center',alignItems:'center',flex:1}}>
        <TouchableWithoutFeedback>
        <View style={[overLayout,shadown]}>
          <FlatList
             keyExtractor={(item,index) => index.toString()}
             extraData={this.state}
             data={listData.area}
             renderItem={({item}) => (
               <View style={listOverService}>
                <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}>
                    <Text style={colorTitle}>{item.name}</Text>
                    <Image source={checkIC} style={[imgShare]} />
                </View>
                </View>
           )} />
           </View>
        </TouchableWithoutFeedback>
        </TouchableOpacity>
        </View>
      </Modal>}

        </ScrollView>
    );
  }
}
