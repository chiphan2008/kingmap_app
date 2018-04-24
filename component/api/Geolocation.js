import { AsyncStorage } from 'react-native';


const Geolocation = async () => {
  try {
      const value = await AsyncStorage.getItem('@currentLocation:key');
      if (value !== null) {
          return JSON.parse(value);
      }
      return {};
  } catch (error) {
  // Error retrieving data
      //return '';
  }
};

export default Geolocation;
