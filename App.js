import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import appStore from './store/AppStore.js';

import { HomeScreen } from './screen/HomeScreen';

const RootStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
});

export default class App extends React.Component {
  render() {
    return (
      <RootStack />
    );
  }
}