/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,TextInput,ScrollView,Alert,Modal,FlatList,Keyboard,
  DeviceEventEmitter,ActivityIndicator,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import postApi from '../api/postApi';
import getApi from '../api/getApi';
import global from '../global';
import language_vn from '../lang/vn/language';
import language_en from '../lang/en/language';
import AddImgProduct from './AddImgProduct';
import ChooseCat from './ChooseCat';
import ChooseArea from '../create_location/ChooseArea';

import checkIC from '../../src/icon/ic-green/ic-check.png';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import cameraIC from '../../src/icon/ic-create/ic-camera.png';
import {onlyNumber} from '../libs';
// import closeIC from '../../src/icon/ic-home/ic-close.png';
const listKind_vn=[
  {name:'Mua',val:'mua'},
  {name:'Bán',val:'ban'},
  {name:'Thuê',val:'thue'},
  {name:'Cho thuê',val:'cho_thue'},
];
const listKind_en=[
  {name:'Buy',val:'mua'},
  {name:'Sell',val:'ban'},
  {name:'Rent',val:'thue'},
  {name:'For rent',val:'cho_thue'},
];
export default class CreateBuySell extends Component {
  constructor(props) {
    super(props);
    const {lang} = this.props.navigation.state.params;
    //console.log('lang',lang);
    this.state = {
      lang:lang.lang==='vn'?language_vn:language_en,
      name:'',
      price:'',
      quantity:'',
      material:'',
      size:'',
      content:'',
      subtype:{},
      raovat_type:'',
      raovat_name:'',
      visible:false,
      errType:'',
      posted:false,
      showCat:false,
      showKind:false,
      arrImg:[],
      idCity:'',idCountry:'',idDist:'',
      kind:'',
      labelKind:'',
      listKind:lang.lang==='vn'?listKind_vn:listKind_en,
    }
    const {id} = this.props.navigation.state.params;
    if(id!==undefined) this.getContent(id);
  }
  submitImage(arrImg){
    this.setState({arrImg})
  }
  getContent(id){
    getApi(`${global.url}${'raovat/get/'}${id}`).then(arrData=>{
      const content = arrData.data[0];
      this.state.name=content.name;
      this.state.price=content.price;
      this.state.raovat_type=content.raovat_type;
      this.state.raovat_name=content._type.name;
      this.state.kind=content.kind;
      this.state.content=content.content;
      this.state.idCountry=content.country;
      this.state.idCity=content.city;
      this.state.idDist=content.district;
      this.state.arrImg=content._images;
      this.state.listKind.forEach(e=>{
        if(e.val===content.kind) this.state.labelKind=e.name;
      })
      //let _subtype={};
      //console.log('length',content._subtypes.length);

      content._subtypes.forEach(e=>{
        this.setState({ subtype:Object.assign(this.state.subtype,{[`${e.id}`]:e.id}) });
        //console.log('_subtype',this.state.subtype);

      });
      //this.state.subtype=_subtype;

      this.setState(this.state);
    });
  }

  delContent(id){
    const { user_id } = this.props.navigation.state.params;
    const arr = new FormData();
    arr.append('user_id',user_id);
    arr.append('id',id);
    //console.log(arr);
    //console.log(`${global.url}${'raovat/delete/'}`);
    postApi(`${global.url}${'raovat/delete'}`,arr).then(arrData=>{
      DeviceEventEmitter.emit('goback',{isLogin:true});
      this.props.navigation.goBack();
    });
  }

