/** @format */

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../../utils/api";
import { useCart } from "../../context/cartContext";
import { RootStackParamList } from "../../index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";

// Types
interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options: {
    ice: string;
    temperature: string;
  };
}

type StoreInfo = {
  name: string;
  address: string;
};

type RouteParams = {
  orderItems: CartItem[];
  deliveryMethod: "Delivery" | "Pick Up";
  store: StoreInfo;
  total: number;
};

interface PaymentMethod {
  id: string;
  name: string;
  type: "Cash" | "E-wallet" | "Other";
  icon: React.ReactNode;
  balance?: number;
  action?: string;
}

const PaymentScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "PaymentScreen">>();
  const route = useRoute();
  const { setCart } = useCart();
  const { orderItems, deliveryMethod, store, total } = route.params as RouteParams;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cash");
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "cash",
      name: "Cash",
      type: "Cash",
      icon: <MaterialIcons name="attach-money" size={24} color="#4CAF50" />,
    },
    {
      id: "shopeepay",
      name: "Shopeepay",
      type: "Other",
      icon: <MaterialCommunityIcons name="cart" size={24} color="#EE4D2D" />,
      action: "Tautkan",
    },
    {
      id: "ovo",
      name: "Ovo",
      type: "Other",
      icon: <FontAwesome5 name="credit-card" size={20} color="#4A2D8B" />,
      action: "Tautkan",
    },
    {
      id: "linkaja",
      name: "Link Aja",
      type: "Other",
      icon: <MaterialIcons name="account-balance-wallet" size={24} color="#ED1C24" />,
      action: "Tautkan",
    },
    {
      id: "qris",
      name: "Qris",
      type: "Other",
      icon: <MaterialIcons name="qr-code" size={24} color="#000000" />,
      action: "Tautkan",
    },
  ];

  const handleConfirmPayment = async () => {
    try {
      setIsProcessing(true);

      // Create the order data object
      const orderData = {
        items: orderItems.map((item) => ({
          product: item._id, // Gunakan _id sebagai product
          quantity: item.quantity,
        })),
        storeInfo: store,
        paymentMethod: selectedPaymentMethod,
        totalAmount: total,
        orderDate: new Date(),
      };
      const userToken = await AsyncStorage.getItem("token");
      if (!userToken) {
        Alert.alert("Error", "User not authenticated. Please log in.");
        return;
      }

      // Send order to your backend
      const response = await api.post("/orders/create", orderData, {
        headers: {
          Authorization: `Bearer ${userToken}`, // Ganti `userToken` dengan token autentikasi pengguna
        },
      });

      // If successful, navigate to success screen
      if (response.status === 201 || response.status === 200) {
        console.log("Order created successfully:", response.data);

        // Clear cart on successful order
        try {
          console.log("Clearing cart...");
          await api.delete("/cart", {
            headers: {
              Authorization: `Bearer ${userToken}`, // Pastikan token dikirim
            },
          });
          console.log("Cart cleared successfully.");
          setCart([]);
        } catch (cartError) {
          if (cartError instanceof Error) {
            console.error("Error clearing cart:", cartError.message);
          } else {
            console.error("Unknown error clearing cart:", cartError);
          }
        }

        // Navigate to success screen
        try {
          navigation.navigate("OrderSuccessScreen", {
            orderId: response.data._id,
            orderDetails: response.data,
          });
          console.log("Navigated to OrderSuccessScreen.");
        } catch (navigationError) {
          console.error("Error navigating to OrderSuccessScreen:", navigationError);
        }
      } else {
        Alert.alert("Error", "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      Alert.alert("Error", "Something went wrong with your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethods = () => {
    const groupedMethods = paymentMethods.reduce((acc, method) => {
      if (!acc[method.type]) {
        acc[method.type] = [];
      }
      acc[method.type].push(method);
      return acc;
    }, {} as Record<string, PaymentMethod[]>);

    return Object.entries(groupedMethods).map(([type, methods]) => (
      <View key={type} style={styles.paymentSection}>
        <Text style={styles.paymentSectionTitle}>{type}</Text>
        {methods.map((method) => (
          <TouchableOpacity key={method.id} style={styles.paymentOption} onPress={() => setSelectedPaymentMethod(method.id)}>
            <View style={styles.paymentOptionLeft}>
              {method.icon}
              <Text style={styles.paymentOptionText}>
                {method.name}
                {method.balance !== undefined && ` (Rp. ${method.balance.toLocaleString("id-ID")})`}
              </Text>
            </View>
            <View style={styles.paymentOptionRight}>
              {method.action ? (
                <Text style={styles.actionText}>{method.action} &gt;</Text>
              ) : (
                <View style={[styles.radioButton, selectedPaymentMethod === method.id && styles.radioButtonSelected]}>{selectedPaymentMethod === method.id && <View style={styles.radioButtonInner} />}</View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>{renderPaymentMethods()}</ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment} disabled={isProcessing}>
          {isProcessing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.confirmButtonText}>Confirm Payment</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentOptionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  paymentOptionRight: {},
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#E94560",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E94560",
  },
  actionText: {
    color: "#333333",
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  confirmButton: {
    backgroundColor: "#E94560",
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentScreen;
