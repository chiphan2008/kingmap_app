/* @flow */

import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,
} from 'react-native';

import global from '../../global';
import getApi from '../../api/getApi';

import likeIcon from '../../../src/icon/ic-like.png';
import likeFullIcon from '../../../src/icon/ic-like-full.png';
import favoriteIcon from '../../../src/icon/ic-favorite.png';
import favoriteFullIcon from '../../../src/icon/ic-favorite-full.png';
import onlineIC from '../../../src/icon/ic-green/ic-online.png';
import locationDarkIC from '../../../src/icon/ic-blue/ic-location-dark.png';
import phoneIC from '../../../src/icon/ic-blue/ic-phone.png';
import priceIC from '../../../src/icon/ic-blue/ic-price.png';
import timeIC from '../../../src/icon/ic-blue/ic-time.png';
const {width,height} = Dimensions.get('window');

export class Rating extends Component {
  render() {
    return (
      <Image source={Number(this.props.showVote) < Number(this.props.rate) ? favoriteIcon : favoriteFullIcon} style={this.props.styleIMG}  />
    );
  }
}

export default class Content extends Component {
  constructor(props){
    super(props);
    this.state={
      showVote:0,
      vote_avg:0,
    }
  }
  saveVote(rate){
    this.props.requestLogin();
    getApi(`${global.url}${'vote?content='}${this.props.listContent.id}${'&user='}${this.props.userId}${'&point='}${rate}`).then(e=>
      {this.setState({showVote:e.data.vote,vote_avg:e.data.vote_average});}
    );
  }

  render() {
    //console.log('this.props.listContent.vote',this.props.listContent.has_vote);
    const {
      wrapContentDetail,rowFlex,rowFlexImg,rowFlexBottom,wrapImgDetail,
      imgDetailContent,colorContent,imgICLocation,marRight,
      favIC,imgOnline,width30,imgContentIC,likeIC,colorRed,
    } = styles;
    const {listContent,vote} = this.props;
    //console.log('listContent.vote1',listContent.vote);
    return (
      <View onLayout={()=>{this.setState({vote_avg:vote,showVote:listContent.has_vote})} } style={wrapContentDetail}>
        <View style={rowFlex}>
            <View style={wrapImgDetail}>
            <Image style={imgDetailContent} source={{uri:`${global.url_media}${listContent.avatar}`}} />
            <Image source={onlineIC} style={imgOnline} />
            <Text style={{fontSize:17,color:'#9FD56A'}}>Online</Text>
            </View>
            <View style={{padding:10,width:width-120,}}>
            <Text numberOfLines={2} style={{fontSize:26,color:'#1C263D'}}>{listContent.name}</Text>
            </View>
        </View>


        <View style={rowFlex}>
          <Image style={[imgICLocation,marRight]} source={locationDarkIC} />
          <Text numberOfLines={1} style={[colorContent,width30]}>{`${listContent.address}${', '}${listContent._district.name}${', '}${listContent._city.name}`}</Text>
        </View>

        <View style={rowFlex}>
          <Image style={[imgContentIC,marRight]} source={timeIC} />
          <Text style={colorContent}>{`${listContent.open_time}`}</Text>
        </View>

        <View style={rowFlex}>
          <Image style={[imgContentIC,marRight]} source={priceIC} />
          <Text style={colorContent}>{`${listContent.price_from}${' - '}${listContent.price_to} ${listContent.currency}`}</Text>
        </View>


        <View style={rowFlexBottom}>
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>this.props.saveLike('like')}>
            <Image source={this.props.hasLiked===1 ? likeFullIcon : likeIcon} style={[likeIC]} />
          </TouchableOpacity>
            <Text style={[marRight,colorRed]}>{this.props.liked}</Text>
            <Text style={marRight}> | </Text>
            <TouchableOpacity onPress={()=>{this.saveVote(1)} }>
            <Rating rate={1} showVote={this.state.vote_avg} styleIMG={favIC} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{this.saveVote(2)} }>
            <Rating rate={2} showVote={this.state.vote_avg} styleIMG={favIC} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{this.saveVote(3)} }>
            <Rating rate={3} showVote={this.state.vote_avg} styleIMG={favIC} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{this.saveVote(4)} }>
            <Rating rate={4} showVote={this.state.vote_avg} styleIMG={favIC} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{this.saveVote(5)} }>
            <Rating rate={5} showVote={this.state.vote_avg} styleIMG={[favIC,marRight]} />
            </TouchableOpacity>
            <Text>({this.state.vote_avg})</Text>

            </View>
            <Text>{Number.parseFloat(listContent.line).toFixed(0)} (m)</Text>

        </View>

    </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapContentDetail:{flexWrap:'wrap',padding:10,backgroundColor:'#fff'},
  rowFlex:{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},
  rowFlexImg:{flexDirection:'row',marginBottom:20},
  rowFlexBottom:{flexDirection:'row',padding:5,paddingLeft:10,marginTop:15,marginBottom:15,justifyContent:'space-between'},
  wrapImgDetail:{marginRight:15,alignItems:'center'},
  marRight:{marginRight:10},
  colorContent:{color:'#6587A8',overflow:'hidden',fontSize:15,},
  favIC:{width:22,height:21,marginRight:2},
  imgContentIC:{width:16,height:16,},
  imgICLocation:{width:14,height:16,},
  likeIC:{width:25,height:21,marginRight:7},
  imgOnline : {
      width: 18,height: 18,position:'absolute',left:65,top:65
  },
  width30:{width:width-50},
  colorRed:{color:'#BE2826',fontSize:15,},
  imgDetailContent:{width:90,height:90,borderRadius:45,marginBottom:5,},

});
