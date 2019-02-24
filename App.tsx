import * as React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import { Hello } from './Hello';
import api from './api';

export default class App extends Component {
  state = {
    bestVacancies: [],
    qualifications: [],
    showNavigation: false,
    loading: false,
  };

  handleGetQualifications = async () => {
    this.setState({ loading: true });

    try {
      interface Qualification {
        counter: number,
      }
      interface Qualification extends Array<Qualification>{}

      const data: Qualification[] = await api.getQualifications();

      data.sort((a,b) => b.counter - a.counter);

      this.setState({
        qualifications: data,
        loading: false,
        showNavigation: true,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        loading: false,
      });
    }

    console.log(this.state.qualifications);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{margin: 50}}>Your Typescript project is working!</Text>
        {/*<Hello name="NAME" enthusiasmLevel={1} ></Hello>*/}
        <TouchableHighlight onPress={this.handleGetQualifications}>
          <Text>click me load qualifications</Text>
        </TouchableHighlight>
        <FlatList
            data={this.state.qualifications}
            keyExtractor={(item) => item._id}
            renderItem={({item}) =>
                <View>
                  <Text>{`${item.value}:${item.counter}`}</Text>
                </View>
            }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
