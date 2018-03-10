import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react/native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { AppLoading } from 'expo';

import AppStore from './store/AppStore';

import { Storage } from './data/Storage';

import { HomeScreen } from './screen/HomeScreen';
import { MenuScreen } from './screen/MenuScreen';
import { TermSelectScreen } from './screen/TermSelectScreen';
import { ApplicationsScreen } from './screen/ApplicationsScreen';
import { JobScreen } from './screen/JobScreen';
import { AboutScreen } from './screen/AboutScreen';

const stores = { AppStore };

@observer
export default class App extends React.Component {
  @observable isReady = false;

  componentDidMount() {
    Storage.getUserCredentials(() => {
      this.isReady = true;
    }, (username, password) => {
      if (!username || !password) {
        this.isReady = true;
      } else {
        AppStore.login(username, password, () => {
          this.isReady = true;
        }, (error) => {
          console.warn(error);
          this.isReady = true;
        });
      }
    })
  }

  render() {
    if (!this.isReady) {
      return <AppLoading />
    }

    let initialRouteName = AppStore.isSignedIn ? 'Menu' : 'Home';

    const RootStack = StackNavigator({
      Home: {
        screen: HomeScreen,
      },
      Menu: {
        screen: MenuScreen,
      },
      TermSelect: {
        screen: TermSelectScreen,
      },
      Applications: {
        screen: ApplicationsScreen,
      },
      Job: {
        screen: JobScreen
      },
      About: {
        screen: AboutScreen
      },
    }, {
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