/** @format */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/api";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../index";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profil</Text>
        <TouchableOpacity>
          <Text style={styles.editIcon}>⤴</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: user?.photo || "https://via.placeholder.com/150" }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>
          {user?.email} • {user?.phone}
        </Text>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <SettingItem label="Edit Profil" onPress={() => {}} />
        <SettingItem label="Alamat Tersimpan" onPress={() => {}} />
        <SettingItem label="E-wallet" onPress={() => {}} />
        <SettingItem label="Privacy Policy" onPress={() => {}} />
      </View>

      {/* Help Section */}
      <View style={styles.section}>
        <SettingItem label="Bantuan" onPress={() => {}} />
        <SettingItem label="Keluar" isLogout onPress={() => setModalVisible(true)} />
      </View>

      {/* Logout Modal */}
      <Modal transparent visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SettingItem = ({ label, onPress, isLogout = false }: { label: string; onPress: () => void; isLogout?: boolean }) => (
  <TouchableOpacity onPress={onPress} style={styles.settingItem}>
    <Text style={[styles.settingText, isLogout && { color: "#E94560" }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backArrow: { fontSize: 24 },
  title: { fontSize: 18, fontWeight: "bold" },
  editIcon: { fontSize: 18 },
  profileContainer: { alignItems: "center", marginVertical: 16 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 135,
    backgroundColor: "#E94560",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: { color: "#fff", fontSize: 12 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 8 },
  email: { color: "#999", marginTop: 4 },
  section: { marginTop: 20, paddingHorizontal: 16 },
  settingItem: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
  },
  settingText: { fontSize: 14, fontWeight: "500" },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalMessage: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#E94560",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
