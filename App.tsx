import * as React from "react";
import { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";

import { Tabs, Tab, ScrollableTab } from "native-base";
import api from "./api";
import { config } from "./config";

interface Item {
  _id: string;
  value: string;
  counter: number;
}

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
    qualificationsLoading: false,
    vacanciesLoading: false,
  };

  handleGetQualifications = async () => {
    this.setState({ qualificationsLoading: true });

    try {
      // @ts-ignore
      const qualifications: Qualification[] = await api.getQualifications();

      const qualificationsFiltered: Qualification[] = qualifications.filter(
        item => item.counter > 0
      );

      qualificationsFiltered.sort((a, b) => b.counter - a.counter);

      this.setState({
        qualifications: qualificationsFiltered,
        qualificationsLoading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        qualificationsLoading: false
      });
    }
  };

  handleGetVacancies = async () => {
    this.setState({ vacanciesLoading: true });

    try {
      // @ts-ignore
      const vacancies: Vacancy[] = await api.getVacancies({ data: "info" });

      this.setState({
        vacancies,
        vacanciesLoading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        vacanciesLoading: false
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Tabs
          style={styles.tabs}
          renderTabBar={() => <ScrollableTab />}
        >
          <Tab heading={config.tableStatuses.QUALIFICATIONS}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.qualificationsLoading}
                  onRefresh={() => this.handleGetQualifications()}
                />
              }
            >
              {!this.state.qualifications.length ? (
                <Text style={styles.noDataText}>
                  No qualifications. Scroll down to refresh
                </Text>
              ) : (
                <FlatList
                  data={this.state.qualifications}
                  keyExtractor={item => item._id}
                  renderItem={({ item }: { item: Qualification }) => (
                    <View style={styles.listItem}>
                      <Text style={styles.tableText}>{item.value}</Text>
                      <Text style={styles.tableText}>{item.counter}</Text>
                    </View>
                  )}
                />
              )}
            </ScrollView>
          </Tab>
          <Tab heading={config.tableStatuses.VACANCIES}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.vacanciesLoading}
                  onRefresh={() => this.handleGetVacancies()}
                />
              }
            >
              {!this.state.vacancies.length ? (
                <Text style={styles.noDataText}>
                  No vacancies. Scroll down to refresh
                </Text>
              ) : (
                <FlatList
                  data={this.state.vacancies}
                  keyExtractor={item => `${item.vacancyId}`}
                  renderItem={({ item }: { item: Vacancy }) => (
                    <View style={styles.listItem}>
                      <Text style={styles.tableText}>{item.cityName}</Text>
                      <Text style={styles.tableText}>{item.vacancyName}</Text>
                    </View>
                  )}
                />
              )}
            </ScrollView>
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
