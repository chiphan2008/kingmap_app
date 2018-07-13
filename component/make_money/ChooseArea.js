/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,TouchableOpacity,Modal,FlatList,TouchableWithoutFeedback,
  Alert,Dimensions,
} from 'react-native';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import postApi from '../api/postApi';
import upDD from '../../src/icon/ic-white/ic-dropdown_up.png';
import checkLocation from '../api/checkLocation';
import checkLogin from '../api/checkLogin';
import checkIC from '../../src/icon/ic-create/ic-check.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import arrowbottomIC from '../../src/icon/ic-arrowbottom.png';
import nextIC from '../../src/icon/ic-next.png';
import prevIC from '../../src/icon/ic-prev.png';
import {CheckTF} from '../libs';
const {height, width} = Dimensions.get('window');
var timeoutRecive;

export default class ChooseArea extends Component {
  constructor(props){
    super(props);
    this.state = {
      idCountry:'',nameCountry:'',listCountry:[],showCountry:false,
      idCity:'',nameCity:'',listCity:[],showCity:false,chooseCity:{},
      idDist:'',nameDist:'Quận/Huyện',listDist:[],showDist:false,
      update:true,ctv_id:'',daily_id:'',chooseDist:{},showListDist:{},
    }
    checkLocation().then(e=>{
      this.setState({
        idCountry:e.idCountry, nameCountry:e.nameCountry,
        idCity:e.idCity, nameCity:e.nameCity,
        chooseCity: Object.assign(this.state.chooseCity,{[e.idCity]:true})
      })
    });
    checkLogin().then(el=>{
      if(el.api_roles!==null){
        el.api_roles.tong_dai_ly!==undefined && this.setState({daily_id:el.id});
        el.api_roles.cong_tac_vien!==undefined && this.setState({ctv_id:el.id});
      }
    })
    this.getCountry();
  }

  getStateChoose(){
    const {_area} = this.props.itemChoose;
    this.state.idCountry=_area.country[0];
    this.setState(this.state);
  }
  getCountry(){

    let url = `${global.url}${'countries'}`;
    //if(this.state.ctv_id!=='') url += `${'?ctv_id='}${this.state.ctv_id}`;
    //console.log(url);
    getApi(url).then(arrData => {
        this.state.chooseCity={};
        this.state.showCountry=true;
        this.state.listCountry=arrData.data;
        this.setState(this.state);
    }).catch(err => console.log(err));
  }
  getCity(id){
    const {_area} = this.props.itemChoose;
    let url = `${global.url}${'cities/'}${id}`;
    getApi(url).then(arrData => {
      if(_area!==undefined){
        arrData.data.forEach(item=>{
          _area.city.includes(item.id) &&  this.setState({ chooseCity:Object.assign(this.state.chooseCity,{[item.id]:true}) })
        })
      }
      this.state.chooseDist={};
      this.state.listCity=arrData.data;
      this.setState(this.state);
    }).catch(err => console.log(err));
    //this.getDist();
  }
  getDist(){
    //const {_area} = this.props.itemChoose;
    let url = `${global.url}${'static/district'}`;
    const arr = new FormData();
    Object.entries(this.state.chooseCity).forEach(e=>{
      e[1] && arr.append('city[]',e[0]);
    })
    //console.log(url);
    //console.log(arr);chooseDist
    postApi(url,arr).then(arrData => {
      this.state.chooseDist = {};
      this.state.listDist=arrData.data;
      //this.state.showListDist=this.state.chooseCity;
      this.setState(this.state);
    }).catch(err => console.log(err));
  }
  componentWillUnmount(){
    clearTimeout(timeoutRecive);
  }
  // getName(route,id){
  //   getApi(`${global.url}${route}/${id}`)
  //   .then(arrData => {
  //       if(route==='country') this.state.nameCountry= arrData.data[0].name;
  //       if(route==='city') this.state.nameCity= arrData.data[0].name;
  //       if(route==='district') this.state.nameDist= arrData.data[0].name;
  //       this.setState(this.state);
  //   })
  //   .catch(err => console.log(err));
  // }


