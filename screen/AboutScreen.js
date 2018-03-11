import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, 
  TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Colors from '../style/Color';

export class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  };

  handleClick = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.root}>
          <Text style={styles.title}>About Waterloo Works Plus</Text>
          <View style={styles.groupContainer}>
            <Text style={styles.questionText}>Is this app associated with the University of Waterloo?</Text>
            <Text style={styles.answerText}>No, it is independently made.</Text>
          </View>
          <View style={styles.groupContainer}>
            <Text style={styles.questionText}>Do you store any of my data?</Text>
            <Text style={styles.answerText}>No, user information is not stored on the backend. We use your username and password, stored securely on your mobile device, to login to Waterloo Works on your behalf and retrieve only the required information.</Text>
          </View>
          <View style={styles.groupContainer}>
            <Text style={styles.questionText}>Can I contribute?</Text>
            <Text style={styles.answerText}>Yes! Contribute to our source code at</Text>
            <TouchableHighlight 
              underlayColor={'transparent'}
              onPress={() => this.handleClick('https://github.com/waterloo-works-plus')}
            >
              <Text style={styles.linkText}>github.com/waterloo-works-plus</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.groupContainer}>
            <Text style={styles.questionText}>Contributors: </Text>
            <TouchableHighlight 
              underlayColor={'transparent'}
              onPress={() => this.handleClick('https://github.com/MunazR')}
            >
              <Text style={styles.linkText}>Munaz Rahman</Text>
            </TouchableHighlight>
            <TouchableHighlight 
              underlayColor={'transparent'}
              onPress={() => this.handleClick('https://github.com/santanu23')}
            >
              <Text style={styles.linkText}>Santanu Sarker</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.veryDarkBlue,
    marginBottom: 10,
  },
  groupContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    color: Colors.blue
  }
});