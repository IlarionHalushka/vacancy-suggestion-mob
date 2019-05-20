import { Button, Input, Item, Spinner } from 'native-base';
import * as React from 'react';
import { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, TouchableOpacity } from 'react-native';
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

interface IVacancy extends Array<IVacancy> {
  counter: number;
  vacancyId: number;
  vacancyName: string;
  cityName: string;
}

interface ITheme {
  backgroundColor: string;
  color: string;
}

export default class Vacancies extends Component {
  public static navigationOptions = {
    headerTitle: <Text>Vacancies</Text>,
  };

  public state = {
    vacancies: [],
    skill: '',
    theme: 'default',
    isVacanciesRefreshing: false,
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

  public handleGetVacancies = async (): Promise<any> => {
    try {
      console.log('HANDLE GET VACANCIES');
      this.setState({ isVacanciesRefreshing: true });
      const { skill } = this.state;
      // @ts-ignore
      const vacancies: IVacancy[] = await api.getVacancies({
        data: { skills: [{ skill }] },
      });

      this.setState({ vacancies });
      console.log(vacancies[0])
    } catch (err) {
      console.error(err);
      await AsyncStorage.getItem('theme');
    } finally {
      this.setState({ isVacanciesRefreshing: false });
    }
  };

  public renderVacancies = (vacancy: IVacancy, theme: ITheme) => (
    <Item style={[styles.listItem, theme]} key={vacancy.externalId}>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('SingleVacancy', { vacancy })}
      >
        <Text style={styles.tableText}>{vacancy.name}</Text>
        <Text style={styles.tableText}>{vacancy.externalId}</Text>
      </TouchableOpacity>
    </Item>
  );

  public setSkill(skill: string) {
    this.setState({ skill });
  }

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
        <Item>
          <Input placeholder="Type skill here" onChangeText={this.setSkill} />
        </Item>
        <Button
          block={true}
          success={true}
          onPress={this.handleGetVacancies}
          disabled={this.state.isVacanciesRefreshing}
        >
          {this.state.isVacanciesRefreshing ? <Spinner /> : <Text>Get Vacancies</Text>}
        </Button>
        <TabContainer
          loadData={this.handleGetVacancies}
          data={this.state.vacancies}
          renderRow={this.renderVacancies}
          isRefreshing={this.state.isVacanciesRefreshing}
          onRefresh={this.handleGetVacancies}
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
