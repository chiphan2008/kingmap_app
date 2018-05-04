import Intl from 'intl';
import 'intl/locale-data/jsonp/en';

export function format_number(value){
  const formatter = new Intl.NumberFormat('pt-BR', {
        //style: 'currency',
        //currency: 'BRL',
        minimumFractionDigits: 0,
    });
    return formatter.format(value);
}

export function hasNumber(text) {
  return /\d/.test(text);
}
export function getThumbVideo(link){
  if(link===null || link==='') return;
  var youtube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  let id_video;
  if(link.match(youtube)){
    id_video = link.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/).pop();
    return `${'https://img.youtube.com/vi/'}${id_video}${'/0.jpg'}`;
  }
  //console.log(link);
  var facebook = /^https:\/\/www\.facebook\.com\/([^\/?].+\/)?video(s|\.php)[\/?].*$/gm;
  if(link.match(facebook)){
    id_video = link.match(/(videos\/|vl\.\d+\/)(\d+).*/).pop();
    //console.log('link',id_video);
    return `${'https://graph.facebook.com/'}${id_video}${'/picture'}`;
  }
}
export function chanelVideo(link){
  if(link===null || link==='') return;
  let id_video;
  var youtube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  var facebook = /^https:\/\/www\.facebook\.com\/([^\/?].+\/)?video(s|\.php)[\/?].*$/gm;
  if(link.match(youtube)){
    id_video = link.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/).pop();
    return `https://www.youtube.com/embed/${id_video}?autoplay=1&amp;autohide=1&amp;fs=1&amp;rel=0&amp;hd=1&amp;wmode=transparent&amp;enablejsapi=1&amp;html5=1`;
  }
  if(link.match(facebook)){
    return `https://www.facebook.com/plugins/video.php?height=232&href=${link}`;
  }
}

export function isEmail(text){
  let email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  return email.test(text);
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
