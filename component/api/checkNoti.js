import { AsyncStorage } from 'react-native';

const checkNoti = async () => {
    try {
        const value = await AsyncStorage.getItem('@Notify:key');
        if (value !== null) {
            return JSON.parse(value);
        }
        return {};
    } catch (error) {
    // Error retrieving data
        return '';
    }
};

export default checkNoti;
