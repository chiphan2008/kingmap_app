import { AsyncStorage } from 'react-native';
import createAuthKey from './createAuthKey';

const getApiKey = async () => {
  try{
    AsyncStorage.getItem('@AuthKey:key',(err, result) => {
      if (result === null) {
          createAuthKey();
      }
      //console.log('@getApiKey---',result);
      //return;
    });

  }catch (error){
  }

};

export default getApiKey;
