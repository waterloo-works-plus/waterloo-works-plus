import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react/native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { AppLoading } from 'expo';

import AppStore from './store/AppStore.js';

import { Storage } from './data/Storage.js';

import { HomeScreen } from './screen/HomeScreen';
import { MenuScreen } from './screen/MenuScreen';

const stores = { AppStore };

@observer
export default class App extends React.Component {
  @observable isReady = false;

  componentWillMount() {
    Storage.getUserCredentials(() => {
      this.isReady = true;
    }, (username, password) => {
      AppStore.login(username, password, () => {
        this.isReady = true;
      });
    })
  }

  render() {
    if (!this.isReady) {
      <AppLoading />
    }

    let initialRouteName = AppStore.isSignedIn ? 'Menu' : 'Home';

    const RootStack = StackNavigator({
      Home: {
        screen: HomeScreen,
      },
      Menu: {
        screen: MenuScreen,
      }
    }, {
      mode: 'modal',
      headerMode: 'float',
      initialRouteName: initialRouteName
    });

    return (
      <Provider {...stores}>
        <RootStack />
      </Provider>
    );
  }
}