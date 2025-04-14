/** @format */

// app/(auth)/location.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../index";

type LocationScreenNavigationProp = StackNavigationProp<RootStackParamList, "Location">;

export default function LocationScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LocationScreenNavigationProp>();

  const handleGetLocation = async () => {
    try {
      setIsLoading(true);

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access location was denied. Please enter location manually.");
        navigation.navigate("ManualLocation");
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get address from coordinates (reverse geocoding)
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocode.length > 0) {
        const address = {
          street: geocode[0].street,
          city: geocode[0].city,
          region: geocode[0].region,
          country: geocode[0].country,
          postalCode: geocode[0].postalCode,
          formattedAddress: `${geocode[0].street || ""}, ${geocode[0].city || ""}, ${geocode[0].region || ""}, ${geocode[0].country || ""}`,
        };

        // Store location data
        await AsyncStorage.setItem(
          "userLocation",
          JSON.stringify({
            coordinates: { lat: latitude, lng: longitude },
            address,
          })
        );

        // Update user location in database
        const userId = await AsyncStorage.getItem("pendingUserId");

        if (userId) {
          await axios.post("http://192.168.1.12:5000/api/auth/update-location", {
            userId,
            location: {
              coordinates: { lat: latitude, lng: longitude },
              address: address.formattedAddress,
            },
          });
        }

        // Complete registration and get token
        completeRegistration();
      } else {
        Alert.alert("Location Error", "Unable to get address from coordinates. Please enter location manually.");
        navigation.navigate("ManualLocation");
      }
    } catch (error: any) {
      Alert.alert("Location Error", "Failed to get your location. Please enter location manually.");
      navigation.navigate("ManualLocation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualEntry = () => {
    navigation.navigate("ManualLocation");
  };

  const completeRegistration = async () => {
    try {
      const userId = await AsyncStorage.getItem("pendingUserId");

      if (!userId) {
        Alert.alert("Error", "User information not found");
        navigation.replace("Register");
        return;
      }

      // Complete registration and get token
      const response = await axios.post("http://localhost:5000/auth/complete-registration", {
        userId,
      });

      // Store token and user info
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.user));
      await AsyncStorage.removeItem("pendingUserId");

      // Navigate to user dashboard
      navigation.navigate("ManualLocation");
    } catch (error) {
      Alert.alert("Error", "Failed to complete registration");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.locationIcon}>
        <Text style={styles.locationIconText}>📍</Text>
      </View>

      <Text style={styles.title}>What Is Your Location?</Text>
      <Text style={styles.subtitle}>We need to know your location in order to suggest nearby service</Text>

      <TouchableOpacity style={[styles.locationButton, isLoading && styles.disabledButton]} onPress={handleGetLocation} disabled={isLoading}>
        <Text style={styles.locationButtonText}>{isLoading ? "Getting Location..." : "Allow Location Access"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.manualEntryButton} onPress={handleManualEntry}>
        <Text style={styles.manualEntryText}>Enter Location Manually</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  locationIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
    position: "relative",
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  locationIconText: {
    fontSize: 50,
    color: "#DC335D",
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 10,
    textAlign: "center",
    color: "#DC335D",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  locationButton: {
    backgroundColor: "#DC335D",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "#DC335D",
  },
  locationButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#f0a0b0",
    borderColor: "#f0a0b0",
  },
  manualEntryButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DC335D",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  manualEntryText: {
    color: "#DC335D",
    fontSize: 16,
    fontWeight: "bold",
  },
});
