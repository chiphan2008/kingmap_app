/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,FlatList,Modal,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import getApi from '../api/getApi';
import checkLogin from '../api/checkLogin';
import loginServer from '../api/loginServer';
import global from '../global';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import plusIC from '../../src/icon/ic-home/ic-plus.png';
import closeIC from '../../src/icon/ic-home/ic-close.png';

export default class ListBuySell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData:[],
      activeTab:'mua',
      isLogin:false,
      showCreate:false,
      user_id:'',
      avatar:'',

    }
    this.getData();
    checkLogin().then(e=>{
      //console.log(e);
      if(e.id===undefined){
        this.setState({isLogin:false})
      }else {
        loginServer(e);
        this.setState({user_id:e.id,avatar:e.avatar,isLogin:true});
      }
    })
  }

  requestLogin(){
    if(this.state.isLogin===false){
      this.props.navigation.navigate('LoginScr',{backScr:'MainScr'});
    }
  }

  getData(){
    //const { activeTab } = this.state;
    //if(kind===null) kind=activeTab;
    const url = `${global.url}${'raovat-type'}`;
    getApi(url)
    .then(arrData => {
        this.setState({ listData: arrData.data });
    })
    .catch(err => console.log(err));
  }



  render() {
    const { lang,name_module } = this.props.navigation.state.params;

    const { navigation } = this.props;
    const { listData,activeTab,showCreate,user_id } = this.state;
    const {
      container,contentWrap,headCatStyle,headContent,titleCreate,
      wrapWhite,wrapTab,borderActive,tabCenter,colorTabActive,colorName,
      activeMua,activeBan,activeThue,activeChoThue,
      hide,show,imgPlusStyle,plusStyle,popoverCreate,itemCreate,colorlbl,
      flatItem,flatlistItem,wrapDistribute,shadown,
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${name_module}`.toUpperCase()} </Text>
              <View></View>
          </View>
      </View>

        <View style={contentWrap}>
        <View style={{backgroundColor:'#F8F7F8',flexDirection:'row',borderBottomWidth:1,borderColor:'#D7D6D7',width}}>
          <TouchableOpacity style={[wrapTab,activeTab==='mua' ? activeMua : '']}
          onPress={()=>{
            if(activeTab!=='mua'){
              this.setState({activeTab:'mua'})
            }
          }}>
          <Text style={[activeTab==='mua' ? colorTabActive : colorName,tabCenter]}> Mua </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[wrapTab,activeTab==='ban' ? activeBan : '']}
          onPress={()=>{
            if(activeTab!=='ban'){
              this.setState({activeTab:'ban'})
            }
          }}>
          <Text style={[activeTab==='ban' ? colorTabActive : colorName,tabCenter]}> Bán </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[wrapTab,activeTab==='thue' ? activeThue : '']}
          onPress={()=>{
            if(activeTab!=='thue'){
              this.setState({activeTab:'thue'})
            }
          }}>
          <Text style={[activeTab==='thue' ? colorTabActive : colorName,tabCenter]}> Thuê </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[wrapTab,activeTab==='cho_thue' ? activeChoThue : '']}
          onPress={()=>{
            if(activeTab!=='cho_thue'){
              this.setState({activeTab:'cho_thue'})
            }
          }}>
          <Text style={[activeTab==='cho_thue' ? colorTabActive : colorName,tabCenter]}> Cho thuê </Text>
          </TouchableOpacity>

        </View>
        <View style={[wrapDistribute,shadown]}>
          <View style={flatlistItem}>
            <FlatList
               numColumns={3}
               extraData={this.state}
               keyExtractor={item => item.id}
               data={listData}
               renderItem={({item}) =>(
                 <TouchableOpacity style={flatItem}
                 onPress={()=>{navigation.navigate('ListProductBScr',{kind:activeTab,raovat_type:item.id,cat_name:item.name,subtypes:item._subtypes})}}>
                 <Image source={{uri:`${global.url_media}${item.image}`}} style={{width:65,height:65,marginBottom:10}} />
                 <Text style={{color:'#2F3540',fontSize:16}}>{item.name} ({item.count_raovat[activeTab]})</Text>
                 </TouchableOpacity>
               )}
             />
           </View>
        </View>
        <TouchableOpacity
        onPress={()=>{
          this.requestLogin();
          if(this.state.isLogin){
            this.setState({showCreate:!showCreate});
          }
        }}
        style={plusStyle}>
            <Image source={plusIC} style={[imgPlusStyle, showCreate===false ? show : hide]} />
        </TouchableOpacity>
        </View>

        <Modal
        onRequestClose={() => null}
        transparent
        visible={showCreate}>
        <View style={popoverCreate}>
            <TouchableOpacity
            onPress={()=>{
              this.setState({showCreate:false});
              navigation.navigate('CreateBuySellScr',{kind:'mua',user_id,sub_module:'Đăng tin cần mua',lang,name_module});
            }}
            style={itemCreate}>
              <Text style={colorlbl}>Đăng tin cần mua</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={()=>{
              this.setState({showCreate:false});
              navigation.navigate('CreateBuySellScr',{kind:'ban',user_id,sub_module:'Đăng tin cần bán',lang,name_module});
            }}
            style={itemCreate}>
              <Text style={colorlbl}>Đăng tin cần bán</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={()=>{
              this.setState({showCreate:false});
              navigation.navigate('CreateBuySellScr',{kind:'thue',user_id,sub_module:'Đăng tin cần thuê',lang,name_module});
            }}
            style={itemCreate}>
              <Text style={colorlbl}>Đăng tin cần thuê</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={()=>{
              this.setState({showCreate:false});
              navigation.navigate('CreateBuySellScr',{kind:'cho_thue',user_id,sub_module:'Đăng tin cho thuê',lang,name_module});
            }}
            style={itemCreate}>
              <Text style={colorlbl}>Đăng tin cho thuê</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={()=>this.setState({showCreate:!showCreate})}
            >
            <Image source={this.state.showCreate===false ? plusIC : closeIC} style={imgPlusStyle} />
            </TouchableOpacity>
        </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignSelf: 'stretch',
  },
  wrapDistribute:{
    width:width-20,borderRadius:5,backgroundColor:'#fff',minHeight:height,
    flexDirection:'row',
    paddingBottom: Platform.OS==='ios' ? 80 : 40,
    marginTop:8,
  },
  shadown:{
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#999',
    shadowOpacity: .5,
  },
  flatlistItem:{
    width:(width-20),
    flexDirection:'row',
  },
  flatItem:{
    alignItems:'center',
    justifyContent:'center',
    borderBottomWidth:1,
    borderBottomColor:'#E3E4E8',
    borderRightWidth:1,
    borderRightColor:'#E3E4E8',
    width:(width-24)/3,
    padding:10,
    paddingTop:20,
  },
  colorlbl :{color:'#323640',fontSize:16},
  itemCreate:{marginBottom:10,backgroundColor:'#fff',width: 170,padding:15,borderRadius:5, alignItems:'center'},
  popoverCreate : {
    paddingBottom: Platform.OS ==='ios' ? 95 :100,
    paddingRight:10,
    position:'absolute',
    alignItems:'flex-end',
    justifyContent:'flex-end',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:5,
  },
  plusStyle :{position:'absolute',right:10,bottom:210,zIndex:999},
  imgPlusStyle:{
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#999',
    shadowOpacity: .2,
    width:60,height:60,
  },
  titleHead:{fontSize:18,fontWeight:'bold',color:'#2F353F'},
  titleNormal:{fontSize:16,color:'#2F353F',marginTop:5,lineHeight:25,textAlign:'center'},
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  wrapWhite:{
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems:'center',
    padding:10,
    paddingLeft:15,
    marginBottom:1,
    width
  },
  marTop:{marginTop:20},
  contentWrap : { width,alignItems: 'center',marginTop:0},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },

  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  colorName:{color:'#84899A',fontSize:16},
  colorTabActive:{color:'#fff',fontSize:16,fontWeight:'400'},
  wrapTab:{width:width/4,alignItems:'center',justifyContent:'center',borderRightWidth:1,borderColor:'#D7D6D7',height:50},
  activeMua:{backgroundColor:'#E8AA42'},
  activeBan:{backgroundColor:'#90BD62'},
  activeThue:{backgroundColor:'#5D8CDC'},
  activeChoThue:{backgroundColor:'#D0554E'},
  borderActive:{borderColor:'#5b89ab',borderBottomWidth:3},
  tabCenter:{textAlign:'center'},
  show : { display: 'flex'},
  hide : { display: 'none'},

})
