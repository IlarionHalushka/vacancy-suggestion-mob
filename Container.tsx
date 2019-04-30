import * as React from "react";
import { Component } from "react";

import { View, Text, StyleSheet } from "react-native";
import { Button } from "native-base";

export default class Container extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Button onPress={this.props.navigation.openDrawer}>
          <Text>Open Drawer</Text>
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

