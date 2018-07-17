import { AsyncStorage } from 'react-native';

const postApi = async (url,param) => {
  try {

    const auth_key = await AsyncStorage.getItem('@AuthKey:key');
    auth_key = JSON.parse(auth_key);

    let params = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer '+ auth_key.access_token,
        },
        body: param,
      };

    //console.log('url, params',url, params);
    let response = await fetch(url, params);
    // console.log('response',response);
    let responseJson = await response.json();
    // console.log('responseJson',responseJson);

    return responseJson;
  } catch (error) {
    console.log('err',error);
  }

};

export default postApi;
