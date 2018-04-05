import { AsyncStorage } from 'react-native';
import global from '../global';

const postEncodeApi = async (url,param) => {
  try {
    //console.log('url,method,param',url,method,param);

    let params = {
        method:'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Authorization: global.auth_key.client_secret
        },
        body: param,
      };
    let response = await fetch(url, params);
    let responseJson = await response.json();
    //console.log('postEncodeApi',responseJson);
    return responseJson;
  } catch (error) {

  }

};

export default postEncodeApi;
