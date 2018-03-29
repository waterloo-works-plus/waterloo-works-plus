import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, 
  Text, TouchableHighlight, View, WebView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native'

import { Accordion } from '../shared/Accordion';

import Colors from '../style/Color';

@inject('AppStore')
@observer
export class InterviewDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.title : 'Interview',
    };
  };

  componentWillMount() {
    const { AppStore, navigation } = this.props;
    const { params } = navigation.state;
    const { interviewId } = params;

    if (!AppStore.interviewDetails.get(interviewId) &&
      !AppStore.isLoadingInterviewDetails.get(interviewId)) {
      AppStore.getInterviewDetails(interviewId);
    }
  }

  render() {
    const { AppStore, navigation } = this.props;
    const { params } = navigation.state;
    const { interviewId, interview } = params;

    const interviewDetails = AppStore.interviewDetails.get(interviewId);
    const isLoadingInterviewDetails = AppStore.isLoadingInterviewDetails.get(interviewId);

    if (!interviewDetails) {
      if (isLoadingInterviewDetails) {
        return (
          <SafeAreaView style={styles.root}>
            <View style={styles.activityContainer}>
              <ActivityIndicator size={'large'} />
            </View>
          </SafeAreaView>
        );
      } else {
        return (
          <SafeAreaView style={styles.root}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Oops, something went wrong</Text>
              <TouchableHighlight
                underlayColor={Colors.lightGrey}
                onPress={() => AppStore.getInterviewDetails(interviewId)}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableHighlight>
            </View>
          </SafeAreaView>
        );
      }
    }

    return (
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.interviewDetailsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Interview Details</Text>
            <Text style={styles.subHeaderText}>{interview.jobTitle}</Text>
            <Text style={styles.subHeaderText}>{interview.organization}</Text>
            <Text style={styles.subHeaderText}>{interview.division}</Text>
          </View>
          <View style={styles.interviewInfoContainer}>
            {
              interviewDetails.interviewType &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>Interview Type:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.interviewType}</Text>
                </View>
              </View>
            }
            {
              interviewDetails.locationType &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>Location Type:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.locationType}</Text>
                </View>
              </View>
            }
            {
              interviewDetails.status &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>Status of Interview:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.status}</Text>
                </View>
              </View>
            }
            {
              interviewDetails.interviewingForJob &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>Interviewing for Job:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.interviewingForJob}</Text>
                </View>
              </View>
            }
            {
              interviewDetails.interviewer &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>Interviewer:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.interviewer}</Text>
                </View>
              </View>
            }
            {
              interviewDetails.method &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>Method:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.method}</Text>
                </View>
              </View>
            }
            {
              interviewDetails.webCamId &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>Web Cam Id:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.webCamId}</Text>
                </View>
              </View>
            }
            {
              interviewDetails.when &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>When:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.when}</Text>
                </View>
              </View>
            }
            {
              interviewDetails.where &&
              <View style={styles.group}>
                <View style={styles.keyContainer}>
                  <Text style={styles.keyText}>Where:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{interviewDetails.where}</Text>
                </View>
              </View>
            }
          </View>
          {
            interviewDetails.specialInstructions &&
            <Accordion
              header={'Special Instructions'}
            >
              <Text style={styles.bodyText}>{interviewDetails.specialInstructions}</Text>
            </Accordion>
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
  activityContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-medium',
    textAlign: 'center',
  },
  retryText: {
    fontSize: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: Colors.blue,
    fontFamily: 'roboto-medium',
  },
  interviewDetailsContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerText: {
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-regular',
    fontSize: 22,
  },
  subHeaderText: {
    color: Colors.darkGrey,
    fontFamily: 'roboto-regular',
    fontSize: 16,
  },
  bodyText: {
    marginHorizontal: 10,
    fontFamily: 'roboto-regular',
    fontSize: 16,
  },
  headerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  group: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  keyContainer: {
    width: 100,
    marginRight: 16,
  },
  keyText: {
    fontFamily: 'roboto-medium',
    color: Colors.darkGrey,
  },
  valueContainer: {
    flex: 1,
  },
  valueText: {
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-regular',
  },
  interviewInfoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bodyText: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.veryDarkGrey
  }
});
