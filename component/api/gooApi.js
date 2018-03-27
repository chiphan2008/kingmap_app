import { AsyncStorage } from 'react-native';
import encodeApi from './encodeApi';
import global from '../global';

const googApi = async (url,param) => {
  try {

    const auth_key = await AsyncStorage.getItem('@AuthKey:key');
    auth_key = JSON.parse(auth_key);
    //console.log('param',param);
    const acc = new FormData();
    if(param.id_google!==null){
      acc.append('id_google', param.id_google);
    }else {
      acc.append('id_google',param.id );
    }
    acc.append('email',param.email);
    if(param.name!==undefined) acc.append('full_name',param.name);
    if(param.photo!==undefined) acc.append('avatar',param.photo);

    let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer '+ auth_key.access_token,
        },
        body: acc,
      });
    let responseJson = await response.json();
    //console.log('responseJson',responseJson);
    if(responseJson.code===200){
      encodeApi(`${global.url_node}${'person'}`,'POST',responseJson.data[0]);
      AsyncStorage.setItem('@MyAccount:key', JSON.stringify(responseJson.data[0]));
    }
    return responseJson;
  } catch (error) {
  }

};

export default googApi;