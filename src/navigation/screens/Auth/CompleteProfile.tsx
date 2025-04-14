/** @format */

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import api from "../../../utils/api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../index";
import { useUser } from "../../context/userContext";

type CompleteProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, "CompleteProfile">;

export default function CompleteProfileScreen() {
  const { setUser } = useUser();
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<CompleteProfileScreenNavigationProp>();

  const pickImage = async () => {
    // Request permission
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.5,
    });
    if (result.didCancel) {
      console.log("User cancelled image picker");
    } else if (result.errorMessage) {
      console.log("ImagePicker Error: ", result.errorMessage);
    } else if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleCompleteProfile = async () => {
    if (!name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    try {
      setIsLoading(true);

      const userId = await AsyncStorage.getItem("pendingUserId");

      if (!userId) {
        Alert.alert("Error", "User information not found");
        navigation.replace("Register");
        return;
      }

      // Create form data for image upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userId", userId);

      if (profileImage) {
        const fileExtension = profileImage.split(".").pop();
        const fileName = `profile-${Date.now()}.${fileExtension}`;

        formData.append("profileImage", {
          uri: profileImage,
          name: fileName || "profile.jpg",
          type: `image/${fileExtension}` || "image/jpeg",
        } as any);
      }

      const response = await api.post("/auth/complete-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // Perbarui nilai isProfileComplete di AsyncStorage
        await AsyncStorage.setItem("isProfileComplete", "true");

        // Navigasi ke layar utama
        navigation.replace("MainTab", { screen: "Home" });
      } else {
        Alert.alert("Error", "Failed to complete profile. Please try again.");
      }

      const updatedUser = response.data.user;

      //statusProfil
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);

      navigation.replace("MainTab", { screen: "Home" });
    } catch (error: any) {
      Alert.alert("Profile Update Failed", error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>Don't worry, only you can see your personal data. No one else will be able to see it.</Text>

      <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImagePlaceholderText}>Add Photo</Text>
          </View>
        )}
        <View style={styles.editIconContainer}>
          <Text style={styles.editIcon}>✏️</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your full name" />
      </View>

      <TouchableOpacity style={[styles.completeButton, isLoading && styles.disabledButton]} onPress={handleCompleteProfile} disabled={isLoading}>
        <Text style={styles.completeButtonText}>{isLoading ? "Updating..." : "Complete Profile"}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImagePlaceholderText: {
    color: "#888",
    fontSize: 14,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff69b4",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 16,
  },
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  completeButton: {
    backgroundColor: "#ff69b4",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ffb6c1",
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
