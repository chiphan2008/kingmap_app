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
