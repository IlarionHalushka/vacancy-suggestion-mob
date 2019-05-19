import { Item } from 'native-base';
import * as React from 'react';
import { Component } from 'react';
import { AsyncStorage, StyleSheet, Text } from 'react-native';
// @ts-ignore
import themeLib from 'react-native-theme';

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

interface IQualification extends Array<IQualification> {
  counter: number;
  value: number;
  _id: string;
}

interface ITheme {
  backgroundColor: string;
  color: string;
}

export default class Qualifications extends Component {
  public static navigationOptions = {
    headerTitle: <Text>Qualifications</Text>,
  };

  public state = {
    qualifications: [],
    skill: '',
    theme: 'default',
    isQualificationsRefreshing: false,
  };

  public async componentDidMount(): Promise<void> {
    // @ts-ignore
    const themeFromStorage = await AsyncStorage.getItem('theme');
    console.log('themeFromStorage', themeFromStorage);
    if (themeFromStorage) {
      this.setState({ theme: themeFromStorage });
      themeLib.active(themeFromStorage);
    }
    themeLib.setRoot(this);
  }

  public handleGetQualifications = async (): Promise<any> => {
    try {
      this.setState({ isQualificationsRefreshing: true });
      // @ts-ignore
      const qualifications: IQualification[] = await api.getQualifications();

      const qualificationsFiltered: IQualification[] = qualifications.filter(
        item => item.counter > 0
      );
      // TODO add sorting on back-end
      qualificationsFiltered.sort((a, b) => b.counter - a.counter);

      this.setState({ qualifications: qualificationsFiltered });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isQualificationsRefreshing: false });
    }
  };

  public renderQualifications = (item: IQualification, theme: ITheme) => (
    <Item style={[styles.listItem, theme]}>
      <Text style={styles.tableText}>{item.value}</Text>
      <Text style={styles.tableText}>{item.counter}</Text>
    </Item>
  );

  public render() {
    const theme =
      this.state.theme === 'default'
        ? {
            backgroundColor: '#44afff',
            color: 'white',
          }
        : {
            backgroundColor: 'white',
            color: 'black',
          };

    // @ts-ignore
    return (
      <Container style={theme}>
        <TabContainer
          loadData={this.handleGetQualifications}
          data={this.state.qualifications}
          renderRow={this.renderQualifications}
          isRefreshing={this.state.isQualificationsRefreshing}
          onRefresh={this.handleGetQualifications}
          style={theme}
          theme={theme}
        />
      </Container>
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
