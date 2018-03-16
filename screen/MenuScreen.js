import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
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
    navigation.push('Login');
  }

  onAboutPress = () => {
    const { navigation } = this.props;

    navigation.push('About');
  }

  onInterviewsPress = () => {
    const { navigation } = this.props;

    navigation.push('Interviews');
  }

  renderMenuItem = (icon, text, onPress) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.grey}
        onPress={onPress}
      >
        <View style={styles.button}>
          <Text style={styles.menuIcon}>{icon}</Text>
          <Text style={styles.buttonText}>{text}</Text>
          <Text style={styles.rightArrow}>{'\uE315'}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.main}>
          {
            this.renderMenuItem('\uE873', 'Applications', this.onApplicationsPress)
          }
          {
            this.renderMenuItem('\uE878', 'Interviews', this.onInterviewsPress)
          }
          {
            this.renderMenuItem('\uE88E', 'About', this.onAboutPress)
          }
          {
            this.renderMenuItem('\uE879', 'Logout', this.onSignOutPress)
          }
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
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  button: {
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  buttonText: {
    fontFamily: 'roboto-regular',
    flex: 1,
    fontSize: 18,
    color: Colors.veryDarkGrey,
  },
  rightArrow: {
    fontFamily: 'material-icons',
    fontSize: 24,
    color: Colors.grey,
  },
  menuIcon: {
    fontFamily: 'material-icons',
    fontSize: 32,
    width: 72,
    color: Colors.grey,
  }
});
