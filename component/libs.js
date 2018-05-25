import Intl from 'intl';
import 'intl/locale-data/jsonp/en';
import lang_en from './lang/en/user/language';
import lang_vn from './lang/vn/user/language';

export function getIndex(element,id){
  return element.key==id;
}

export function calcAngle(str){
  var h = parseInt(str.substr(0,2));
  var m = parseInt(str.substr(-2));
  if (h >= 12) h = h - 12;
  if (m === 60) m = 0;
  console.log('h,m',h,m);
  let hour_angle = (0.5 * (h * 60 + m));
  let minute_angle = 6 * m;
  console.log('hour_angle,minute_angle',hour_angle,minute_angle);
  let angle = Math.abs(hour_angle - minute_angle);
  //angle = Math.min(360 - angle, angle);

  return (angle * (2 * Math.PI / (12 * 12))) / 5;
}

export function format_number(value,dv=null){
  if(value>1000 && dv !==null) {
    value = Number.parseFloat(value/1000).toFixed(0);
  }

  const formatter = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 0,
    });
    return formatter.format(value);
}

export function hasNumber(text) {
  return /\d/.test(text);
}
export function getThumbVideo(link,thumb=null){
  if(link===null || link==='') return;
  var youtube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  let id_video;
  if(link.match(youtube)){
    id_video = link.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/).pop();
    // maxresdefault
    if(thumb!==null) thumb='/hqdefault.jpg';
    else  thumb='/hqdefault.jpg';
    //console.log('thumb',`${'https://img.youtube.com/vi/'}${id_video}${thumb}`);
    return `${'https://img.youtube.com/vi/'}${id_video}${thumb}`;
  }
  //console.log(link);
  var facebook = /^https:\/\/www\.facebook\.com\/([^\/?].+\/)?video(s|\.php)[\/?].*$/gm;
  if(link.match(facebook)){
    id_video = link.match(/(videos\/|vl\.\d+\/)(\d+).*/).pop();
    //console.log('link',id_video);
    return `${'https://graph.facebook.com/'}${id_video}${'/picture'}`;
  }
}
export function chanelVideo(link,height=null){
  if(link===null || link==='') return;
  let id_video;
  var youtube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  var facebook = /^https:\/\/www\.facebook\.com\/([^\/?].+\/)?video(s|\.php)[\/?].*$/gm;
  if(link.match(youtube)){
    id_video = link.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/).pop();
    return `https://www.youtube.com/embed/${id_video}?autoplay=1&amp;autohide=1&amp;fs=1&amp;rel=0&amp;hd=1&amp;wmode=transparent&amp;enablejsapi=1&amp;html5=1`;
  }
  if(link.match(facebook)){
    if(height===null) height=300;
    return `https://www.facebook.com/plugins/video.php?height=${height}&href=${link}`;
  }
}
export function checkPassword(pass,lang){
  var obj ={};
    var language = lang==='vn' ? lang_vn : lang_en;
    var strongRegex = new RegExp("^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$", "g");
    var mediumRegex = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");

    if (false == enoughRegex.test(pass)) {
      obj = {
        color:'#d9534f',
        msg : language.notify_pwd_length
      };

    } else if (strongRegex.test(pass)) {
      obj = {
        color:'#5cb85c',
        msg : language.notify_pwd_strong
      };

    } else if (mediumRegex.test(pass)) {
      obj = {
        color:'#f0ad4e',
        msg : language.notify_pwd_medium
      };

    } else {
      obj = {
        color:'#f0ad4e',
        msg : language.notify_pwd_weak
      };

    }
    return obj;
}
export function checkKeyword(str,char=null){
  if(str!==undefined){
    str.toLowerCase();
    if(char===null){
      char=',';
    }
    var arr = str.split(char);
    if(arr[arr.length-1]==='') arr.splice(-1);
    for(i=0;i<arr.length;i++){
        arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    if(arr.length>1){
      console.log('arr',arr);
      var lastElement = arr[arr.length-1].trim();
      console.log('lastElement',lastElement);
      arr.splice(-1);
      var index = arr.indexOf(lastElement);
      console.log('index',index);
      return !(index===-1);
    }
    return false;
  }
  return false;
}

export function isEmail(text){
  let email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  return email.test(text);
}

export function checkSVG(text){
  return text.substr(-3)=='svg';
}

export function xoa_dau(str) {
  str = str.toLowerCase();
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	return str;
}
export function onlyLetters(str) {
    let regex = /^[a-zA-Z\s]+$/;
    return regex.test(xoa_dau(str));
}

export function onlyNumber(str) {
    let regex = /^[0-9\s]+$/;
    return regex.test(str);
}
export function checkUrl(url){
  return url.indexOf('http')!=-1;
}

export function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
    array.toString();
    return array.toString();
}
export function removeItem(array,index) {
    array.splice(index, 1);
    return array
}
export function removeText(str,element){
  var array = str.split(',');
  remove(array, element);
  array.toString();
  return array.toString();
}

export function strtoarray(str,char=null){
  if(str!==undefined){
    if(char===null){
      char=',';
    }
    return str.split(char);
  }
  return [];
}

export function checkItemExists(obj){

  Object.entries(obj).find(function(element) {
    return element[1];
  });

}

export function formatDate(d){
  return Moment(d).format('DD/MM/YY');
}
export function formatHour(h){
  return Moment(h).format('HH:mm');
}
