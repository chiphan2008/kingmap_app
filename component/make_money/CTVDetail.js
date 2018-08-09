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
import checkIC from '../../src/icon/ic-create/ic-check.png';
import plusIC from '../../src/icon/ic-plus.png';
import closeIC from '../../src/icon/ic-create/ic-close.png';

const {width,height} = Dimensions.get('window');

export default class CTVDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      listData:{},
      showArea:false,
      content:'',
      quyenloi: '',
      showQuyenloi: false
    }
  }
  componentWillMount(){
    this.getStatic();
    this.assignWork();
  }

  assignWork(){
    const { daily_id, ctv_id, lang,content_id } = this.props.navigation.state.params;
    const userId = daily_id!==''?daily_id:ctv_id;
    const block_text = daily_id !== '' ? 'quyen_loi_va_nghia_vu_cua_tdl' : 'quyen_loi_va_nghia_vu_cua_ctv'
    //console.log(`${global.url}${'static/giaoviec/'}${userId}${'?lang='}${lang.lang}`);
    content_id===undefined && getApi(`${global.url}${'static/giaoviec/'}${userId}${'?lang='}${lang.lang}${'&block_text='}${block_text}`).then(arr => {
      //console.log('arr.block_text', arr)
      this.setState({quyenloi: daily_id !== '' ? arr.block_text.quyen_loi_va_nghia_vu_cua_tdl : arr.block_text.quyen_loi_va_nghia_vu_cua_ctv })
        arr.data!==null && this.setState({ content:arr.data[0].content });
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
    //console.log(`${global.url}${'static'}${'?lang='}${lang.lang}`,arr);
    postApi(`${global.url}${'static'}${'?lang='}${lang.lang}`,arr)
    .then(arr => {
      console.log('listData',arr.data)
        this.setState({ listData:arr.data });
    }).catch(err => console.log(err));
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      wrapper,
      imgLogoTop,colorlbl,wrapWhite,titleCoin,colorTitle,
      popoverLoc,overLayout,shadown,listOverService,imgShare
    } = styles;
    const {listData,showArea,content,quyenloi,showQuyenloi} = this.state;
    const {goBack} = this.props.navigation;
    const {avatar,name,address,lang,ctv_id,content_id,user_profile,_daily,role_id} = this.props.navigation.state.params;

    // console.log('_daily',_daily);
    return (
      <View>
        <View style={wrapper}>
          <View style={headCatStyle}>
              <View style={headContent}>
              <TouchableOpacity onPress={()=>goBack()}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Image source={logoTop} style={imgLogoTop} />
              <View></View>
              </View>
          </View>

            <ScrollView>
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
                {(_daily!=='' && _daily!==undefined) && <View>
                <View style={wrapWhite}>
                  <View>
                    <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{`${lang.agency}`}</Text>
                    {<Text style={titleCoin}>{_daily}</Text>}
                  </View>
                </View>
                <View style={{height:1}}></View>
                </View>}

                  <View style={wrapWhite}>
                    <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                      <View>
                        <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{role_id ? 'Khu vực phụ trách' : `${lang.area_charge}`}</Text>
                        <Text style={titleCoin}>{listData.area!==undefined && format_number(listData.area.length)}</Text>
                      </View>
                      <TouchableOpacity onPress={()=>{
                        listData.area.length>0 &&
                        this.setState({showArea:true})}}>
                      <Image source={plusIC} style={{width:35,height:35}} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{height:1}}></View>
                  </View> }
                  {listData.count_ctv !== undefined && content_id===undefined && <View>
                    <View style={wrapWhite}>
                      <View style={{width:width-30,flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'}}>
                        <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{role_id?'Tổng số CTV':`${lang.total_coll}`}</Text>
                        <Text style={[titleCoin]}>{listData.count_ctv}</Text>
                      </View>
                    </View>
                    <View style={{height:1}}></View>
                  </View>}
                {!!(role_id || content_id!==undefined) && <View style={wrapWhite}>
                   <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                     <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{role_id ? 'Tổng thu nhập tháng này' : `${lang.total_MM}`}</Text>
                     <Text style={titleCoin}>{`${format_number(listData.total)}`}</Text>
                   </View>
                 </View>}
                 {!!role_id && listData.static!==undefined && listData.static.length>0 &&
                   <View style={wrapWhite}>
                     <View style={{height:1}}></View>
                     <FlatList
                      extraData={this.state}
                      data={listData.static}
                      //style={{borderColor:'#E0E8ED',borderTopWidth:1,marginTop:5}}
                      keyExtractor={(item,index) => index.toString()}
                      renderItem={({item,index}) =>(
                        <TouchableWithoutFeedback>
                        <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                          <Text style={{color:'#2F3C51',fontWeight:'bold'}}>{item.name}</Text>
                          <Text style={{color:'#5782A4'}}>{`${format_number(item.value)}`}</Text>
                       </View>
                       </TouchableWithoutFeedback>
                      )} />
                 </View>}
                 <View style={{height:1}}></View>
                 {!!role_id &&<View style={wrapWhite}>
                   <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                     <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{role_id ? 'Tổng số địa điểm' : `${lang.total_location}`}</Text>
                     <Text style={titleCoin}>{`${format_number(listData.count_location)}`}</Text>
                   </View>
                 </View> }
                 <View style={{height:1}}></View>
                 
                {quyenloi !== null && content_id===undefined &&
                <View style={wrapWhite}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <View>
                    <Text numberOfLines={1} style={[colorTitle, {fontSize:14,color:'#6791AF', fontWeight: 'bold'}]}>{role_id ? 'Quyền lợi và Nghĩa vụ' : `${lang.rightsand_obligations}`}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>{
                    this.setState({showQuyenloi: !this.state.showQuyenloi})}}>
                    <Image source={plusIC} style={{width:35,height:35}} />
                  </TouchableOpacity>
                </View>
              </View>}
              <View style={{height:3}}></View>
              {content!==null && content_id===undefined &&
                   <View>
                   <View style={{height:1}}></View>
                   <View style={wrapWhite} >
                       <View>
                       <Text numberOfLines={1} style={{color:'#6791AF', fontWeight: 'bold'}}>{`${lang.assign_work}`}:</Text>
                       <Text style={{color:'#2F353F',fontSize:16,lineHeight:22}}>{content}</Text>
                       </View>
                  </View>
                 </View>}
                {showQuyenloi && quyenloi !== null &&
                <Modal onRequestClose={() => null} transparent visible={showQuyenloi}
                style={{maxHeight: height*1.8, margin:8, backgroundColor: '#fff'}}>
                  <View style={{flex: 1,maxHeight: height*1.8, backgroundColor: '#fff', paddingBottom: 3}}>
                    <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} 
                    style={{alignItems:'flex-end', marginTop: 20, marginRight: 5}}
                    onPress={() => this.setState({showQuyenloi: false})}>
                       <Image source={closeIC} style={{width:35,height:35}} />
                    </TouchableOpacity>
                    <ScrollView style={{maxHeight: height*1.8, marginLeft: 6, marginTop: 20, marginRight: 6, paddingLeft: 10, paddingRight: 10}}>
                      <Text style={{color: '#000'}}>{quyenloi}</Text>
                    </ScrollView>
                  </View>
                </Modal>}
                <View style={{height:15}}></View>

            </ScrollView>

        </View>

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
               <TouchableWithoutFeedback style={listOverService}>
                <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}>
                    <Text style={colorTitle}>{item.name}</Text>
                    <Image source={checkIC} style={[imgShare]} />
                </View>
                </TouchableWithoutFeedback>
           )} />
           </View>
        </TouchableWithoutFeedback>
        </TouchableOpacity>
        </View>
      </Modal>}

        </View>
    );
  }
}
