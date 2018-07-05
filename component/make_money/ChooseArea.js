/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,TouchableOpacity,Modal,FlatList,TouchableWithoutFeedback
} from 'react-native';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import postApi from '../api/postApi';
import upDD from '../../src/icon/ic-white/ic-dropdown_up.png';
import checkLocation from '../api/checkLocation';
import checkLogin from '../api/checkLogin';
import checkIC from '../../src/icon/ic-check.png';

var timeoutRecive;
export default class ChooseArea extends Component {
  constructor(props){
    super(props);
    this.state = {
      idCountry:'',nameCountry:'',listCountry:[],showCountry:false,
      idCity:'',nameCity:'',listCity:[],showCity:false,chooseCity:{},
      idDist:'',nameDist:'Quận/Huyện',listDist:[],showDist:false,
      update:true,ctv_id:'',daily_id:'',chooseDist:{},
    }
    checkLocation().then(e=>{
      this.setState({
        idCountry:e.idCountry, nameCountry:e.nameCountry,
        idCity:e.idCity, nameCity:e.nameCity,
        chooseCity: Object.assign(this.state.chooseCity,{[e.idCity]:e.idCity})
      })
    });
    checkLogin().then(el=>{
      if(el.api_roles!==null){
        el.api_roles.tong_dai_ly!==undefined && this.setState({daily_id:el.id});
        el.api_roles.cong_tac_vien!==undefined && this.setState({ctv_id:el.id});
      }
    })
  }
  getCountry(){
    const {_area} = this.props.itemChoose;
    let url = `${global.url}${'countries'}`;
    //if(this.state.ctv_id!=='') url += `${'?ctv_id='}${this.state.ctv_id}`;
    //console.log(url);
    getApi(url).then(arrData => {
        this.state.listCountry=arrData.data;
        if(_area!==undefined){
          this.state.idCountry=_area.country[0];
        }
        this.setState(this.state);
    }).catch(err => console.log(err));
  }
  getCity(id){
    const {_area} = this.props.itemChoose;
    let url = `${global.url}${'cities/'}${id}`;
    //if(this.state.ctv_id!=='') url += `${'?ctv_id='}${this.state.ctv_id}`;

    //console.log(url);
    getApi(url).then(arrData => {
      this.state.listCity=arrData.data;
      if(_area!==undefined){
        let lCity={};
        _area.city.forEach(e=>{
          lCity= Object.assign(lCity,{[e]:e})
        });
        this.state.chooseCity=lCity;
      }
      this.setState(this.state);
    }).catch(err => console.log(err));
    //this.getDist();
  }
  getDist(){
    const {_area} = this.props.itemChoose;
    let url = `${global.url}${'static/district'}`;
    //if(this.state.ctv_id!=='') url += `${'?ctv_id='}${this.state.ctv_id}`;
    const arr = new FormData();
    Object.entries(this.state.chooseCity).forEach(e=>{
      e[1] && arr.append('city[]',e[1]);
    })
    //console.log(url);
    //console.log(arr);
    postApi(url,arr).then(arrData => {
      this.state.listDist=arrData.data;
      if(_area!==undefined){
        let lDist={};
        _area.district.forEach(e=>{
          lDist= Object.assign(lDist,{[e]:e})
        });
        this.state.chooseDist=lDist;
      }
      this.setState(this.state);
    }).catch(err => console.log(err));
  }
  componentWillUnmount(){
    clearTimeout(timeoutRecive);
  }
  getName(route,id){
    getApi(`${global.url}${route}/${id}`)
    .then(arrData => {
        if(route==='country') this.state.nameCountry= arrData.data[0].name;
        if(route==='city') this.state.nameCity= arrData.data[0].name;
        if(route==='district') this.state.nameDist= arrData.data[0].name;
        this.setState(this.state);
    })
    .catch(err => console.log(err));
  }
  // componentWillUpdate(){
  //   clearTimeout(timeoutRecive);
  //   const {_area} = this.props.itemChoose;
  //   timeoutRecive = setTimeout(()=>{
  //   if(_area!==undefined){
  //      this.getName('country',idCountry);
  //      this.getName('city',idCity);
  //      this.getName('district',idDist);
  //     this.state.update && this.setState({idCountry, idCity,  idDist},()=>{
  //       this.setState({update:false});
  //       //console.log('nameDist',nameDist);
  //     })
  //   }else {
  //       //console.log('null');
  //       this.state.update && checkLocation().then(e=>{
  //         //console.log(e);
  //         this.setState({idCountry:e.idCountry, nameCountry:e.nameCountry,idCity:e.idCity, nameCity:e.nameCity,},()=>{
  //           this.setState({update:false});
  //         })
  //       });
  //   }
  // },500)
  // }

