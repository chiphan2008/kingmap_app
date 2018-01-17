import { AsyncStorage } from 'react-native';

const checkLogin = async () => {
    try {
        const value = await AsyncStorage.getItem('@MyAccount:key');
        if (value !== null) {
            return JSON.parse(value);
        }
        return {};
    } catch (error) {
    // Error retrieving data
        return '';
    }
};

export default checkLogin;
