import React from 'react';
import {  ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'

import { Storage } from '../data/Storage';

import Colors from '../style/Color';

@inject('AppStore')
@observer
export class MenuScreen extends React.Component {
  static navigationOptions = {
    title: 'Waterloo Works Plus',
    headerLeft: null,
  };

  onApplicationsPress = () => {
    const { navigation } = this.props;

    navigation.push('TermSelect');
  }

  onSignOutPress = () => {
    const { AppStore, navigation } = this.props;

    Storage.clearUserCredentials();
    AppStore.logout();
    navigation.push('Home');
  }

  onAboutPress = () => {
    const { navigation } = this.props;

    navigation.push('About');
  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.main}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.lightBlue}
            onPress={this.onApplicationsPress}
          >
            <Text style={styles.buttonText}>Applications</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.lightBlue}
            onPress={this.onAboutPress}
          >
            <Text style={styles.buttonText}>About</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.lightBlue}
            onPress={this.onSignOutPress}
          >
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableHighlight>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  button: {
    height: 65,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.blue,
  },
  buttonText: {
    fontSize: 24,
    marginLeft: 20,
    color: Colors.white,
  },
  footerText: {
    marginVertical: 10,
    color: Colors.grey,
    textAlign: 'center',
  },
});
