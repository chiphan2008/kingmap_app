import { AsyncStorage } from 'react-native';

const postApi = async (url,param) => {
  try {

    const auth_key = await AsyncStorage.getItem('@AuthKey:key');
    auth_key = JSON.parse(auth_key);

    const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer '+ auth_key.access_token,
        },
        body: param
      };

      // fetch('https://facebook.github.io/react-native/movies.json')
        // .then((response) => response.json())
        // .then((responseJson) => {
        //   console.log('responseJson.movies',responseJson.movies);
        // })
        // .catch((error) =>{
        //   console.error(error);
        // });

    //console.log('url, params',url, param);
    let response = await fetch(url, params);
    //console.log('response',response);

    let responseJson = await response.json();
    //console.log('responseJson',responseJson);
    //
    return responseJson;
    // return await fetch(url, params).then((response) => response.json())
    // .then((responseJson) => {
    //   //console.log();
    //   return responseJson;
    // })
    // .catch((error) =>{
    //   console.error(error);
    // });

  } catch (error) {
    console.log('err',error);
  }

};

export default postApi;
