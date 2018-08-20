/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,TouchableWithoutFeedback,
  TextInput,Dimensions,ScrollView,StyleSheet,Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../styles';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import notiIC from '../../src/icon/color-red/ic-notification.png';
import closeIC from '../../src/icon/ic-white/ic-close.png';
import checkIC from '../../src/icon/ic-check.png';
import uncheckIC from '../../src/icon/ic-uncheck.png';

const {width,height} = Dimensions.get('window');
import CircularSlider from 'react-native-circular-slider';
import Svg, { G, Path } from 'react-native-svg';
//import * as _ from 'lodash';
//import {getIndex,calcAngle} from '../libs';

const WAKE_ICON = (
  <G>
    <Path d="M2,12.9h1.7h3h2.7h3H14c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7c-0.9,0-1.7-0.7-1.7-1.7v-4
      c0-2.1-1.5-3.8-3.4-4.2C9,1.6,9,1.4,9,1.3c0-0.5-0.4-1-1-1c-0.5,0-1,0.4-1,1c0,0.2,0,0.3,0.1,0.4c-2,0.4-3.4,2.1-3.4,4.2v4
      c0,0.9-0.7,1.7-1.7,1.7c-0.4,0-0.7,0.3-0.7,0.7C1.3,12.6,1.6,12.9,2,12.9z"/>
    <Path d="M8,15.7c1.1,0,2.1-0.9,2.1-2.1H5.9C5.9,14.8,6.9,15.7,8,15.7z"/>
  </G>
);

const BEDTIME_ICON = (
  <G>
    <Path d="M11.7,10.5c-3.6,0-6.4-2.9-6.4-6.4c0-0.7,0.1-1.4,0.4-2.1C3.1,2.9,1.2,5.3,1.2,8.1c0,3.6,2.9,6.4,6.4,6.4
      c2.8,0,5.2-1.8,6.1-4.4C13.1,10.4,12.4,10.5,11.7,10.5z"/>
    <Path d="M8,7.6l2-2.5H8V4.4H11v0.6L9,7.6h2v0.7H8V7.6z"/>
    <Path d="M11.7,5.4l1.5-1.9h-1.4V3h2.2v0.5l-1.5,1.9h1.5v0.5h-2.2V5.4z"/>
    <Path d="M9.4,3l1.1-1.4h-1V1.3H11v0.4L9.9,3H11v0.4H9.4V3z"/>
  </G>
);

function calculateMinutesFromAngle(angle) {
  return Math.round(angle / (2 * Math.PI / (12 * 12))) * 5;
}

function calculateTimeFromAngle(angle) {
  const minutes = calculateMinutesFromAngle(angle);
  const h = Math.floor(minutes / 60);
  const m = minutes - h * 60;
  return { h, m };
}
// function calcAngle(str){
//   var h = parseInt(str.substr(0,2));
//   var m = parseInt(str.substr(-2));
//   if (h >= 12) h = h - 12;
//   if (m === 60) m = 0;
//   var mili = (m+h)/60;
//   return mili*(2 * Math.PI / (12 * 12))/5;
// }

function roundAngleToFives(angle) {
  const fiveMinuteAngle = 2 * Math.PI / 144;
  //console.log('fiveMinuteAngle',fiveMinuteAngle);
  return Math.round(angle / fiveMinuteAngle) * fiveMinuteAngle;
}

