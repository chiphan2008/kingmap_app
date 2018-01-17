import { AsyncStorage } from 'react-native';

const postApi = async (url,param) => {
  try {

    const auth_key = await AsyncStorage.getItem('@AuthKey:key');
    auth_key = JSON.parse(auth_key);

    let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer '+ auth_key.access_token,
        },
        body: param,
      });
    let responseJson = await response.json();

    return responseJson;
  } catch (error) {
  }

};

export default postApi;
