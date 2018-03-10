import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, 
  Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'
import _ from 'lodash';

import Colors from '../style/Color';

import { SortApplicationsByModal } from './SortApplicationsByModal';

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

  onApplicationPress = (application, term) => {
    const { AppStore, navigation } = this.props;

    const jobId = application.jobId;
    if (!AppStore.jobs.get(jobId) &&
      !AppStore.isLoadingJob.get(jobId)) {
      AppStore.getJob(application.jobId, term);
    }
    
    navigation.push('Job', { 
      jobId: application.jobId,
      title: application.company
    });
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

    const applications = _.sortBy(_.values(AppStore.applications.get(term)), this.sortBy);
    const isLoadingApplications = AppStore.isLoadingApplications.get(term);

    if (isLoadingApplications) {
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
          <View style={styles.headerContainer}>
            <View style={styles.sortByContainer}>
              <Text style={styles.sortByText}>Sort by: </Text>
              <Text style={[styles.sortByText, { fontWeight: 'bold' }]}>{this.sortByTitle}</Text>
            </View>
            <View>
              <Text style={styles.totalText}>{applications.length + ' apps'}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <FlatList
          style={styles.list}
          data={applications}
          extraData={isLoadingApplications}
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
                onPress={() => this.onApplicationPress(application, term)}
                underlayColor={Colors.lightBlue}
              >
                <View style={[
                  styles.applicationsContainer,
                  { backgroundColor: backgroundColor },
                ]}>
                  <Text style={styles.titleText}>{application.title}</Text>
                  <Text style={styles.companyText}>{application.company}</Text>
                  <View style={styles.group}>
                    <Text style={styles.key}>City:</Text>
                    <Text style={styles.value}>{application.city || 'Unknown'}</Text>
                  </View>
                  <View style={styles.group}>
                    <Text style={styles.key}>App Status:</Text>
                    <Text style={styles.value}>{application.appStatus}</Text>
                  </View>
                  <View style={styles.group}>
                    <Text style={styles.key}>Job Status:</Text>
                    <Text style={styles.value}>{application.jobStatus}</Text>
                  </View>
                  <View style={styles.group}>
                    <Text style={styles.key}>Openings:</Text>
                    <Text style={styles.value}>{application.openings}</Text>
                  </View>
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
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.blue,
    width: deviceWidth,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.veryDarkBlue,
  },
  sortByContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  sortByText: {
    color: Colors.white,
    fontSize: 18,
  },
  totalText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    flex: 1
  },
  applicationsContainer: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.black,
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
    marginBottom: 10,
  },
  group: {
    flexDirection: 'row',
  },
  key: {
    fontWeight: 'bold',
    width: 90,
  },
  value: {
  }
});
