import React from "react";
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import AppContent from "./AppContent";

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: AppContent
  }
});

export default createAppContainer(MyDrawerNavigator);
