/* @flow */

import React, { Component } from 'react';
import {Keyboard,Platform, View, Text, StyleSheet, Dimensions, Image,
  TextInput, TouchableOpacity,Modal,
  FlatList,DeviceEventEmitter,
} from 'react-native';
const {height, width} = Dimensions.get('window');

import Rating from '../detail/Rating'
import styles from '../../styles';
import loginServer from '../../api/loginServer';
import getApi from '../../api/getApi';
import getLocationByIP from '../../api/getLocationByIP';
import global from '../../global';
import lang_vn from '../../lang/vn/language';
import lang_en from '../../lang/en/language';
import SelectLocation from '../../main/location/SelectLocation';
import checkLocation from '../../api/checkLocation';
import checkLogin from '../../api/checkLogin';

import upDD from '../../../src/icon/ic-white/ic-dropdown_up.png';
import sortDownIC from '../../../src/icon/ic-sort-down.png';
import searchIC from '../../../src/icon/ic-gray/ic-search.png';
import likeIC from '../../../src/icon/ic-like.png';
import likeFullIcon from '../../../src/icon/ic-like-full.png';
import checkIC from '../../../src/icon/ic-green/ic-check.png';
import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import logoTop from '../../../src/icon/ic-white/Logo-ngang.png';
import topIC from '../../../src/icon/ic-top.png';
import {remove,removeText} from '../../libs';

