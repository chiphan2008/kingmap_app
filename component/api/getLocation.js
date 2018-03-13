import { AsyncStorage } from 'react-native';
import getLocationByIP from './getLocationByIP';

const getLocation = async () => {
  try{
    navigator.geolocation.getCurrentPosition(
          (position) => {
            return position;
           },
           (error) => {
            getLocationByIP().then((e) => {
                return e;
            });
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    );
  }catch(err){

  }
};

export default getLocation;