  postContent(){
    this.setState({posted:true});Keyboard.dismiss();
    const {
      name,price,quantity,size,material,content,raovat_type,subtype,arrImg,
      idCountry,idCity,idDist,kind,
     } = this.state;
    const { user_id,name_module,lang,id } = this.props.navigation.state.params;
    console.log(this.state.raovat_type);
    if(idDist==='') {
      this.setState({posted:false});
      return Alert.alert(lang.notify,lang.plz_choose_area);
    }
    if(name==='') {
      // console.log('name');
      this.setState({posted:false});
      return Alert.alert(lang.notify,lang.title_buysell);
    }
    if(price==='') {
      this.setState({posted:false});
      return Alert.alert(lang.notify,'Bạn phải nhập giá');
    }
    if(kind==='') {
      this.setState({posted:false});
      return Alert.alert(lang.notify,'Vui lòng chọn loại tin');
    }
    if(raovat_type==='' || Object.entries(subtype).length===0) {
      // console.log('raovat_type');
      this.setState({posted:false});
      return Alert.alert(lang.notify,'Chọn danh mục đăng tin');
    }
    //console.log('arrImg',arrImg);
    if(arrImg.length===0) {
      // console.log('arrImg');
      this.setState({posted:false});
      return Alert.alert(lang.notify,'Vui lòng chọn hình.');
    }
    if(content==='') {
      // console.log('content');
      this.setState({posted:false});
      return Alert.alert(lang.notify,'Bạn phải nhập nội dung rao vặt');
    }


    const arr = new FormData();
    id!==undefined && arr.append('id',id);
    arr.append('name',name);
    arr.append('price',price);
    // arr.append('quantity',quantity);
    // arr.append('size',size);
    // arr.append('material',material);
    arr.append('country',idCountry);
    arr.append('city',idCity);
    arr.append('district',idDist);
    arr.append('content',content);
    arr.append('raovat_type',raovat_type);
    Object.entries(subtype).forEach((e)=>{
      e[1] && arr.append('subtype[]',e[1]);
    })
    arr.append('user_id',user_id);
    arr.append('kind',kind);

    arrImg.forEach((e,index)=>{
      e.path!==undefined && arr.append(`image[]`, {
        uri:`${e.path}`,
        name: `${index}_image.jpg`,
        type: `${e.mime}`
      });
    })
    arr.append('active',1);
    const act = id===undefined?'create':'edit';
    console.log(arr,'arr');
    console.log(`${global.url}${'raovat/'}${act}`);
    postApi(`${global.url}${'raovat/'}${act}`,arr).then((e)=>{
      if(e.code===200){
        this.setState({posted:false});

        Alert.alert(this.state.lang.notify,id!==undefined?this.state.lang.update_success:this.state.lang.create_success,[
          {text: '', style: 'cancel'},
          {text: 'OK', onPress: () => this.props.navigation.goBack()}
        ],
       { cancelable: false })

      }else {
        this.setState({posted:false});
      }
    });

  }

