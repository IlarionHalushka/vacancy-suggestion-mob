import * as React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";
import { Card, CardItem } from "native-base";

const TabContainer = ({ isRefreshing, onRefresh, data, renderRow, theme }) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {!data.length ? (
        <Text style={[styles.noDataText, theme]}>
          No data. Scroll down to refresh
        </Text>
      ) : (
        <Card style={theme}>
          {data.map(item => (
            <CardItem
              style={theme}
              key={`${item.vacancyId}${item.companyExternalId}`}
            >
              {renderRow(item, theme)}
            </CardItem>
          ))}
        </Card>
        // <FlatList
        //   data={data}
        //   keyExtractor={item => item.vacancyId}
        //   renderItem={({ item }) => renderRow(item)}
        // />
      )}
    </ScrollView>
  );
};

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

export default TabContainer;
