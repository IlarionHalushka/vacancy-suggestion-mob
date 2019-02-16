import * as React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Hello } from './Hello';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Your Typescript project is working!</Text>
        <Hello name="NAME" enthusiasmLevel={1} ></Hello>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
