/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,Alert,
  TextInput,Dimensions,ScrollView,FlatList,ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import {checkUrl,onlyNumber} from '../libs';
import styles from '../styles';
import global from '../global';
import postApi from '../api/postApi';
import loginServer from '../api/loginServer';
import checkLogin from '../api/checkLogin';
import checkLocation from '../api/checkLocation';
import SelectLocation from '../main/location/SelectLocation';

import lang_vn from '../lang/vn/language';
import lang_en from '../lang/en/language';
import cameraLargeIC from '../../src/icon/ic-create/ic-camera-large.png';
import cameraIC from '../../src/icon/ic-create/ic-camera.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import closeIC from '../../src/icon/ic-create/ic-close.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import uncheckIC from '../../src/icon/ic-uncheck.png';
import checkIC from '../../src/icon/ic-create/ic-check.png';
import sortDownIC from '../../src/icon/ic-sort-down.png';
import selectedIC from '../../src/icon/ic-create/ic-selected.png';


const {width,height} = Dimensions.get('window');

export default class AddImageMore extends Component {
  constructor(props){
    super(props);
    const {lang} = this.props.navigation.state.params;
    this.state = {
      lang:lang==='vn'?lang_vn:lang_en,
      birthday:'',
      address:'',
      phone:'',
      cmnd:'',
      nameKV:'',
      district:'',
      daily_id:'',
      listAgency:[],
      showLoc:false,
      posted:false,
      showDay:false,
      showMonth:false,
      showYear:false,
      showCMND:false,
      dDay:'',dMonth:'',dYear:'',
      cmnd_image_front:{},
      cmnd_image_back:{},
    }
    checkLogin().then(e=>{
      e.temp_daily_code!=='' && this.props.navigation.navigate('MainScr');
    })
  }
  componentWillMount(){
    const {user_profile} = this.props.navigation.state.params;
    //console.log(user_profile);
    let strday;
    if(user_profile.birthday===null || user_profile.birthday===undefined){
      strday = String(Moment(new Date()).format('YYYY-MM-DD')).split('-') ;
    }else {
      strday = String(user_profile.birthday).split('-');
    }
    this.setState({
      dDay:strday[2],
      dMonth:strday[1],
      dYear:strday[0],
      phone:user_profile.phone===null?'':user_profile.phone,
      address:user_profile.address===null?'':user_profile.address,
      cmnd:user_profile.cmnd===null?'':user_profile.cmnd,
    })
  }
  getlistAgency(){
    const {country, city, district} = this.state;
    const url = `${global.url}${'static/search-daily'}`;
    const arr = new FormData();
    arr.append('country',country);
    arr.append('city',city);
    arr.append('district',district);
    //console.log(url);
    //console.log(arr);
    postApi(url,arr).then((e)=>{
      this.setState({listAgency:e.data});
    });
  }

  register(){
    const {birthday,address,phone,cmnd,daily_id,lang,district,dDay,dMonth,dYear} = this.state;
    const {user_profile} = this.props.navigation.state.params;
    // const day = birthday.substr(0,2);
    // const month = birthday.substr(3,2);
    // const year = birthday.substr(-4);

    if(address!==null && address.trim()===''){
      //console.log('address');
      this.setState({posted:false},()=>{
        Alert.alert(lang.notify,lang.enter_address);
      })

    }else if(phone!==null && phone.trim()===''){
      //console.log('phone');
      this.setState({posted:false},()=>{
        Alert.alert(lang.notify,lang.enter_phone);
      })

    }else if(cmnd!==null && cmnd.trim()===''){
      //console.log('cmnd');
      this.setState({posted:false},()=>{
        Alert.alert(lang.notify,lang.enter_cmnd);
      })
    }else if (this.state.cmnd_image_front.path===undefined && this.state.cmnd_image_back.path===undefined) {
      this.setState({posted:false},()=>{
        Alert.alert(lang.notify,lang.add_cmnd);
      })

    }else if (this.state.cmnd_image_front.path===undefined) {
      this.setState({posted:false},()=>{
        Alert.alert(lang.notify,lang.add_front_cmnd);
      })
    }else if (this.state.cmnd_image_back.path===undefined) {
      this.setState({posted:false},()=>{
        Alert.alert(lang.notify,lang.add_back_cmnd);
      })
    }else if(district===''){
      //console.log('district');
      this.setState({posted:false},()=>{
        Alert.alert(lang.notify,lang.plz_choose_area);
      })

    }else if(daily_id==='' || daily_id===false){
      //console.log('daily_id');
      this.setState({posted:false},()=>{
        Alert.alert(lang.notify,lang.plz_choose_agency);
      })
    }else {
      const url = `${global.url}${'user/register-ctv'}${'?lang='}${lang.lang}`;
      const arr = new FormData();
      arr.append('id',user_profile.id);
      arr.append('birthday',`${dYear}-${dMonth}-${dDay}`);
      arr.append('address',address);
      arr.append('phone',phone);
      arr.append('cmnd',cmnd);
      arr.append('daily_id',daily_id);
      this.state.cmnd_image_front.path!==undefined && arr.append(`cmnd_image_front`, {
        uri:`${this.state.cmnd_image_front.path}`,
        name: `cmnd_image_front.jpg`,
        type: `${this.state.cmnd_image_front.mime}`
      });
      this.state.cmnd_image_back.path!==undefined &&  arr.append(`cmnd_image_back`, {
        uri:`${this.state.cmnd_image_back.path}`,
        name: `cmnd_image_back.jpg`,
        type: `${this.state.cmnd_image_back.mime}`
      });
      //console.log(url);
      //console.log(arr);
      this.state.posted && postApi(url,arr).then((e)=>{
        if(e.code===200){
          //loginServer(user_profile);
          loginServer(user_profile,'reqLog');
          this.setState({posted:false},()=>{
            Alert.alert(lang.notify,e.data,[
              {text: '', style: 'cancel'},
              {text: 'OK', onPress: () => {this.props.navigation.navigate('MainScr')}}
            ],
           { cancelable: false })
          });
        }else {
          this.setState({posted:false},()=>{
            Alert.alert(lang.notify,e.message);
          });
        }
      }).catch(e=>{});
    }

  }
  uploadCMND(route){
    ImagePicker.openPicker({
      cropping: false
    }).then(image =>{
      //console.log(image);
      if(route==='front'){
        this.setState({cmnd_image_front:image});
      }else {
        this.setState({cmnd_image_back:image});
      }
    }).catch(e=>console.log('e'));
  }

