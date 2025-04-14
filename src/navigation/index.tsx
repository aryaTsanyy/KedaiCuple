/** @format */

import React, { useEffect, useState } from "react";
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider } from "./context/userContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Screens
import AppLoadingScreen from "../navigation/screens/AppLoadingScreen";
import OnboardingScreen from "../navigation/screens/Auth/OnBoardingScreen";
import LoginScreen from "../navigation/screens/Auth/LoginScreen";
import RegisterScreen from "../navigation/screens/Auth/SignUpScreen";
import VerifyCodeScreen from "../navigation/screens/Auth/VerifyCode";
import CompleteProfileScreen from "../navigation/screens/Auth/CompleteProfile";
import ProductDetailScreen from "../navigation/screens/User/ProductDetail";
import LocationScreen from "./screens/Auth/Location";
import { LocationManualScreen } from "../navigation/screens/Auth/ManualLocation";
import CheckoutScreen from "./screens/User/CheckoutScreen";
import PaymentScreen from "./screens/User/PaymentScreen";
import OrderSuccessScreen from "./screens/User/OrderSuccesScreen";
import OrderTrackerScreen from "./screens/User/OrderTrackerScreen";
import OrderReceiptScreen from "./screens/User/OrderReceiptScreen";
import MainTabs, { MainTabParamList } from "./Maintabs";
import { CartItem } from "../../types";

export type RootStackParamList = {
  Onboarding: undefined;
  AppLoading: undefined;
  Login: undefined;
  Register: undefined;
  OrderTrackerScreen: { orderId: string };
  OrderReceiptScreen: { orderId: string };
  VerifyCodeScreen: { email: string };
  CompleteProfile: { userId: string };
  ProductDetail: { product: any };
  MainTab: NavigatorScreenParams<MainTabParamList>;
  Location: { userId: string };
  ManualLocation: undefined;
  CheckoutScreen: { cartItems?: CartItem[] };
  PaymentScreen: {
    orderItems: any[];

    store: { name: string; address: string };
    total: number;
  };
  OrderSuccessScreen: {
    orderId: string;
    orderDetails: {
      storeInfo: {
        name: string;
        address: string;
      };
    };
  };
  OrderDetailsScreen: {
    orderId: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!isLoading) {
    return <AppLoadingScreen />;
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AppLoading" component={AppLoadingScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} />
          <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="ManualLocation" component={LocationManualScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} />
          <Stack.Screen name="OrderTrackerScreen" component={OrderTrackerScreen} />
          <Stack.Screen name="OrderReceiptScreen" component={OrderReceiptScreen} />
          <Stack.Screen name="MainTab" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default AppNavigator;