var timeout;
export default class ListLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword:'',
      noData:'',
      lang: this.props.navigation.state.params.lang==='vn' ? lang_vn : lang_en,
      labelLoc : "Địa điểm",
      labelCat : "Danh mục",
      labelSer : "Dịch vụ",
      valueLoc : 0,
      valueCat : 0,
      valueSer : 0,
      curLocation : {
        latlng:'',
      },
      curLoc:{},
      showLoc:false,
      listData:[],
      listSubCat:{
        arr:[],
        check:'',
        showList:false,
      },
      listSerItem:{
        arr:[],
        check:'',
        showList:false,
      },
      showServie:{},
      idDist:null,
      id_sub:null,
      id_serv:'-1',
      isRefresh:false,
      page:0,
      pullToRefresh:false,
      //disable:false,
      user_id:0,
      isLogin:false,
      isLoad:true,
      scrollToTop:false,
    }
    this.refresh();

  }

  getCategory(idcat,loc){
    const url = global.url+'content-by-category?category='+idcat+'&location='+loc;
    //console.log('url',url);
    if(this.state.isLoad){
      getApi(url)
      .then(arrData => {
        //console.log('arrData',arrData);
        this.setState({ listData: arrData.data });
      }).catch(err => console.log(err));
    }

  }

  onRefresh(skip=null){
    //console.log('refreshing')
    const { idDist,id_sub,id_serv,page,pullToRefresh } = this.state;
    const pos= skip!==null ? skip : page+20 ;

    if(pullToRefresh){
        this.setState({ isRefresh: true, page: page+20 }, function() {
          this.getContentByDist(idDist,id_sub,id_serv,pos)
        });
      }
    }

  getContentByDist(id_district,id_sub,id_serv,skip=null){
    clearTimeout(timeout);this.setState({isLoad:false,noData:''});
    if(skip===null){
      skip = 0; this.setState({page:0})
    }
    //console.log('skip',skip);
    const id_cat = this.props.navigation.state.params.idCat;
    const { keyword,curLoc } = this.state;
    var url = `${global.url}${'search-content?category='}${id_cat}&skip=${skip}&limit=20`;
    url += `${'&location='}${curLoc.latlng}`;
    if(keyword.trim()!=='') url += `${'&keyword='}${keyword}`;
    if(id_district!==null) url += `${'&district='}${id_district}`;

    //if(loc!=='') url += `${'&location='}${loc}`;

    if(id_sub!==null) url += `${'&subcategory='}${id_sub}`;
    id_serv = id_serv.replace('-1,','');
    if(id_serv!=='' && id_serv!=='-1'){
      url += `${'&service='}${id_serv}`;
    }
    console.log('-----url-----',url);
    getApi(url)
    .then(arrData => {
      //console.log('count',arrData.data.length);
      if(skip===0){
        //console.log('-----skip===0-----');

        this.setState({ listData: arrData.data, isRefresh:false, noData: arrData.data.length===0 ? this.state.lang.not_found : '' });
      }else {
        //console.log('-----skip!==-----');
        if(arrData.data.length===0) this.setState({ pullToRefresh:false });
        this.setState({ listData: this.state.listData.concat(arrData.data), isRefresh:false });
      }
    })
    .catch(err => console.log(err));
  }

  saveLocation(){
    this.setState({keyword:''})
    checkLocation().then((e)=>{
      //console.log('saveLocation',e);
      this.getContentByDist(e.idDist,this.state.id_sub,this.state.id_serv);
      this.setState({showLoc:!this.state.showLoc,idDist:e.idDist,labelLoc:e.nameDist});
    });
  }

  // componentDidMount() {
  //   var _this = this;
  //   const id = _this.props.navigation.state.params.idCat;
  //   let latlng;
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     //console.log('position');
  //           latlng = `${position.coords.latitude}${','}${position.coords.longitude}`;
  //           _this.setState({
  //             curLocation : {
  //               latlng:latlng,
  //             },
  //             curLoc:{
  //               latlng:latlng,
  //               latitude:`${position.coords.latitude}`,
  //               longitude:`${position.coords.longitude}`,
  //             }
  //           },()=>{
  //             _this.getCategory(id,latlng);
  //           });
  //          },
  //          (error) => {
  //            //console.log('error',id);
  //            getLocationByIP().then(e => {
  //              const latlng = `${e.latitude},${e.longitude}`;
  //              _this.setState({
  //                curLoc:{
  //                  latlng:`${e.latitude},${e.longitude}`,
  //                  latitude:`${e.latitude}`,
  //                  longitude:`${e.longitude}`,
  //                },
  //              },()=>{
  //                _this.getCategory(id,latlng);
  //              });
  //
  //            });
  //            //console.log('ip',ip.latitude);
  //         },
  //         {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
  //   );
  //   _this.setState({pullToRefresh:true});
  // }



  componentDidMount() {
    const id = this.props.navigation.state.params.idCat;
     navigator.geolocation.getCurrentPosition(
       ({coords}) => {
         const {latitude, longitude} = coords
         this.setState({
           curLoc: {
             latitude,
             longitude,
             latlng:`${latitude},${longitude}`,
           }
         },()=>{
           this.getCategory(id,`${latitude},${longitude}`);
         })

       },
       (error) => {},
       {enableHighAccuracy: true}
     );
     this.watchID = navigator.geolocation.watchPosition(
       ({coords}) => {
         const {lat, long} = coords
         this.setState({
           curLoc: {
             lat,
             long
           }
         })
     });
     this.setState({pullToRefresh:true});
   }
   componentWillUnmount() {
     //navigator.geolocation.clearWatch(this.watchID);
   }
   refresh(){
     checkLogin().then(e=>{
       if(e.id!==undefined){
         this.setState({user_id:e.id,isLogin:true});
         loginServer(e);
       }
     });
   }
   componentWillMount(){
     setTimeout(()=>{
       DeviceEventEmitter.addListener('goback', (e)=>{
         if(e.isLogin) this.refresh();
       })
       DeviceEventEmitter.addListener('detailBack', ()=>{
         //console.log('detailBack');
         this.setState({pullToRefresh:true});
       })
     },1500)
   }
  requestLogin(){
    const {navigate} = this.props.navigation;
    if(this.state.isLogin===false){
      navigate('LoginScr');
    }

  }
  saveLike(id){
    //console.log('like');
    const {isLogin,user_id,page} = this.state;
    if(isLogin===false){ this.requestLogin();}else {
      getApi(`${global.url}${'like'}${'?content='}${id}${'&user='}${user_id}`).then(e=>{
          this.onRefresh(0);
        }
      );
    }

  }

  saveVote(rate,id){
    const {isLogin,idDist,id_sub,id_serv,page,user_id}=this.state;
    if(isLogin===false){this.requestLogin();}else {
      const url =`${global.url}${'vote?content='}${id}${'&user='}${user_id}${'&point='}${rate}`;
      getApi(url).then(e=>{
        this.onRefresh(page);
      }
      );
    }
  }

  render() {
    //console.log('pullToRefresh',this.state.pullToRefresh);
    const {
      keyword,lang,idDist,id_sub,id_serv,isRefresh,
      listData,scrollToTop,isLogin,noData
    } = this.state;
    const { goBack,navigate,state } = this.props.navigation;
    //console.log('this.props.navigation',this.props);
    const {idCat,sub_cat,serv_items} = this.props.navigation.state.params;
    //console.log('lang',lang);
    //console.log('state.key-ListLoc',state.key);
    const {
      container,btnScrollTop,
      headStyle, filterFrame,wrapFilter,headContent,imgLogoTop,
      inputSearch,show,hide,colorTextPP,colorNumPP,
      selectBoxBuySell,widthLoc,optionListLoc,OptionItemLoc,
      wrapListLoc,padLoc,flatItemLoc,imgFlatItem,wrapFlatRight,
      txtTitleOverCat,txtAddrOverCat,flatlistItemCat,wrapInfoOver,
      imgUpCreate,imgUpLoc,imgUpSubCat,imgUpInfo,popoverLoc,
      padCreate,overLayout,imgInfo,overLayoutLoc,shadown,overLayoutSer,listCatOver,listOverService,colorText,
      favIC,marRight,
    } = styles;
    //console.log('this.props.navigation',this.props.navigation);
    return (
      <View style={container}>
      <TouchableOpacity style={[btnScrollTop,scrollToTop ? show : hide ]}
      onPress={()=>{
        this.refs.listPro.scrollToOffset({x: 0, y: 0, animated: true});
        this.setState({scrollToTop:false});
      }}>
      <Image source={topIC} style={{width:40,height:40}} />
      </TouchableOpacity>
      <View style={headStyle}>
          <View style={headContent}>
          <TouchableOpacity
          onPress={()=>goBack()}
          >
          <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
          </TouchableOpacity>
              <Image source={logoTop} style={imgLogoTop} />
              <View></View>
          </View>
          <View style={{marginTop:Platform.OS==='ios' ? 7 : 10}}></View>
        <TextInput
        underlineColorAndroid='transparent' style={inputSearch}
        placeholder={lang.search}
        onChangeText={(keyword)=>this.setState({keyword})}
        onSubmitEditing={(event)=>{
          if(keyword!==''){
            this.getContentByDist(idDist,id_sub,id_serv);
          }
        }}
        value={keyword} />

        <TouchableOpacity style={{top:Platform.OS==='ios' ? 75 : 65,left:(width-50),position:'absolute'}}
        onPress={()=>{
          if (keyword!=='') {
            Keyboard.dismiss();
            this.getContentByDist(idDist,id_sub,id_serv);
          }
        }}>
          <Image style={{width:16,height:16,}} source={searchIC} />
        </TouchableOpacity>

      </View>

        <View style={wrapFilter}>
                <View style={filterFrame}>
                <TouchableOpacity
                  onPress={()=>this.setState({ showLoc:!this.state.showLoc,listSubCat:{showList:false},listSerItem:{showList:false}, })}
                  style={[selectBoxBuySell,widthLoc]}>
                    <Text  numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelLoc}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>this.setState({ listSubCat:{showList:!this.state.listSubCat.showList},listSerItem:{showList:false}, showLoc:false})}
                  style = {[selectBoxBuySell,widthLoc]}>
                    <Text  numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelCat}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>

                <TouchableOpacity
                onPress={()=>this.setState({ listSubCat:{showList:false},listSerItem:{showList:!this.state.listSerItem.showList}, showLoc:false})}
                style = {[selectBoxBuySell,widthLoc]}>
                    <Text numberOfLines={1} style={{color:'#303B50'}}>{this.state.labelSer}</Text>
                    <Image source={sortDownIC} style={{width:12,height:13,top:13,right:5,position:'absolute'}} />
                </TouchableOpacity>
              </View>
        </View>

        <View style={[wrapListLoc,padLoc]}>
              <FlatList
                     ref="listPro"
                     onScroll={(e) => {
                       if(e.nativeEvent.velocity.y < 0 ){
                         this.setState({scrollToTop: false});
                       }else {
                         this.setState({scrollToTop: true});
                       }
                       //
                     }}
                     style={{marginBottom:Platform.OS==='ios' ? 130 : 150}}
                     ListEmptyComponent={<Text>{noData==='' ? `${'Loading ...'}` : noData }</Text> }
                     //refreshing={isRefresh}
                     extraData={this.state}
                     onEndReachedThreshold={0.5}
                     onEndReached={() => this.onRefresh()}
                     data={listData}
                     keyExtractor={(item,index) => item.id || index}
                     renderItem={({item}) => (
                       <View style={flatlistItemCat}>
                           <TouchableOpacity
                           onPress={()=>{
                             this.setState({pullToRefresh:false},()=>{
                               navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc:this.state.curLoc,lang:lang})
                               //console.log('lang2',lang);
                             })
                           }}>
                             <Image style={imgFlatItem} source={{uri:`${global.url_media}${item.avatar}`}} />
                           </TouchableOpacity>
                           <View style={wrapInfoOver}>
                             <View>
                               <TouchableOpacity
                               onPress={()=>{
                                 this.setState({pullToRefresh:false},()=>{
                                   navigate('DetailScr',{idContent:item.id,lat:item.lat,lng:item.lng,curLoc:this.state.curLoc,lang:lang.lang})
                                 })
                               }}>
                                   <Text style={txtTitleOverCat} numberOfLines={2}>{item.name}</Text>
                               </TouchableOpacity>
                                   <Text style={txtAddrOverCat} numberOfLines={1}>{`${item.address}${', '}${item._district.name}${', '}${item._city.name}${', '}${item._country.name}`}</Text>
                             </View>

                               <View style={{flexDirection:'row'}}>
                                   <View style={{flexDirection:'row',paddingRight:10}}>
                                      <TouchableOpacity onPress={()=>this.saveLike(item.id)}>
                                     <Image style={{width:22,height:18,marginRight:5}} source={item.like>0 ? likeFullIcon : likeIC} />
                                     </TouchableOpacity>
                                     <Text>{item.like}</Text>
                                   </View>
                                   <View style={{paddingRight:10}}>
                                     <Text> | </Text>
                                   </View>
                                   <View  style={{flexDirection:'row',paddingRight:10}}>
                                     <TouchableOpacity onPress={()=>{this.saveVote(1,item.id)} }>
                                     <Rating rate={1} showVote={item.vote} styleIMG={favIC} />
                                     </TouchableOpacity>
                                     <TouchableOpacity onPress={()=>{this.saveVote(2,item.id)} }>
                                     <Rating rate={2} showVote={item.vote} styleIMG={favIC} />
                                     </TouchableOpacity>

                                     <TouchableOpacity onPress={()=>{this.saveVote(3,item.id)} }>
                                     <Rating rate={3} showVote={item.vote} styleIMG={favIC} />
                                     </TouchableOpacity>

                                     <TouchableOpacity onPress={()=>{this.saveVote(4,item.id)} }>
                                     <Rating rate={4} showVote={item.vote} styleIMG={favIC} />
                                     </TouchableOpacity>

                                     <TouchableOpacity onPress={()=>{this.saveVote(5,item.id)} }>
                                     <Rating rate={5} showVote={item.vote} styleIMG={[favIC,marRight]} />
                                     </TouchableOpacity>

                                     <Text>{item.vote}</Text>
                                   </View>
                               </View>

                           </View>
                       </View>
                     )}
                   />
        </View>


        <Modal onRequestClose={() => null} transparent visible={this.state.showLoc}>
        <TouchableOpacity
        onPress={()=>this.setState({showLoc:!this.state.showLoc})}
        style={[popoverLoc,padCreate]}>
          <Image style={[imgUpCreate,imgUpLoc]} source={upDD} />
          <View style={[overLayout,shadown]}>
              <SelectLocation saveLocation={this.saveLocation.bind(this)} />
          </View>
          </TouchableOpacity>
          </Modal>

        <Modal onRequestClose={() => null} transparent visible={this.state.listSubCat.showList}>
        <TouchableOpacity
        onPress={()=>this.setState({listSubCat:{showList:!this.state.listSubCat.showList}})}
        style={[popoverLoc,padCreate]}>
        <Image style={[imgUpCreate,imgUpSubCat]} source={upDD} />
            <View style={[overLayoutLoc,shadown]}>
            <FlatList
               keyExtractor={item => item.id}
               data={sub_cat}
               renderItem={({item}) => (
                 <TouchableOpacity
                 onPress={()=>{
                   this.getContentByDist(this.state.idDist,item.id,this.state.id_serv);
                   this.setState({listSubCat:{showList:!this.state.listSubCat.showList},id_sub:item.id,labelCat:item.name});
               }}
                 style={listCatOver}>
                   <Text style={colorText}>{item.name}</Text>
               </TouchableOpacity>
            )} />

            <TouchableOpacity
                onPress={()=>{
                  this.getContentByDist(this.state.idDist,null,this.state.id_serv);
                  this.setState({listSubCat:{showList:!this.state.listSubCat.showList},id_sub:null,labelCat:'Danh mục'});
              }}
                style={listCatOver}>
                  <Text style={colorText}>Tất cả</Text>
          </TouchableOpacity>

            </View>
        </TouchableOpacity>
        </Modal>

        <Modal onRequestClose={() => null} transparent visible={this.state.listSerItem.showList}>
        <TouchableOpacity
        onPress={()=>this.setState({listSerItem:{showList:!this.state.listSerItem.showList}})}
        style={[popoverLoc,padCreate]}>
        <Image style={[imgUpCreate,imgUpInfo]} source={upDD} />
            <View style={[overLayout,shadown]}>

            <FlatList
               extraData={this.state}
               keyExtractor={(item, index) => index}
               data={serv_items}
               renderItem={({item}) => (
              <View  style={listOverService}>
              <TouchableOpacity
                 onPress={()=>{
                  let idServ = this.state.id_serv;
                  let lblArr = this.state.labelSer;
                  if(lblArr==='Dịch vụ'){ lblArr =`${item.name}`;}else {
                    lblArr =`${this.state.labelSer}`;
                  }
                  clearTimeout(timeout);
                  //console.log('lblArr1',lblArr);
                  const arr = JSON.parse(`[${idServ}]`);
                  if(idServ==='-1'){ idServ=`-1,${item.id}`; }else{
                    if(arr.includes(item.id)){
                      remove(arr, item.id);idServ = arr.toString();

                      if(this.state.showServie[`${item.id}`]===item.id) lblArr = removeText(lblArr,item.name);
                      if(idServ==='') {idServ='-1,';}
                      }else {
                      idServ = `${this.state.id_serv},${item.id}`;
                      lblArr =`${this.state.labelSer},${item.name}`;
                      //console.log('lblArr3',lblArr);
                    }

                  }
                  if(lblArr==='') lblArr='Dịch vụ';
                  //console.log('lblArr4',lblArr);
                  if(this.state.showServie[`${item.id}`]!==item.id)
                    this.setState({
                      showServie: Object.assign(this.state.showServie,{[item.id]:item.id}),labelSer:lblArr,id_serv:idServ
                    },()=>{
                      timeout = setTimeout(()=>{
                        this.getContentByDist(this.state.idDist,this.state.id_sub,idServ);
                      },2000)
                    });
                    //if(`${this.state.labelSer}`.includes(labelServ)) this.setState({labelSer:labelServ});
                  else
                    this.setState({
                      showServie: Object.assign(this.state.showServie,{[item.id]:!item.id}),labelSer:lblArr,id_serv:idServ
                    },()=>{
                      timeout = setTimeout(()=>{
                        this.getContentByDist(this.state.idDist,this.state.id_sub,idServ);
                      },2000)
                    });
                  }}
                  style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}
                >
                   <Text style={colorText}>{item.name}</Text>
                   <Image style={[imgInfo, this.state.showServie[`${item.id}`]===item.id  ? show : hide]} source={checkIC}/>

               </TouchableOpacity>
               </View>
            )} />

            <View style={listOverService}>
                <TouchableOpacity  style={{padding:15}}
                   onPress={()=>{

                    this.getContentByDist(this.state.idDist,this.state.id_sub,'-1,');
                    this.setState({listSerItem:{showList:!this.state.listSerItem.showList},id_serv:'-1',labelSer:'Dịch vụ',showServie:{} });
                    }}
                  >
                     <Text style={colorText}>Tất cả</Text>
                 </TouchableOpacity>
             </View>

            </View>
        </TouchableOpacity>
        </Modal>

      </View>
    );
  }
}
