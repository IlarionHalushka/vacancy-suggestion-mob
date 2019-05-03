import * as React from "react";
import { Component } from "react";

import { View, Text, StyleSheet, AsyncStorage, Switch } from "react-native";
import {
  Button,
  Item,
} from "native-base";

import themeLib from "react-native-theme";
import Container from "./Container";

// Setup Themes
themeLib.add(require("./theme/default"));
// themeLib.addComponents({ Example: require("./ThemeExample") });

themeLib.add(require("./theme/night"), "night");
// themeLib.addComponents({ Example: require("./RedExample") }, "night");


export default class Settings extends Component {
  static navigationOptions = {
    headerTitle: <Text>Settings</Text>,
  };

  state = {
    theme: "default",
  };

  async componentDidMount(): void {
    // @ts-ignore
    const themeFromStorage = await AsyncStorage.getItem("theme");
    themeFromStorage &&
      this.setState({ theme: themeFromStorage }) &&
      themeLib.active(themeFromStorage);
    themeLib.setRoot(this);
  }

  handleThemeChange = async () => {
    try {
      // @ts-ignore
      if (themeLib.name !== "default") {
        themeLib.active();
        AsyncStorage.setItem("theme", "default");
      } else {
        themeLib.active("night");
        AsyncStorage.setItem("theme", "night");
      }

      this.setState({ theme: themeLib.name });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const theme =
      this.state.theme === "default"
        ? {
            backgroundColor: "#44afff",
            color: "white"
          }
        : {
            backgroundColor: "white",
            color: "black"
          };

    return (
      <Container navigation={this.props.navigation} style={theme}>
          <Item
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Text style={theme}>Night mode:</Text>
            <Switch
              style={{ alignSelf: "center" }}
              onValueChange={() => this.handleThemeChange()}
              value={this.state.theme === "default"}
            />
          </Item>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    flexDirection: "column",
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
