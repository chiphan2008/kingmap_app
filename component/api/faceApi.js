import { AsyncStorage } from 'react-native';
import encodeApi from './encodeApi';
import getEncodeApi from './getEncodeApi';
import global from '../global';

const faceApi = async (url,param) => {
  try {

    const auth_key = await AsyncStorage.getItem('@AuthKey:key');
    auth_key = JSON.parse(auth_key);
    //console.log('param',param);
    const acc = new FormData();
    if(param.id_facebook===undefined){
      acc.append('id_facebook',param.id );
    }else {
      acc.append('id_facebook', param.id_facebook);
    }
    acc.append('email',param.email);
    if(param.name!==undefined) acc.append('full_name',param.name);
    if(param.picture!==undefined) acc.append('avatar',param.picture.data.url);
    //console.log('param.picture.data.url',param);
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
      getEncodeApi(`${global.url_node}${'person/'}${responseJson.data[0].id}`).then(e=>{
        if(e.data===undefined) encodeApi(`${global.url_node}${'person/add'}`,'POST',responseJson.data[0]);
        else encodeApi(`${global.url_node}${'person/update'}`,'POST',responseJson.data[0]);
      })
      AsyncStorage.setItem('@MyAccount:key', JSON.stringify(responseJson.data[0]));
    }
    return responseJson;
  } catch (error) {
  }

};

export default faceApi;
