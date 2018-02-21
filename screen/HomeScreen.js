import React from 'react';
import { TouchableHighlight, Dimensions, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native'

import Colors from '../style/Color.js'

@observer
export class HomeScreen extends React.Component {
  @observable shouldRememberMe = false;
  @observable userEmail = '';
  @observable userPassword = '';

  static navigationOptions = {
    title: 'Login',
  };

  onLoginPress = () => {

  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.root}>
          <Text style={styles.title}>Waterloo Works Mobile</Text>
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            placeholder={'Email'}
            onValueChange={value => this.userEmail = value}
            value={this.userEmail}
          />
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            placeholder={'Password'}
            secureTextEntry
            onValueChange={value => this.userPassword = value}
            value={this.userPassword}
          />
          <View style={styles.rememberMeContainer}>
            <Switch
              value={this.shouldRememberMe}
              onValueChange={value => this.shouldRememberMe = value}
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
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.footer}>
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
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#fff',
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
    color: Colors.veryDarkBlue,
  },
  footerText: {
    color: Colors.grey,
  },
  textInput: {
    marginTop: 10,
    width: deviceWidth - 30,
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
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
  }
});
