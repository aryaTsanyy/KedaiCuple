/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import api, { fetchCart } from "../../../utils/api";
import { CartItem, StoreInfo } from "../../../../types";
import { RootStackParamList } from "../../index";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, "CheckoutScreen">;
type CheckoutScreenRouteProp = RouteProp<RootStackParamList, "CheckoutScreen">;

const CheckoutScreen = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const route = useRoute<CheckoutScreenRouteProp>();
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<"Delivery" | "Pick Up">("Pick Up");
  const [store, setStore] = useState<StoreInfo>({
    name: "Kedai Cuple Manten'e",
    address: "Jl.Tanjlig, Bersole, Karangpucung, Purwokerto Selatan",
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleNotesChange = (id: string, notes: string) => {
    setOrderItems((prevItems) => prevItems.map((item) => (item._id === id ? { ...item, notes } : item)));
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token from AsyncStorage:", token);
        if (!token) {
          console.error("No token found");
          navigation.navigate("Login");
          return;
        }

        console.log("Token sent to backend:", token);

        // Panggil fetchCart dari api.ts
        const cartData = await fetchCart(token);
        console.log("Cart data fetched:", cartData);
        setOrderItems(cartData); // Simpan data ke state
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (id: string, change: number) => {
    setOrderItems((prevItems) => prevItems.map((item) => (item._id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleContinueToPayment = () => {
    navigation.navigate("PaymentScreen", {
      orderItems: orderItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || "", // Kirim notes ke backend
      })),
      store,
      total: calculateTotal(),
    });
  };

  const formatPrice = (price: number) => {
    return `Rp. ${price.toLocaleString("id-ID")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Pickup Location */}
        <Text style={styles.pickupText}>Pick up your order at :</Text>
        <View style={styles.storeInfo}>
          <View style={styles.storeIconContainer}>
            <Ionicons name="storefront-outline" size={24} color="#E94560" />
          </View>
          <View style={styles.storeDetails}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeAddress}>{store.address}</Text>
          </View>
        </View>

        {/* Order List */}
        <Text style={styles.sectionTitle}>Order List</Text>
        {orderItems.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.productCart}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item._id, -1)}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity style={[styles.quantityButton, styles.incrementButton]} onPress={() => handleQuantityChange(item._id, 1)}>
                  <Text style={[styles.quantityButtonText, styles.incrementButtonText]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.sectionTitle}>Custom Pesanan</Text>
              <TextInput style={styles.itemNotesInput} placeholder="Add custom notes (e.g., less sugar, no ice)" placeholderTextColor={"#ADADAD"} value={item.notes || ""} onChangeText={(text) => handleNotesChange(item._id, text)} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinueToPayment}>
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 35,
    paddingBottom: 20,
  },
  productCart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  itemNotesInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    fontSize: 14,
    color: "#333",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  shippingOptions: {
    flexDirection: "row",
    marginBottom: 24,
  },
  shippingOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    alignItems: "center",
  },
  selectedShippingOption: {
    backgroundColor: "#E94560",
    borderColor: "#E94560",
  },
  shippingOptionText: {
    fontWeight: "500",
    color: "#333",
  },
  selectedShippingOptionText: {
    color: "#FFFFFF",
  },
  pickupText: {
    fontSize: 16,
    marginBottom: 12,
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  storeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE5EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 14,
    color: "#888888",
  },
  orderItem: {
    flexDirection: "column",
    marginBottom: 16,
    paddingBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemOptions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  itemOptionText: {
    fontSize: 14,
    color: "#888888",
    marginLeft: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
  },
  incrementButton: {
    backgroundColor: "#E94560",
    borderColor: "#E94560",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  incrementButtonText: {
    color: "#FFFFFF",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  continueButton: {
    backgroundColor: "#E94560",
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CheckoutScreen;