function padMinutes(min) {
  if (`${min}`.length < 2) {
    return `0${min}`;
  }
  return min;
}
const opt_date_vn = [
  {name:'Thứ 2',val:1},
  {name:'Thứ 3',val:2},
  {name:'Thứ 4',val:3},
  {name:'Thứ 5',val:4},
  {name:'Thứ 6',val:5},
  {name:'Thứ 7',val:6},
  {name:'Chủ Nhật',val:0},
];
const opt_date_en = [
  {name:'Mon',val:1},
  {name:'Tue',val:2},
  {name:'Wed',val:3},
  {name:'Thu',val:4},
  {name:'Fri',val:5},
  {name:'Sat',val:6},
  {name:'Sun',val:0},
];
var timeoutUpdateHour;
export default class OpenTime extends Component {
  constructor(props){
    super(props);
    const {lang} = this.props;
    //console.log('lang',lang);
    this.state = {
      from_date:1,
      to_date:6,
      from_hour:'10:00',
      to_hour:'17:00',
      // startAngle:5.333,
      // angleLength:3.222,
      opt_date: lang.lang ==='vn'? opt_date_vn : opt_date_en,

      ListDataTime:[{
          from_date:1,
          to_date:6,
          from_hour:'10:00',
          to_hour:'17:00',
          angle_from:5.235987755982989,
          angle_to:3.665191429188092,
          index:0
        }],
      ListOpenTime:[],
      index_clock:0,
      index:0,
      showClock:false,
      showDate:false,
      update:true,
      updateFromDate:'',
      updateToDate:'',
    }

  }
  componentWillUpdate(){
    const {ListOpenTime} = this.props;
    if(ListOpenTime.length>0 && this.state.update){
      //console.log(ListOpenTime);
      var arr = [];
      ListOpenTime.forEach((e,index)=>{
        arr.push(<ListTime
          ListDataTime={ListOpenTime}
          openTimer={(index)=>this.openTimer(index)}
          openFromDate={(val,index)=>this.openFromDate(val,index)}
          openToDate={(val,index)=>this.openToDate(val,index)}
          removeGroup={()=>this.removeGroup(index)}
          key={index}
          index={index}
          lang={this.props.lang} />);
      });
      this.state.ListOpenTime = arr;
      this.state.index = ListOpenTime.length-1;
      this.state.ListDataTime = ListOpenTime;
      this.state.update = false;
      this.setState(this.state);
    }

    //console.log('ListOpenTime',ListOpenTime);
  }
  addElement(){
    var {index,ListOpenTime,ListDataTime} = this.state;
    index +=1;
    let opt_time={
        from_date:1,
        to_date:6,
        from_hour:'10:00',
        to_hour:'17:00',
        angle_from:5.235987755982989,
        angle_to:3.665191429188092,
        index
      };
    ListDataTime.push(opt_time);
    var arr = [];
    ListDataTime.forEach((e,index)=>{
      arr.push(<ListTime
        ListDataTime={ListDataTime}
        openTimer={(index)=>this.openTimer(index)}
        openFromDate={(val,index)=>this.openFromDate(val,index)}
        openToDate={(val,index)=>this.openToDate(val,index)}
        removeGroup={()=>this.removeGroup(index)}
        key={index}
        index={index}
        lang={this.props.lang} />);
    });
    ListOpenTime = arr;
    this.setState({index,ListOpenTime,ListDataTime},()=>{
      //console.log('addElement',ListDataTime);
    });
  }
  getIndex(element,id){
    //console.log(element.index);
    return element.key==id;
  }

  removeGroup(id){
    //console.log('id',id);
    var {ListOpenTime,ListDataTime} = this.state;
    const i = ListOpenTime.findIndex((e)=>this.getIndex(e,id));
    if(i!==-1){
      ListDataTime.splice(i, 1);

      var arr2 = [];
      ListDataTime.forEach((e,index)=>{
        arr2.push({
          from_date:e.from_date,
          to_date:e.to_date,
          from_hour:e.from_hour,
          to_hour:e.to_hour,
          angle_from:e.angle_from,
          angle_to:e.angle_to,
          index
        })
      });
      ListDataTime = arr2;
      var arr = [];
      ListDataTime.forEach((e,index)=>{
        arr.push(<ListTime
          ListDataTime={ListDataTime}
          openTimer={(index)=>this.openTimer(index)}
          openFromDate={(val,index)=>this.openFromDate(val,index)}
          openToDate={(val,index)=>this.openToDate(val,index)}
          removeGroup={()=>this.removeGroup(index)}
          key={index}
          index={index}
          lang={this.props.lang} />);
      });
      ListOpenTime = arr;
      this.state.index = ListDataTime.length-1;

      this.setState(this.state,()=>{
        this.setState({ListOpenTime})
      })
    }

  }
  openTimer(index_clock){
    this.setState({
      showClock:true,index_clock,
      startAngle:parseFloat(this.state.ListDataTime[index_clock].angle_from),
      angleLength:parseFloat(this.state.ListDataTime[index_clock].angle_to),
    })
  }
  openFromDate(index_clock,updateFromDate){
    this.setState({showDate:true,index_clock,updateFromDate,updateToDate:''})
  }
  openToDate(index_clock,updateToDate){
    this.setState({showDate:true,index_clock,updateFromDate:'',updateToDate})
  }
  updateListItem = () => {
      var arr  = [];
      this.state.ListDataTime.forEach((e,index)=>{
        //let index = e.index;
        arr.push(<ListTime
          ListDataTime={this.state.ListDataTime}
          openTimer={(index)=>this.openTimer(index)}
          openFromDate={(val,index)=>this.openFromDate(val,index)}
          openToDate={(val,index)=>this.openToDate(val,index)}
          removeGroup={()=>this.removeGroup(index)}
          key={index}
          index={index}
          lang={this.props.lang} />)
      });

      this.state.ListOpenTime = arr;
      this.setState(this.state);
    //},1200)

  }

