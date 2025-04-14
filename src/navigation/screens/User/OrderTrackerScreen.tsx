/** @format */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import api from "../../../utils/api";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../index";
import { StackNavigationProp } from "@react-navigation/stack";

type OrderSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, "OrderSuccessScreen">;
type OrderSuccessScreenRouteProp = RouteProp<RootStackParamList, "OrderSuccessScreen">;
const OrderTrackerScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation<OrderSuccessScreenNavigationProp>();
  const route = useRoute<OrderSuccessScreenRouteProp>();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Ambil token dari AsyncStorage
        if (!token) {
          console.warn("No token found");
          return;
        }

        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Transaction ID: {item._id}</Text>
      <Text style={styles.orderType}>Order Type: {item.deliveryMethod}</Text>
      <Text style={styles.orderTotal}>Total Payment: Rp. {item.totalAmount.toLocaleString("id-ID")}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
      <View style={styles.orderActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("OrderReceiptScreen", { orderId: item._id })}>
          <Text style={styles.actionButtonText}>View Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={orders} keyExtractor={(item) => item._id} renderItem={renderOrder} contentContainerStyle={styles.list} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  list: {
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  orderType: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E94560",
    marginBottom: 8,
  },
  orderActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    backgroundColor: "#E94560",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default OrderTrackerScreen;
