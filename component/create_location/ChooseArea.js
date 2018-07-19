/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Image,TouchableOpacity,Modal,FlatList
} from 'react-native';
import styles from '../styles';
import global from '../global';
import getApi from '../api/getApi';
import upDD from '../../src/icon/ic-white/ic-dropdown_up.png';
import checkLocation from '../api/checkLocation';
import checkLogin from '../api/checkLogin';

var timeoutRecive;
export default class ChooseArea extends Component {
  constructor(props){
    super(props);
    this.state = {
      idCountry:'',nameCountry:'',listCountry:[],showCountry:false,
      idCity:'',nameCity:'',listCity:[],showCity:false,
      idDist:'',nameDist:'Quận/Huyện',listDist:[],showDist:false,
      update:true,
      ctv_id:'',
      daily_id:'',
    }
    checkLocation().then(e=>{
      this.setState({idCountry:e.idCountry, nameCountry:e.nameCountry,idCity:e.idCity, nameCity:e.nameCity,})
    });
    checkLogin().then(el=>{
      if(el.api_roles!==null){
        el.api_roles.tong_dai_ly!==undefined && this.setState({daily_id:el.id});
        el.api_roles.cong_tac_vien!==undefined && this.setState({ctv_id:el.id});
      }
    })
  }
  getCountry(){
    let url = `${global.url}${'countries'}`;
    if(this.state.ctv_id!=='') url += `${'?ctv_id='}${this.state.ctv_id}`;

    //console.log(url);
    getApi(url).then(arrData => {
        this.setState({ listCountry:arrData.data });
    }).catch(err => console.log(err));
  }
  getCity(id){
    let url = `${global.url}${'cities/'}${id}`;
    if(this.state.ctv_id!=='') url += `${'?ctv_id='}${this.state.ctv_id}`;

    //console.log(url);
    getApi(url).then(arrData => {
        this.setState({ listCity:arrData.data });
    }).catch(err => console.log(err));
    //this.getDist();
  }
  getDist(id){
    let url = `${global.url}${'districts/'}${id}`;
    if(this.state.ctv_id!=='') url += `${'?ctv_id='}${this.state.ctv_id}`;

    //console.log(url);
    getApi(url).then(arrData => {
        this.setState({ listDist:arrData.data });
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
  componentWillUpdate(){
    clearTimeout(timeoutRecive);
    const {idCountry, nameCountry,idCity, nameCity, idDist, nameDist} = this.props;
    timeoutRecive = setTimeout(()=>{
    if(idDist!=='' && idDist!==undefined){
       //console.log('!!!null',idDist);
       // this.getName('country',idCountry);
       // this.getName('city',idCity);
       // this.getName('district',idDist);
      this.state.update && this.setState({idCountry, idCity,  idDist},()=>{
        this.setState({update:false});
        //console.log('nameDist',nameDist);
      })
    }else {
        //console.log('null');
        this.state.update && checkLocation().then(e=>{
          //console.log(e);
          this.setState({idCountry:e.idCountry, nameCountry:e.nameCountry,idCity:e.idCity, nameCity:e.nameCity,},()=>{
            this.setState({update:false});
          })
        });
    }
  },500)
  }

  render() {
    const {
      listCreate,itemKV,txtKV,popoverLoc,padCreate,imgUpCreate,imgUpLoc,overLayout,shadown,
      colorlbl,listOverService,imgUpInfo,
    } = styles;
    const { lang,nameDist,nameCity,nameCountry } = this.props;
    //console.log('componentWillUnmount',nameCountry);
    //console.log('nameDist',this.props.nameDist);
    //this.props.nameDist!=='' && this.setState({nameDist:this.props.nameDist})
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
          onPress={()=>{this.setState({ showDist:true }); this.getDist(this.state.idCity)}}
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
                      this.props.setCountry(item.id);
                      this.setState({
                      idCountry:item.id,nameCountry:item.name,showCountry:false,
                      idCity:'', nameCity:lang.city,idDist:'',nameDist:lang.district,
                     })}}
                    style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}} >
                     <Text style={colorlbl}>{item.name}</Text>
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
                      this.props.setCity(item.id);
                      this.setState({
                      idCity:item.id,nameCity:item.name,showCity:false,
                      idDist:'',nameDist:lang.district,
                     })}}
                    style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}} >
                     <Text style={colorlbl}>{item.name}</Text>
                 </TouchableOpacity>
                </View>
              )} />
              </View>
          </TouchableOpacity>
          </Modal>

          <Modal onRequestClose={() => null} transparent visible={this.state.showDist}>
          <TouchableOpacity
          onPress={()=>{this.setState({ showDist:false });}}
          style={[popoverLoc,padCreate]}>
          {/*<Image style={[imgUpCreate,imgUpInfo]} source={upDD} />*/}
              <View style={[overLayout,shadown]}>
              <FlatList
                 extraData={this.state}
                 keyExtractor={(item, index) => index.toString()}
                 data={this.state.listDist}
                 renderItem={({item}) => (
                <View  style={listOverService}>
                <TouchableOpacity
                    onPress={()=>{
                      this.props.setDist(
                        this.state.idCountry,this.state.idCity,item.id,
                        this.state.nameCountry,this.state.nameCity,item.name);
                      this.setState({ idDist:item.id,nameDist:item.name,showDist:false });
                    }}
                    style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}} >
                     <Text style={colorlbl}>{item.name}</Text>
                 </TouchableOpacity>
                </View>
              )} />
              </View>

          </TouchableOpacity>
          </Modal>

      </View>
      </View>
    );
  }
}
