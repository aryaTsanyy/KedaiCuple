/** @format */
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../index";

type LocationManualScreenNavigationProp = StackNavigationProp<RootStackParamList, "ManualLocation">;

export function LocationManualScreen() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([
    { id: 1, name: "Home", address: "Jl. Dukuwaluh, Kec. Kembaran, Kab..." },
    { id: 2, name: "Office", address: "Jl. Nganjuk, Kec. Entah, Kabupa..." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const navigation = useNavigation<LocationManualScreenNavigationProp>();

  // In a real app, you would implement a search function that uses a maps API
  const handleSearch = (text: string) => {
    setSearchText(text);
    // Mock search results
    // In a real app, you would call a maps API for geocoding
  };

  const handleSelectLocation = (locationId: number) => {
    setSelectedLocation(locationId);
    const location = searchResults.find((item) => item.id === locationId);

    if (location) {
      // Store the selected location
      AsyncStorage.setItem(
        "userLocation",
        JSON.stringify({
          name: location.name,
          address: location.address,
          // Mock coordinates
          coordinates: {
            lat: -7.4291,
            lng: 109.2428,
          },
        })
      );
    }
  };

  const handleUseCurrentLocation = async () => {
    // Navigate back to automatic location screen
    const userId = await AsyncStorage.getItem("pendingUserId");
    if (!userId) {
      Alert.alert("Error", "User information not found");
      return;
    }
    navigation.replace("Location", { userId });
  };

  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      Alert.alert("Error", "Please select a location");
      return;
    }

    try {
      setIsLoading(true);

      const userId = await AsyncStorage.getItem("pendingUserId");
      const locationData = await AsyncStorage.getItem("userLocation");

      if (!userId || !locationData) {
        Alert.alert("Error", "User or location information not found");
        return;
      }

      const location = JSON.parse(locationData);

      // Update user location in database
      await axios.post("http://192.168.1.12:5000/api/auth/update-location", {
        userId,
        location: {
          name: location.name,
          address: location.address,
          coordinates: location.coordinates,
        },
      });

      // Complete registration and get token
      const response = await axios.post("http://your-backend-url/api/auth/complete-registration", {
        userId,
      });

      // Store token and user info
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.user));
      await AsyncStorage.removeItem("pendingUserId");

      // Navigate to user dashboard
      navigation.navigate("Location", { userId });
    } catch (error) {
      Alert.alert("Error", "Failed to save location and complete registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Enter Your Location</Text>

      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search for your location..." value={searchText} onChangeText={handleSearch} />
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(searchText)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.locationItem, selectedLocation === item.id && styles.selectedLocation]} onPress={() => handleSelectLocation(item.id)}>
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
          </TouchableOpacity>
        )}
        style={styles.resultsList}
        contentContainerStyle={styles.resultsListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.noResultsText}>No results found</Text>}
      />
      <TouchableOpacity style={[styles.confirmButton, isLoading && styles.disabledButton]} onPress={handleConfirmLocation} disabled={isLoading}>
        <Text style={styles.confirmButtonText}>{isLoading ? "Saving..." : "Confirm Location"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.currentLocationButton} onPress={handleUseCurrentLocation}>
        <Text style={styles.currentLocationText}>Use Current Location</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#DC335D",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
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
  disabledButton: {
    backgroundColor: "#f0a0b0",
    borderColor: "#f0a0b0",
  },
  searchButton: {
    backgroundColor: "#DC335D",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: "#DC335D",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsList: {
    width: "100%",
    maxHeight: 200,
    marginBottom: 20,
  },
  resultsListContent: {
    paddingBottom: 20,
  },
  locationItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  selectedLocation: {
    backgroundColor: "#DC335D",
    borderColor: "#DC335D",
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DC335D",
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: "#888",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#DC335D",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
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
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  currentLocationButton: {
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
  currentLocationText: {
    color: "#DC335D",
    fontSize: 16,
    fontWeight: "bold",
  },
});
