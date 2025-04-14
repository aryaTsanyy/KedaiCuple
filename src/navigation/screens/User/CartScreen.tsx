/** @format */

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useCart } from "../../context/cartContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainTabParamList } from "../../Maintabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { fetchCart } from "../../../utils/api";

type CartScreenNavigationProp = StackNavigationProp<MainTabParamList, "Cart">;

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../index";

const CartScreen = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const route = useNavigation<RootStackParamList>();

  const { cart, setCart, isLoading, updateQuantity } = useCart();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          return;
        }
        const cartData = await fetchCart(token); // Panggil fungsi fetchCart dari backend
        setCart(cartData); // Simpan data cart ke context
      } catch (error) {
        if (error instanceof Error && error.message === "Cart is empty") {
          console.warn("Cart is empty.");
          setCart([]);
        } else if (error instanceof Error) {
          console.error("Failed to fetch cart from backend:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    };

    loadCart();
  }, []);

  const subtotal = cart.reduce((total, item) => {
    return total + (item.price ?? 0) * (item.quantity ?? 1);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButton}>
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path
                d="M12.3181 16.6995C12.1713 16.6995 12.0245 16.6454 11.9086 16.5295L6.87042 11.4913C6.05133 10.6723 6.05133 9.32771 6.87042 8.50862L11.9086 3.47044C12.1327 3.24635 12.5036 3.24635 12.7277 3.47044C12.9518 3.69453 12.9518 4.06544 12.7277 4.28953L7.68951 9.32771C7.3186 9.69862 7.3186 10.3013 7.68951 10.6723L12.7277 15.7104C12.9518 15.9345 12.9518 16.3054 12.7277 16.5295C12.6118 16.6377 12.465 16.6995 12.3181 16.6995Z"
                fill="#292D32"
              />
            </Svg>
          </View>
        </TouchableOpacity>

        <Text style={styles.header}>Keranjang</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Keranjang Anda kosong.</Text>
          <TouchableOpacity style={styles.addProductButton} onPress={() => navigation.navigate("Menu")}>
            <Text style={styles.addProductButtonText}>Tambah Produk</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>Rp {item.price ? item.price.toLocaleString("id-ID") : "0"}</Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item._id, item.quantity - 1)}>
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item._id, item.quantity + 1)}>
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <TextInput placeholder="Masukkan kode promo..." style={styles.promoInput} />

        <View style={styles.summaryRow}>
          <Text>Sub-Total</Text>
          <Text style={styles.subtotalText}>Subtotal: Rp {subtotal.toLocaleString("id-ID")}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Delivery fee</Text>
          <Text>Rp 0</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Discount</Text>
          <Text>- Rp 0</Text>
        </View>

        <View style={styles.totalRow}>
          <Text>Total Payment</Text>
          <Text style={styles.subtotalText}>Subtotal: Rp {subtotal.toLocaleString("id-ID")}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            const parentNavigation = navigation.getParent();
            parentNavigation?.navigate("CheckoutScreen", { cartItems: cart });
          }}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  backButton: {
    borderRadius: 100,
    borderWidth: 0.77,
    padding: 10,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", alignItems: "center", marginVertical: 16, position: "absolute", left: "53%", transform: [{ translateX: -53 }] },

  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  productImage: { width: 60, height: 80, borderRadius: 8 },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 16, fontWeight: "600" },
  productPrice: { fontSize: 14, color: "#777" },

  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: { fontSize: 18, color: "#777", marginBottom: 16 },
  addProductButton: {
    backgroundColor: "#E91E63",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  addProductButtonText: { color: "#fff", fontWeight: "bold" },
  itemNotesInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
  shippingOption: {
    flexDirection: "row",
    marginBottom: 24,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  quantityButton: {
    backgroundColor: "#F06292",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quantityText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  quantity: { paddingHorizontal: 8 },

  footer: { marginTop: 16 },
  promoInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  subtotalText: {
    fontWeight: "bold",
    color: "#E91E63",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    borderTopWidth: 1,
    paddingTop: 8,
    borderColor: "#ddd",
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#E91E63",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
