/* @flow */

import React, { Component } from 'react';
import {
  View,Text,Modal,TouchableOpacity,Image,
  TextInput,Dimensions,FlatList,
} from 'react-native';
import styles from '../../styles';
import getApi from '../../api/getApi';
import global from '../../global';

import arrowLeft from '../../../src/icon/ic-white/arrow-left.png';
import searchIC from '../../../src/icon/ic-white/ic-search.png';
import checkIC from '../../../src/icon/ic-create/ic-check.png';
import {checkUrl} from '../../libs';
const {width,height} = Dimensions.get('window');

export default class ChangeOwner extends Component {
  constructor(props){
    super(props);
    this.state = {
      txtLoc:'',
      txtUser:'',
      listData:[],
      arrLoc:{},
    }
  }
  getData(userId){
    //const {userId} = this.props;
    const url = `${global.url}${'user/list-location/'}${userId}`;
    console.log(url);
    getApi(url)
    .then(arrData => {
      setTimeout(()=>{
        this.setState({ listData: arrData.data });
      },2000)
    })
    .catch(err => console.log(err));
  }
  chooseLoc(id){
    if(this.state.arrLoc[id]){
      this.setState({ arrLoc: Object.assign(this.state.arrLoc,{[id]:!id}) })
    }else {
      this.setState({ arrLoc: Object.assign(this.state.arrLoc,{[id]:id}) })
    }
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,
      titleTab,titleActive,inputLoc,btnSearchOwn,
      imgShare,show,hide,colorlbl
    } = styles;
    const {visible,title,lang,userId} = this.props;
    //console.log(userId);
    const {txtLoc,txtUser,listData,arrLoc} = this.state;
    return (
      <Modal onRequestClose={() => null} transparent
      //animationType={'slide'}
      visible={visible} >
        <View style={container}>
          <View style={headCatStyle}>
              <View style={headContent}>
                  <TouchableOpacity onPress={()=>this.props.closeModal()}>
                  <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                  </TouchableOpacity>
                    <Text style={titleCreate}> {title} </Text>
                  <View></View>
              </View>
          </View>
          <View style={{backgroundColor:'#fff'}}>
            <View style={{padding:15}}>

               <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                   <TextInput underlineColorAndroid='transparent' ref='Users'
                   placeholder={lang.enter_email_number} style={inputLoc}
                   onChangeText={(txtUser) => this.setState({txtUser})}
                   value={txtUser}
                   returnKeyType = {"done"}
                    />
                    <TouchableOpacity style={btnSearchOwn}>
                    <Image source={searchIC} style={{width:20,height:20}} />
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <TextInput underlineColorAndroid='transparent'
                    returnKeyType = {"next"}
                    onSubmitEditing={(event) => {this.refs.Users.focus();}}
                    placeholder={lang.name_location} style={inputLoc}
                    onChangeText={(txtLoc) => this.setState({txtLoc})}
                    value={txtLoc}
                     />
                   <TouchableOpacity style={btnSearchOwn}>
                   <Image source={searchIC} style={{width:20,height:20}} />
                   </TouchableOpacity>
                </View>

             </View>
         </View>

         <View style={{padding:15}}>
         <FlatList
            extraData={this.state}
            data={listData}
            keyExtractor={(item,index) => index}
            renderItem={({item}) =>(
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <View style={{flexDirection:'row',maxWidth:width-50}}>
                      <TouchableOpacity onPress={()=>this.chooseLoc(item.id)} >
                        <Image source={{uri:checkUrl(item.avatar) ? item.avatar : `${global.url_media}${item.avatar}`}} style={{width:50,height:40,marginRight:10}} />
                      </TouchableOpacity>
                      <View>
                      <TouchableOpacity onPress={()=>{this.chooseLoc(item.id)} } >
                        <Text numberOfLines={1} style={colorlbl}>{item.name}</Text>
                      </TouchableOpacity>
                      <Text numberOfLines={1} style={{color:'#6791AF'}}>{`${item.address}, ${item._district.name}, ${item._city.name}, ${item._country.name},`}</Text>
                      </View>
                  </View>
                    <Image source={checkIC} style={[imgShare,arrLoc[item.id] ? show : hide ]} />
              </View>
            )} />
         </View>

        </View>
        </Modal>
    );
  }
}
