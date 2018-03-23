import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, 
  Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'
import _ from 'lodash';

import Colors from '../style/Color';

import { SortApplicationsByModal } from './SortApplicationsByModal';
import { FilterApplicationsModal } from './FilterApplicationsModal';

@inject('AppStore')
@observer
export class ApplicationsScreen extends React.Component {
  @observable isSortByModalVisible = false;
  @observable isFilterModalVisible = false;
  @observable sort = {
    title: 'Submitted on',
    value: 'appSubmittedOn',
    reverse: true,
  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.title : 'Applications',
    };
  };

  componentWillMount() {
    const { AppStore, navigation } = this.props;
    const { params } = navigation.state;
    const { term } = params;

    if (!AppStore.applications.get(term) &&
      !AppStore.isLoadingApplications.get(term)) {
      AppStore.getApplicationsForTerm(term);
    }
  }

  onApplicationPress = (application, term) => {
    const { navigation } = this.props;
    
    navigation.push('Job', { 
      jobId: application.jobId,
      term: term,
      title: application.company
    });
  }

  onSortChange = (sort) => {
    this.sort = sort;
    this.isSortByModalVisible = false;
  }

  formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ` +
      `${((date.getHours() + 11) % 12 + 1)}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()} ` + 
      `${date.getHours() < 12 ? 'AM' : 'PM'}`;
  }

  render() {
    const { AppStore, navigation } = this.props;
    const { params } = navigation.state;
    const { term } = params;

    let applications = AppStore.applications.get(term);
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
    
    applications = _.values(applications);

    if (this.sort.reverse) {
      applications = applications.reverse();
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

    const totalAppCount = applications.length;
    const appStatusFilters = AppStore.appStatusFilters;
    const jobStatusFilters = AppStore.jobStatusFilters;

    applications = _.filter(applications, application => {
      return appStatusFilters.indexOf(application.appStatus) > -1 &&
        jobStatusFilters.indexOf(application.jobStatus) > -1;
    });

    applications = _.sortBy(applications, this.sort.value);

    if (this.sort.reverse) {
      applications = applications.reverse();
    }

    return (
      <SafeAreaView style={styles.root}>
        <SortApplicationsByModal
          isVisible={this.isSortByModalVisible}
          onCancel={() => this.isSortByModalVisible = false}
          onSortByPress={this.onSortChange}
        />
        <FilterApplicationsModal
          isVisible={this.isFilterModalVisible}
          onDonePress={() => this.isFilterModalVisible = false}
          onCancel={() => this.isFilterModalVisible = false}
        />
        <View style={styles.headerContainer}>
          <TouchableHighlight
            style={styles.headerButton}
            onPress={() => this.isSortByModalVisible = true}
            underlayColor={Colors.lightGrey}
          >
            <View style={styles.headerItemContainer}>
              <Text style={[styles.headerText, { fontFamily: 'roboto-medium' }]}>Sort by: </Text>
              <Text style={styles.headerText}>{this.sort.title}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.headerButton}
            onPress={() => this.isFilterModalVisible = true}
            underlayColor={Colors.lightGrey}
          >
            <View style={styles.headerItemContainer}>
              <Text style={[styles.headerText, { fontFamily: 'roboto-medium' }]}>Viewing {applications.length} of {totalAppCount}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <FlatList
          style={styles.list}
          data={applications}
          extraData={isLoadingApplications}
          keyExtractor={(item, index) => item.jobId}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={(data) => {
            const { item: application } = data;
            let jobStatusColor = Colors.blue;
            let appStatusColor = Colors.blue;

            if (application.appStatus === 'Employed') {
              appStatusColor = Colors.darkGreen;
            } else if (application.appStatus === 'Selected for Interview') {
              appStatusColor = Colors.green;
            } else if (application.appStatus === 'Not Selected') {
              appStatusColor = Colors.red;
            }
            
            if (application.jobStatus === 'Cancel') {
              jobStatusColor = Colors.red;
            } else if (application.jobStatus === 'Filled') {
              jobStatusColor = Colors.grey;
            }

            return (
              <View style={styles.applicationsContainer}>
                <View style={styles.titleContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.titleText}>{application.title}</Text>
                    <Text style={styles.companyText}>{application.company}</Text>
                    <Text style={styles.locationText}>
                      {`${application.city}${application.city && ', '}${application.location}`}
                    </Text>
                  </View>
                  <View>
                    <View style={[
                      styles.statusIcon,
                      {
                        backgroundColor: jobStatusColor,
                        marginBottom: 8,
                      }
                    ]}>
                      <Text style={styles.statusChar}>{application.jobStatus.toUpperCase().charAt(0)}</Text>
                    </View>
                    <View style={[
                      styles.statusIcon,
                      {
                        backgroundColor: appStatusColor
                      }
                    ]}>
                      <Text style={styles.statusChar}>{application.appStatus.toUpperCase().charAt(0)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.supportingTextContainer}>
                    <View style={styles.group}>
                      <Text style={styles.key}>Job Status:</Text>
                      <Text style={styles.value}>{application.jobStatus}</Text>
                    </View>
                    <View style={styles.group}>
                      <Text style={styles.key}>App Status:</Text>
                      <Text style={styles.value}>{application.appStatus}</Text>
                    </View>
                    <View style={styles.group}>
                      <Text style={styles.key}>Openings:</Text>
                      <Text style={styles.value}>{application.openings}</Text>
                    </View>
                    <View style={styles.group}>
                      <Text style={styles.key}>Submitted on:</Text>
                      <Text style={styles.value}>{this.formatDate(new Date(application.appSubmittedOn))}</Text>
                    </View>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableHighlight
                    onPress={() => this.onApplicationPress(application, term)}
                    underlayColor={Colors.lightGrey}
                  >
                    <View style={styles.actionContainer}>
                      <Text style={styles.actionText}>VIEW JOB</Text>
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
    fontFamily: 'roboto-medium',
  },
  messageText: {
    fontSize: 18,
    marginBottom: 16,
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-medium',
    textAlign: 'center',
  },
  headerContainer: {
    elevation: 1,
    height: 45,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.blackBorder,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  headerButton: {
    flex: 1,
  },
  headerItemContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: Colors.blackBorder,
  },
  headerText: {
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-regular',
    fontSize: 14,
  },
  totalText: {
    color: Colors.veryDarkGrey,
    fontSize: 14,
    fontFamily: 'roboto-medium',
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
  statusIcon: {
    height: 36,
    width: 36,
    marginLeft: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.blackBorder,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 1,
  },
  statusChar: {
    textAlign: 'center',
    color: Colors.white,
    fontFamily: 'roboto-medium',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  supportingTextContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionsContainer: {
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionContainer: {
    borderRadius: 2,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    paddingHorizontal: 8,
    fontSize: 14,
    color: Colors.blue,
    fontFamily: 'roboto-medium',
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
    paddingBottom: 8,
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
    paddingBottom: 4,
  },
  key: {
    width: 100,
    marginRight: 8,
    fontFamily: 'roboto-medium',
    color: Colors.darkGrey,
  },
  value: {
    flex: 1,
    fontFamily: 'roboto-regular',
    color: Colors.veryDarkGrey,
  },
});
