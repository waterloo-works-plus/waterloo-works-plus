import React from 'react';
import { Dimensions, FlatList, Modal, StyleSheet,
  Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Colors from '../style/Color.js';

const SORT_BY = [{
  title: 'Job Status',
  value: 'jobStatus',
}, {
  title: 'App Status',
  value: 'appStatus',
}, {
  title: 'Title',
  value: 'title',
}, {
  title: 'City',
  value: 'city',
}, {
  title: 'Location',
  value: 'location',
}, {
  title: 'Openings',
  value: 'openings',
}, {
  title: 'Company',
  value: 'company',
}]

export class SortApplicationsByModal extends React.Component {
  render() {
    const { onSortByPress, onCancel, isVisible } = this.props;

    return (
      <Modal
        visible={isVisible}
        animationType={'slide'}
        onRequestClose={onCancel}
      >
        <SafeAreaView style={styles.root}>
          <Text style={styles.titleText}>Sort by</Text>
          <FlatList
            style={styles.list}
            data={SORT_BY}
            keyExtractor={(item, index) => index}
            renderItem={data => {
              return (
                <TouchableHighlight
                  underlayColor={Colors.lightBlue}
                  onPress={() => onSortByPress(data.item)}
                >
                  <View style={styles.sortItemContainer}>
                    <Text style={styles.sortItemText}>{data.item.title}</Text>
                  </View>
                </TouchableHighlight>
              )
            }}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}

const { width: deviceWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 22,
    color: Colors.veryDarkBlue,
    marginLeft: 15,
    marginVertical: 10,
  },
  list: {
    flex: 1,
  },
  sortItemContainer: {
    width: deviceWidth,
    backgroundColor: Colors.blue,
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.veryLightBlue,
  },
  sortItemText: {
    fontSize: 18,
    color: Colors.white,
  },
});
