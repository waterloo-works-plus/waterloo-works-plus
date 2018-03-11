import React from 'react';
import { FlatList, Modal, StyleSheet, Platform,
  Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Colors from '../style/Color';

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
                  underlayColor={Colors.veryLightBlue}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 10,
  },
  titleText: {
    fontSize: 22,
    color: Colors.veryDarkBlue,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  sortItemContainer: {
    backgroundColor: Colors.blue,
    padding: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.veryDarkGrey,
  },
  sortItemText: {
    fontSize: 18,
    color: Colors.white,
  },
});
