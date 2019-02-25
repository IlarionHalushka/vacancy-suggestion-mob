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
        <TouchableHighlight style={styles.qualificationsBtn} onPress={this.handleGetQualifications}
         underlayColor="#2c51ff">
          <Text style={{fontSize: 20}}>Load qualifications</Text>
        </TouchableHighlight>
        <FlatList
            data={this.state.qualifications}
            keyExtractor={(item) => item._id}
            renderItem={({item} : {item: Item}) =>
                <View style={styles.listItem}>
                  <Text style={{ alignSelf: 'center' }}>{`${item.value}`}</Text>
                  <Text style={{ alignSelf: 'center' }}>{`${item.counter}`}</Text>
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
      justifyContent: 'center'
  },
  qualificationsBtn: {
      alignSelf: 'auto',
      borderWidth: 1,
      borderColor: '#2c51ff',
      backgroundColor: '#80d9ff',
      borderRadius: 20,
      marginVertical: 25,
      marginHorizontal: '10%',
      width: '80%',
      height: '10%',
      alignItems: 'center',
      justifyContent: 'center',
  },
    listItem: {
      margin: 2,
        marginHorizontal: '20%',
        borderTopWidth: 1,
        borderTopEndRadius: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
