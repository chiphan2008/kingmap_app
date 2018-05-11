/* @flow */

import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,Image,TouchableWithoutFeedback,
  TextInput,Dimensions,ScrollView,StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../styles';
import arrowLeft from '../../src/icon/ic-white/arrow-left.png';
import notiIC from '../../src/icon/color-red/ic-notification.png';
import closeIC from '../../src/icon/ic-white/ic-close.png';
const {width,height} = Dimensions.get('window');
import CircularSlider from 'react-native-circular-slider';
import Svg, { G, Path } from 'react-native-svg';

import {getIndex} from '../libs';

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

function convertAngle(h) {
  if(h==='') return;
  var arr = h.split(':');
  var h = parseInt(arr[0]);
  var m = parseInt(arr[1]);
  //console.log(h,m);
  var hour_angle = 0.5 * (h * 60 + m)
  var minute_angle = 6 * m
  var angle = Math.abs(hour_angle - minute_angle)

  angle = Math.min(360 - angle, angle)

  return angle

  // const angle = h/60+m;
  // return Math.round(angle * (2 * Math.PI / (12 * 12)))/5;
}

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
  {name:'Wen',val:3},
  {name:'Thu',val:4},
  {name:'Fri',val:5},
  {name:'Sat',val:6},
  {name:'Sun',val:0},
];

export default class OpenTime extends Component {
  constructor(props){
    super(props);
    this.state = {
      from_date:1,
      to_date:6,
      from_hour:'10:00',
      to_hour:'5:00',
      opt_date: opt_date_vn,
      ListOpenTime:[],
      ListDataTime:[{
          from_date:1,
          to_date:6,
          from_hour:'10:00',
          to_hour:'5:00',
          index:0
        }],

      index_clock:0,
      index:1,
      showClock:false,
    }

  }

  addElement(){
    const {index,ListOpenTime,ListDataTime} = this.state;
    let opt_time={
        from_date:1,
        to_date:6,
        from_hour:'10:00',
        to_hour:'5:00',
      };
    ListOpenTime.push(<ListTime
      ListDataTime={ListDataTime}
      openTimer={(index)=>this.openTimer(index)}
      removeGroup={()=>this.removeGroup(index)}
      key={index}
      index={index}
      lang={this.props.lang} />);
    ListDataTime.push(Object.assign(opt_time,{['index']:index}))
    this.setState({index:index+1,ListOpenTime,ListDataTime},()=>{
      console.log(ListDataTime);
    });
  }
  getIndex(element,id){
    return element.key==id;
  }

  removeGroup(id){
    let {ListOpenTime,ListDataTime} = this.state;
    const index = ListOpenTime.findIndex((e)=>this.getIndex(e,id));
    if(index!==-1){
      ListOpenTime.splice(index, 1);
      ListDataTime.splice(index+1, 1);
      //console.log('ListDataTime',ListDataTime);
      this.setState(this.state)
    }

  }
  openTimer(index_clock){
    this.setState({showClock:true,index_clock})
  }
  render() {
    const {
      container,headCatStyle,headContent,titleCreate,show,hide,
      titleOpentime,btnClock,marTop10,titleActive,btnPress,colorNext
    } = styles;
    const { lang } = this.props;
    const {from_date, to_date, from_hour, to_hour,opt_date,ListOpenTime,showClock,ListDataTime,index_clock} = this.state;
    return (

      <View style={container}>
      <View style={headCatStyle}>
          <View style={headContent}>
              <View></View>
                <Text style={titleCreate}> {lang.choose_time} </Text>
              <TouchableOpacity onPress={()=>{
                this.props.closeModal(ListDataTime)}}>
              <Text style={titleCreate}> Xong </Text>
              </TouchableOpacity>
          </View>

      </View>
      <ScrollView>
      <View style={{flexDirection:'row',justifyContent:'space-between',padding:5,paddingLeft:15,width}}>
          <View style={{width:(width-60)/4,}}>
            <Text style={titleOpentime}>Từ ngày</Text>
            <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{}}>
              <Text style={titleActive}>{ListDataTime[0].from_date!==0 ? opt_date[ListDataTime[0].from_date-1].name : opt_date[6].name}</Text>
            </TouchableOpacity>

          </View>

          <View style={{width:(width-60)/4}}>

            <Text style={titleOpentime}>Đến ngày</Text>
            <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{}}>
              <Text style={titleActive}>{ ListDataTime[0].to_date!==0 ? opt_date[ListDataTime[0].to_date-1].name : opt_date[6].name}</Text>
            </TouchableOpacity>

