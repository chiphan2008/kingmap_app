/* @flow */

import React, { Component } from 'react';
import {Platform, View, Text, StyleSheet, Dimensions, Image,
  TouchableOpacity,TextInput,ScrollView,Alert,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';

import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import cameraLargeIC from '../../src/icon/ic-create/ic-camera-large.png';
import closeIC from '../../src/icon/ic-create/ic-close.png';

export default class DesignAds extends Component {
  constructor(props) {
    super(props);
    this.state = {
        leftImgHalf:{},
        leftText:'',
        rightImgHalf:{},
        rightText:'',
        aboveImg:{},
        aboveText:'',
        belowImg:{},
        belowText:'',
        fullImg:[],
        fullText:'',
        route:'',
        imgArr:[],
    }
  }

  uploadImage(route){
    ImagePicker.openPicker({
      cropping: false
    }).then(imgArr => {
      this.setState({imgArr,
        leftImgHalf:{},
        rightImgHalf:{},
        aboveImg:{},
        belowImg:{},
        fullImg:[],
        fullText:'',
        route
      });
      switch (route) {
        case 'leftImgHalf':
          this.setState({leftImgHalf:{img:imgArr}});
          break;
        case 'rightImgHalf':
          this.setState({rightImgHalf:{img:imgArr}});
          break;
        case 'aboveImg':
          this.setState({aboveImg:{img:imgArr}});
          break;
        case 'belowImg':
          this.setState({belowImg:{img:imgArr}});
          break;
        case 'fullImg':
          this.setState({fullImg:imgArr});
          break;
        //default:

      }
    }).catch(e => {
      //alert(e);
    });
  }
  saveDesign(){
    const { leftImgHalf,rightImgHalf, aboveImg,belowImg,route,
      fullImg, fullText, imgArr,leftText,rightText, aboveText, belowText } = this.state;
      if( leftImgHalf.img!==undefined || rightImgHalf.img!==undefined || aboveImg.img!==undefined || belowImg.img!==undefined || fullImg.path!==undefined || fullText!==''){
        if(fullText!==''){

        }else {

        }
      }else{
        Alert.alert('Thông báo','Vui lòng chọn kiểu quảng cáo')
      }
  }
  render() {
    const {lang,name_module} = this.props.navigation.state.params;
    const { leftImgHalf,rightImgHalf, aboveImg,belowImg,
      fullImg, fullText, imgArr,leftText,rightText, aboveText, belowText } = this.state;
    const { navigation } = this.props;
    const {
      container,headCatStyle,headContent,titleCreate,
      wrapper,colorTitle,bgWhite,wrapHalf,btnUpload,txtInput,
      rowItem,widthFull,widthImageFull,show,hide,
    } = styles;

    return (
      <ScrollView>
      <View style={container}>
        <View style={headCatStyle}>
            <View style={headContent}>
                <TouchableOpacity onPress={()=>navigation.goBack()} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Image source={arrowLeft} style={{width:18, height:18,marginTop:5}} />
                </TouchableOpacity>
                  <Text style={titleCreate}> {`${name_module}`.toUpperCase()} </Text>
                <TouchableOpacity onPress={()=>this.saveDesign()}>
                <Text style={titleCreate}>{`${'Lưu'}`}</Text>
                </TouchableOpacity>
            </View>
        </View>


          <View style={wrapper}>
            <Text style={colorTitle}>Kiểu hình bên trái, mô tả bên phải </Text>
          </View>
          <View style={[bgWhite,rowItem]}>
            <TouchableOpacity style={[wrapHalf,btnUpload,leftImgHalf.img===undefined ? show : hide ]}
            onPress={()=>this.uploadImage('leftImgHalf')}>
              <Image source={cameraLargeIC} style={{width:60,height:60}} />
              <Text>{`${'Tải ảnh lên'}`.toUpperCase()}</Text>
            </TouchableOpacity>
            <View style={[wrapHalf,leftImgHalf.img!==undefined ? show : hide]}>
            <Image source={{isStatic:true,uri:`${imgArr.path}`}} style={wrapHalf} />
            <TouchableOpacity style={{position:'absolute',top:7,right:7}}
            onPress={()=>this.setState({ leftImgHalf:{} })}>
              <Image source={closeIC} style={{width:18,height:18}} />
            </TouchableOpacity>
            </View>
            <TextInput
            multiline underlineColorAndroid='transparent'
            onChangeText={(rightText) => this.setState({rightText})}
            value={this.state.rightText}
            placeholder={'Viết mô tả'}
            style={[wrapHalf,txtInput]} />
          </View>


          <View style={wrapper}>
            <Text style={colorTitle}>Kiểu hình bên phải, mô tả bên trái</Text>
          </View>
          <View style={[bgWhite,rowItem]}>
            <TextInput
            multiline underlineColorAndroid='transparent'
            onChangeText={(leftText) => this.setState({leftText})}
            value={this.state.leftText}
            placeholder={'Viết mô tả'}
            style={[wrapHalf,txtInput]} />

            <View style={[wrapHalf,rightImgHalf.img!==undefined ? show : hide]}>
            <Image source={{isStatic:true,uri:`${imgArr.path}`}} style={wrapHalf} />
            <TouchableOpacity style={{position:'absolute',top:7,right:7}}
            onPress={()=>this.setState({ rightImgHalf:{} })}>
              <Image source={closeIC} style={{width:18,height:18}} />
            </TouchableOpacity>
            </View>

            <TouchableOpacity style={[wrapHalf,btnUpload,rightImgHalf.img===undefined ? show : hide ]}
            onPress={()=>this.uploadImage('rightImgHalf')}>
              <Image source={cameraLargeIC} style={{width:60,height:60}} />
              <Text>{`${'Tải ảnh lên'}`.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          <View style={wrapper}>
            <Text style={colorTitle}>Kiểu hình bên trên, mô tả bên dưới</Text>
          </View>
          <View style={[bgWhite]}>
          <TouchableOpacity style={[btnUpload,widthFull,aboveImg.img===undefined ? show : hide ]}
          onPress={()=>this.uploadImage('aboveImg')}>
            <Image source={cameraLargeIC} style={{width:60,height:60}} />
            <Text>{`${'Tải ảnh lên'}`.toUpperCase()}</Text>
          </TouchableOpacity>
          <View style={[widthFull,aboveImg.img!==undefined ? show : hide]}>
          <Image source={{isStatic:true,uri:`${imgArr.path}`}} style={widthFull} />
          <TouchableOpacity style={{position:'absolute',top:7,right:7}}
          onPress={()=>this.setState({ aboveImg:{} })}>
            <Image source={closeIC} style={{width:18,height:18}} />
          </TouchableOpacity>
          </View>

          <TextInput
            multiline underlineColorAndroid='transparent'
            onChangeText={(belowText) => this.setState({belowText})}
            value={this.state.belowText}
            placeholder={'Viết mô tả'}
            style={[txtInput,widthFull]} />
          </View>

          <View style={wrapper}>
            <Text style={colorTitle}>Kiểu hình bên dưới, mô tả bên trên</Text>
          </View>
          <View style={[bgWhite]}>
            <TextInput
              multiline underlineColorAndroid='transparent'
              onChangeText={(aboveText) => this.setState({aboveText})}
              value={this.state.aboveText}
              placeholder={'Viết mô tả'}
              style={[txtInput,widthFull]} />
            <TouchableOpacity style={[btnUpload,widthFull, belowImg.img===undefined ? show : hide]}
            onPress={()=> this.uploadImage('belowImg')}>
              <Image source={cameraLargeIC} style={{width:60,height:60}} />
              <Text>{`${'Tải ảnh lên'}`.toUpperCase()}</Text>
            </TouchableOpacity>

            <View style={[widthFull,belowImg.img!==undefined ? show : hide]}>
            <Image source={{isStatic:true,uri:`${imgArr.path}`}} style={widthFull} />
            <TouchableOpacity style={{position:'absolute',top:7,right:7}}
            onPress={()=>this.setState({ belowImg:{} })}>
              <Image source={closeIC} style={{width:18,height:18}} />
            </TouchableOpacity>
            </View>

          </View>

          <View style={wrapper}>
            <Text style={colorTitle}>Kiểu full hình</Text>
          </View>
          <View style={[bgWhite]}>
            <TouchableOpacity style={[btnUpload,widthImageFull, fullImg.path===undefined ? show : hide]}
            onPress={()=> this.uploadImage('fullImg')}>
              <Image source={cameraLargeIC} style={{width:60,height:60}} />
              <Text>{`${'Tải ảnh lên'}`.toUpperCase()}</Text>
            </TouchableOpacity>
            <View style={[widthImageFull,fullImg.path!==undefined ? show : hide]}>
            <Image source={{isStatic:true,uri:`${imgArr.path}`}} style={widthImageFull} />
            <TouchableOpacity style={{position:'absolute',top:7,right:7}}
            onPress={()=>this.setState({ fullImg:{} })}>
              <Image source={closeIC} style={{width:18,height:18}} />
            </TouchableOpacity>
            </View>

          </View>

          <View style={wrapper}>
            <Text style={colorTitle}>Kiểu full text</Text>
          </View>
          <View style={[bgWhite]}>
            <TextInput
              multiline underlineColorAndroid='transparent'
              onChangeText={(fullText) => this.setState({fullText})}
              value={this.state.fullText}
              placeholder={'Viết mô tả'}
              style={[txtInput,widthImageFull]} />
          </View>

      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,minHeight:height,
    marginBottom:height/4
  },
  wrapHalf:{width:width/2,height:width/2},
  widthFull:{height:width/3,width},
  widthImageFull:{height:width/4,width},
  txtInput:{padding:10,textAlignVertical:'top'},
  btnUpload:{
    borderStyle: 'dashed',borderWidth: 1,borderColor: '#646769',
    alignItems:'center',justifyContent:'center',},
  wrapper:{padding:15},
  bgWhite:{backgroundColor:'#fff',},
  rowItem:{flexDirection:'row'},
  marTop:{marginTop:20},
  contentWrap : { width,height:height-155,alignItems: 'center',justifyContent: 'center'},
  headCatStyle : {
      backgroundColor: '#D0021B',paddingTop: Platform.OS==='ios' ? 30 : 20, alignItems: 'center',height: 65,
      position:'relative',zIndex:5,
  },
  colorTitle:{color:'#6587A8',fontSize:17},
  headContent : {
      width: width - 40,justifyContent: 'space-between',flexDirection: 'row',
  },
  titleCreate:{color:'white',fontSize:18,paddingTop:5},
  show : { display: 'flex'},
  hide : { display: 'none'},
})
