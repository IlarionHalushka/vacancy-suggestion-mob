import * as React from "react";
import { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TextInput
} from "react-native";

import { Tabs, Tab, ScrollableTab } from "native-base";
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
    mode: "qualifications",
    page: 1,
  };

  handleGetQualifications = async () => {
    this.setState({ loading: true });

    try {
      // @ts-ignore
      const qualifications: Qualification[] = await api.getQualifications();

      const qualificationsFiltered: Qualification[] = qualifications.filter(
        item => item.counter > 0
      );

      qualificationsFiltered.sort((a, b) => b.counter - a.counter);

      this.setState({
        qualifications: qualificationsFiltered,
        loading: false,
        mode: "qualifications",
        page: 0,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        loading: false
      });
    }
  };

  handleGetVacancies = async () => {
    this.setState({ loading: true });

    try {
      // @ts-ignore
      const vacancies: Vacancy[] = await api.getVacancies({ data: "info" });

      this.setState({
        vacancies,
        loading: false,
        mode: "vacancies",
        page: 1,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        loading: false
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            height: "10%"
          }}
        >
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleGetVacancies}
            underlayColor="#2c51ff"
          >
            <Text style={{ fontSize: 20 }}>Vacancies</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleGetQualifications}
            underlayColor="#2c51ff"
          >
            <Text style={{ fontSize: 20 }}>Qualifications</Text>
          </TouchableHighlight>
        </View>

        <Tabs page={this.state.page} style={{ marginTop: 50 }} renderTabBar={() => <ScrollableTab />}>
          <Tab heading="Qualifications">
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
          </Tab>
          <Tab heading="Vacancies">
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
    marginHorizontal: "20%",
    borderTopWidth: 1,
    borderTopEndRadius: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
