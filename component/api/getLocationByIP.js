import { AsyncStorage } from 'react-native';
import createAuthKey from './createAuthKey';
import global from '../global';

const getLocationByIP = async () => {
  try {
    return fetch(`${global.url_media}${'/getLocation'}`, {
      method: 'GET',
    }).then(res => res.json());

  } catch (error) {
     //console.log('error',error);
  }

};

export default getLocationByIP;
