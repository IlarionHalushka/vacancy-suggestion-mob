import React from "react";
import { Text } from 'react-native';
import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import Qualifications from "./Qualifications";
import Vacancies from "./Vacancies";
import Settings from "./Settings";

const VacanciesStack = createStackNavigator(
  {
    Vacancies: {
      screen: Vacancies,
    },
  },
  {
    initialRouteName: "Vacancies"
  }
);

const QualificationsStack = createStackNavigator(
  {
    Qualifications: {
      screen: Qualifications,
    },
  },
  {
    initialRouteName: "Qualifications"
  }
);

const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: Settings,
    },
  },
  {
    initialRouteName: "Settings"
  }
);

const MyDrawerNavigator = createDrawerNavigator({
  Qualifications: {
    screen: QualificationsStack
  },
  Vacancies: {
    screen: VacanciesStack
  },
  Settings: {
    screen: SettingsStack
  }
});

export default createAppContainer(MyDrawerNavigator);
