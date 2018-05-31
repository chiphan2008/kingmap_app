/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,TextInput,ScrollView,Alert,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import postApi from '../api/postApi';
import global from '../global';
import language_vn from '../lang/vn/language';
import language_en from '../lang/en/language';
import AddImgProduct from './AddImgProduct';
import ChooseCat from './ChooseCat';
import ChooseArea from '../create_location/ChooseArea';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import arrowNextIC from '../../src/icon/ic-arrow-next.png';
import cameraIC from '../../src/icon/ic-create/ic-camera.png';
// import closeIC from '../../src/icon/ic-home/ic-close.png';

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
      arrImg:[],
      idCity:'',idCountry:'',idDist:'',

    }

  }
  submitImage(arrImg){
    this.setState({arrImg})
  }
  postContent(){
    this.setState({posted:true})
    const {
      name,price,quantity,size,material,content,raovat_type,subtype,arrImg,
      idCountry,idCity,idDist,

     } = this.state;
    const { user_id,kind,name_module,lang } = this.props.navigation.state.params;
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
      // console.log('price');
      this.setState({posted:false});
      return Alert.alert(lang.notify,'Bạn phải nhập giá');
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
      arr.append('subtype[]',e[1]);
    })
    arr.append('user_id',user_id);
    arr.append('kind',kind);

    arrImg.forEach((e,index)=>{
      arr.append(`image[]`, {
        uri:`${e.path}`,
        name: `${index}_image.jpg`,
        type: `${e.mime}`
      });
    })
    arr.append('active',1);

    postApi(`${global.url}${'raovat/create'}`,arr).then((e)=>{
      if(e.code===200){
        this.props.navigation.navigate('ListBuySellScr',{name_module,lang});
      }else {
        this.setState({posted:false});
      }
    });

  }

  render() {
    const { user_id,kind,name_module,lang,sub_module } = this.props.navigation.state.params;
    const { navigation } = this.props;
    const { name,price,quantity,size,material,visible,content,showCat,raovat_name,posted } = this.state;
    const {
      container,headCatStyle,headContent,titleCreate,hide,show,
      colorlbl,wrapItems,widthLable,widthContentItem,wrapCamera,
      colorErr,
    } = styles;

    return (
      <View style={container}>

      <View style={headCatStyle}>
          <View style={headContent}>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
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
            value={name}
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
            onSubmitEditing={(event) => {}}
            placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
            onChangeText={(price) => this.setState({price})}
            value={price}
             />
            </View>
            <View></View>
          </View>
        </View>

        {/*<View style={wrapItems}>
          <View style={widthLable}>
            <Text style={colorlbl}>Số lượng </Text>
          </View>
          <View style={widthContentItem}>
            <View>
            <TextInput underlineColorAndroid='transparent'
            onSubmitEditing={(event) => {}}
            placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
            onChangeText={(quantity) => this.setState({quantity})}
            value={quantity}
             />
            </View>
            <View></View>
          </View>
        </View>

        <View style={wrapItems}>
          <View style={widthLable}>
            <Text style={colorlbl}>Kích thước </Text>
          </View>
          <View style={widthContentItem}>
            <View>
            <TextInput underlineColorAndroid='transparent'
            onSubmitEditing={(event) => {}}
            placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
            onChangeText={(size) => this.setState({size})}
            value={size}
             />
            </View>
            <View></View>
          </View>
        </View>

        <View style={wrapItems}>
          <View style={widthLable}>
            <Text style={colorlbl}>Chất liệu </Text>
          </View>
          <View style={widthContentItem}>
            <View>
            <TextInput underlineColorAndroid='transparent'
            onSubmitEditing={(event) => {}}
            placeholder={'------'} style={{width:width-15-(width/3),padding:0}}
            onChangeText={(material) => this.setState({material})}
            value={material}
             />
            </View>
            <View></View>
          </View>
        </View>*/}

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
        value={content} placeholder={this.state.lang.des}
        style={{width:width-30,textAlign:'left'}} />

        </View>
        </View>

      </ScrollView>

      <AddImgProduct visible={visible}
      closeModal={()=>this.setState({visible:false})}
      submitImage={this.submitImage.bind(this)} />

      <ChooseCat visible={showCat}
      closeModal={()=>this.setState({showCat:false})}
      submitCat={(raovat_type,raovat_name,subtype)=>this.setState({raovat_type,raovat_name,subtype,errType:''})} />

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

})
