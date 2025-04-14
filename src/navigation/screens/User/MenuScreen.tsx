/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { fetchCategories, fetchProducts, fetchFeaturedProducts } from "../../../utils/api";
import { Product, Category } from "../../../../types";
import { RootStackParamList } from "../../index";
import Svg, { Path } from "react-native-svg";
import { useCart } from "../../context/cartContext";

export default function MenuScreen() {
  const { cart } = useCart();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories();
        setCategories([{ _id: "all", name: "All Menu", slug: "all-menu" }, ...categoriesData]);

        // Initially load featured products (Koleksi Cuple)
        const allProducts = await fetchProducts("");
        setProducts(allProducts);
        setSelectedCategory("all-menu");
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryPress = async (categoryId: string, slug: string) => {
    setLoading(true);
    try {
      let fetchedProducts;
      if (slug === "all-menu") {
        fetchedProducts = await fetchProducts(""); // Fetch all products
      } else if (slug === "koleksi-cuple") {
        fetchedProducts = await fetchFeaturedProducts();
      } else {
        fetchedProducts = await fetchProducts(categoryId);
      }
      setProducts(fetchedProducts);
      setSelectedCategory(slug);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, priceRange?: { min: number; max: number }) => {
    if (priceRange) {
      return `Rp. ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}`;
    }
    return `Rp. ${price.toLocaleString()}`;
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={[styles.categoryButton, selectedCategory === item.slug ? styles.selectedCategory : null]} onPress={() => handleCategoryPress(item._id, item.slug)}>
      <Text style={[styles.categoryText, selectedCategory === item.slug ? styles.selectedCategoryText : null]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => navigation.navigate("ProductDetail", { product: { ...item, id: item._id, image: item.imageUrl } })}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#888" />
          </TouchableOpacity>
        </View>
        <Text style={styles.productDescription}>{item.description}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{formatPrice(item.price, item.priceRange)}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
          <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Path
              d="M12.3183 16.6996C12.1715 16.6996 12.0246 16.6456 11.9087 16.5296L6.87054 11.4915C6.05145 10.6724 6.05145 9.32783 6.87054 8.50874L11.9087 3.47056C12.1328 3.24647 12.5037 3.24647 12.7278 3.47056C12.9519 3.69465 12.9519 4.06556 12.7278 4.28965L7.68963 9.32783C7.31873 9.69874 7.31873 10.3015 7.68963 10.6724L12.7278 15.7106C12.9519 15.9346 12.9519 16.3056 12.7278 16.5296C12.6119 16.6378 12.4651 16.6996 12.3183 16.6996Z"
              fill="#292D32"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <TouchableOpacity style={styles.buttonBack}>
          <Svg width="20" height="18" viewBox="0 0 14 12" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.84819 1.21195C1.76791 1.69792 0.976744 2.85449 0.976744 4.23353C0.976744 5.64206 1.56279 6.72811 2.40149 7.65901C3.09367 8.42578 3.93107 9.06177 4.74763 9.68109C4.94211 9.82854 5.1342 9.97557 5.32391 10.1222C5.66642 10.3882 5.97181 10.621 6.26679 10.7909C6.56177 10.9608 6.79814 11.0377 7 11.0377C7.20186 11.0377 7.43888 10.9608 7.73321 10.7909C8.02819 10.621 8.33358 10.3882 8.67609 10.1222C8.8658 9.97514 9.05789 9.82833 9.25237 9.68173C10.0689 9.06113 10.9063 8.42578 11.5985 7.65901C12.4379 6.72811 13.0233 5.64206 13.0233 4.23353C13.0233 2.85513 12.2321 1.69792 11.1518 1.21195C10.1021 0.739448 8.69172 0.864466 7.35163 2.23581C7.30607 2.28235 7.25145 2.31936 7.19104 2.34465C7.13062 2.36993 7.06565 2.38296 7 2.38296C6.93435 2.38296 6.86938 2.36993 6.80896 2.34465C6.74855 2.31936 6.69393 2.28235 6.64837 2.23581C5.30828 0.864466 3.89786 0.739448 2.84819 1.21195ZM7 1.23503C5.49451 -0.0920785 3.80865 -0.278002 2.44186 0.336828C1.00019 0.98756 0 2.49546 0 4.23417C0 5.94274 0.722791 7.24677 1.67153 8.2982C2.43079 9.13998 3.36 9.84457 4.18112 10.4665C4.36778 10.6075 4.54707 10.7447 4.71898 10.878C5.05302 11.1371 5.41116 11.4127 5.77386 11.6217C6.13656 11.8307 6.5507 12 7 12C7.4493 12 7.86344 11.8301 8.22614 11.6217C8.58949 11.4127 8.94698 11.1371 9.28102 10.878C9.45293 10.7447 9.63222 10.6075 9.81888 10.4665C10.6393 9.84457 11.5692 9.13934 12.3285 8.2982C13.2772 7.24677 14 5.94274 14 4.23417C14 2.49546 13.0005 0.98756 11.5581 0.33811C10.1913 -0.277361 8.50549 -0.0914375 7 1.23503Z"
              fill="black"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <FlatList horizontal data={categories} renderItem={renderCategory} keyExtractor={(item) => item._id} style={styles.categoryList} showsHorizontalScrollIndicator={false} />
      {cart.length > 0 && (
        <TouchableOpacity style={styles.floatingCartButton} onPress={() => navigation.navigate("MainTab", { screen: "Cart" })}>
          <Ionicons name="cart" size={24} color="white" />
          <Text style={styles.cartText}>{cart.length}</Text>
        </TouchableOpacity>
      )}

      <FlatList data={products} renderItem={renderProduct} keyExtractor={(item) => item._id} style={styles.productList} showsVerticalScrollIndicator={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingBottom: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope-SemiBold",
  },
  buttonBack: {
    borderRadius: "100%",
    padding: 10,
    borderWidth: 0.773,
    borderColor: "#D9D9D9",
  },
  categoryList: {
    marginVertical: 10,
    marginHorizontal: 16,
    maxHeight: 50,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
    backgroundColor: "#f0f0f0",
  },
  selectedCategory: {
    backgroundColor: "#f84f6e",
  },
  categoryText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Manrope-Medium",
    fontWeight: "medium",
  },
  selectedCategoryText: {
    color: "#fff",
    fontFamily: "Manrope-Medium",
    fontWeight: "medium",
  },
  productList: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 50,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productDescription: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#f84f6e",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopColor: "#eee",
    borderTopWidth: 1,
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: 5,
  },
  tabItemActive: {
    borderBottomColor: "#f84f6e",
    borderBottomWidth: 2,
  },
  floatingCartButton: {
    position: "absolute",
    right: 20,
    bottom: 90, // Di atas floating navbar (ubah sesuai posisi navbar-mu)
    backgroundColor: "#000",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
  },
  cartText: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 12,
  },
});
