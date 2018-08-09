/* @flow */
import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TextInput,
  Platform,Dimensions,TouchableOpacity,Modal,
  FlatList,
} from 'react-native';
import ImageViewer from './ImageViewer';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import postApi from '../../api/postApi';
import global from '../../global';

import likeIcon from '../../../src/icon/ic-like.png';
import likeFullIcon from '../../../src/icon/ic-like-full.png';
import commentsIcon from '../../../src/icon/ic-comments.png';
import ImageIcon from '../../../src/icon/ic-Image.png';
import sendEmailIcon from '../../../src/icon/ic-send-email.png';
import closeIC from '../../../src/icon/ic-white/ic-close.png';
import closeIcon from '../../../src/icon/ic-create/ic-close.png'
import {checkUrl,removeItem} from '../../libs';
const {width,height} = Dimensions.get('window');

export default class Comments extends Component {
  constructor(props){
    super(props);
    this.state = {
      showComments: 0,
      inputComment:'',
      inputChildComment:'',
      arrIdComment:{},
      _has_liked:{},
      arrImage:[],
      arrImageChild:[],
      showNotify:false,
      showNotifyChild:false,
      showImgComment:false,
      showImgCommentChild:false,
      arrImgModal:[],
      index:0,

    }
  }

  uploadImage(id){
    const {userId} = this.props;
    //console.log('userId',userId);
    if(userId===0){
      this.props.requestLogin();
      return;
    }

    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 50
    }).then(img => {
      //console.log('img',img);
      if(id===0){
        this.setState({arrImage:this.state.arrImage.concat(img)});
      }else {
        this.setState({arrImageChild:this.state.arrImageChild.concat(img)});
      }
    }).catch(e=>{});
  }
  postComment(comment_id){
    if(this.state.inputChildComment.trim()!=='' || this.state.inputComment.trim()!=='' || this.state.arrImage.length>0){
      const arr = new FormData();
      arr.append('user_id',this.props.userId);
      arr.append('content_id',this.props.idContent);
      arr.append('comment_id',comment_id);
      arr.append('content',comment_id===0 ? this.state.inputComment.toString() : this.state.inputChildComment.toString());
      if(comment_id===0){
        this.state.arrImage.forEach((e,index)=>{
          arr.append(`image[]`, {
            uri:`${e.path}`,
            name: `${index}_my_photo.jpg`,
            type: `${e.mime}`
          });
        })
      }else {
        this.state.arrImageChild.forEach((e,index)=>{
          arr.append(`image[]`, {
            uri:`${e.path}`,
            name: `${index}_my_photo.jpg`,
            type: `${e.mime}`
          });
        })
      }
      //console.log(`${global.url}${'content-create-comment'}`,arr);
      postApi(`${global.url}${'content-create-comment'}`,arr);
      if(comment_id===0){
        this.setState({inputComment:'',arrImage:[],showNotify:true});
        setTimeout(()=>{
          this.setState({showNotify:false})
        },4000)
      }else{
        this.setState({inputChildComment:'',arrImageChild:[],showNotifyChild:true});
        setTimeout(()=>{
          this.setState({showNotifyChild:false})
        },4000)
      }
    }
  }

  likeComment(comment_id){
    this.props.requestLogin();
    const arr = new FormData();
    arr.append('user_id',this.props.userId);
    arr.append('comment_id',comment_id);
    postApi(`${global.url}${'content-like-comment'}`,arr).then(e=>{
      this.setState({
        arrIdComment: Object.assign(this.state.arrIdComment,{[comment_id]:e.data.like}),
        _has_liked: Object.assign(this.state._has_liked,{[comment_id]:e.info==='unlike' ? 0 : 1}),
     });
    });
  }

  render() {
    const {
      txtComments,padLeft,colorText,mrgTop,show,hide,rowFlex
    } = styles;
    //console.log("this.props.navigation=",util.inspect(this.props.navigation,false,null));
    const {idContent,listComment,lang,userId,moderation} = this.props;

    const {
      showImgComment,arrImage,showImgCommentChild,arrImageChild,index,
      showNotify,showNotifyChild,arrImgModal,
    } = this.state;
    //console.log('this.state.idContent====',lang.your_comment)
    var _this = this;
    return (
      <View>
          <View>
            <TextInput onFocus={()=>{this.props.requestLogin();}} style={[txtComments,padLeft]} underlineColorAndroid='transparent'
            placeholder={lang.your_comment} editable={moderation==='request_publish' ? false : true}
            onChangeText={(text) => this.setState({inputComment: text})}
            value={this.state.inputComment}
             />
            <TouchableOpacity style={{position:'absolute',right:45,top:Platform.OS==='ios' ? 15 : 18}}
            onPress={()=> moderation==='request_publish' ? {} : this.uploadImage(0)}>
            <Image source={ImageIcon} style={{width:20,height:20,}} />
            </TouchableOpacity>

            <TouchableOpacity style={{position:'absolute',right:15,top:Platform.OS==='ios' ? 15 : 18}}
            onPress={()=> moderation==='request_publish' ? {} : this.postComment(0)}
            >
            <Image source={sendEmailIcon} style={{width:20,height:20,}} />
            </TouchableOpacity>

            <View style={showNotify ? show :hide }>
            <Text style={{color:'#5b89ab',padding:5}}>{lang.notify_comment}</Text>
            </View>

            <FlatList
               horizontal
               showsHorizontalScrollIndicator={false}
               extraData={this.state}
               keyExtractor={(item,index) => index.toString()}
               data={arrImage}
               renderItem={({item,index}) => (
                 <View>
                 <Image key={index} style={{width:90,height:90,marginTop:10,marginRight:10}}
                 source={{isStatic:true,uri:`${item.path}`}} />
                 <TouchableOpacity onPress={()=>{this.setState({arrImage:removeItem(arrImage,index)})}}
                 style={{position:'absolute',top:5,right:5}}>
                 <Image source={closeIcon} style={{width:16,height:18}} />
                 </TouchableOpacity>
                 </View>
               )}
            />




          </View>
          {listComment.length>0 ?
            listComment.map((e)=>(
              e._comment_by!==null &&
              <View onLayout={()=>{this.setState({arrIdComment:Object.assign(this.state.arrIdComment,{[e.id]:e.like_comment}),
                _has_liked: Object.assign(this.state._has_liked,{[e.id]:e._has_liked.length}) }); }}
              key={e.id} style={{borderBottomWidth:1,borderBottomColor:'#E1E7EC',paddingBottom:10}}>
              <View style={rowFlex}>

                  <Image source={{uri:checkUrl(`${e._comment_by.avatar}`) ? `${e._comment_by.avatar}` : `${global.url_media}/${e._comment_by.avatar}`}} style={{width:66,height:66,borderRadius:33}} />
                <View>

                    <View style={{paddingLeft:10}}>
                      <Text style={colorText}>{e._comment_by.full_name}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginLeft:10,marginTop:5}}>
                        <Text>{Moment(e.created_at).format('h:m A')}</Text><Text> | </Text><Text>{Moment(e.created_at).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
              </View>

              <View style={mrgTop}>
                  <Text>{e.content}</Text>
                  <View style={{flexDirection:'row',marginRight:5,marginTop:5}}>
                    <FlatList
                       horizontal
                       extraData={this.state}
                       showsHorizontalScrollIndicator={false}
                       data={e._images} extraData={this.state}
                       keyExtractor={(item,index) => index.toString()}
                       renderItem={({item,index}) => (
                         <TouchableOpacity onPress={()=>this.setState({showImgComment:true,index,arrImgModal:e._images})}>
                         <Image source={{uri:checkUrl(item.url) ? `${item.url}` : `${global.url_media}${item.url}`}} style={{width:90,height:90,marginRight:7}} />
                         </TouchableOpacity>
                       )}
                    />
                  </View>

                  {this.state.showImgComment &&
                  <ImageViewer
                  visible={this.state.showImgComment}
                  data={arrImgModal}
                  index={index}
                  closeModal={()=>this.setState({showImgComment:false})} />}
              </View>

              <View style={{padding:15,paddingLeft:0,flexDirection:'row'}}>
                  <TouchableOpacity style={{flexDirection:'row',}}
                  onPress={()=>{this.likeComment(e.id);}}>
                    <Image style={{width:22,height:18,marginRight:5}} source={this.state._has_liked[e.id]!==0 ? likeFullIcon : likeIcon} />
                    <Text>{this.state.arrIdComment[e.id]} like</Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress={()=>{this.setState({showComments:e.id}); }}
                  style={{flexDirection:'row',marginLeft:20}}>
                    <Image style={{width:22,height:22,marginRight:5}} source={commentsIcon} />
                    <Text>Comments</Text>
                  </TouchableOpacity>
              </View>

              <View style={this.state.showComments===e.id ? show : hide}>
              <View>
                <TextInput onFocus={()=>{this.props.requestLogin(); }}
                style={[txtComments, {paddingLeft: 20}]} underlineColorAndroid='transparent'
                placeholder={`    ${lang.your_comment}`}
                onChangeText={(cm) => this.setState({inputChildComment: cm})}
                value={this.state.inputChildComment}
                 />
                <TouchableOpacity style={{position:'absolute',right:45,top:Platform.OS==='ios' ? 15 : 18}}
                onPress={()=>this.uploadImage(e.id)}>
                <Image source={ImageIcon} style={{width:20,height:20,}} />
                </TouchableOpacity>

                <TouchableOpacity style={{position:'absolute',right:15,top:Platform.OS==='ios' ? 15 : 18}}
                onPress={()=>this.postComment(e.id)}
                >
                <Image source={sendEmailIcon} style={{width:20,height:20,}} />
                </TouchableOpacity>

                <View style={showNotifyChild ? show :hide }>
                <Text style={{color:'#5b89ab',padding:5}}>{lang.notify_comment}</Text>
                </View>

                <FlatList
                   horizontal showsHorizontalScrollIndicator={false}
                   data={arrImageChild} extraData={this.state}
                   keyExtractor={(item,index) => index.toString()}
                   renderItem={({item,index}) => (
                     <View>
                         <Image key={index} style={{width:90,height:90,marginTop:10,marginRight:10}}
                         source={{isStatic:true,uri:`${item.path}`}} />
                         <TouchableOpacity onPress={()=>{this.setState({arrImageChild:removeItem(arrImageChild,index)})}}
                         style={{position:'absolute',top:5,right:5}}>
                         <Image source={closeIcon} style={{width:16,height:18}} />
                         </TouchableOpacity>
                     </View>
                   )}
                />

              </View>
              </View>

                {e._replies.length>0 ?
                  e._replies.map(r =>(
                    <View onLayout={()=>this.setState({arrIdComment:Object.assign(this.state.arrIdComment,{[r.id]:r.like_comment}),
                    _has_liked: Object.assign(this.state._has_liked,{[r.id]:r._has_liked.length}), })}
                    style={{width:width-70,marginLeft:70,marginTop:10,borderTopWidth:1,borderTopColor:'#E1E7EC'}} key={r.id}>
                    <View style={rowFlex}>
                      <Image source={{uri:checkUrl(`${r._comment_by.avatar}`) ? `${r._comment_by.avatar}` : `${global.url_media}/${r._comment_by.avatar}`}} style={{width:66,height:66,borderRadius:33}} />
                      <View>
                          <View style={{paddingLeft:10}}>
                            <Text style={colorText}>{r._comment_by.full_name}</Text>
                          </View>
                          <View style={{flexDirection:'row',marginLeft:10,marginTop:5}}>
                              <Text>{Moment(r.created_at).format('h:m A')}</Text><Text> | </Text><Text>{Moment(r.created_at).format('DD/MM/YYYY')}</Text>
                          </View>
                      </View>
                    </View>

                    <View style={mrgTop}>
                        <Text>{r.content}</Text>
                        <View style={{flexDirection:'row',marginRight:5,marginTop:5}}>
                          <FlatList
                             horizontal showsHorizontalScrollIndicator={false}
                             extraData={this.state}
                             data={r._images}
                             keyExtractor={(item,index) => index.toString()}
                             renderItem={({item,index}) => (
                               <TouchableOpacity onPress={()=>this.setState({arrImgModal:r._images})}>
                                <Image source={{uri: checkUrl(item.url) ? `${item.url}` : `${global.url_media}${item.url}` }} style={{width:90,height:90,marginRight:7}} />
                               </TouchableOpacity>
                             )}
                          />
                        </View>
                    </View>

                    <View style={{paddingTop:15,paddingLeft:0,flexDirection:'row'}}>
                        <TouchableOpacity style={{flexDirection:'row',}}
                        onPress={()=>{this.likeComment(r.id);}}>
                          <Image style={{width:22,height:18,marginRight:5}} source={this.state._has_liked[r.id]!==0 ? likeFullIcon : likeIcon} />
                          <Text>{this.state.arrIdComment[r.id]} like</Text>
                        </TouchableOpacity>
                    </View>
                      <View style={rowFlex}>
                      </View>
                    </View>
                  ))

                  :
                  <View></View>
                }
                {this.state.showImgCommentChild &&
                <ImageViewer
                visible={this.state.showImgCommentChild}
                data={arrImgModal}
                index={index}
                closeModal={()=>this.setState({showImgCommentChild:false})} />}
              </View>
            ))

            :
            <View></View>
          }

          <View style={{width,display:'flex'}}></View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  show : { display: 'flex'},
  hide : { display: 'none'},
  rowFlex:{flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:10},
  txtComments:{borderWidth:1,borderColor:'#E1E7EC',borderRadius:3,padding:15,paddingRight:70},
  padLeft:{paddingLeft:15},
  colorText :{color:'#303B50',fontSize:17,marginTop:7},
  mrgTop:{marginTop:10},
});
