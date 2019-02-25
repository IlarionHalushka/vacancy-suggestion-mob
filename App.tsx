import * as React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import api from './api';

interface Item {
  _id: string,
  value: string,
  counter: number,
}

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
      interface Qualification extends Array<Qualification>{
        counter: number,
      }

      // @ts-ignore
      const data: Qualification[] = await api.getQualifications();

      data.sort((a,b) => b.counter - a.counter);

      this.setState({ qualifications: data, loading: false, showNavigation: true });
    } catch (err) {
      console.error(err);
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{margin: 50}}>Your Typescript project is working!</Text>
        <TouchableHighlight onPress={this.handleGetQualifications}>
          <Text>Load qualifications</Text>
        </TouchableHighlight>
        <FlatList
            data={this.state.qualifications}
            keyExtractor={(item) => item._id}
            renderItem={({item} : {item: Item}) =>
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
