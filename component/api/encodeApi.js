import { AsyncStorage } from 'react-native';

const encodeApi = async (url,method,param) => {
  try {
    //console.log('url,method,param',url,method,param);
    let formBody = `${'id='}${param.id}&${'name='}${param.full_name}&${'urlhinh='}${param.avatar}`;

    let params = {
        method:method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: formBody,
      };
    let response = await fetch(url, params);
    let responseJson = await response.json();
    //console.log('encodeApi',responseJson);
    return responseJson;
  } catch (error) {

  }

};

export default encodeApi;