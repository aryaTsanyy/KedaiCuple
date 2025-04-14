/** @format */

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../index";
import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
import { KeyboardAvoidingView, Platform } from "react-native";

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, "Register">;

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [secure, setSecure] = useState(true);

  const toggleSecureEntry = () => {
    setSecure(!secure);
  };

  const navigation = useNavigation<SignupScreenNavigationProp>();

  const handleSignup = async () => {
    // Validasi input
    if (!name.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      Alert.alert("Error", "Phone number must contain only numbers");
      return;
    }

    if (!isAgreed) {
      Alert.alert("Error", "Please agree to terms and conditions");
      return;
    }

    try {
      setIsLoading(true);

      // Kirim data ke backend
      const response = await api.post("/auth/signup", {
        name,
        email,
        phoneNumber,
        password,
      });

      // Simpan userId untuk langkah verifikasi
      await AsyncStorage.setItem("pendingUserId", response.data.userId);

      // Navigasi ke layar verifikasi
      navigation.navigate("VerifyCodeScreen", { email });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Gunakan "padding" untuk iOS dan "height" untuk Android
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSignUp}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.backButton}>
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M12.3181 16.6995C12.1713 16.6995 12.0245 16.6454 11.9086 16.5295L6.87042 11.4913C6.05133 10.6723 6.05133 9.32771 6.87042 8.50862L11.9086 3.47044C12.1327 3.24635 12.5036 3.24635 12.7277 3.47044C12.9518 3.69453 12.9518 4.06544 12.7277 4.28953L7.68951 9.32771C7.3186 9.69862 7.3186 10.3013 7.68951 10.6723L12.7277 15.7104C12.9518 15.9345 12.9518 16.3054 12.7277 16.5295C12.6118 16.6377 12.465 16.6995 12.3181 16.6995Z"
                  fill="#292D32"
                />
              </Svg>
            </View>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill your information below or register with your social account.</Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} placeholderTextColor={"#ADADAD"} onChangeText={setName} placeholder="Enter your name" />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} placeholderTextColor={"#ADADAD"} onChangeText={setEmail} placeholder="Example@gmail.com" keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phoneNumber} placeholderTextColor={"#ADADAD"} onChangeText={setPhoneNumber} placeholder="Enter your phone number..." keyboardType="phone-pad" />

          <View style={styles.emailInput}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="*********" placeholderTextColor="#ADADAD" value={password} onChangeText={setPassword} secureTextEntry={secure} />
              <TouchableOpacity onPress={toggleSecureEntry} style={styles.icon}>
                <Icon name={secure ? "eye-off" : "eye"} size={22} color="#ADADAD" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsAgreed(!isAgreed)}>
            <View style={[styles.checkbox, isAgreed && styles.checkedBox]}>{isAgreed && <Text style={styles.checkmark}>✓</Text>}</View>
            <Text style={styles.checkboxLabel}>
              Agree with <Text style={styles.termsText}>Terms & Condition</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.signupButton, isLoading && styles.disabledButton]} onPress={handleSignup} disabled={isLoading}>
            <Text style={styles.signupButtonText}>{isLoading ? "Signing Up..." : "Sign Up"}</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    marginTop: 20,
  },
  headerText: {
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    left: -30,
  },
  headerSignUp: {
    flexDirection: "row",
    position: "relative",
    justifyContent: "flex-start",
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
    width: "60%",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderColor: "#efefef",
    borderWidth: 1,
    marginBottom: 20,
    color: "#000",
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
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

  icon: {
    position: "absolute",
    right: 15,
    top: "38%",
    transform: [{ translateY: -11 }], // setengah dari icon size (22)
    zIndex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ff69b4",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "#DC335D",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  backButton: {
    borderRadius: 100,
    borderWidth: 0.77,
    padding: 10,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  termsText: {
    color: "#DC335D",
    fontWeight: "500",
  },
  signupButton: {
    backgroundColor: "#DC335D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#DC335D",
  },
  signupButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#888",
  },
  loginLink: {
    color: "#DC335D",
    fontWeight: "500",
  },
});