  saveLocation(){
    this.setState({showLoc:false},()=>{
      checkLocation().then((e)=>{
        //console.log('e',e);
        this.state.nameKV=`${e.nameDist}, ${e.nameCity}`;
        this.state.country=e.idCountry;this.state.city=e.idCity;this.state.district=e.idDist;
        this.setState(this.state,()=>{
          this.getlistAgency();
        })
      });
    })
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,wrapInputCreImg,
      wrapItems,widthLable,colorlbl,widthContentItem,show,hide,colorErr,
      popoverLoc,padCreate,overLayout,shadown,imgShare,btnYInfo,btnInfo,imgCamera,
      wrapSelect,posDayCTV,posMonthCTV,posYearCTV,widthYear,wrapBtnInfo,widthDay,colourTitle
    } = styles;
    const {navigate,goBack} = this.props.navigation;
    const {titleScr,user_profile} = this.props.navigation.state.params;
    const {birthday,address,phone,cmnd,nameKV,district,listAgency,daily_id,
    showDay,showMonth,showYear,dDay,dMonth,dYear,showCMND,
    cmnd_image_back,cmnd_image_front} = this.state;
    return (
        <ScrollView>
        <TouchableWithoutFeedback onPress={()=>this.setState({showDay:false,showMonth:false,showYear:false,})}>

        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>goBack()}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> {titleScr.toUpperCase()} </Text>
                  <View></View>
              </View>
          </View>

          <View style={wrapItems}>
            <View style={widthLable}>
              <Text style={colorlbl}>{this.state.lang.name} </Text>
            </View>
            <View style={widthContentItem}>
              <Text>{user_profile.full_name}</Text>
            </View>
          </View>

          <View style={wrapItems}>
            <View style={widthLable}>
              <Text style={colorlbl}>{this.state.lang.birthday} </Text>
            </View>
            <View style={widthContentItem}>
              <View style={{flexDirection:'row',alignItems:'center',overflow:'visible'}}>
              <TouchableOpacity style={btnInfo}
              onPress={()=>{
                this.setState({disable:showDay,showDay:!showDay,showMonth:false,showYear:false})
              }}>
                  <Text style={colourTitle}>{this.state.dDay}</Text>
                  <Image source={sortDownIC} style={{width:12,height:12}} />
              </TouchableOpacity>
              <Text> / </Text>

              <TouchableOpacity style={btnInfo}
              onPress={()=>{this.setState({showDay:false,disable:showMonth,showMonth:!showMonth,showYear:false});
              }}>
                  <Text style={colourTitle}>{this.state.dMonth}</Text>
                  <Image source={sortDownIC} style={{width:12,height:12}} />
              </TouchableOpacity>
              <Text> / </Text>

              <TouchableOpacity style={btnYInfo}
              onPress={()=>{this.setState({showDay:false,showMonth:false,disable:showYear,showYear:!showYear});
              }}>
                  <Text style={colourTitle}>{this.state.dYear}</Text>
                  <Image source={sortDownIC} style={{width:12,height:12}} />
              </TouchableOpacity>

