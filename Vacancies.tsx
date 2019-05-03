import * as React from "react";
import { Component } from "react";

import { Text, StyleSheet, AsyncStorage } from "react-native";
import { Button, Item, Input, Spinner } from "native-base";
import TabContainer from "./TabContainer";
import api from "./api";

import themeLib from "react-native-theme";
import Container from "./Container";

// Setup Themes
themeLib.add(require("./theme/default"));
// themeLib.addComponents({ Example: require("./ThemeExample") });

themeLib.add(require("./theme/night"), "night");
// themeLib.addComponents({ Example: require("./RedExample") }, "night");

interface Vacancy extends Array<Vacancy> {
  counter: number;
  vacancyId: number;
  vacancyName: string;
  cityName: string;
}

export default class Vacancies extends Component {
  static navigationOptions = {
    headerTitle: <Text>Vacancies</Text>
  };

  state = {
    vacancies: [],
    skill: "",
    theme: "default",
    isVacanciesRefreshing: false
  };

  async componentDidMount(): void {
    // @ts-ignore
    const themeFromStorage = await AsyncStorage.getItem("theme");
    console.log("themeFromStorage", themeFromStorage);
    themeFromStorage &&
      this.setState({ theme: themeFromStorage }) &&
      themeLib.active(themeFromStorage);
    themeLib.setRoot(this);
  }

  handleGetVacancies = async (): Promise<any> => {
    try {
      console.log("HANDLE GET VACANCIES");
      this.setState({ isVacanciesRefreshing: true });
      const { skill } = this.state;
      // @ts-ignore
      const vacancies: Vacancy[] = await api.getVacancies({
        data: { skills: [{ skill: skill }] }
      });

      this.setState({ vacancies });
    } catch (err) {
      console.error(err);
      await AsyncStorage.getItem("theme");
    } finally {
      this.setState({ isVacanciesRefreshing: false });
    }
  };

  renderVacancies = (item, theme) => (
    <Item style={[styles.listItem, theme]}>
      <Text style={styles.tableText}>{item.cityName}</Text>
      <Text style={styles.tableText}>{item.vacancyName}</Text>
    </Item>
  );

  render() {
    const theme =
      this.state.theme === "default"
        ? {
            backgroundColor: "#44afff",
            color: "white"
          }
        : {
            backgroundColor: "white",
            color: "black"
          };

    // @ts-ignore
    return (
      <Container style={theme}>
        <Item>
          <Input
            placeholder="Type skill here"
            onChangeText={skill => this.setState({ skill })}
          />
        </Item>
        <Button
          block
          success
          onPress={this.handleGetVacancies}
          disabled={this.state.isVacanciesRefreshing}
        >
          {this.state.isVacanciesRefreshing ? (
            <Spinner />
          ) : (
            <Text>Get Vacancies</Text>
          )}
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
    flexDirection: "column",
    justifyContent: "space-between"
  },
  loaderText: {
    color: "blue",
    fontSize: 24
  },
  actionButtonText: { fontSize: 20 },
  noDataText: {
    margin: 10,
    alignSelf: "center"
  },
  tableText: { alignSelf: "center" },
  tabs: { marginTop: 20 }
});