  updateDate = (index) => {
    //console.log(index);
    let {ListDataTime,updateFromDate,updateToDate} = this.state;
    if(updateFromDate!==''){
      ListDataTime[updateFromDate].from_date = index;
    }else {
      ListDataTime[updateToDate].to_date = index;
    }
    //console.log('ListDataTime',ListDataTime);
    this.setState(this.state,()=>{
      this.updateListItem();
    })
  }

  componentDidMount(){
    this.setState({
      ListOpenTime:[
        <ListTime
        ListDataTime={this.state.ListDataTime}
        openTimer={(index)=>this.openTimer(index)}
        openFromDate={(val,index)=>this.openFromDate(val,index)}
        openToDate={(val,index)=>this.openToDate(val,index)}
        removeGroup={()=>this.removeGroup(this.state.index)}
        key={this.state.index}
        index={this.state.index}
        lang={this.props.lang} />
      ]
    })
  }
  render() {
    const {
      container,wrapSetting,headCatStyle,headContent,titleCreate,show,hide,
      titleOpentime,btnClock,marTop10,titleActive,btnPress,colorNext,popoverLoc,padCreate
    } = styles;
    const { lang } = this.props;
    const {updateFromDate,updateToDate,from_date, to_date, from_hour, to_hour,opt_date,ListOpenTime,showClock,showDate,ListDataTime,index_clock} = this.state;
    //console.log('ListDataTime',ListDataTime);
    return (

      <View style={wrapSetting}>
      <View style={headCatStyle}>
          <View style={headContent}>
              <View></View>
                <Text style={titleCreate}> {lang.choose_time} </Text>
              <TouchableOpacity onPress={()=>{
                this.props.closeModal(ListDataTime)}}>
              <Text style={titleCreate}> {lang.done} </Text>
              </TouchableOpacity>
          </View>

      </View>
      <ScrollView style={{height:height-150}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:15,paddingLeft:15,width}}>
          <View style={{width:(width-40)/4,}}>
            <Text numberOfLines={1} style={titleOpentime}>{lang.from_date}</Text>
          </View>

          <View style={{width:(width-40)/4}}>
            <Text  numberOfLines={1} style={titleOpentime}>{lang.to_date}</Text>
          </View>

          <View style={{paddingRight:15,width:(width-40)*0.5,flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={titleOpentime}>{lang.from_hour}</Text>
            <Text style={titleOpentime}>{lang.to_hour}</Text>
          </View>

          <TouchableOpacity>
          <Text style={{fontWeight:'bold',fontSize:16,transform:[{ rotate: '45deg'}]}}>   </Text>
          </TouchableOpacity>
      </View>
      <View>
      {ListOpenTime}
      </View>
      <View style={{width:width*0.7,alignSelf:'center',marginTop:20,marginBottom:40}}>
        <TouchableOpacity onPress={()=>this.addElement()} style={btnPress}>
        <Text style={colorNext}> + {lang.add_time_open} </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>



      {this.state.showClock && <Clock
      index={index_clock}
      lang={this.props.lang}
      showClock={this.state.showClock}
      from_hour={ListDataTime[index_clock].from_hour}
      to_hour={ListDataTime[index_clock].to_hour}
      startAngle={ListDataTime[index_clock].angle_from}
      angleLength={ListDataTime[index_clock].angle_to}
      updateFTHour={(from_hour,to_hour,startAngle,angleLength)=>{
        //console.log(startAngle,angleLength);
        ListDataTime[index_clock].from_hour= from_hour===24?0:from_hour;
        ListDataTime[index_clock].to_hour= to_hour===24?0:to_hour;
        ListDataTime[index_clock].angle_from= startAngle;
        ListDataTime[index_clock].angle_to= angleLength;
        this.setState(this.state,()=>{
          clearTimeout(timeoutUpdateHour);
          this.updateListItem()
        })
      }}
      closeModal={()=>this.setState({showClock:false })}
      />}

      {showDate &&
        <ListChooseDate
        showDate={showDate}
        index={index_clock}
        lang={this.props.lang}
        updateDate={(index)=>{this.updateDate(index)}}
        closeModal={()=>{ this.setState({showDate:false})}}
        />
      }

      </View>
    );
  }
}

export class ListChooseDate extends Component {
  constructor(props){
    super(props);
    const {index,lang} = this.props;
    this.state = {
      index,
      opt_date: lang.lang==='vn'?opt_date_vn:opt_date_en,
    }
  }


