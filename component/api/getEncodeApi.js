import { AsyncStorage } from 'react-native';
import createAuthKey from './createAuthKey';
import global from '../global';

const getEncodeApi = async (url) => {
  try {
    //AsyncStorage.removeItem('@AuthKey:key');
    
    resposive = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': global.auth_key.client_secret,
      },
    }).then(res => res.json());
    if(resposive.code!==401) return resposive;

  } catch (error) {
     //console.log('error',error);
  }

};

export default getEncodeApi;
