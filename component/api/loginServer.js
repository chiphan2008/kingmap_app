import { AsyncStorage } from 'react-native';
import global from '../global';
import getApi from './getApi';
import loginApi from './loginApi';
import gooApi from './gooApi';
import faceApi from './faceApi';

const loginServer = async (param,reqLoc=null) => {
  try {
    getApi(`${global.url}${'check-login'}`).then(arr => {

      if(arr.data.length===0 || reqLoc!==null){
        //console.log('aaa',param.login_type);
        if(param.login_type==='goo'){
          //console.log('check-login-goo',param);
          gooApi(`${global.url}${'login-google'}`,param);
        }else if (param.login_type==='fac') {
          faceApi(`${global.url}${'login-facebook'}`,param);
        }else {
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
