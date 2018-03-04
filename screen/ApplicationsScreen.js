import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, Modal, StyleSheet, 
  Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'
import _ from 'lodash';

import Colors from '../style/Color.js';

import { SortApplicationsByModal } from './SortApplicationsByModal.js';

@inject('AppStore')
@observer
export class ApplicationsScreen extends React.Component {
  @observable isSortByModalVisible = false;
  @observable sortByTitle = 'Job Status';
  @observable sortBy = 'jobStatus';

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.title : 'Applications',
    };
  };

  onJobPress = (jobId) => {
    
  }

  onSortByPress = () => {
    this.isSortByModalVisible = true;
  }

  onSortChange = (sort) => {
    this.sortByTitle = sort.title;
    this.sortBy = sort.value;

    this.isSortByModalVisible = false;
  }

  render() {
    const { AppStore, navigation } = this.props;
    const { params } = navigation.state;
    const { term } = params;

    const applications = _.sortBy(_.values(AppStore.applications[term]), this.sortBy);

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
        <SortApplicationsByModal
          isVisible={this.isSortByModalVisible}
          onCancel={() => this.isSortByModalVisible = false}
          onSortByPress={this.onSortChange}
        />
        <TouchableHighlight
          onPress={this.onSortByPress}
          underlayColor={Colors.lightBlue}
        >
          <View style={styles.sortByContainer}>
            <Text style={styles.sortByText}>Sort by: </Text>
            <Text style={[styles.sortByText, { fontWeight: 'bold' }]}>{this.sortByTitle}</Text>
          </View>
        </TouchableHighlight>
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
            } else if (application.appStatus === 'Selected for Interview') {
              backgroundColor = Colors.lightGreen;
            } else if (application.appStatus === 'Not Selected') {
              backgroundColor = Colors.yellow;
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
  noAppsText: {
    fontSize: 18,
    marginTop: 20,
    color: Colors.veryDarkBlue,
  },
  sortByContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: Colors.blue,
    width: deviceWidth,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.veryDarkBlue,
  },
  sortByText: {
    color: Colors.white,
    fontSize: 18,
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
