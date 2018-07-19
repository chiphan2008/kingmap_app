import { AsyncStorage } from 'react-native';
import createAuthKey from './createAuthKey';
import global from '../global';

const getApi = async (url) => {
  try {
    //AsyncStorage.removeItem('@AuthKey:key');
    const auth_key = await AsyncStorage.getItem('@AuthKey:key');
    auth_key = JSON.parse(auth_key);

    var resposive = {code:401};
    if(auth_key!==null){
      const params = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ auth_key.access_token,
        },
      };
      //console.log(url);
      let res = await fetch(url, params);//.then(res => {res.json()});
      //console.log(res);
      resposive = await res.json();
      //console.log(resposive);
      if(resposive.code!==401) return resposive;
    }

    resposive = await createAuthKey();
    const resJson = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ resposive.access_token,
      },
    }).then(res => res.json()).catch(function(error) {
      throw error;
    });
    if(resposive.code!==401) return resJson;

  } catch (error) {
     //console.log('error',error);
  }

};

export default getApi;
