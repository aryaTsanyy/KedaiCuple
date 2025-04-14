/** @format */

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import api from "../../../utils/api";

export default function VerifyCodeScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    try {
      setIsLoading(true);

      // Kirim kode verifikasi ke backend
      const response = await api.post("/auth/verify", {
        email,
        code,
      });

      Alert.alert("Success verifikasi email, Silahkan login");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Verification Failed", error.response?.data?.message || "An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>Enter the verification code sent to {email}</Text>
      <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="Enter verification code" keyboardType="number-pad" />
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify} disabled={isLoading}>
        <Text style={styles.verifyButtonText}>{isLoading ? "Verifying..." : "Verify"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  verifyButton: {
    backgroundColor: "#ff69b4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
