import { AsyncStorage } from 'react-native';
import global from '../global';
import getApi from '../api/getApi';
import loginApi from '../api/loginApi';

const loginServer = async (username,password) => {
  try {
    getApi(`${global.url}${'check-login'}`)
    .then(arr => {
      if(arr.data.length===0){
        const param = {username,password};
        loginApi(`${global.url}${'login'}`,param);
      }
    })
    .catch(err => console.log(err));

  } catch (error) {
     //console.log('error',error);
  }

};

export default loginServer;
