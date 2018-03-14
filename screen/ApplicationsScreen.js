import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, 
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
      term: term,
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} />
          </View>
        </SafeAreaView>
      );
    }

    if (!applications) {
      return (
        <SafeAreaView style={styles.root}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Oops, something went wrong</Text>
            <TouchableHighlight
              underlayColor={Colors.lightGrey}
              onPress={() => AppStore.getApplicationsForTerm(term)}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableHighlight>
          </View>
        </SafeAreaView>
      )
    }

    if (!applications.length) {
      return (
        <SafeAreaView style={styles.root}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>We didn't find any applications</Text>
          </View>
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
          underlayColor={Colors.grey}
        >
          <View style={styles.headerContainer}>
            <View style={styles.sortByContainer}>
              <Text style={[styles.sortByText, { fontWeight: 'bold' }]}>Sort by: </Text>
              <Text style={styles.sortByText}>{this.sortByTitle}</Text>
            </View>
            <View>
              <Text style={styles.totalText}>{applications.length}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <FlatList
          style={styles.list}
          data={applications}
          extraData={isLoadingApplications}
          keyExtractor={(item, index) => item.jobId}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={(data) => {
            const { item: application } = data;

            return (
              <View style={styles.applicationsContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>{application.title}</Text>
                  <Text style={styles.companyText}>{application.company}</Text>
                  <Text style={styles.locationText}>
                    {`${application.city}${application.city && ', '}${application.location}`}
                  </Text>
                </View>
                <View style={styles.supportingTextContainer}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.group}>
                      <Text style={[styles.key, { width: 85 }]}>Job Status:</Text>
                      <Text style={styles.value}>{application.jobStatus}</Text>
                    </View>
                    <View style={styles.group}>
                      <Text style={[styles.key, { width: 85 }]}>App Status:</Text>
                      <Text style={styles.value}>{application.appStatus}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.group}>
                      <Text style={[styles.key, { width: 75 }]}>Openings:</Text>
                      <Text style={styles.value}>{application.openings}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableHighlight
                    onPress={() => this.onApplicationPress(application, term)}
                    underlayColor={Colors.lightGrey}
                  >
                    <View style={styles.actionContainer}>
                      <Text style={styles.actionText}>VIEW</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  retryText: {
    fontSize: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: Colors.blue,
    fontWeight: 'bold',
    fontFamily: 'roboto-regular',
  },
  messageText: {
    fontSize: 18,
    marginBottom: 16,
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-regular',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerContainer: {
    elevation: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.blackBorder,
  },
  sortByContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  sortByText: {
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-regular',
    fontSize: 14,
  },
  totalText: {
    color: Colors.veryDarkGrey,
    fontSize: 14,
    fontFamily: 'roboto-regular',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    paddingTop: 16,
  },
  applicationsContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
    elevation: 1,
    backgroundColor: Colors.white,
    borderRadius: 2,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  supportingTextContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionContainer: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: 'roboto-regular',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'roboto-regular',
    color: Colors.veryDarkGrey,
  },
  companyText: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.darkGrey,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.darkGrey,
  },
  group: {
    flexDirection: 'row',
  },
  key: {
    fontWeight: 'bold',
    fontFamily: 'roboto-regular',
    color: Colors.darkGrey,
  },
  value: {
    flex: 1,
    fontFamily: 'roboto-regular',
    color: Colors.veryDarkGrey,
  },
});