          </View>

          <View style={{width:(width-60)/4}}>
            <Text style={titleOpentime}>Từ giờ</Text>
            <TouchableOpacity style={[btnClock,marTop10]}
            onPress={()=>{this.openTimer(0)}}>
              <Text style={titleActive}>{ ListDataTime[0].from_hour}</Text>
            </TouchableOpacity>

          </View>

          <View style={{width:(width-60)/4}}>
            <Text style={titleOpentime}>Đến giờ</Text>
            <TouchableOpacity style={[btnClock,marTop10]}
            onPress={()=>{this.openTimer(0)}}>
              <Text style={titleActive}>{ListDataTime[0].to_hour}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
          <Text style={{fontWeight:'bold',fontSize:18,transform:[{ rotate: '45deg'}]}}> </Text>
          </TouchableOpacity>
      </View>
      <View>
      {ListOpenTime}
      </View>
      <View style={{width:width/2,alignSelf:'center'}}>
        <TouchableOpacity onPress={()=>this.addElement()} style={btnPress}>
        <Text style={colorNext}> + {lang.add_time_open} </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      <Clock
      index={index_clock}
      lang={this.props.lang}
      showClock={this.state.showClock}
      from_hour={ListDataTime[index_clock].from_hour}
      to_hour={ListDataTime[index_clock].to_hour}
      updateFromHour={(from_hour)=>{
        ListDataTime[index_clock].from_hour=from_hour
        this.setState(this.state)
      }}
      updateToHour={(to_hour)=>{
        ListDataTime[index_clock].to_hour=to_hour
        this.setState(this.state)
      }}
      closeModal={()=>this.setState({showClock:false })}
      />

      </View>
    );
  }
}

export class Clock extends Component {
  constructor(props){
    super(props);
    const {from_hour, to_hour} = this.props;
    console.log('from_hour, to_hour',from_hour, to_hour);
    this.state = {
      // startAngle:convertAngle(from_hour),
      // angleLength:convertAngle(to_hour),
      startAngle: Math.PI * 10/6,
      angleLength: Math.PI * 7/6,
      opt_date: opt_date_vn,
    }
  }

