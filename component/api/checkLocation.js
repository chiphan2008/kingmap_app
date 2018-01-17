import { AsyncStorage } from 'react-native';

const checkLocation = async () => {
  const value = await AsyncStorage.getItem('@LocationKey:key');
  if (value !== null) {
      return JSON.parse(value);
  }
  return {};
};

export default checkLocation;
