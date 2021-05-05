import * as React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingsScreen from "../screens/SettingsScreen";
import MyDonationScreen from "../screens/MyDonationScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MyReceivedBookScreen from "../screens/MyReceivedBookScreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: AppTabNavigator },
    MyDonations: { screen: MyDonationScreen },
    MyReceivedBook: { screen: MyReceivedBookScreen },
    Settings: { screen: SettingsScreen },
    Notification: { screen: NotificationScreen },
  },
  { contentComponent: CustomSideBarMenu },
  { initialRouteName: "Home" }
);
