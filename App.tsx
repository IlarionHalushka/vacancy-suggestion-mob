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
import api from "./api";

interface Item {
  _id: string;
  value: string;
  counter: number;
}

export default class App extends Component {
  state = {
    vacancies: [],
    qualifications: [],
    loading: false,
    mode: "qualifications"
  };

  handleGetQualifications = async () => {
    this.setState({ loading: true });

    try {
      interface Qualification extends Array<Qualification> {
        counter: number;
      }

      // @ts-ignore
      const qualifications: Qualification[] = await api.getQualifications();

      const qualificationsFiltered: Qualification[] = qualifications.filter(
        item => item.counter > 0
      );

      qualificationsFiltered.sort((a, b) => b.counter - a.counter);

      this.setState({
        qualifications: qualificationsFiltered,
        loading: false,
        mode: "qualifications"
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
      interface Vacancy extends Array<Vacancy> {
        counter: number;
      }

      // @ts-ignore
      const vacancies: Vacancy[] = await api.getVacancies({ data: "info" });

      this.setState({
        vacancies,
        loading: false,
        mode: "vacancies"
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

        <FlatList
          style={{ marginTop: 50 }}
          data={
            (this.state.mode === "qualifications" &&
              this.state.qualifications) ||
            (this.state.mode === "vacancies" && this.state.vacancies)
          }
          keyExtractor={item =>
            (this.state.mode === "qualifications" && item._id) ||
            (this.state.mode === "vacancies" && item.vacancyId)
          }
          renderItem={({ item }: { item: Item }) =>
            (this.state.mode === "qualifications" && (
              <View style={styles.listItem}>
                <Text style={{ alignSelf: "center" }}>{`${item.value}`}</Text>
                <Text style={{ alignSelf: "center" }}>{`${item.counter}`}</Text>
              </View>
            )) ||
            (this.state.mode === "vacancies" && (
              <View style={styles.listItem}>
                <Text style={{ alignSelf: "center" }}>{`${
                  item.cityName
                }`}</Text>
                <Text style={{ alignSelf: "center" }}>{`${
                  item.vacancyName
                }`}</Text>
              </View>
            ))
          }
        />
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
