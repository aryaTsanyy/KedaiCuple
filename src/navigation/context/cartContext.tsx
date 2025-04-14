/** @format */

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCart } from "../../utils/api"; // Import fungsi fetchCart dari utils/api
import api from "../../utils/api";
import { Product } from "../../../types";

type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: readonly CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (product: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const saveCartToBackend = async (updatedCart: CartItem[]) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found. Skipping cart sync.");
        return;
      }

      if (!updatedCart || updatedCart.length === 0) {
        return; // Jangan kirim permintaan jika cart kosong
      }
      const formattedCart = updatedCart.map((item) => ({
        product: item._id, // Gunakan _id sebagai product
        quantity: item.quantity,
      }));

      console.log("Token sent to backend:", token);
      console.log("Cart data sent to backend:", formattedCart);

      await api.post(
        "/cart",
        { items: formattedCart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to save cart to backend:", error);
    }
  };
  useEffect(() => {
    const saveCart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("User is not logged in. Skipping cart sync.");
          return; // Jangan sinkronkan cart jika pengguna belum login
        }

        await AsyncStorage.setItem("cart", JSON.stringify(cart)); // Simpan ke AsyncStorage
        await saveCartToBackend(cart); // Sinkronkan ke backend
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    };
    saveCart();
  }, [cart]);

  const addToCart = (product: CartItem) => {
    if (!product._id || !product.name || !product.price) {
      console.error("Invalid product data:", product);
      return;
    }
    const newProduct: CartItem = { ...product, quantity: 1 };
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item._id === newProduct._id);

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += newProduct.quantity;
        return updatedCart;
      } else {
        return [...prevCart, newProduct];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item._id !== id));
    } else {
      setCart((prev) => prev.map((item) => (item._id === id ? { ...item, quantity } : item)));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return <CartContext.Provider value={{ cart, setCart, addToCart, updateQuantity, clearCart, isLoading }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
