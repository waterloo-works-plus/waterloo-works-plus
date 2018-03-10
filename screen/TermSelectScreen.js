import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'

import Colors from '../style/Color';

@inject('AppStore')
@observer
export class TermSelectScreen extends React.Component {
  static navigationOptions = {
    title: 'Applications',
  };

  onCurrentJobSearchTermPress = () => {
    const { AppStore, navigation } = this.props;

    navigation.push('Applications', {
      title: 'Current Job Search Term',
      term: AppStore.getCurrentJobSearchTerm(),
    });
  }

  onCurrentWorkTermPress = () => {
    const { AppStore, navigation } = this.props;

    navigation.push('Applications', {
      title: 'Current Work Term',
      term: AppStore.getCurrentWorkTerm(),
    });
  }

  render() {
    const now = new Date();
    const currentTerm = Math.floor((now.getMonth() - 1) / 4);
    const year = now.getFullYear();

    let currentJobSearchTerm = '';
    let currentWorkTerm = '';

    if (currentTerm === 0) {
      currentJobSearchTerm = 'Spring ' + year;
      currentWorkTerm = 'Winter ' + year;
    } else if (currentTerm === 1) {
      currentJobSearchTerm = 'Fall ' + year;
      currentWorkTerm = 'Spring ' + year;
    } else if (currentTerm === 2) {
      currentJobSearchTerm = 'Winter ' + (year + 1);
      currentWorkTerm = 'Fall ' + year;
    }

    return (
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.main}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.lightBlue}
            onPress={this.onCurrentJobSearchTermPress}
          >
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Current Job Search Term</Text>
              <Text style={styles.buttonSmallText}>{currentJobSearchTerm}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.lightBlue}
            onPress={this.onCurrentWorkTermPress}
          >
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Current Work Term</Text>
              <Text style={styles.buttonSmallText}>{currentWorkTerm}</Text>
            </View>
          </TouchableHighlight>
        </ScrollView>
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
    color: Colors.white,
  },
  buttonSmallText: {
    fontSize: 18,
    color: Colors.white,
  },
  buttonTextContainer: {
    marginLeft: 20,
  }
});
