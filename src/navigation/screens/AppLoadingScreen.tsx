/** @format */
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../index";
import { useNavigation } from "@react-navigation/native";

type AppLoadingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "AppLoading">;
};

const AppLoadingScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "AppLoading">>();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        const isProfileComplete = await AsyncStorage.getItem("isProfileComplete");
        const userId = await AsyncStorage.getItem("userId");

        if (isLoggedIn === "true") {
          if (isProfileComplete === "true") {
            navigation.replace("MainTab", { screen: "Home" }); // Navigasi ke layar utama
          } else if (userId) {
            navigation.replace("CompleteProfile", { userId: userId ?? "" }); // Navigasi ke layar profil
          } else {
            console.error("User ID is null");
          }
        } else {
          navigation.replace("Onboarding"); // Navigasi ke layar login
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, [navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.ImgLoading}>
        <Image source={require("../../../assets/LoadingScreen.png")} style={styles.BGLoading} />
      </View>
    </View>
  );
};

export default AppLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  ImgLoading: {
    width: 240,
    position: "relative",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  BGLoading: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
});