  render(){
    const { popoverLoc,padCreate } = styles;
    const {index,opt_date} = this.state;
    const { lang,showDate } = this.props;

    return(
      showDate && <View style={[popoverLoc,padCreate]}>
        <TouchableOpacity onPress={()=>{
          //console.log('updateDate',index);
          this.props.updateDate(index);
          this.props.closeModal();
        }}
        style={{position:'absolute',top:10,right:10}}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
        <Image source={closeIC} style={{width:18, height:18}} />
        </TouchableOpacity>

        <View style={{backgroundColor:'#fff',width:width-50,padding:10}}>
            <Text style={{color:'#000',fontSize:18,marginBottom:10}}>{lang.open_time}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection:'row'}}>
            {opt_date.map(e=>{
                return(
                  <TouchableOpacity key={e.val} style={{alignItems:'center',marginRight:10}}
                  onPress={()=>{this.setState({index:e.val})}}>
                  <Image source={index===e.val? checkIC: uncheckIC} style={{width:18,height:18}} />
                  <Text>{e.name}</Text>
                  </TouchableOpacity>
                )
            })}
            </View>
            </ScrollView>

        </View>
       </View>
    )
  }
}

export class Clock extends Component {
  constructor(props){
    super(props);
    const {from_hour, to_hour,startAngle,angleLength,lang} = this.props;
    //console.log('from_hour, to_hour',calcAngle(from_hour), calcAngle(to_hour));
    this.state = {
      // startAngle:calcAngle(from_hour),
      // angleLength:calcAngle(to_hour),
      apmFrom:parseInt(from_hour.substr(0,2))>12?true:false,
      apmTo:parseInt(to_hour.substr(0,2))>12?true:false,
      startAngle:parseFloat(startAngle),
      angleLength:parseFloat(angleLength),
      opt_date: lang.lang==='vn'?opt_date_vn:opt_date_en,
    }
  }

  onUpdate = ({ startAngle, angleLength }) => {
    //console.log(startAngle, angleLength);
    this.setState({
      startAngle: roundAngleToFives(startAngle),
      angleLength: roundAngleToFives(angleLength)
    });
    //var f_hour = calculateTimeFromAngle(startAngle);
    //var t_hour = calculateTimeFromAngle((startAngle + angleLength) % (2 * Math.PI));

  }
  static propTypes = {
    updateFTHour: PropTypes.func.isRequired,
  }
  render(){
    const {
      popupClock,timeContainer,time,timeHeader,wakeText,timeValue,bedtimeText,show,hide
    } = styles;
    const {startAngle, angleLength,apmFrom,apmTo} = this.state;
    const { lang,showClock,from_hour,to_hour } = this.props;
    //console.log(convertAngle(from_hour));

    const f_hour = calculateTimeFromAngle(startAngle);
    const t_hour = calculateTimeFromAngle((startAngle + angleLength) % (2 * Math.PI));

    return(
      showClock &&
      <View style={popupClock}>
      <TouchableOpacity onPress={()=>{
        this.props.updateFTHour(`${apmFrom?f_hour.h+12:f_hour.h}:${padMinutes(f_hour.m)}`,`${apmTo?t_hour.h+12:t_hour.h}:${padMinutes(t_hour.m)}`,startAngle,angleLength);
        this.props.closeModal()}}
        style={{position:'absolute',top:Platform.OS==='ios'?20:10,right:10}}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
      <Image source={closeIC} style={{width:20, height:20}} />
      </TouchableOpacity>
      <View style={timeContainer}>
      <View style={time}>
        <View style={timeHeader}>
          {showClock && <Svg height={16} width={16} style={{width:16,height:16}}>
            <G fill="#8db9da">{WAKE_ICON}</G>
          </Svg>}
          <Text style={wakeText}>{lang.open_time}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
        <Text style={timeValue}>{f_hour.h}:{padMinutes(f_hour.m)}</Text>
        <TouchableOpacity onPress={()=>this.setState({apmFrom:!apmFrom})}>
        <Text style={timeValue}> {apmFrom?'PM':'AM'}</Text>
        </TouchableOpacity>
        </View>
      </View>

        <View style={time}>
          <View style={timeHeader}>
            {showClock && <Svg height={16} width={16}  style={{width:16,height:16}}>
              <G fill="#5b89ab">{BEDTIME_ICON}</G>
            </Svg>}
            <Text style={bedtimeText}>{lang.close_time}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
          <Text style={timeValue}>{t_hour.h}:{padMinutes(t_hour.m)}</Text>
          <TouchableOpacity onPress={()=>this.setState({apmTo:!apmTo})}>
          <Text style={timeValue}> {apmTo?'PM':'AM'}</Text>
          </TouchableOpacity>
          </View>

        </View>
      </View>

        {showClock && <CircularSlider
          startAngle={startAngle}
          angleLength={angleLength}
          onUpdate={({ startAngle, angleLength }) => {
            this.setState({
              startAngle: roundAngleToFives(startAngle),
              angleLength: roundAngleToFives(angleLength)
            });
          }}
          segments={5}
          strokeWidth={40}
          radius={width>320?140:120}
          gradientColorFrom="#8db9da"
          gradientColorTo="#5b89ab"
          showClockFace
          clockFaceColor="#fff"
          bgCircleColor="#2E3B51"
          stopIcon={<G scale="1.1" x="-8" y="-8" transform={{ translate: "-8, -8" }}>{BEDTIME_ICON}</G>}
          startIcon={<G scale="1.1"  x="-8" y="-8" transform={{ translate: "-8, -8" }}>{WAKE_ICON}</G>}
        />}
      </View>
    )
  }
}

