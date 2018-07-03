import { AsyncStorage } from 'react-native';
import global from '../global';
import getApi from '../api/getApi';
import loginApi from '../api/loginApi';
import gooApi from '../api/gooApi';
import faceApi from '../api/faceApi';

const loginServer = async (param,reqLoc=null) => {
  try {
    //console.log(`${global.url}${'check-login'}`,);
    getApi(`${global.url}${'check-login'}`).then(arr => {
      //console.log('arr.data.length',arr.data);

      if(arr.data.length===0 || reqLoc!==null){
        //console.log('aaa',param.login_type);
        if(param.login_type==='goo'){
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
