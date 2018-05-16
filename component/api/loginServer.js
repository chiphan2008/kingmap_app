import { AsyncStorage } from 'react-native';
import global from '../global';
import getApi from '../api/getApi';
import loginApi from '../api/loginApi';
import gooApi from '../api/gooApi';

const loginServer = async (param) => {
  try {
    //console.log(`${global.url}${'check-login'}`,);
    getApi(`${global.url}${'check-login'}`).then(arr => {
      //console.log('arr.data.length',arr.data.length);
      if(arr.data.length===0){
        if(param.id_google!==null){
          //console.log('gooApi');
          gooApi(`${global.url}${'login-google'}`,param);
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
