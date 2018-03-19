import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, 
  Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'
import _ from 'lodash';

import { TermUtil } from '../util/TermUtil';

import Colors from '../style/Color';

const DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dev'];

@inject('AppStore')
@observer
export class InterviewsScreen extends React.Component {
  static navigationOptions = {
    title: 'Interviews'
  };

  onInterviewsPress = (interview) => {
    const { AppStore, navigation } = this.props;

  }

  onJobPress = (interview) => {
    const { AppStore, navigation } = this.props;
    const term = TermUtil.convertReadableTermToTermNum(interview.term)

    const jobId = interview.jobId;
    if (!AppStore.jobs.get(jobId) &&
      !AppStore.isLoadingJob.get(jobId)) {
      AppStore.getJob(jobId, term);
    }
    
    navigation.push('Job', { 
      jobId: jobId,
      term: term,
      title: interview.organization,
    });
  }

  formatInterviewTime = (dateTime) => {
    let hour = dateTime.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }
    let minutes = dateTime.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }

    return `${DAYS[dateTime.getDay()]}, ${MONTHS[dateTime.getMonth()]} ` +
      `${dateTime.getDate()}, ${dateTime.getFullYear()} ` +
      `${hour}:${minutes} ${dateTime.getHours() >= 12 ? 'PM' : 'AM'}`;
  }

  render() {
    const { AppStore, navigation } = this.props;

    let interviews = AppStore.interviews;
    const isLoadingInterviews = AppStore.isLoadingInterviews;
    const applications = AppStore.applications;

    if (isLoadingInterviews) {
      return (
        <SafeAreaView style={styles.root}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} />
          </View>
        </SafeAreaView>
      );
    }

    if (!interviews) {
      return (
        <SafeAreaView style={styles.root}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Oops, something went wrong</Text>
            <TouchableHighlight
              underlayColor={Colors.lightGrey}
              onPress={() => AppStore.getInterviews()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableHighlight>
          </View>
        </SafeAreaView>
      )
    }

    interviews = _.sortBy(_.values(interviews), 'dateTime').reverse();

    if (!interviews.length) {
      return (
        <SafeAreaView style={styles.root}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>We didn't find any interviews</Text>
          </View>
        </SafeAreaView>
      )
    }

    return (
      <SafeAreaView style={styles.root}>
        <FlatList
          style={styles.list}
          data={interviews}
          extraData={isLoadingInterviews}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={(data) => {
            const { item: interview } = data;
            const now = new Date();
            const oneHourAgo = new Date();
            oneHourAgo.setHours((now.getHours()) - 1 % 24);
            const interviewDateTime = new Date(interview.dateTime);
            
            let interviewIcon = '\uE87c';

            switch (interview.method) {
              case 'In Person':
                interviewIcon = '\uE8D3';
                break;
              case 'Webcam':
                interviewIcon = '\uE04B';
                break;
              case 'Phone':
                interviewIcon = '\uE0CD';
                break;
            }

            return (
              <View style={styles.interviewContainer}>
                <View style={styles.titleContainer}>
                  <View style={{ flex: 1}}>
                    <Text style={styles.titleText}>{interview.jobTitle}</Text>
                    <Text style={styles.companyText}>{interview.organization}</Text>
                    <Text style={styles.divisionText}>{interview.division}</Text>
                  </View>
                  <View>
                    <View style={[
                      styles.statusIcon,
                      {
                        backgroundColor: oneHourAgo > interviewDateTime ? 
                          Colors.grey : Colors.blue,
                      }
                    ]}>
                      <Text style={styles.statusChar}>{interviewIcon}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.supportingTextContainer}>
                  <View style={styles.group}>
                    <Text style={styles.key}>Location:</Text>
                    <Text style={styles.value}>{interview.location}</Text>
                  </View>
                  <View style={styles.group}>
                    <Text style={styles.key}>Method:</Text>
                    <Text style={styles.value}>{interview.method}</Text>
                  </View>
                  <View style={styles.group}>
                    <Text style={styles.key}>Type:</Text>
                    <Text style={styles.value}>{interview.type}</Text>
                  </View>
                  <View style={styles.group}>
                    <Text style={styles.key}>Date/Time:</Text>
                    <Text style={styles.value}>{this.formatInterviewTime(interviewDateTime)}</Text>
                  </View>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableHighlight
                    onPress={() => this.onJobPress(interview)}
                    underlayColor={Colors.lightGrey}
                  >
                    <View style={styles.actionContainer}>
                      <Text style={styles.actionText}>VIEW JOB</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ marginLeft: 8 }}
                    onPress={() => this.onInterviewsPress(interview)}
                    underlayColor={Colors.lightGrey}
                  >
                    <View style={styles.actionContainer}>
                      <Text style={styles.actionText}>VIEW INTERVIEW</Text>
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
  list: {
    flex: 1,
    paddingTop: 16,
  },
  interviewContainer: {
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  supportingTextContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionContainer: {
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
  divisionText: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.darkGrey,
  },
  dateTimeText: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.darkGrey,
  },
  group: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  key: {
    fontFamily: 'roboto-medium',
    width: 70,
    marginRight: 8,
    color: Colors.darkGrey,
  },
  value: {
    flex: 1,
    fontFamily: 'roboto-regular',
    color: Colors.veryDarkGrey,
  },
  statusIcon: {
    height: 36,
    width: 36,
    marginLeft: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.blackBorder,
    backgroundColor: Colors.blue,
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
    fontSize: 22,
    fontFamily: 'material-icons',
  },
});
