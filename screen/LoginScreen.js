import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Switch, Text,
  TextInput, TouchableHighlight, View, WebView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'

import { Storage } from '../data/Storage';
import Colors from '../style/Color';

export class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies    : {},
      webViewUrl : ''
    }
    this.webView = null;
  }


  onNavigationStateChange = (webViewState: { url: string }) => {
    const { url } = webViewState;

    // when WebView.onMessage called, there is not-http(s) url
    if(url.includes('http')) {
      this.setState({ webViewUrl: url })
    }
  }

  _onMessage = (event) => {
    console.log('message');
    const { data } = event.nativeEvent;
    const cookies  = data.split(';'); // `csrftoken=...; rur=...; mid=...; somethingelse=...`

    cookies.forEach((cookie) => {
      const c = cookie.trim().split('=');

      const new_cookies = this.state.cookies;
      new_cookies[c[0]] = c[1];

      this.setState({ cookies: new_cookies });
    });

  }

  render() {
    const jsCode = "window.postMessage(document.cookie)"
    // let jsCode = "window.postMessage(document.cookie= 'login=; expires=Bla bla bla')"; // if you need to write some cookies, not sure if it goes to shared cookies, most probably no :)

    return (
      <WebView
        source={{ uri: 'https://cas.uwaterloo.ca/cas/login?service=https://waterlooworks.uwaterloo.ca/waterloo.htm' }}
        onNavigationStateChange={this.onNavigationStateChange}
        onMessage={this._onMessage}
        injectedJavaScript={jsCode}
        style={{ flex: 1 }}
        ref={( webView ) => this.webView = webView}
      />
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 32,
    paddingVertical: 24,
    textAlign: 'center',
    color: Colors.blue,
    fontFamily: 'roboto-medium',
  },
  textInput: {
    marginBottom: 16,
    height: 40,
    borderBottomWidth: 1,
    borderColor: Colors.blackBorder,
    fontFamily: 'roboto-regular',
    padding: 8,
    fontSize: 18,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  rememberMeText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.grey,
    fontFamily: 'roboto-regular',
  },
  loginButton: {
    elevation: 1,
    borderRadius: 2,
    marginVertical: 24,
    padding: 10,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  loginText: {
    color: Colors.white,
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginFailed: {
    color: Colors.red,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'roboto-regular',
  }
});
