import * as React from "react";
import { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TextInput,
  Modal,
  ScrollView,
  RefreshControl
} from "react-native";

import { Tabs, Tab, ScrollableTab, Spinner, Button } from "native-base";
import api from "./api";

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
    loading: false,
    qualificationsLoading: false,
    vacanciesLoading: false,
    mode: "qualifications",
    page: 1
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
        mode: "qualifications",
        page: 0
      });
    } catch (err) {
      console.error(err);
      this.setState({
        loading: false
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
        mode: "vacancies",
        page: 1
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
        {this.state.loading && (
          <Modal transparent>
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "aqua",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner size={"large"} color="blue" />
              <Text style={{ color: "blue", fontSize: 24 }}>Loading...</Text>
            </View>
          </Modal>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            height: "10%"
          }}
        >
          <Button style={styles.button} onPress={this.handleGetVacancies}>
            <Text style={{ fontSize: 20 }}>Vacancies</Text>
          </Button>
          <Button style={styles.button} onPress={this.handleGetQualifications}>
            <Text style={{ fontSize: 20 }}>Qualifications</Text>
          </Button>
        </View>

        <Tabs
          page={this.state.page}
          style={{ marginTop: 50 }}
          renderTabBar={() => <ScrollableTab />}
        >
          <Tab heading="Qualifications">
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.qualificationsLoading}
                  onRefresh={() => this.handleGetQualifications()}
                />
              }
            >
              {!this.state.qualifications.length && (
                <Text style={{ margin: 10, alignSelf: "center" }}>
                  No qualifications. Scroll down to refresh
                </Text>
              )}
              <FlatList
                data={this.state.qualifications}
                keyExtractor={item => item._id}
                renderItem={({ item }: { item: Qualification }) => (
                  <View style={styles.listItem}>
                    <Text style={{ alignSelf: "center" }}>{item.value}</Text>
                    <Text style={{ alignSelf: "center" }}>{item.counter}</Text>
                  </View>
                )}
              />
            </ScrollView>
          </Tab>
          <Tab heading="Vacancies">
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.vacanciesLoading}
                  onRefresh={() => this.handleGetVacancies()}
                />
              }
            >
              {!this.state.qualifications.length && (
                <Text style={{ margin: 10, alignSelf: "center" }}>
                  No vacancies. Scroll down to refresh
                </Text>
              )}
              <FlatList
                data={this.state.vacancies}
                keyExtractor={item => `${item.vacancyId}`}
                renderItem={({ item }: { item: Vacancy }) => (
                  <View style={styles.listItem}>
                    <Text style={{ alignSelf: "center" }}>{item.cityName}</Text>
                    <Text style={{ alignSelf: "center" }}>
                      {item.vacancyName}
                    </Text>
                  </View>
                )}
              />
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
    // justifyContent: "center"
  },
  button: {
    alignSelf: "auto",
    borderWidth: 1,
    borderColor: "#2c51ff",
    backgroundColor: "#80d9ff",
    borderRadius: 20,
    marginTop: 25,
    marginBottom: 0,
    width: "40%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  listItem: {
    margin: 2,
    marginHorizontal: "5%",
    borderTopWidth: 1,
    borderTopEndRadius: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
