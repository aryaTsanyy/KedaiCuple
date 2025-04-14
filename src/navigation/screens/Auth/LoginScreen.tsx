/** @format */

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/api";
import { RootStackParamList } from "../../index";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { KeyboardAvoidingView, Platform } from "react-native";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  const toggleSecureEntry = () => {
    setSecure(!secure);
  };

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      await AsyncStorage.setItem("token", token);

      // Store token and user info
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.user));
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("isProfileComplete", user.isProfileComplete ? "true" : "false");
      await AsyncStorage.setItem("userId", user._id);

      console.log("Login successful. Token and user data saved.");

      //navigasi status profil dan lokasi
      if (!user.isProfileComplete) {
        navigation.replace("CompleteProfile", { userId: user._id });
      } else {
        navigation.replace("MainTab", { screen: "Home" });
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.response?.data?.message || "Periksa Email atau kata sandi anda");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Gunakan "padding" untuk iOS dan "height" untuk Android
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerLogin}>
            <Image source={require("../../../assets/LogoCuple.png")} style={styles.LogoCuple} />
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subTitle}>Welcome to Kedai Cuple Manten'e App</Text>
          </View>
          <View>
            <View style={styles.emailInput}>
              <Text style={styles.titleInput}>Email</Text>
              <TextInput style={styles.input} placeholder="Example@gmail.com" placeholderTextColor={"#ADADAD"} value={email} onChangeText={setEmail} keyboardType="email-address" />
            </View>
            <View style={styles.emailInput}>
              <Text style={styles.titleInput}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="*********" placeholderTextColor="#ADADAD" value={password} onChangeText={setPassword} secureTextEntry={secure} />
                <TouchableOpacity onPress={toggleSecureEntry} style={styles.icon}>
                  <Icon name={secure ? "eye-off" : "eye"} size={22} color="#ADADAD" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.forgetPassWord}>
              <Text style={styles.forgetPassWordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.SignUpContainer}>
              <Text style={styles.SignUpText}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.SignUpTextBR}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    flex: 1,
    justifyContent: "space-evenly",
    padding: 20,
    backgroundColor: "#fff",
  },
  SignUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  SignUpText: {
    fontSize: 13,
    fontFamily: "Manrope-SemiBold",
  },
  SignUpTextBR: {
    fontSize: 13,
    fontFamily: "Manrope-SemiBold",
    color: "#DC335D",
  },
  headerLogin: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
    justifyContent: "center",
    marginBottom: 32,
  },
  ButtonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
  },
  LogoCuple: {
    width: 131,
    height: 125,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
    textAlign: "center",
    fontFamily: "Manrope-SemiBold",
  },
  subTitle: {
    fontSize: 12,
    color: "#ADADAD",
  },
  forgetPassWord: {
    alignItems: "flex-end",
  },
  forgetPassWordText: {
    color: "#DC335D",
    fontSize: 12,
    fontFamily: "Manrope-Medium",
    textAlign: "right",
  },
  emailInput: {
    gap: 8,
    flexDirection: "column",
  },
  titleInput: {
    fontSize: 12,
    fontFamily: "Manrope-SemiBold",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: 15,
    height: 50,
    borderColor: "#efefef",
    borderWidth: 1,
    marginBottom: 15,
    color: "#000",
    borderRadius: 8,
  },

  icon: {
    position: "absolute",
    right: 15,
    top: "38%",
    transform: [{ translateY: -11 }], // setengah dari icon size (22)
    zIndex: 1,
  },
  loginButton: {
    backgroundColor: "#DC335D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
