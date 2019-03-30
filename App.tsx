import * as React from "react";
import { Component } from "react";
import { View, Text, StyleSheet, AsyncStorage, Switch } from "react-native";
import { Tabs, Tab, ScrollableTab, Button, Item, Input } from "native-base";
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
    skill: ""
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
    }
  };

  handleGetVacancies = async () => {
    try {
      const { skill } = this.state;
      // @ts-ignore
      const vacancies: Vacancy[] = await api.getVacancies({
        data: { skills: [{ skill: skill }] }
      });

      this.setState({ vacancies });
    } catch (err) {
      console.error(err);
      await AsyncStorage.getItem("theme");
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
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.state.theme === "default" ? "white" : "blue" }
        ]}
      >
        <Item
          style={{ display: "flex", justifyContent: "center", marginTop: 70 }}
        >
          <Text>Night mode:</Text>
          <Switch
            style={{ alignSelf: "center" }}
            onValueChange={() => this.handleThemeChange()}
            value={this.state.theme === "default"}
          />
        </Item>
        <Item>
        <Tabs style={styles.tabs} renderTabBar={() => <ScrollableTab />}>
          <Tab
            heading={config.tableStatuses.QUALIFICATIONS}
            style={{
              backgroundColor: this.state.theme === "default" ? "white" : "blue"
            }}
          >
            <TabContainer
              loadData={this.handleGetQualifications}
              data={this.state.qualifications}
              renderRow={this.renderQualifications}
              style={{
                backgroundColor:
                  this.state.theme === "default" ? "white" : "blue"
              }}
            />
          </Tab>
          <Tab
            heading={config.tableStatuses.VACANCIES}
            style={{
              backgroundColor: this.state.theme === "default" ? "white" : "blue"
            }}
          >
            <Item>
              <Input
                placeholder="Type skill here"
                onChangeText={skill => this.setState({ skill })}
              />
            </Item>
            <Button onPress={this.handleGetVacancies}>
              <Text>Get Vacancies</Text>
            </Button>
            <TabContainer
              loadData={this.handleGetVacancies}
              data={this.state.vacancies}
              renderRow={this.renderVacancies}
              style={{
                backgroundColor:
                  this.state.theme === "default" ? "white" : "blue"
              }}
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
