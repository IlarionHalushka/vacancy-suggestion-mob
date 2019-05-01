import * as React from "react";
import { Component } from "react";

import { View, StyleSheet } from "react-native";
import { Button } from "native-base";

import { Ionicons } from '@expo/vector-icons';

export default class Container extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Button onPress={this.props.navigation.openDrawer} transparent>
          <Ionicons style={{ paddingHorizontal: 5 }} name="ios-menu" size={32} color="blue" />
        </Button>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70
  },
});