  render() {
    const { user_id,name_module,lang,sub_module,id } = this.props.navigation.state.params;
    //console.log('user_id',user_id);
    const { navigation } = this.props;
    const { name,price,quantity,size,material,visible,content,showCat,showKind,raovat_name,posted,labelKind } = this.state;
    const {
      container,headCatStyle,headContent,titleCreate,hide,show,
      colorlbl,wrapItems,widthLable,widthContentItem,wrapCamera,
      colorErr,popoverLoc,padBuySell,overLayout,shadown,listOverService,colorText,
      btnPress,colorNext,imgShare
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
              </TouchableOpacity>
                <Text style={titleCreate}> {`${sub_module}`.toUpperCase()} </Text>
              <TouchableOpacity disabled={posted} onPress={()=>{this.postContent()}}>
              <Text style={titleCreate}> {this.state.lang.done} </Text>
              </TouchableOpacity>
          </View>
      </View>

      <ScrollView>
      <View style={{paddingBottom:height/5}}>
      <View style={{padding:10,paddingLeft:15,flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={colorlbl}>{this.state.lang.choose_area}</Text>
        <View style={this.state.errArea ? show : hide}>
          <Text style={colorErr}>{this.state.lang.plz_choose_area}</Text>
        </View>
      </View>
      <View>
        <ChooseArea
        setCountry={(idCountry)=>this.setState({idCountry})}
        setCity={(idCity)=>this.setState({idCity})}
        idCountry={this.state.idCountry}
        idCity={this.state.idCity}
        idDist={this.state.idDist}
        setDist={(idCountry,idCity,idDist,nameCountry,nameCity,nameDist)=>{this.setState({idCountry,idCity,idDist,nameCountry,nameCity,nameDist,errArea:false})}}
        lang={lang}/>
      </View>
      <View style={{height:30}}></View>

        <View style={wrapItems}>
          <View style={widthLable}>
            <Text style={colorlbl}>{this.state.lang.name} </Text>
          </View>
          <View style={widthContentItem}>
            <View>
            <TextInput underlineColorAndroid='transparent'
            onSubmitEditing={(event) => {}}
            placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
            onChangeText={(name) => this.setState({name})}
            value={name.toString()}
             />
            </View>
            <View></View>
          </View>
        </View>

        <View style={wrapItems}>
          <View style={widthLable}>
            <Text style={colorlbl}>{this.state.lang.price} </Text>
          </View>
          <View style={widthContentItem}>
            <View>
            <TextInput underlineColorAndroid='transparent'
            onSubmitEditing={(event) => {}} keyboardType={'numeric'}
            placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
            onChangeText={(price) =>{if(price==='' || (onlyNumber(price) && price.substr(0,1)>0) ) this.setState({price})}}
            value={price.toString()} maxLength={9}
             />
            </View>
            <View></View>
          </View>
        </View>


        <TouchableOpacity style={wrapItems}
        onPress={()=>this.setState({showCat:true})}>
          <View style={widthLable}>
            <Text style={colorlbl}>Danh mục </Text>
          </View>
          <View style={widthContentItem}>
            <View>
              <Text>{raovat_name} </Text>
            </View>
            <Image source={arrowNextIC} style={{width:16,height:16}} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={wrapItems}
        onPress={()=>this.setState({showKind:true})}>
          <View style={widthLable}>
            <Text style={colorlbl}>Loại tin </Text>
          </View>
          <View style={widthContentItem}>
            <View>
              <Text>{labelKind} </Text>
            </View>
            <Image source={arrowNextIC} style={{width:16,height:16}} />
          </View>
        </TouchableOpacity>

        <View style={{height:20}}></View>

        <View style={wrapItems}>
          <View style={widthLable}>
            <Text style={colorlbl}>{this.state.lang.image}</Text>
          </View>
          <View style={widthContentItem}>
          <View></View>
          <TouchableOpacity style={wrapCamera}
          onPress={()=>{this.setState({visible:true})}}>
            <Image source={cameraIC} style={{width:20,height:20}} />
          </TouchableOpacity>
          </View>
        </View>

        <View style={{padding:10,paddingLeft:15}}>
        <Text style={{color:'#6587A8'}}>{this.state.lang.content}</Text>
        </View>

        <View style={wrapItems}>
          <TextInput underlineColorAndroid='transparent'
          multiline numberOfLines={6} maxHeight={100}
          onChangeText={(content) => this.setState({content})}
          value={content.toString()} placeholder={this.state.lang.des}
          style={{width:width-30,textAlign:'left'}} />

        </View>


        {id!==undefined &&
          <View>
          <View style={{height:15}}></View>
            <View style={{width:width-(width/4),alignSelf:'center',marginBottom:5}}>
              <TouchableOpacity onPress={()=>{this.delContent(id)}} style={btnPress}>
              <Text style={colorNext}> {'Xoá tin'} </Text>
              </TouchableOpacity>
            </View>
            <View style={{height:15}}></View>
        </View>}

        </View>

      </ScrollView>

      <AddImgProduct visible={visible}
      closeModal={()=>this.setState({visible:false})}
      submitImage={this.submitImage.bind(this)} />

      <ChooseCat visible={showCat}
      type={this.state.raovat_type}
      subtype={this.state.subtype}
      labelCat={this.state.raovat_name}
      closeModal={()=>this.setState({showCat:false})}
      submitCat={(raovat_type,raovat_name,subtype)=>this.setState({raovat_type,raovat_name,subtype,errType:''})} />

      <Modal onRequestClose={() => null} transparent visible={showKind}>
        <TouchableOpacity onPress={()=>this.setState({showKind:false})} style={[popoverLoc,padBuySell]}>
        <View style={[overLayout,shadown]}>
        <FlatList
           keyExtractor={(item,index) => index.toString()}
           data={this.state.listKind}
           renderItem={({item}) => (
             <View style={listOverService}>
              <TouchableOpacity onPress={()=>{ this.setState({showKind:false,labelKind:item.name,kind:item.val});}}
             style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',padding:15}}>
                  <Text style={colorText}>{item.name}</Text>
                  <Image source={checkIC} style={[imgShare,this.state.kind===item.val ? show : hide]} />
              </TouchableOpacity>
              </View>
        )} />
        

        </View>

        </TouchableOpacity>
      </Modal>

      {this.state.posted &&
      <Modal onRequestClose={() => null} transparent
      visible={this.state.posted} >
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.6)'}}>
          <ActivityIndicator size="large" color="#d0021b" />
        </View>
      </Modal>}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  colorText :{color:'#303B50',fontSize:17},
  listOverService:{
      borderBottomColor:'#EEEDEE',
      borderBottomWidth:1,
  },
  shadown:{
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#999',
    shadowOpacity: .5,
  },
  overLayout:{
    backgroundColor:'#fff',width: width-20,borderRadius:6,overflow:'hidden',top:7,
    maxHeight:Platform.OS ==='ios' ? 350 : 380,
    //position:'absolute',zIndex:999,
  },
  padBuySell:{ paddingTop: 120},
  popoverLoc : {
    alignItems:'center',
    position:'absolute',
    width,height,
    backgroundColor:'rgba(0,0,0,0.7)',
    zIndex:8,
  },
  container: {
    width,
    height,
    alignSelf: 'stretch',
  },
  wrapCamera:{backgroundColor:'#E4E6EB',width:26,height:26,borderRadius:13,alignItems:'center',justifyContent:'center'},
  widthContentItem:{width:width-15-(width/3),flexDirection:'row',justifyContent:'space-between'},
  widthLable:{width:(width-30)/3},
  wrapItems:{backgroundColor:'#fff',marginBottom:1,flexDirection:'row',padding:15},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },
  headContent : {
      width: width - 30,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  colorlbl :{color:'#323640',fontSize:16},
  show : { display: 'flex'},
  hide : { display: 'none'},
  btnPress: {
    padding:15,
    borderRadius : 5,
    minWidth: width/3,
    borderWidth: 1,
    borderColor : "#D0021B",
    alignItems:'center'
  },
  imgShare:{width:18,height:18},
  colorNext : {
    color: '#D0021B',
    textAlign: 'center',
  },
})
