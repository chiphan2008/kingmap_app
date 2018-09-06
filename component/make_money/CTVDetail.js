/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,Modal,
  TextInput,Dimensions,ScrollView,FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import {connect} from 'react-redux';
import Moment from 'moment';
import {format_number,checkFriendAccept,getGroup} from '../libs';
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

class CTVDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      listData:{},
      showArea:false,
      content:'',
      quyenloi: '',
      showQuyenloi: false,
      showInfo: false
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
    const {listData,showArea,content,quyenloi,showQuyenloi, showInfo} = this.state;
    const {goBack,navigate} = this.props.navigation;
    const {avatar,name,address,lang,ceo_id,daily_id,ctv_id,content_id,user_profile,_daily,role_id} = this.props.navigation.state.params;
  //  console.log('ctv_id,_daily,user_profile.id',ceo_id,daily_id,ctv_id);
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
            <View style={{flexDirection:'row',paddingTop:15,justifyContent:'center',alignItems:'center'}}>
              <View style={{flexDirection:'row',paddingBottom:15,justifyContent:'center',alignItems:'center'}}>
                  <Image source={{uri:avatar}} style={{width:70,height:70,marginRight:10,borderRadius:35}} />
                  <View style={{width:width-110}}>
                    <Text numberOfLines={1} style={[colorlbl,{fontWeight:'bold'}]}>{name}</Text>
                    <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${address}`}</Text>

                    {content_id===undefined &&
                      <TouchableOpacity style={{backgroundColor:'#d0021b',padding:5,borderRadius:5,maxWidth:100,alignItems:'center',marginTop:5}}
                      onPress={()=>{
                          //if(isLogin){
                            const {id} = this.props.user_profile;
                            const friend_id = daily_id!==''?daily_id:ctv_id;
                            const port = getGroup(id,friend_id);
                            navigate('MessengerScr',{id,friend_id,yf_avatar:avatar,name,port_connect:port})
                          //}
                      }}>
                      <Text style={{fontSize:16,color:'#fff',lineHeight:23}} numberOfLines={2}>Chat online</Text>
                      </TouchableOpacity>
                    }

                  </View>
              </View>
            </View>
            {content_id===undefined && !role_id && listData.ceo && <View>
              <View style={[wrapWhite, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                  <View>
                    <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>
                    {`${lang.your_management_manager}`}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={()=>{
                        this.setState({showInfo:!this.state.showInfo})}}>
                      <Image source={plusIC} style={{width:35,height:35}} />
                  </TouchableOpacity>
                </View>
                <View style={{height:1}}></View>
            </View>}
            {showInfo && <View style={{flexDirection: 'column', padding:15}}>
              <Text style={{color: '#000'}}>{`${lang.name}: ${listData.ceo.full_name}`}</Text>
              <Text style={{color: '#000'}}>{`${lang.phone}: ${listData.ceo.phone}`}</Text>
              <Text style={{color: '#000'}}>{`Email: ${listData.ceo.email}`}</Text>
            </View>}

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
                        <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{role_id ? `${lang.area_charges}` : `${lang.area_charge}`}</Text>
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
                        <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{`${lang.total_coll}`}</Text>
                        <Text style={[titleCoin]}>{listData.count_ctv}</Text>
                      </View>
                    </View>
                    <View style={{height:1}}></View>
                  </View>}
                {!!(role_id || content_id!==undefined) && <View style={wrapWhite}>
                   <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                     <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{role_id ? `${lang.total_MMY}` : `${lang.total_MM}`}</Text>
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
                     <Text numberOfLines={1} style={[colorTitle, {fontWeight: 'bold', fontSize:14}]}>{`${role_id ? lang.total_locationd : lang.total_location}`}</Text>
                     <Text style={titleCoin}>{`${format_number(listData.count_location)}`}</Text>
                   </View>
                 </View> }
                 <View style={{height:1}}></View>

                {quyenloi !== null && content_id===undefined &&
                <View style={wrapWhite}>
                <View style={{width:width-30,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <View>
                    <Text numberOfLines={1} style={[colorTitle, {fontSize:14,color:'#6791AF', fontWeight: 'bold'}]}>{role_id ? lang.rightsandobligations : `${lang.rightsand_obligations}`}</Text>
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
const mapStateToProps = (state) => {
  return {user_profile:state.user_profile}
}

export default connect(mapStateToProps)(CTVDetail);
