import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Switch, Text, 
  TextInput, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'

import { Storage } from '../data/Storage';
import Colors from '../style/Color.js';

@inject('AppStore')
@observer
export class HomeScreen extends React.Component {
  @observable shouldRememberMe = false;
  @observable username = '';
  @observable password = '';
  @observable isLoggingIn = false;
  @observable showLoginFailedMessage = false;

  static navigationOptions = {
    title: 'Login',
    headerLeft: null,
  };

  componentWillMount() {
    const { AppStore } = this.props;

    this.username = AppStore.username;
    this.password = AppStore.password;

    if (this.username && this.password) {
      this.shouldRememberMe = true;
    }
  }

  onLoginPress = () => {
    const { AppStore, navigation } = this.props;

    if (!this.username || !this.password) {
      return;
    }

    if (this.shouldRememberMe) {
      Storage.updateUserCredentials(this.username, this.password);
    }

    this.isLoggingIn = true;

    AppStore.login(this.username, this.password, () => {
      // Login successful
      this.isLoggingIn = false;
      this.showLoginFailedMessage = false;
      navigation.push('Menu');
    }, (error) => {
      // Login failed
      this.isLoggingIn = false;
      this.showLoginFailedMessage = true;
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.main}>
          <Text style={styles.title}>Waterloo Works{'\n'}Plus</Text>
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            placeholder={'Username'}
            onChangeText={value => this.username = value}
            value={this.username}
            autoCapitalize={'none'}
            editable={!this.isLoggingIn}
            underlineColorAndroid={Colors.white}
          />
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            placeholder={'Password'}
            secureTextEntry
            onChangeText={value => this.password = value}
            value={this.password}
            editable={!this.isLoggingIn}
            underlineColorAndroid={Colors.white}
          />
          <View style={styles.rememberMeContainer}>
            <Switch
              value={this.shouldRememberMe}
              onValueChange={value => this.shouldRememberMe = value}
              disabled={this.isLoggingIn}
            />
            <Text
              style={[styles.rememberMeText, { color: this.shouldRememberMe ? Colors.veryDarkGrey : Colors.grey }]}
            >
              Remember me
            </Text>
          </View>
          <TouchableHighlight
            style={styles.loginButton}
            onPress={this.onLoginPress}
            underlayColor={Colors.lightBlue}
            disabled={this.isLoggingIn}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableHighlight>
          {
            this.showLoginFailedMessage &&
            <Text style={styles.loginFailed}>
              We couldn't log you in
            </Text>
          }
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Not affilliated with the University of Waterloo
          </Text>
        </View>
        {
          this.isLoggingIn &&
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={Colors.veryDarkBlue} />
          </View>
        }
      </SafeAreaView>
    );
  }
}

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  main: {
    flex: 1,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.blue,
  },
  footerText: {
    color: Colors.grey,
  },
  textInput: {
    marginTop: 10,
    width: deviceWidth - 30,
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.veryDarkGrey,
    padding: 5,
    fontSize: 18,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  rememberMeText: {
    fontSize: 18,
    marginLeft: 10,
    color: Colors.grey,
  },
  loginButton: {
    marginTop: 20,
    width: deviceWidth - 30,
    padding: 10,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: Colors.white,
    fontSize: 24,
  },
  loadingContainer: {
    position: 'absolute',
    width: deviceWidth,
    height: deviceHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginFailed: {
    color: Colors.red,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  }
});
