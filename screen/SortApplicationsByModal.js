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
          <FlatList
            style={styles.list}
            data={SORT_BY}
            keyExtractor={(item, index) => index}
            renderItem={data => {
              return (
                <TouchableHighlight
                  underlayColor={Colors.grey}
                  onPress={() => onSortByPress(data.item)}
                >
                  <View style={styles.sortItemContainer}>
                    <Text style={styles.sortItemText}>{data.item.title}</Text>
                    <Text style={styles.rightArrow}>{'\uE315'}</Text>
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
  },
  list: {
    paddingTop: 8,
    flex: 1,
  },
  sortItemContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: Colors.blackBorder,
  },
  sortItemText: {
    flex: 1,
    fontFamily: 'roboto-regular',
    fontSize: 14,
    color: Colors.veryDarkGrey,
  },
  rightArrow: {
    fontFamily: 'material-icons',
    fontSize: 18,
    color: Colors.grey,
  },
});
