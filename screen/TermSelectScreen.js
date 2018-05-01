import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'

import { TermUtil } from '../util/TermUtil';

import Colors from '../style/Color';

@inject('AppStore')
@observer
export class TermSelectScreen extends React.Component {
  static navigationOptions = {
    title: 'Applications',
    headerStyle: {
      backgroundColor: Colors.blue,
    },
    headerTitleStyle: {
      color: Colors.white,
    },
    headerTintColor: Colors.white,
  };

  onCurrentJobSearchTermPress = () => {
    const { navigation } = this.props;

    navigation.push('Applications', {
      title: 'Current Job Search Term',
      term: TermUtil.getCurrentJobSearchTerm(),
    });
  }

  onCurrentWorkTermPress = () => {
    const { navigation } = this.props;

    navigation.push('Applications', {
      title: 'Current Work Term',
      term: TermUtil.getCurrentWorkTerm(),
    });
  }

  renderTermItem = (title, subtitle, onPress) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.lightGrey}
        onPress={onPress}
        style={styles.buttonContainer}
      >
        <View style={styles.button}>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>{title}</Text>
            <Text style={styles.buttonSmallText}>{subtitle}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.rightArrow}>{'\uE315'}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    const now = new Date();
    const currentTerm = Math.floor((now.getMonth()) / 4);
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
          {
            this.renderTermItem(
              'Current Job Search Term', 
              currentJobSearchTerm, 
              this.onCurrentJobSearchTermPress
            )
          }
          {
            this.renderTermItem(
              'Current Work Term', 
              currentWorkTerm, 
              this.onCurrentWorkTermPress
            )
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
    paddingVertical: 16,
  },
  button: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    height: 72,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  buttonTextContainer: {
    flex: 1,
    paddingVertical: 20
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'roboto-regular',
    color: Colors.veryDarkGrey,
  },
  buttonSmallText: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.grey,
  },
  arrowContainer: {
    backgroundColor: Colors.blue,
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  rightArrow: {
    fontFamily: 'material-icons',
    fontSize: 24,
    color: Colors.white,
  },
});
