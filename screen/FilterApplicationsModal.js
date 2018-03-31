import React from 'react';
import { CheckBox, FlatList, Modal, StyleSheet, Platform,
  Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { inject, observer } from 'mobx-react/native'

import Colors from '../style/Color';
import { Accordion } from '../shared/Accordion';

export const JOB_STATUS_VALUES =
  ['Cancel', 'Expired - Apps Available', 'Filled', 'Posted', 'Sub Posted'];
export const APP_STATUS_VALUES =
  ['Applied', 'Employed', 'Not Selected', 'Selected for Interview'];

@inject('AppStore')
@observer
export class FilterApplicationsModal extends React.Component {

  onAppStatusPress = (appStatus) => {
    const { AppStore } = this.props;
    AppStore.toggleAppStatusFilter(appStatus);
  }

  onJobStatusPress = (jobStatus) => {
    const { AppStore } = this.props;
    AppStore.toggleJobStatusFilter(jobStatus);
  }

  render() {
    const { onDonePress, onCancel, isVisible, AppStore } = this.props;
    const { appStatusFilters, jobStatusFilters } = AppStore;

    return (
      <Modal
        visible={isVisible}
        animationType={'slide'}
        onRequestClose={onCancel}
      >
        <SafeAreaView style={styles.root}>
          <Text style={styles.titleText}>Filter applications</Text>
          <View style={{ flex: 1 }}>
            <Accordion header={'Job Status'}>
              <View style={{ height: 48 * JOB_STATUS_VALUES.length + 6 }}>
                <FlatList
                  scrollEnabled={false}
                  style={styles.list}
                  data={JOB_STATUS_VALUES}
                  extraData={jobStatusFilters.length}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index}
                  renderItem={data => {
                    const isActive = jobStatusFilters.indexOf(data.item) > -1;
                    return (
                      <TouchableHighlight
                        underlayColor={Colors.grey}
                        onPress={() => this.onJobStatusPress(data.item)}
                      >
                        <View style={styles.filterItemContainer}>
                          <Text style={styles.filterItemText}>{data.item}</Text>
                          <Text style={[
                            styles.filterIcon,
                            {
                              color: isActive ? Colors.blue : Colors.grey
                            }
                          ]}>
                            {isActive ? '\uE834' : '\uE835'}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    )
                  }}
                />
              </View>
            </Accordion>
            <Accordion header={'App Status'}>
              <View style={{ height: 48 * APP_STATUS_VALUES.length + 6 }}>
                <FlatList
                  scrollEnabled={false}
                  style={styles.list}
                  data={APP_STATUS_VALUES}
                  extraData={appStatusFilters.length}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index}
                  renderItem={data => {
                    const isActive = appStatusFilters.indexOf(data.item) > -1;
                    return (
                      <TouchableHighlight
                        underlayColor={Colors.grey}
                        onPress={() => this.onAppStatusPress(data.item)}
                      >
                        <View style={styles.filterItemContainer}>
                          <Text style={styles.filterItemText}>{data.item}</Text>
                          <Text style={[
                            styles.filterIcon,
                            {
                              color: isActive ? Colors.blue : Colors.grey
                            }
                          ]}>
                            {isActive ? '\uE834' : '\uE835'}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    )
                  }}
                />
              </View>
            </Accordion>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableHighlight
              onPress={() => {
                AppStore.resetAppFilters()
                onDonePress()
              }}
              underlayColor={Colors.lightGrey}
              style={styles.buttonContainer}
            >
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>RESET</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={onDonePress}
              underlayColor={Colors.lightGrey}
              style={styles.buttonContainer}
            >
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>DONE</Text>
              </View>
            </TouchableHighlight>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    paddingTop: 8,
    flex: 1,
  },
  filterItemContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: Colors.blackBorder,
  },
  filterItemText: {
    flex: 1,
    fontFamily: 'roboto-regular',
    fontSize: 14,
    color: Colors.veryDarkGrey,
  },
  titleText: {
    fontSize: 20,
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-regular',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.blackBorder,
  },
  buttonContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: Colors.blackBorder,
  },
  buttonTextContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'roboto-medium',
    fontSize: 18,
  },
  filterIcon: {
    fontFamily: 'material-icons',
    fontSize: 18,
    color: Colors.grey,
  },
});
