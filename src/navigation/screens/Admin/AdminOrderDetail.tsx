/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../index";
import api from "../../../utils/api";

type AdminOrderDetailRouteProp = RouteProp<RootStackParamList, "AdminOrderDetail">;
type AdminOrderDetailNavigationProp = StackNavigationProp<RootStackParamList, "AdminOrderDetail">;

type OrderItem = {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  notes?: string;
};

type OrderDetail = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  items: OrderItem[];
  storeInfo: {
    name: string;
    address: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderDate: string;
  createdAt: string;
};

const AdminOrderDetail = () => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const route = useRoute<AdminOrderDetailRouteProp>();
  const navigation = useNavigation<AdminOrderDetailNavigationProp>();
  const { orderId } = route.params;

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      Alert.alert("Error", "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const updateOrderStatus = async (status: string) => {
    try {
      setUpdatingStatus(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      await api.patch(`/admin/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });

      Alert.alert("Success", "Order status updated successfully");
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Error", "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const confirmStatusChange = (status: string) => {
    Alert.alert("Update Order Status", `Are you sure you want to change the order status to "${status}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Update", onPress: () => updateOrderStatus(status) },
    ]);
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chef Cooking":
        return "#FFA500"; // Orange
      case "Ready for Pickup":
        return "#4CAF50"; // Green
      case "Completed":
        return "#2196F3"; // Blue
      case "Cancelled":
        return "#F44336"; // Red
      default:
        return "#9E9E9E"; // Grey
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC335D" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Order ID and Date */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID:</Text>
            <Text style={styles.infoValue}>{order._id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment:</Text>
            <Text style={styles.infoValue}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Status:</Text>
            <Text
              style={[
                styles.infoValue,
                {
                  color: order.paymentStatus === "success" ? "#4CAF50" : "#F44336",
                },
              ]}
            >
              {order.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{order.user?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{order.user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{order.user?.phoneNumber}</Text>
          </View>
        </View>

        {/* Store Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{order.storeInfo.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{order.storeInfo.address}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={`${item.product._id}-${index}`} style={styles.orderItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatCurrency(item.product.price * item.quantity)}</Text>
              {item.notes && <Text style={styles.itemNotes}>Note: {item.notes}</Text>}
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.totalAmount)}</Text>
          </View>
        </View>

        {/* Status Update Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Order Status</Text>
          <View style={styles.statusButtonsContainer}>
            {["Chef Cooking", "Ready for Pickup", "Completed", "Cancelled"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.statusButton, order.status === status && styles.activeStatusButton, { backgroundColor: getStatusColor(status) }]}
                onPress={() => confirmStatusChange(status)}
                disabled={updatingStatus || order.status === status}
              >
                <Text style={styles.statusButtonText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {updatingStatus && <ActivityIndicator size="small" color="#DC335D" style={styles.updatingIndicator} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#F44336",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#DC335D",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    elevation: 2,
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    flex: 2,
    textAlign: "right",
  },
  orderItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingVertical: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    flex: 1,
  },
  itemQty: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
  },
  itemNotes: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#888888",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#DC335D",
  },
  statusButtonsContainer: {
    flexDirection: "column",
    marginTop: 8,
  },
  statusButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  activeStatusButton: {
    elevation: 4,
  },
  statusButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  updatingIndicator: {
    marginTop: 16,
  },
});

export default AdminOrderDetail;
