/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../index";
import api from "../../../utils/api";

type AdminDashboardNavigationProp = StackNavigationProp<RootStackParamList, "AdminDashboard">;

type Order = {
  _id: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  storeInfo: {
    name: string;
    address: string;
  };
  user: {
    name: string;
    email: string;
  };
};

type StatisticsData = {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
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

  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const navigation = useNavigation<AdminDashboardNavigationProp>();

  const fetchOrders = async (status = "") => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await api.get(`/admin/orders?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await api.get("/admin/orders/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
    fetchStatistics();
  }, [statusFilter]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders(statusFilter);
    fetchStatistics();
  }, [statusFilter]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status === statusFilter ? "" : status);
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

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate("AdminOrderDetail", { orderId: item._id })}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item._id.substring(0, 8)}</Text>
        <OrderStatusBadge status={item.status} />
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.customerName}>Customer: {item.user?.name || "Unknown"}</Text>
        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
      </View>

      <View style={styles.paymentInfo}>
        <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
        <Text style={styles.orderAmount}>{formatCurrency(item.totalAmount)}</Text>
      </View>

      <View style={styles.paymentStatusContainer}>
        <Text style={[styles.paymentStatus, { color: item.paymentStatus === "success" ? "#4CAF50" : "#F44336" }]}>Payment: {item.paymentStatus}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatistics = () => {
    if (!statistics) return null;

    return (
      <View style={styles.statisticsContainer}>
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>
        <View style={styles.statsCards}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.completedOrders}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={[styles.statCard, styles.revenueCard]}>
            <Text style={styles.statValue}>{formatCurrency(statistics.totalRevenue)}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFilters = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
      {["Chef Cooking", "Ready for Pickup", "Completed", "Cancelled"].map((status) => (
        <TouchableOpacity key={status} style={[styles.filterButton, statusFilter === status && styles.activeFilterButton]} onPress={() => handleStatusFilterChange(status)}>
          <Text style={[styles.filterButtonText, statusFilter === status && styles.activeFilterButtonText]}>{status}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      {renderStatistics()}

      <View style={styles.ordersContainer}>
        <Text style={styles.sectionTitle}>Order Management</Text>
        {renderFilters()}

        {loading ? (
          <ActivityIndicator size="large" color="#DC335D" style={styles.loader} />
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.ordersList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No orders found</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
  },
  statisticsContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333333",
  },
  statsCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  revenueCard: {
    backgroundColor: "#e8f4fd",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    color: "#DC335D",
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
  },
  ordersContainer: {
    flex: 1,
    padding: 16,
  },
  filtersContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  activeFilterButton: {
    backgroundColor: "#DC335D",
    borderColor: "#DC335D",
  },
  filterButtonText: {
    color: "#666666",
    fontSize: 14,
  },
  activeFilterButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    borderLeftWidth: 5,
    borderLeftColor: "#DC335D",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    color: "#555555",
  },
  orderDate: {
    fontSize: 12,
    color: "#888888",
  },
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentMethod: {
    fontSize: 14,
    color: "#555555",
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  paymentStatusContainer: {
    alignItems: "flex-end",
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  loader: {
    marginTop: 24,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
  },
});

export default AdminDashboard;