              </View>
              <View></View>
            </View>
          </View>

          {showDay && <View style={[wrapSelect,posDayCTV,wrapBtnInfo]}>
          <ScrollView>
          <View style={widthDay}>
          {Array(31).fill().map((_, i) => {
            i=i+1; i = i<10 ? `0${i}` : i;
            return (
              <TouchableOpacity key={i} onPress={()=>this.setState({dDay:i,showDay:false,disable:true})}>
                 <Text style={colourTitle}>{i}</Text>
             </TouchableOpacity>
          )})}
          </View>
          </ScrollView>
          </View>}

          {showMonth && <View style={[wrapSelect,wrapBtnInfo,posMonthCTV]}>
          <ScrollView>
          <View style={widthDay}>
          {Array(12).fill().map((_, i) => {
            i=i+1; i = i<10 ? `0${i}` : i;
            return (
              <TouchableOpacity key={i} onPress={()=>this.setState({dMonth:i,showMonth:false,disable:true})}>
                 <Text style={colourTitle}>{i}</Text>
             </TouchableOpacity>
          )})}
          </View>
          </ScrollView>
          </View>}

          {showYear && <View style={[wrapSelect,posYearCTV,wrapBtnInfo]}>
          <ScrollView>
          <View style={widthYear}>
          {Array(100).fill().map((_, i) => {
            i=Moment(new Date()).format('YYYY')-i;
            return (
              <TouchableOpacity key={i} onPress={()=>this.setState({dYear:i,showYear:false,disable:true})}>
                 <Text style={colourTitle}>{i}</Text>
             </TouchableOpacity>
          )})}
          </View>
          </ScrollView>
          </View>}

          <View style={wrapItems}>
            <View style={widthLable}>
              <Text style={colorlbl}>{this.state.lang.address} </Text>
            </View>
            <View style={widthContentItem}>
              <View>
              <TextInput underlineColorAndroid='transparent'
              onSubmitEditing={(event) => {}}
              placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
              onChangeText={(address) => this.setState({address})}
              value={address}
               />
              </View>
              <View></View>
            </View>
          </View>

          <View style={wrapItems}>
            <View style={widthLable}>
              <Text style={colorlbl}>{this.state.lang.phone} </Text>
            </View>
            <View style={widthContentItem}>
              <View>
              <TextInput underlineColorAndroid='transparent'
              onSubmitEditing={(event) => {}} maxLength={11} keyboardType={'numeric'}
              placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
              onChangeText={(phone) => {if(onlyNumber(phone) || phone==='') this.setState({phone})}}
              value={phone}
               />
              </View>
              <View></View>
            </View>
          </View>

          <View style={wrapItems}>
            <View style={widthLable}>
              <Text style={colorlbl}>{this.state.lang.cmnd} </Text>
            </View>
            <View style={widthContentItem}>
              <View>
              <TextInput underlineColorAndroid='transparent'
              onSubmitEditing={(event) => {}} maxLength={12} keyboardType={'numeric'}
              placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
              onChangeText={(cmnd) => {if(onlyNumber(cmnd) || cmnd==='') this.setState({cmnd})}}
              value={cmnd.toString()}
               />
              </View>
              <View></View>
            </View>
          </View>

