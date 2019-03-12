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

import { Tabs, Tab, ScrollableTab, Button } from "native-base";
import api from "./api";
import { config } from "./config";
import { TfImageRecognition } from 'react-native-tensorflow';


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
    page: 0
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
        page: 0
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
        page: 1
      });
    } catch (err) {
      console.error(err);
      this.setState({
        vacanciesLoading: false
      });
    }
  };

  classifyImage = async () => {

    const tfImageRecognition = new TfImageRecognition({
      model: require('./assets/tensorflow_inception_graph.pb'),
      labels: require('./assets/tensorflow_labels.txt'),
      imageMean: 117, // Optional, defaults to 117
      imageStd: 1 // Optional, defaults to 1
    })

    const results = await tfImageRecognition.recognize({
      image: require('./assets/62751e994c55ec5072b86b3036f331a4.jpg'),
      inputName: "input", //Optional, defaults to "input"
      inputSize: 224, //Optional, defaults to 224
      outputName: "output", //Optional, defaults to "output"
      maxResults: 3, //Optional, defaults to 3
      threshold: 0.1, //Optional, defaults to 0.1
    });

    results.forEach((result) =>
        console.log(
            result.id, // Id of the result
            result.name, // Name of the result
            result.confidence // Confidence value between 0 - 1
        )
    );

    await tfImageRecognition.close() // Necessary in order to release objects on native side
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.actionButtonsContainer}>
          <Button style={styles.button} onPress={this.handleGetQualifications}>
            <Text style={styles.actionButtonText}>Qualifications</Text>
          </Button>
          <Button style={styles.button} onPress={this.handleGetVacancies}>
            <Text style={styles.actionButtonText}>Vacancies</Text>
          </Button>
          <Button style={styles.button} onPress={this.classifyImage}>
            <Text style={styles.actionButtonText}>Classify</Text>
          </Button>
        </View>

        <Tabs
          page={this.state.page}
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
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: "10%"
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
