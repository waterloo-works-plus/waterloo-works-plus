import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, 
  Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'
import _ from 'lodash';

import { Storage } from '../data/Storage.js';

import Colors from '../style/Color.js'
import appStore from '../store/AppStore.js';

@inject('AppStore')
@observer
export class ApplicationsScreen extends React.Component {
  @observable sortBy = 'jobStatus';

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.title : 'Applications',
    };
  };

  onJobPress = (jobId) => {
    
  }

  render() {
    const { AppStore, navigation } = this.props;
    const { params } = navigation.state;
    const { term } = params;

    const applications = _.values(AppStore.applications[term]);

    if (AppStore.isLoadingApplications) {
      return (
        <SafeAreaView style={styles.root}>
          <ActivityIndicator style={styles.loadingIndicator} />
        </SafeAreaView>
      );
    }

    if (!applications || !applications.length) {
      return (
        <SafeAreaView style={styles.root}>
          <Text style={styles.noAppsText}>No applications found</Text>
        </SafeAreaView>
      )
    }

    return (
      <SafeAreaView style={styles.root}>
        <FlatList
          style={styles.list}
          data={applications}
          extraData={AppStore.isLoadingApplications}
          keyExtractor={(item, index) => item.jobId}
          renderItem={(data) => {
            const { item: application } = data;
            let backgroundColor = Colors.veryLightBlue;

            if (application.appStatus === 'Employed') {
              backgroundColor = Colors.green;
            } else if (application.jobStatus === 'Filled') {
              backgroundColor = Colors.lightGrey;
            } else if (application.jobStatus === 'Cancel') {
              backgroundColor = Colors.grey;
            } else if (application.appStatus === 'Selected For Interview') {
              backgroundColor = Colors.yellow;
            }

            return (
              <TouchableHighlight
                onPress={() => this.onJobPress(application.jobId)}
                underlayColor={Colors.lightBlue}
              >
                <View style={[
                  styles.applicationsContainer,
                  { backgroundColor: backgroundColor },
                ]}>
                  <Text style={styles.titleText}>{application.title}</Text>
                  <Text style={styles.companyText}>{application.company}</Text>
                  <Text>City: {application.city || 'Unknown'}</Text>
                  <Text>App Status: {application.appStatus}</Text>
                  <Text>Job Status: {application.jobStatus}</Text>
                </View>
              </TouchableHighlight>
            );
          }}
        />
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
  noAppsText: {
    fontSize: 18,
    marginTop: 20,
    color: Colors.veryDarkBlue,
  },
  list: {
    flex: 1
  },
  applicationsContainer: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.veryDarkBlue,
    width: deviceWidth,
    backgroundColor: Colors.veryLightBlue,
  },
  loadingIndicator: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
  },
  companyText: {
    fontSize: 16,
  },
});
