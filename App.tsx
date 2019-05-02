import React from "react";
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import Qualifications from "./Qualifications";
import Vacancies from "./Vacancies";
import Settings from "./Settings";

const MyDrawerNavigator = createDrawerNavigator({
  Qualifications: {
    screen: Qualifications,
  },
  Vacancies: {
    screen: Vacancies,
  },
  Settings: {
    screen: Settings,
  }
});

export default createAppContainer(MyDrawerNavigator);
