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
          underlayColor={Colors.lightBlue}
          onPress={() => {
            this.isVisible = !this.isVisible
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{header}</Text>
            <Text style={styles.headerIcon}>{this.isVisible ? '-' : '+'}</Text>
          </View>
        </TouchableHighlight>
        {
          this.isVisible &&
          <View>
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
    backgroundColor: Colors.blue,
    paddingHorizontal: 10,
    height: 50,
    alignItems: 'center',
    borderColor: Colors.veryLightBlue,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    color: Colors.white,
    fontSize: 18,
    flex: 1,
    fontWeight: 'bold',
  },
  headerIcon: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  }
});