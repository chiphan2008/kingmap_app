/* @flow */

import React, { Component } from 'react';
import {
  Image
} from 'react-native';
import favoriteIcon from '../../../src/icon/ic-favorite.png';
import favoriteFullIcon from '../../../src/icon/ic-favorite-full.png';

export default class Rating extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const { showVote,rate,styleIMG }= this.props;
    return (
      <Image source={Number(showVote) < Number(rate) ? favoriteIcon : favoriteFullIcon} style={styleIMG}  />
    );
  }
}
