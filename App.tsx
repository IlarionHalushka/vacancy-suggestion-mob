import React from "react";
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import AppContent from "./AppContent";
import Settings from "./Settings";

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: AppContent,
  },
  Settings: {
    screen: Settings,
  }
});

export default createAppContainer(MyDrawerNavigator);
