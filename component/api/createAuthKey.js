import { AsyncStorage } from 'react-native';
import getAuthKey from './getAuthKey';
import global from '../global';
const createAuthKey = async () => {
  try {
    let responseJson = await getAuthKey(`${global.url_media}${'/oauth/token'}`,global.auth_key);
    AsyncStorage.setItem('@AuthKey:key', JSON.stringify(responseJson));
    return responseJson;
  } catch (error) {
  }

};

export default createAuthKey;