  onUpdate = ({ startAngle, angleLength }) => {
    this.setState({
      startAngle: roundAngleToFives(startAngle),
      angleLength: roundAngleToFives(angleLength)
    });
    var f_hour = calculateTimeFromAngle(startAngle);
    var t_hour = calculateTimeFromAngle((startAngle + angleLength) % (2 * Math.PI));
    this.props.updateFromHour(`${f_hour.h}:${padMinutes(f_hour.m)}`);
    this.props.updateToHour(`${t_hour.h}:${padMinutes(t_hour.m)}`);
  }
  static propTypes = {
    updateToHour: PropTypes.func.isRequired,
      updateToHour: PropTypes.func.isRequired,
  }
  render(){
    const {
      popupClock,timeContainer,time,timeHeader,wakeText,timeValue,bedtimeText,show,hide
    } = styles;
    const {startAngle, angleLength} = this.state;
    const { lang,showClock,from_hour,to_hour } = this.props;
    //console.log(convertAngle(from_hour));

    const f_hour = calculateTimeFromAngle(startAngle);
    const t_hour = calculateTimeFromAngle((startAngle + angleLength) % (2 * Math.PI));

    return(
      <View style={[popupClock,showClock ? show : hide]}>
      <TouchableOpacity onPress={()=>this.props.closeModal()} style={{position:'absolute',top:10,right:10}}>
      <Image source={closeIC} style={{width:18, height:18}} />
      </TouchableOpacity>
      <View style={timeContainer}>
      <View style={time}>
        <View style={timeHeader}>
          {showClock && <Svg height={16} width={16} style={{width:16,height:16}}>
            <G fill="#8db9da">{WAKE_ICON}</G>
          </Svg>}
          <Text style={wakeText}>{lang.open_time}</Text>
        </View>
        <Text style={timeValue}>{f_hour.h}:{padMinutes(f_hour.m)}</Text>
      </View>

        <View style={time}>
          <View style={timeHeader}>
            {showClock && <Svg height={16} width={16}  style={{width:16,height:16}}>
              <G fill="#5b89ab">{BEDTIME_ICON}</G>
            </Svg>}
            <Text style={bedtimeText}>{lang.close_time} </Text>
          </View>
          <Text style={timeValue}>{t_hour.h}:{padMinutes(t_hour.m)}</Text>
        </View>
      </View>

        {showClock && <CircularSlider
          startAngle={startAngle}
          angleLength={angleLength}
          onUpdate={this.onUpdate}
          segments={5}
          strokeWidth={40}
          radius={145}
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
    this.state = {
      startAngle: Math.PI * 10/6,
      angleLength: Math.PI * 7/6,
      from_date:1,
      to_date:6,
      from_hour:'10:00',
      to_hour:'05:00',
      opt_date: opt_date_vn,
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

    return (

      <View>

      <View style={{flexDirection:'row',justifyContent:'space-between',padding:5,paddingLeft:15,width}}>
          <View style={{width:(width-60)/4,}}>
            <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{}}>
              <Text style={titleActive}>{from_date!==0 ? opt_date[from_date-1].name : opt_date[6].name}</Text>
            </TouchableOpacity>

            <View style={[popupDate, hide]}>
            {opt_date.map((e,index)=>(
              <TouchableOpacity key={index} style={padItemList}
              onPress={()=>{this.setState({from_date:e.val})}}>
              <Text style={[titleOpentime]}>{e.name}</Text>
              </TouchableOpacity>
            ))}
            </View>
          </View>

          <View style={{width:(width-60)/4}}>

            <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{}}>
              <Text style={titleActive}>{ to_date!==0 ? opt_date[to_date-1].name : opt_date[6].name}</Text>
            </TouchableOpacity>

            <View style={[popupDate, hide]}>
            {opt_date.map((e,index)=>(
              <TouchableOpacity key={index} style={padItemList}
              onPress={()=>{this.setState({to_date:e.val})}}>
              <Text style={[titleOpentime]}>{e.name}</Text>
              </TouchableOpacity>
            ))}
            </View>

          </View>

          <View style={{width:(width-60)/4}}>
            <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{this.props.openTimer(index)}}>
              <Text style={titleActive}>{ListDataTime[index].from_hour}</Text>
            </TouchableOpacity>

            <View style={[popupDate,hide]}>
            {opt_date.map((e,index)=>(
              <TouchableOpacity key={index} style={padItemList}
              onPress={()=>{this.setState({to_date:e.val})}}>
              <Text style={[titleOpentime]}>{e.name}</Text>
              </TouchableOpacity>
            ))}
            </View>
          </View>

          <View style={{width:(width-60)/4}}>
            <TouchableOpacity style={[btnClock,marTop10]} onPress={()=>{this.props.openTimer(index)}}>
              <Text style={titleActive}>{ ListDataTime[index].to_hour}</Text>
            </TouchableOpacity>

            <View style={[popupDate,hide]}>
            {opt_date.map((e,index)=>(
              <TouchableOpacity key={index} style={padItemList}
              onPress={()=>{this.setState({to_date:e.val})}}>
              <Text style={[titleOpentime]}>{e.name}</Text>
              </TouchableOpacity>
            ))}
            </View>
          </View>

          <TouchableOpacity onPress={()=>this.props.removeGroup(index)}>
          <Text style={{fontWeight:'bold',fontSize:18,transform:[{ rotate: '45deg'}]}}>+</Text>
          </TouchableOpacity>

      </View>

    </View>

    );
  }
}
