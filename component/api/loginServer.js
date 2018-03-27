import { AsyncStorage } from 'react-native';
import global from '../global';
import getApi from '../api/getApi';
import loginApi from '../api/loginApi';
import gooApi from '../api/gooApi';

const loginServer = async (param) => {
  try {
    getApi(`${global.url}${'check-login'}`)
    .then(arr => {
      //console.log('arr.data.length',arr.data);
      if(arr.data.length===0){
        if(param.id_google!==null){
          //console.log(param);
          gooApi(`${global.url}${'login-google'}`,param);
        }
        if(param.pwd!==undefined){
          const params = {username:param.email,password:param.pwd};
          loginApi(`${global.url}${'login'}`,params);
        }

      }
    })
    .catch(err => console.log(err));

  } catch (error) {
     //console.log('error',error);
  }

};

export default loginServer;
