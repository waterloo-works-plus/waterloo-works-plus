import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

import { observable } from 'mobx';
import { observer } from 'mobx-react/native'

import Colors from '../style/Color';

@observer
export class Accordion extends React.Component {

  @observable isVisible = false;

  render() {
    const { header } = this.props;

    return (
      <View>
        <TouchableHighlight
          underlayColor={Colors.grey}
          onPress={() => {
            this.isVisible = !this.isVisible
          }}
        >
          <View style={[
            styles.headerContainer,
            {
              borderBottomWidth: this.isVisible ? 0 : 1,
            }
          ]}>
            <Text style={styles.headerText}>{header}</Text>
            <Text style={styles.headerIcon}>{this.isVisible ? '\uE316' : '\uE313'}</Text>
          </View>
        </TouchableHighlight>
        {
          this.isVisible &&
          <View style={[
            styles.contentContainer,
            {
              borderBottomWidth: this.isVisible ? 1 : 0,
            }
          ]}>
            {this.props.children}
          </View>
        }
          
      </View>
    )
  }

}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.blackBorder,
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
  },
  headerText: {
    color: Colors.veryDarkGrey,
    fontFamily: 'roboto-medium',
    fontSize: 14,
    flex: 1,
  },
  headerIcon: {
    color: Colors.grey,
    fontFamily: 'material-icons',
    fontSize: 18,
  },
  contentContainer: {
    borderColor: Colors.blackBorder,
  }
});