import { AsyncStorage } from 'react-native';
import createAuthKey from './createAuthKey';
import global from '../global';

const getEncodeApi = async (url) => {
  try {
    var resposive = {code:401};
    const params = {
      method: 'GET',
      headers: {
        'Authorization': global.auth_key.client_secret
      }
    };
    let res = await fetch(url, params);
    resposive = await res.json();
    return resposive;

  } catch (error) {
     //console.log('error',error);
  }

};

export default getEncodeApi;
