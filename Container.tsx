import { Ionicons } from '@expo/vector-icons';
import { Button } from 'native-base';
import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

interface IProps {
  style: object;
  navigation: NavigationScreenProp<any, any>;
}

class Container extends Component<IProps, Readonly<any>> {
  public render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Button onPress={this.props.navigation.openDrawer} transparent={true}>
          <Ionicons style={{ paddingHorizontal: 5 }} name="ios-menu" size={32} color="blue" />
        </Button>
        {this.props.children}
      </View>
    );
  }
}

export default withNavigation(Container);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
