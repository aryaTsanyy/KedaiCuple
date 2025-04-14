/** @format */

import React, { useState, useEffect } from "react";
import { StatusBar, View } from "react-native";
import { UserProvider } from "./navigation/context/userContext";
import { CartProvider } from "./navigation/context/cartContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./navigation";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppLoadingScreen from "../src/navigation/screens/AppLoadingScreen";
import { useCallback } from "react";

// Jika Anda menggunakan statemanagement seperti Redux
// import { Provider } from 'react-redux';
// import store from './store';

SplashScreen.preventAutoHideAsync();

const loadFonts = () => {
  return Font.loadAsync({
    "Manrope-Regular": require("../assets/manrope/Manrope-Regular.ttf"),
    "Manrope-Bold": require("../assets/manrope/Manrope-Bold.ttf"),
    "Manrope-Medium": require("../assets/manrope/Manrope-Medium.ttf"),
    "Manrope-SemiBold": require("../assets/manrope/Manrope-SemiBold.ttf"),
  });
};

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Manrope-Regular": require("../assets/manrope/Manrope-Regular.ttf"),
          "Manrope-Bold": require("../assets/manrope/Manrope-Bold.ttf"),
          "Manrope-Medium": require("../assets/manrope/Manrope-Medium.ttf"),
          "Manrope-SemiBold": require("../assets/manrope/Manrope-SemiBold.ttf"),
        });
      } catch (err) {
        console.warn(err);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return <AppLoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <CartProvider>
          <SafeAreaProvider onLayout={onLayoutRootView} style={{ flex: 1 }}>
            <AppNavigator />
          </SafeAreaProvider>
        </CartProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;