  render() {
    const {
      container,headCatStyle,headContent,
      listAdd,titleCreate,colorlbl,imgShare
    } = styles;
    const { lang,visible,itemChoose } = this.props;
    //console.log('itemChoose',itemChoose);
    const {
      listCity,chooseCity,chooseDist,listDist,idCountry,nameCountry,nameCity,nameDist,listCountry,
      showCountry,showCity,showDist,showListDist,
    } = this.state;
    //console.log(itemChoose)
    return (
      <View>
      <Modal
      onRequestClose={()=>null} transparent animationType={'slide'}
      visible={visible}
      >
        <View style={container} onLayout={()=>{
          itemChoose._area!==undefined && this.getStateChoose();
        }}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>this.setState({showDist:false,showCity:false,showCountry:true},()=>{
                    this.props.closeModal();
                  })} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                  <Text style={titleCreate}> {lang.choose_area} </Text>
                  <View></View>
              </View>
          </View>

          {showCountry && <FlatList
             extraData={this.state}
             data={listCountry}
             renderItem={({item}) =>(
               <TouchableOpacity onPress={()=>{
                 this.state.idCountry=item.id;
                 this.state.showCountry=false;
                 this.state.showCity=true;
                 this.setState(this.state,()=>this.getCity(item.id))
               }}
               style={listAdd}>
                 <Text style={colorlbl}>{item.name}</Text>
                 <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                 {idCountry===item.id && <Image source={checkIC} style={[imgShare]} />}
                 <Image source={arrowNextIC} style={[imgShare]} />
                 </View>
               </TouchableOpacity>
             )}
             keyExtractor={item => item.id.toString()}
           />}

           {showCity &&
             <View>
             <TouchableOpacity onPress={()=>{
               CheckTF(this.state.chooseCity).then(e=>{
                 if(e){
                   this.state.showCity = false;
                   this.state.showDist = true;
                   this.state.chooseDist={};
                   this.setState(this.state,()=>this.getDist());
                 }else {
                   Alert.alert(lang.notify,lang.plz_choose_dist);
                 }
               })

             }} style={[listAdd,{justifyContent:'flex-start',alignItems:'center'}]}>
               <Text style={{color:'#6791AF',fontSize:16}}>
               {lang.name_dist}
               </Text>
               <Image source={nextIC} style={{width:20,height:20}} />
             </TouchableOpacity>
             <FlatList
              extraData={this.state}
              data={listCity}
              style={{paddingBottom:55,height:height-140}}
              renderItem={({item}) =>(
                <TouchableOpacity onPress={()=>{
                  if(chooseCity[item.id]){
                    this.state.chooseCity = Object.assign(this.state.chooseCity,{[item.id]:false});
                  }else {
                    this.state.chooseCity = Object.assign(this.state.chooseCity,{[item.id]:true});
                  }
                  this.setState(this.state)
                }} style={listAdd}>
                  <Text style={colorlbl}>{item.name}</Text>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  {chooseCity[item.id] && <Image source={checkIC} style={[imgShare]} />}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id.toString()}
            />
            </View>
          }

          {showDist &&
            <View>
            <TouchableOpacity onPress={()=>{
              this.state.showCity = true;
              this.state.showDist = false;
              this.setState(this.state,()=>{
                this.props.chooseDist(chooseDist)
              })
            }} style={[listAdd,{justifyContent:'flex-start',alignItems:'center'}]}>
            <Image source={prevIC} style={{width:20,height:20}} />
              <Text style={{color:'#6791AF',fontSize:16}}>
              {lang.back}
              </Text>
            </TouchableOpacity>
            <FlatList
             extraData={this.state}
             data={listDist}
             style={{paddingBottom:55,height:height-140}}
             renderItem={({item}) =>(
               <View>
                   <TouchableOpacity style={[listAdd]} onLayout={()=>{
                     item.districts.map(e=>{
                       itemChoose._area!==undefined && itemChoose._area.district.includes(e.id) && this.setState({
                         chooseDist:Object.assign(this.state.chooseDist,{[e.id]:e.id})
                        })
                     })
                   }}
                   onPress={()=>{
                     if(showListDist[item.city.id]){
                       this.state.showListDist = Object.assign(this.state.showListDist,{[item.city.id]:false});
                     }else {
                       this.state.showListDist = Object.assign(this.state.showListDist,{[item.city.id]:true});
                     }
                     this.setState(this.state)
                   }}
                   >
                    <Text style={colorlbl}>{item.city.name}</Text>
                    <Image source={showListDist[item.city.id]?arrowbottomIC:arrowNextIC} style={[imgShare]} />
                  </TouchableOpacity>
                  {item.districts.map(e=>(
                    showListDist[item.city.id] && <TouchableOpacity  key={e.id} onPress={()=>{
                    if(chooseDist[e.id]){
                      this.state.chooseDist = Object.assign(this.state.chooseDist,{[e.id]:!e.id});
                    }else {
                      this.state.chooseDist = Object.assign(this.state.chooseDist,{[e.id]:e.id});
                    }
                    this.setState(this.state,()=>this.props.chooseDist(chooseDist));
                  }} style={listAdd}>
                    <Text style={colorlbl}>{e.name}</Text>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    {chooseDist[e.id] && <Image source={checkIC} style={[imgShare]} />}

                    </View>
                  </TouchableOpacity>) )}

               </View>
             )}
             keyExtractor={item => item.city.id.toString()}
           />
           </View>
         }

           <View style={{height:5}}></View>
        </View>
        </Modal>
      </View>
    );
  }
}
