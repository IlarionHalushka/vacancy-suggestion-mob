import * as React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";
import { Card } from "native-base";

interface IItem {
  vacancyId: string;
}

interface ITheme {
  backgroundColor: string;
  color: string;
}

interface IProps {
  isRefreshing: boolean;
  onRefresh: Function;
  data: Array<Object>;
  renderRow: Function;
  theme: ITheme;
}

const TabContainer = ({
  isRefreshing,
  onRefresh,
  data,
  renderRow,
  theme
}: IProps) => {
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
          <FlatList
            data={data}
            keyExtractor={(item: IItem) => item.vacancyId}
            renderItem={({ item }) => renderRow(item)}
          />
        </Card>
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
