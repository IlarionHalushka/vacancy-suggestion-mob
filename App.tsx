import * as React from 'react';
import {
  createAppContainer,
  createDrawerNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
} from 'react-navigation';

import Qualifications from './Qualifications';
import Settings from './Settings';
import Vacancies from './Vacancies';

const VacanciesStack = createStackNavigator(
  {
    Vacancies: {
      screen: Vacancies,
    },
  },
  {
    initialRouteName: 'Vacancies',
  }
);

const QualificationsStack = createStackNavigator(
  {
    Qualifications: {
      screen: Qualifications,
    },
  },
  {
    initialRouteName: 'Qualifications',
  }
);

const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: Settings,
    },
  },
  {
    initialRouteName: 'Settings',
  }
);

const VacanciesTabs = createMaterialTopTabNavigator(
  {
    Vacancies: { screen: VacanciesStack },
    Settings: { screen: SettingsStack },
  },
  {
    initialRouteName: 'Vacancies',
    tabBarPosition: 'bottom',
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
      },
      tabStyle: {
        width: 100,
      },
      style: {
        backgroundColor: 'blue',
      },
    },
  }
);

const MyDrawerNavigator = createDrawerNavigator({
  Qualifications: {
    screen: QualificationsStack,
  },
  Vacancies: {
    screen: VacanciesTabs,
  },
  Settings: {
    screen: SettingsStack,
  },
});

export default createAppContainer(MyDrawerNavigator);
