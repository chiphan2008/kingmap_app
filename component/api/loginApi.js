import { AsyncStorage } from 'react-native';

const loginApi = async (url,param) => {
  try {

    const auth_key = await AsyncStorage.getItem('@AuthKey:key');
    auth_key = JSON.parse(auth_key);

    const acc = new FormData();
    acc.append('username',param.username.toString());
    acc.append('password',param.password.toString());

    let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer '+ auth_key.access_token,
        },
        body: acc,
      });
    let responseJson = await response.json();
    if(responseJson.code===200){
      AsyncStorage.setItem('@MyAccount:key', JSON.stringify(Object.assign(responseJson.data[0],{'pwd':param.password.toString()})));
    }
    return responseJson;
  } catch (error) {
  }

};

export default loginApi;