  render() {
    const {
      listCreate,itemKV,txtKV,popoverLoc,padCreate,imgUpCreate,imgUpLoc,overLayout,shadown,
      colorlbl,listOverService,imgUpInfo,txtNextItem
    } = styles;
    const { lang } = this.props;
    const {listCity,chooseCity,chooseDist,idCountry,nameCountry,nameCity,nameDist} = this.state;
    return (
      <View>
      <View style={listCreate}>
          <TouchableOpacity
          onPress={()=>{ this.setState({ showCountry:true });this.getCountry() }}
          style={itemKV}>
            <Text numberOfLines={1} style={txtKV}>{nameCountry!=='' && nameCountry!==undefined ?nameCountry:this.state.nameCountry}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{this.setState({ showCity:true });this.getCity(this.state.idCountry)}}
          style={itemKV}>
            <Text numberOfLines={1} style={txtKV}>{nameCity!=='' && nameCity!==undefined ?nameCity:this.state.nameCity}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{this.setState({ showDist:true }); this.getDist()}}
          style={itemKV}>
            <Text numberOfLines={1} style={txtKV}>{nameDist!=='' && nameDist!==undefined ?nameDist:this.state.nameDist}</Text>
          </TouchableOpacity>

          <Modal onRequestClose={() => null} transparent visible={this.state.showCountry}>
          <TouchableOpacity
          onPress={()=>this.setState({ showCountry:false }) }
          style={[popoverLoc,padCreate]}>
          {/*<Image style={[imgUpCreate,imgUpLoc]} source={upDD} />*/}
              <View style={[overLayout,shadown]}>
              <FlatList
                 extraData={this.state}
                 keyExtractor={(item, index) => index.toString()}
                 data={this.state.listCountry}
                 renderItem={({item}) => (
                <View  style={listOverService}>
                <TouchableOpacity
                    onPress={()=>{
                      this.setState({
                      idCountry:item.id,nameCountry:item.name,showCountry:false,
                      idCity:'', nameCity:lang.city,idDist:'',nameDist:lang.district,
                     })}}
                    style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}} >
                     <Text style={colorlbl}>{item.name}</Text>
                     {idCountry===item.id && <Image source={checkIC} style={{width:18,height:18}}/>}
                 </TouchableOpacity>
                </View>
              )} />
              </View>
          </TouchableOpacity>
          </Modal>

          <Modal onRequestClose={() => null} transparent visible={this.state.showCity}>
          <TouchableOpacity
          onPress={()=>this.setState({ showCity:false }) }
          style={[popoverLoc,padCreate]}>
          {/*<Image style={[imgUpCreate]} source={upDD} />*/}
              <View style={[overLayout,shadown]}>
              <FlatList
                 extraData={this.state}
                 keyExtractor={(item, index) => index.toString()}
                 data={this.state.listCity}
                 renderItem={({item}) => (
                <View  style={listOverService}>
                <TouchableOpacity
                    onPress={()=>{

                      this.state.idCity=item.id;
                      //this.state.nameCity=item.name;
                      this.state.idDist='';
                      this.state.nameDist=lang.district;
                      if(chooseCity[item.id]){
                        this.state.chooseCity= Object.assign(chooseCity,{[item.id]:!item.id});
                      }else {
                        this.state.chooseCity= Object.assign(chooseCity,{[item.id]:item.id});
                      }
                      this.setState(this.state);
                    }}
                    style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}} >
                     <Text style={colorlbl}>{item.name}</Text>
                     {chooseCity[item.id] && <Image source={checkIC} style={{width:18,height:18}}/>}
                 </TouchableOpacity>
                </View>
              )} />
              </View>
          </TouchableOpacity>
          </Modal>

          <Modal onRequestClose={() => null} transparent visible={this.state.showDist}>
          <View style={popoverLoc}>
          <TouchableOpacity
          onPress={()=>{this.setState({ showDist:false });}}
          style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          {/*<Image style={[imgUpCreate,imgUpInfo]} source={upDD} />*/}
          <TouchableWithoutFeedback>
              <View style={[overLayout,shadown]}>
              <FlatList
                 extraData={this.state}
                 keyExtractor={(item, index) => index.toString()}
                 data={this.state.listDist}
                 renderItem={({item}) => (
                   <View>
                     <View style={listOverService}>
                        <View style={{padding:15}}>
                          <Text style={txtNextItem}>{item.city.name}</Text>
                        </View>
                     </View>
                        {item.districts.map(e=>{
                          return (<View key={e.id} style={listOverService}>
                              <TouchableOpacity
                                  onPress={()=>{
                                      //this.state.idDist = e.id;
                                      //this.state.nameDist = e.name;
                                    if(chooseDist[e.id]){
                                      this.state.chooseDist= Object.assign(chooseDist,{[e.id]:!e.id});
                                    }else {
                                      this.state.chooseDist= Object.assign(chooseDist,{[e.id]:e.id});
                                    }
                                    this.setState(this.state,()=>{
                                      this.props.setDist(chooseDist);
                                    });
                                  }}
                                  style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}} >
                                   <Text style={colorlbl}>{e.name}</Text>
                                   {chooseDist[e.id] && <Image source={checkIC} style={{width:18,height:18}}/>}
                               </TouchableOpacity>
                         </View>)
                        })}
                  </View>
              )} />
              </View>
              </TouchableWithoutFeedback>
          </TouchableOpacity>
          </View>
          </Modal>

      </View>
      </View>
    );
  }
}
