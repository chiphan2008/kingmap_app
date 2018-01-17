/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow https://github.com/vault-development/react-native-svg-uri/blob/master/README.md
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import LogoWhite from '../src/icon/Logo-intro.png';
export default class IntroScreen extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
      <Image style={styles.imgLogo} source={LogoWhite} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#D0021B',
  },
  imgLogo: {
    height:80,
    width:170
  },
});
