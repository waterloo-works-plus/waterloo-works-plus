import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, 
  TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Colors from '../style/Color';

export class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
    headerStyle: {
      backgroundColor: Colors.blue,
    },
    headerTitleStyle: {
      color: Colors.white,
    },
    headerTintColor: Colors.white,
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
          <Text style={styles.title}>About WaterlooWorks Plus</Text>
          <View style={styles.groupContainer}>
            <Text style={styles.questionText}>What is this app?</Text>
            <Text style={styles.answerText}>Waterloo Works Plus is aimed to help you view your applications, jobs and interviews on the go.</Text>
          </View>
          <View style={styles.groupContainer}>
            <Text style={styles.questionText}>Is this app associated with the University of Waterloo?</Text>
            <Text style={styles.answerText}>No, it is independently made.</Text>
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
            <TouchableHighlight 
              underlayColor={'transparent'}
              onPress={() => this.handleClick('https://github.com/mbkauser')}
            >
              <Text style={styles.linkText}>Mubasshira Kauser</Text>
            </TouchableHighlight>
            <TouchableHighlight 
              underlayColor={'transparent'}
              onPress={() => this.handleClick('https://github.com/LupenTiJay')}
            >
              <Text style={styles.linkText}>Jayant Tiwari</Text>
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
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    color: Colors.veryDarkGrey,
    marginBottom: 24,
    fontFamily: 'roboto-regular',
  },
  groupContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontFamily: 'roboto-regular',
    fontSize: 16,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: 'roboto-regular',
  },
  linkText: {
    fontSize: 14,
    color: Colors.blue,
    fontFamily: 'roboto-medium',
  }
});