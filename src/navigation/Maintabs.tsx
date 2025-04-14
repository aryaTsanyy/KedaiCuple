/** @format */

// navigation/MainTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

import Home from "../navigation/screens/User/Home";
import MenuScreen from "../navigation/screens/User/MenuScreen";
import CartScreen from "../navigation/screens/User/CartScreen";
import ProfileScreen from "../navigation/screens/User/Profile";
import { HeaderShownContext } from "@react-navigation/elements";
import { RootStackParamList } from "./index";

export type MainTabParamList = {
  Home: undefined;
  Menu: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons = {
  home: {
    active: require("../../assets/iconNavbar/homeactive.png"),
    inactive: require("../../assets/iconNavbar/homeinactive.png"),
  },
  menu: {
    active: require("../../assets/iconNavbar/menuactive.png"),
    inactive: require("../../assets/iconNavbar/menuinactive.png"),
  },
  cart: {
    active: require("../../assets/iconNavbar/bag.png"),
    inactive: require("../../assets/iconNavbar/cartinactive.png"),
  },
  profile: {
    active: require("../../assets/iconNavbar/bag.png"),
    inactive: require("../../assets/iconNavbar/cartinactive.png"),
  },
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const currentRouteName = state.routes[state.index].name;
  if (currentRouteName === "Cart") {
    return null; // Jangan render tab bar di layar Cart
  }
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        let icon;
        switch (route.name) {
          case "Home":
            icon = isFocused ? icons.home.active : icons.home.inactive;
            break;
          case "Menu":
            icon = isFocused ? icons.menu.active : icons.menu.inactive;
            break;
          case "Cart":
            icon = isFocused ? icons.cart.active : icons.cart.inactive;
            break;
          case "Profile":
            icon = isFocused ? icons.profile.active : icons.profile.inactive;
            break;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={index} onPress={onPress} style={styles.tabButton}>
            <Image source={icon} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false, tabBarStyle: { display: "none" } }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: "#000",
    borderRadius: 100,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default MainTabs;
