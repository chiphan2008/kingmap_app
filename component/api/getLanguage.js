import { AsyncStorage } from 'react-native';

const getLanguage = async () => {
    try {
        const value = await AsyncStorage.getItem('@MyLanguage:key');
        if (value !== null) {
            return JSON.parse(value);
        }
        return {};
    } catch (error) {
    // Error retrieving data
        return '';
    }
};

export default getLanguage;
