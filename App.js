import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react/native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { AppLoading, Font } from 'expo';

import AppStore from './store/AppStore';

import { Storage } from './data/Storage';

import { LoginScreen } from './screen/LoginScreen';
import { MenuScreen } from './screen/MenuScreen';
import { TermSelectScreen } from './screen/TermSelectScreen';
import { ApplicationsScreen } from './screen/ApplicationsScreen';
import { JobScreen } from './screen/JobScreen';
import { AboutScreen } from './screen/AboutScreen';
import { InterviewsScreen } from './screen/InterviewsScreen';

const stores = { AppStore };

@observer
export default class App extends React.Component {
  @observable isReady = false;
  @observable isLoadingFonts = true;

  loadFonts = async () => {
    await Font.loadAsync({
      'material-icons': require('./assets/fonts/MaterialIcons-Regular.ttf'),
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
    });

    this.isLoadingFonts = false;
  }

  componentDidMount() {
    this.loadFonts();

    Storage.getUserCredentials(() => {
      this.isReady = true;
    }, (username, password) => {
      if (!username || !password) {
        this.isReady = true;
      } else {
        AppStore.setUserCredentials(username, password);
        this.isReady = true;
      }
    })
  }

  render() {
    if (!this.isReady || this.isLoadingFonts) {
      return <AppLoading />
    }

    let initialRouteName = AppStore.isSignedIn ? 'Menu' : 'Login';

    const RootStack = StackNavigator({
      Login: {
        screen: LoginScreen,
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
        screen: JobScreen,
      },
      About: {
        screen: AboutScreen,
      },
      Interviews: {
        screen: InterviewsScreen,
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