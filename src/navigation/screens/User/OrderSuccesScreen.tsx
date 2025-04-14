/** @format */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../index";
import { StackNavigationProp } from "@react-navigation/stack";

type OrderSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, "OrderSuccessScreen">;
type OrderSuccessScreenRouteProp = RouteProp<RootStackParamList, "OrderSuccessScreen">;

const OrderSuccessScreen = () => {
  const navigation = useNavigation<OrderSuccessScreenNavigationProp>();
  const route = useRoute<OrderSuccessScreenRouteProp>();
  const { orderId, orderDetails } = route.params || {};

  const handleViewOrderDetails = () => {
    navigation.navigate("OrderTrackerScreen", { orderId });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTab", params: { screen: "Home" } }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>

        <Text style={styles.successTitle}>Pesanan Diterima!</Text>
        <Text style={styles.successMessage}>Ditunggu kedatangannya di Kedai Cuple Manten'e</Text>

        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Order ID:</Text>
          <Text style={styles.orderValue}>{orderId}</Text>
        </View>
      </View>
      <View style={styles.pickupInfo}>
        <Text style={styles.pickupTitle}>Pick up at:</Text>
        <Text style={styles.pickupLocation}>{orderDetails.storeInfo.name}</Text>
        <Text style={styles.pickupAddress}>{orderDetails.storeInfo.address}</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.detailsButton} onPress={handleViewOrderDetails}>
          <Text style={styles.detailsButtonText}>View Order Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333333",
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666666",
    lineHeight: 24,
  },
  orderInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  orderLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  orderValue: {
    fontSize: 16,
  },
  pickupInfo: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    width: "100%",
  },
  pickupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickupLocation: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  pickupAddress: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  footer: {
    padding: 16,
  },
  detailsButton: {
    backgroundColor: "#E94560",
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginBottom: 12,
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E94560",
  },
  homeButtonText: {
    color: "#E94560",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OrderSuccessScreen;