export class ListTime extends Component {
  constructor(props){
    super(props);
    const {lang} = this.props;
    this.state = {
      startAngle: Math.PI * 10/6,
      angleLength: Math.PI * 7/6,
      from_date:1,
      to_date:6,
      from_hour:'10:00',
      to_hour:'17:00',
      opt_date: lang.lang === 'vn' ? opt_date_vn : opt_date_en,
    }
  }
  static propTypes = {
      ListDataTime: PropTypes.array.isRequired,
  }
  render() {

    const {
      show,hide,
      titleTab,titleActive,btnClock,marTop10,padItemList,popupDate,titleOpentime,
    } = styles;

    const { startAngle, angleLength, from_date, to_date,opt_date } = this.state;
    const { index,ListDataTime } = this.props;
    //console.log('index',index);
    const from_hour = calculateTimeFromAngle(startAngle);
    const to_hour = calculateTimeFromAngle((startAngle + angleLength) % (2 * Math.PI));
    //console.log('ListDataTime',ListDataTime);
    return (
      ListDataTime[index] !== undefined &&
      <View>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingLeft:15,paddingRight:10,width}}>
          <View style={{width:(width-60)/4,}}>
            <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{this.props.openFromDate(ListDataTime[index].from_date,index)}}>
              <Text numberOfLines={1} style={titleActive}>{ListDataTime[index].from_date!==0 ? opt_date[ListDataTime[index].from_date-1].name : opt_date[6].name}</Text>
            </TouchableOpacity>

          </View>

          <View style={{width:(width-60)/4}}>
            <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{this.props.openToDate(ListDataTime[index].to_date,index)}}>
              <Text numberOfLines={1} style={titleActive}>{ListDataTime[index].to_date!==0 ? opt_date[ListDataTime[index].to_date-1].name : opt_date[6].name}</Text>
            </TouchableOpacity>
          </View>

          <View style={{width:(width-60)/2}}>
          <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{this.props.openTimer(index)}}>
            <Text numberOfLines={1} style={titleActive}>{ListDataTime[index].from_hour.substr(0,5)} - {ListDataTime[index].to_hour.substr(0,5)}</Text>
          </TouchableOpacity>
          </View>

          {index>0 ?
          <TouchableOpacity onPress={()=>this.props.removeGroup(index)}>
          <Text numberOfLines={1} style={{fontWeight:'bold',fontSize:22,transform:[{ rotate: '45deg'}]}}>{'+'}</Text>
          </TouchableOpacity>
          :
          <View style={{width:14}}>
          <Text numberOfLines={1} style={{fontWeight:'bold',fontSize:22,transform:[{ rotate: '45deg'}]}}>{'  '}</Text>
          </View>
          }

      </View>

    </View>

    );
  }
}
