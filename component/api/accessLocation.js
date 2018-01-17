/* @flow */
import RNSettings from 'react-native-settings';
import { Alert,PermissionsAndroid, AsyncStorage,Linking,Platform } from 'react-native';

async function accessLocation() {
  try {

    RNSettings.getSetting(RNSettings.LOCATION_SETTING).then(result => {
      if (result == RNSettings.ENABLED) {
      } else {
        Alert.alert(
          'KingMap App Location Permission',
          'KingMap App needs access to your location so you can find location exactly.',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => {Platform.OS==='ios' ? Linking.openURL('app-settings:') : RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS)}},
          ],
          { cancelable: false ,}
        );
        console.log('location is disabled')
      }
    });

  } catch (err) {
    console.warn(err)
  }
}

export default accessLocation;
