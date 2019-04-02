import * as React from "react";
import { Component } from "react";
import { View, Text, StyleSheet, AsyncStorage, Switch } from "react-native";
import {
  Tabs,
  Tab,
  ScrollableTab,
  Button,
  Item,
  Input,
  Spinner,
} from "native-base";
import { TabContainer } from "./TabContainer";
import api from "./api";
import { config } from "./config";

import themeLib from "react-native-theme";

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

interface Qualification extends Array<Qualification> {
  counter: number;
  value: number;
  _id: string;
}

export default class App extends Component {
  state = {
    vacancies: [],
    qualifications: [],
    skill: "",
    theme: "default",
    isVacanciesRefreshing: false,
    isQualificationsRefreshing: false
  };

  async componentDidMount(): void {
    // @ts-ignore
    const themeFromStorage = await AsyncStorage.getItem("theme");
    themeFromStorage &&
      this.setState({ theme: themeFromStorage }) &&
      themeLib.active(themeFromStorage);
    themeLib.setRoot(this);
  }

  handleGetQualifications = async () => {
    try {
      this.setState({ isQualificationsRefreshing: true });
      // @ts-ignore
      const qualifications: Qualification[] = await api.getQualifications();

      const qualificationsFiltered: Qualification[] = qualifications.filter(
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

  handleGetVacancies = async () => {
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

  handleThemeChange = async () => {
    try {
      const { theme } = this.state;
      // @ts-ignore
      if (themeLib.name !== "default") {
        themeLib.active();
        AsyncStorage.setItem("theme", "default");
      } else {
        themeLib.active("night");
        AsyncStorage.setItem("theme", "night");
      }

      this.setState({ theme: themeLib.name });
      console.log("handleThemeChange:", this.state.theme);
    } catch (err) {
      console.error(err);
    }
  };

  renderQualifications = item => (
    <View style={styles.listItem}>
      <Text style={styles.tableText}>{item.value}</Text>
      <Text style={styles.tableText}>{item.counter}</Text>
    </View>
  );

  renderVacancies = item => (
    <View style={styles.listItem}>
      <Text style={styles.tableText}>{item.cityName}</Text>
      <Text style={styles.tableText}>{item.vacancyName}</Text>
    </View>
  );

  render() {
    const theme =
      this.state.theme === "default"
        ? {
            backgroundColor: "blue",
            color: "white"
          }
        : {
            backgroundColor: "white",
            color: "black"
          };

    return (
      <View style={[styles.container, theme]}>
        <Item
          style={{ display: "flex", justifyContent: "center", marginTop: 70 }}
        >
          <Text style={theme} >Night mode:</Text>
          <Switch
            style={{ alignSelf: "center" }}
            onValueChange={() => this.handleThemeChange()}
            value={this.state.theme === "default"}
          />
        </Item>
        <Tabs style={styles.tabs} renderTabBar={() => <ScrollableTab />}>
          <Tab heading={config.tableStatuses.QUALIFICATIONS} style={theme}>
            <TabContainer
              loadData={this.handleGetQualifications}
              data={this.state.qualifications}
              renderRow={this.renderQualifications}
              isRefreshing={this.state.isQualificationsRefreshing}
              onRefresh={this.handleGetQualifications}
              style={theme}
            />
          </Tab>
          <Tab heading={config.tableStatuses.VACANCIES} style={theme}>
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
          </Tab>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    margin: 2,
    marginHorizontal: "5%",
    borderTopWidth: 1,
    borderTopEndRadius: 10,
    flex: 1,
    flexDirection: "row",
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
