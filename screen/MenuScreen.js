import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'

import { Storage } from '../data/Storage.js';

import Colors from '../style/Color.js';

@inject('AppStore')
@observer
export class MenuScreen extends React.Component {
  static navigationOptions = {
    title: 'Waterloo Works Mobile',
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
            onPress={this.onSignOutPress}
          >
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.lightBlue}
            onPress={this.onAboutPress}
          >
            <Text style={styles.buttonText}>About</Text>
          </TouchableHighlight>
        </ScrollView>
        <View>
          <Text style={styles.footerText}>
            Not affilliated with the University of Waterloo
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const { width: deviceWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  main: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.veryDarkGrey,
    flex: 1,
  },
  button: {
    height: 75,
    justifyContent: 'center',
    width: deviceWidth,
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
    marginTop: 10,
    color: Colors.grey,
  },
});
