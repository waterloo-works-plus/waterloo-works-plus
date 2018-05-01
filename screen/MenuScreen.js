import React from 'react';
import { Alert, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'
import { Expo } from 'expo'

import { Storage } from '../data/Storage';

import Colors from '../style/Color';

@inject('AppStore')
@observer
export class MenuScreen extends React.Component {
  static navigationOptions = {
    headerLeft: null,
    header: Platform.OS === 'ios' ? undefined : null,
    headerStyle: {
      backgroundColor: Colors.blue,
      borderBottomWidth: 0,
    }
  };

  onApplicationsPress = () => {
    const { navigation } = this.props;

    navigation.push('TermSelect');
  }

  onSignOutPress = () => {
    const { AppStore, navigation } = this.props;

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes', onPress: () => {
            Storage.clearUserCredentials();
            AppStore.logout();
            navigation.push('Login');
          }
        },
      ],
      { cancelable: false }
    )
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
        style={styles.buttonContainer}
      >
        <View style={styles.button}>
          <Image style={styles.icon} source={icon} />
          <Text style={styles.buttonText}>{text}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.main}>
          <View style={styles.background}>
            <View style={styles.backgroundBlue}/>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>WaterlooWorks</Text>
            <Text style={styles.titleSubText}>Plus</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              {
                this.renderMenuItem(require('../assets/applications.png'), 'Applications', this.onApplicationsPress)
              }
            </View>
            <View style={{ flex: 1, alignItems: 'center', }}>
              {
                this.renderMenuItem(require('../assets/interviews.png'), 'Interviews', this.onInterviewsPress)
              }
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              {
                this.renderMenuItem(require('../assets/about.png'), 'About', this.onAboutPress)
              }
            </View>
            <View style={{ flex: 1, alignItems: 'center', }}>
              {
                this.renderMenuItem(require('../assets/logout.png'), 'Logout', this.onSignOutPress)
              }
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('screen');

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
  },
  backgroundBlue: {
    backgroundColor: Colors.blue,
    height: deviceHeight * 0.35,
  },
  titleContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 25 : 50,
  },
  titleText: {
    fontFamily: 'roboto-regular',
    fontSize: 42,
    color: Colors.white,
    textAlign: 'center',
  },
  titleSubText: {
    fontFamily: 'roboto-bold',
    fontSize: 42,
    color: Colors.white,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: 300,
    marginBottom: 32,
  },
  buttonContainer: {
    height: 120,
    width: 120,
    elevation: 1,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    borderRadius: 4,
  },
  button: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'roboto-regular',
    marginTop: 8,
    fontSize: 14,
    color: Colors.veryDarkGrey,
  },
  icon: {
    width: 64,
    height: 64,
  }
});
