import * as React from "react";
import { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Tabs, Tab, ScrollableTab, Button, Input, Item } from "native-base";
import { TabContainer } from "./TabContainer";
import api from "./api";
import { config } from "./config";

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
    skill: ''
  };

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
      <View style={styles.container}>
        <Tabs style={styles.tabs} renderTabBar={() => <ScrollableTab />}>
          <Tab heading={config.tableStatuses.QUALIFICATIONS}>
            <TabContainer
              loadData={this.handleGetQualifications}
              data={this.state.qualifications}
              renderRow={this.renderQualifications}
            />
          </Tab>
          <Tab heading={config.tableStatuses.VACANCIES}>
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
  tabs: { marginTop: 50 }
});
