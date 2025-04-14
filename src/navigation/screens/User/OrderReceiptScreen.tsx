/** @format */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/api";

const OrderReceiptScreen = ({ route }: { route: any }) => {
  const { orderId } = route.params;
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Ambil token dari AsyncStorage
        if (!token) {
          console.warn("No token found");
          return;
        }

        const response = await api.get(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
          },
        });
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC335D" />
        <Text style={styles.loadingText}>Loading Order Details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Receipt</Text>
      <View style={styles.dashedLine} />
      <Text style={styles.label}>Transaction ID:</Text>
      <Text style={styles.value}>{orderDetails._id}</Text>
      <Text style={styles.label}>Order Type:</Text>
      <Text style={styles.value}>{orderDetails.deliveryMethod}</Text>
      <Text style={styles.label}>Total Payment:</Text>
      <Text style={styles.value}>Rp. {orderDetails.totalAmount.toLocaleString("id-ID")}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{orderDetails.status}</Text>
      <View style={styles.dashedLine} />
      <Text style={styles.subTitle}>Items</Text>
      <FlatList
        data={orderDetails.items}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.product.name}</Text>
            <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemDetails}>Price: Rp. {item.product.price.toLocaleString("id-ID")}</Text>
          </View>
        )}
      />
      <View style={styles.dashedLine} />
      <Text style={styles.footerText}>Orderan ini akan hilang jika anda tidak mengambil lebih dari 1 jam</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#DC335D",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#DC335D",
    textAlign: "center",
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#DC335D",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 8,
  },
  item: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  itemDetails: {
    fontSize: 14,
    color: "#555555",
  },
  dashedLine: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#DC335D",
    marginVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: "#DC335D",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },
});

export default OrderReceiptScreen;
