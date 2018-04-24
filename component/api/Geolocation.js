import { AsyncStorage } from 'react-native';


const Geolocation = async () => {
  await navigator.geolocation.getCurrentPosition(
    (position) => {
      const {coords} = position.coords;
      console.log(position.coords);
      return coords;
    },
    (error) => {},
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
};

export default Geolocation;
