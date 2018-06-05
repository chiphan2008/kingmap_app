import { AsyncStorage } from 'react-native';
import encodeApi from './encodeApi';
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
    console.log(responseJson);
    if(responseJson.code===200){
      encodeApi(`${global.url_node}${'person'}`,'POST',responseJson.data[0]);
      AsyncStorage.setItem('@MyAccount:key', JSON.stringify(Object.assign(responseJson.data[0],{'pwd':param.password.toString(),remember_me:param.isCheck})));
    }
    return responseJson;
  } catch (error) {
  }

};

export default loginApi;
