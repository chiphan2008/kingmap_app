import { AsyncStorage } from 'react-native';
import encodeApi from './encodeApi';
import getEncodeApi from './getEncodeApi';
import global from '../global';

const loginApi = async (url,param) => {
  try {

    const auth_key = await AsyncStorage.getItem('@AuthKey:key');
    auth_key = JSON.parse(auth_key);

    const acc = new FormData();
    acc.append('username',param.username.toString());
    acc.append('password',param.password.toString());

    let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer '+ auth_key.access_token,
        },
        body: acc,
      });
    let responseJson = await response.json();
    //console.log(responseJson);
    if(responseJson.code===200){
      getEncodeApi(`${global.url_node}${'person/'}${responseJson.data[0].id}`).then(e=>{
        if(e.data===undefined) encodeApi(`${global.url_node}${'person/add'}`,'POST',responseJson.data[0]);
        else encodeApi(`${global.url_node}${'person/update'}`,'POST',responseJson.data[0]);
      })
      AsyncStorage.setItem('@MyAccount:key', JSON.stringify(Object.assign(responseJson.data[0],{'pwd':param.password.toString(),remember_me:param.isCheck,login_type:'local'})));
    }
    return responseJson;
  } catch (error) {
  }

};

export default loginApi;
