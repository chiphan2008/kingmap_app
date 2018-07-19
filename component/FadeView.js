import React, { Component } from 'react';
import { Animated, Image, View, Dimensions } from 'react-native';

import CityScreen from './location/CityScreen';
import IntroScreen from './IntroScreen';
import LogoWhite from '../src/icon/Logo-intro.png';
const {height, width} = Dimensions.get('window');

export default class FadeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnimOut: new Animated.Value(1),
      fadeAnimIn: new Animated.Value(0),
    }
  }
  componentDidMount() {

    Animated.parallel([
      Animated.timing(                  // Animate over time
        this.state.fadeAnimOut,            // The animated value to drive
        {
          toValue: 0,                   // Animate to opacity: 1 (opaque)
          duration: 3000,
        }),
        Animated.timing(                  // Animate over time
          this.state.fadeAnimIn,            // The animated value to drive
          {
            toValue: 1,                   // Animate to opacity: 1 (opaque)
            duration: 4000,
          }
        ),

  ]).start();

  }
  render() {
    //console.log("this.props.fadeview=",util.inspect(this.props.navigation,true,null));
    let { fadeAnimOut, fadeAnimIn } = this.state;
    const {navigation} = this.props;
    //console.log('FV',this.props);
    return (
      <View>
      <Animated.View                 // Special animatable View
        style={{
          width,
          height,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#D0021B',
          position: 'absolute',
          opacity: fadeAnimOut,
        }}
      >
        <IntroScreen />
      </Animated.View>

          <Animated.View                 // Special animatable View
            style={{
              width,
              height,
              justifyContent: 'center',
              alignItems: 'center',
              //backgroundColor: '#fff',
              opacity: fadeAnimIn,
            }}
          >

            <CityScreen screenProps={this.props.screenProps}  navigation={navigation}/>
          </Animated.View>

      </View>
    );
  }


}