          <TouchableOpacity style={wrapItems}
          onPress={()=>this.setState({showCMND:true})}>
              <View style={{width:width-70,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={colorlbl}>{this.state.lang.cmnd_image}</Text>
             </View>

             <View style={{flexDirection:'row',alignItems:'center'}}>
               <Image source={selectedIC} style={[imgShare,cmnd_image_back.path!==undefined&&cmnd_image_front.path!==undefined ? show : hide]}/>
               <View style={imgCamera}>
                 <Image source={cameraIC} style={imgShare}/>
               </View>
             </View>

           </TouchableOpacity>

          <TouchableOpacity style={wrapItems}
          onPress={()=>this.setState({showLoc:true})}>
              <View style={{width:width-40,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={colorlbl}>{this.state.lang.choose_area}</Text>
                <View style={{width:width/2}}>
                <Text numberOfLines={1} style={colorlbl}>{this.state.nameKV}</Text>
                </View>
             </View>
             <Image source={arrowNextIC} style={{width:16,height:16,marginTop:5}} />
           </TouchableOpacity>


           {this.state.listAgency.length>0 &&
             <View>
           <Text style={{marginTop:15,paddingLeft:15,color:'#5D8BAF'}}>{this.state.lang.list_agency.toUpperCase()}</Text>
           <View style={{backgroundColor:'#fff',marginTop:15,paddingTop:15}}>
           <FlatList
            extraData={this.state}
            data={listAgency}
            keyExtractor={(item,index) => index.toString()}
            renderItem={({item,index}) =>(
              <TouchableOpacity onPress={()=>{
                if(daily_id===item.id){
                  this.setState({daily_id:!item.id})
                }else {
                  this.setState({daily_id:item.id})
                }
              }} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <View style={{flexDirection:'row',paddingBottom:15}}>
                      <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:50,marginRight:10,borderRadius:25}} />
                      <View style={{width:width-110}}>
                        <Text numberOfLines={1} style={colorlbl}>{item.full_name}</Text>
                        <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}`}</Text>
                      </View>
                  </View>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={daily_id===item.id?checkIC:uncheckIC} style={imgShare} />
                 </View>
                </TouchableOpacity>
            )} />
            </View>
           </View>}

           <TouchableOpacity style={{alignItems:'center',marginTop:15,backgroundColor:'#d0021b',borderRadius:3,width:width-30,paddingTop:10,paddingBottom:10,alignItems:'center',marginLeft:15}}
           onPress={()=>{this.setState({posted:true},()=>{
             this.register();
           })}}>
             <Text style={{color:'#fff'}}>{this.state.lang.register}</Text>
           </TouchableOpacity>

        </View>
        </TouchableWithoutFeedback>

        <Modal onRequestClose={() => null} transparent visible={this.state.showLoc}>
        <TouchableOpacity
        onPress={()=>this.setState({showLoc:false})}
        style={[popoverLoc,padCreate]}>
          <View style={[overLayout,shadown]}>
              <SelectLocation
              id_city={this.state.city}
              saveLocation={this.saveLocation.bind(this)} />
          </View>
          </TouchableOpacity>
        </Modal>

        <Modal onRequestClose={() => null} transparent visible={this.state.showCMND}>
        <ScrollView style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <Text style={[titleCreate, {width: width * 0.33}]}>   </Text>
                  <Text style={[titleCreate, {width: width * 0.33}]}> {this.state.lang.cmnd_image.toUpperCase()} </Text>
                    
                <TouchableOpacity onPress={()=>this.setState({showCMND:false})}>
                {/*<Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />*/}
                <Text style={[titleCreate, {width: width * 0.33, left: 50}]}> {this.state.lang.done} </Text>
                </TouchableOpacity>
              </View>
          </View>
          <View style={{height:15}}></View>
          <View style={{margin: 8}}><Text style={{fontWeight: '300', color: '#2F78AC'}}>{this.state.lang.cmnd_image_front.toUpperCase()}</Text></View>
          <View style={{height:15}}></View>
          <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#FFFEFF',padding:50,marginBottom:5,borderColor:'#ECEEF3',borderBottomWidth:1}}>
            <TouchableOpacity
            onPress={()=>this.uploadCMND('front')}>
            <Image source={cameraLargeIC} style={{width:60,height:60,marginBottom:10}}/>
            </TouchableOpacity>
            <Text style={{fontSize:18}}>{this.state.lang.upload_image.toUpperCase()}</Text>
          </View>

          <View style={{height:5}}></View>
          {cmnd_image_front.path!==undefined &&
            <Image style={{width,height:300,resizeMode: 'cover'}}
          source={{isStatic:true,uri:cmnd_image_front.path!==undefined?`${cmnd_image_front.path}`:`${''}`}} />
          }
          <View style={{height:15}}></View>
          <View style={{margin: 8}}><Text style={{fontWeight: '300', color: '#2F78AC'}}>{this.state.lang.cmnd_image_back.toUpperCase()}</Text></View>
          <View style={{height:15}}></View>
          <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#FFFEFF',padding:50,marginBottom:5,borderColor:'#ECEEF3',borderBottomWidth:1}}>
            <TouchableOpacity
            onPress={()=>this.uploadCMND('back')}>
            <Image source={cameraLargeIC} style={{width:60,height:60,marginBottom:10}}/>
            </TouchableOpacity>
            <Text style={{fontSize:18}}>{this.state.lang.upload_image.toUpperCase()}</Text> 
          </View>
          <View style={{height:5}}></View>
          {cmnd_image_back.path!==undefined &&
            <Image style={{width,height:300,resizeMode: 'cover'}}
          source={{isStatic:true,uri:cmnd_image_back.path!==undefined?`${cmnd_image_back.path}`:`${''}`}} />
          }
          <View style={{height:5}}></View>

          </ScrollView>
        </Modal>
        {this.state.posted &&
        <Modal onRequestClose={() => null} transparent
        visible={this.state.posted} >
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.6)'}}>
            <ActivityIndicator size="large" color="#d0021b" />
          </View>
        </Modal>}
        <View style={{height:15}}></View>
      </ScrollView>

    );
  }
}