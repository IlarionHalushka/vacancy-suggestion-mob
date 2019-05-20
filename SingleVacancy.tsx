import { Button, Input, Item, Spinner } from 'native-base';
import * as React from 'react';
import { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import themeLib from 'react-native-theme';
import { NavigationNavigatorProps } from 'react-navigation';

import api from './api';
import Container from './Container';
import TabContainer from './TabContainer';
// @ts-ignore
import theme0 from './theme/default';
// @ts-ignore
import theme01 from './theme/night';

// Setup Themes

themeLib.add(theme0);
// themeLib.addComponents({ Example: require("./ThemeExample") });

themeLib.add(theme01, 'night');
// themeLib.addComponents({ Example: require("./RedExample") }, "night");

interface IVacancy extends Array<IVacancy> {
  name: any;
  counter: number;
  vacancyId: number;
  vacancyName: string;
  cityName: string;
}

interface IProps {
  navigation: any;
}

export default class SingleVacancy extends Component<IProps, any> {
  public static navigationOptions = {
    headerTitle: <Text>Single Vacancy</Text>,
  };

  public render() {
    const { navigation } = this.props;
    const vacancy: IVacancy = navigation.getParam('vacancy');

    return (
      <View>
        <Text>{vacancy.name}</Text>
        <Text>{vacancy.externalId}</Text>
        <Text>{vacancy.requirements}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  loaderText: {
    color: 'blue',
    fontSize: 24,
  },
  actionButtonText: { fontSize: 20 },
  noDataText: {
    margin: 10,
    alignSelf: 'center',
  },
  tableText: { alignSelf: 'center' },
  tabs: { marginTop: 20 },
});
