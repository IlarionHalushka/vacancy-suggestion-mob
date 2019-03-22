import * as React from "react";
import { Component } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";

export class TabContainer extends Component {
  state = {
    data: [],
    isRefreshing: false
  };

  handleScrollDownToRefresh = async () => {
    this.setState({ isRefreshing: true });
    const { loadData } = this.props;

    try {
      // @ts-ignore
      const data = await loadData();

      this.setState({ data });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isRefreshing: false });
    }
  };

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={() => this.handleScrollDownToRefresh()}
          />
        }
      >
        {!this.props.data.length ? (
          <Text style={styles.noDataText}>No data. Scroll down to refresh</Text>
        ) : (
          <FlatList
            data={this.props.data}
            keyExtractor={item => item._id}
            renderItem={({ item }) => this.props.renderRow(item)}
          />
        )}
      </ScrollView>
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
