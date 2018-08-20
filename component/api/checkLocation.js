import { AsyncStorage } from 'react-native';

const checkLocation = async () => {
  try {
    const value = await AsyncStorage.getItem('@LocationKey:key');
    //console.log('jhfdhs', value)
    if (value !== null) {
        return JSON.parse(value);
    }
    return {};
   } catch (error) {
     //console.log('Error retrieving data',error)
   }

};

export default checkLocation;
