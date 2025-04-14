/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainTabParamList } from "../../Maintabs";
import { fetchProductsByCategory, fetchCategories, fetchProducts } from "../../../utils/api";
import { Product, Category } from "../../../../types";
import Svg, { Path } from "react-native-svg";
import { RootStackParamList } from "../../index";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigation = useNavigation<NavigationProp>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("koleksi-cuple");
  const [loading, setLoading] = useState<boolean>(true);

  const goToOrderTracker = () => {
    // Bisa kirim orderId dummy atau real, tapi bisa juga ubah param jadi optional di RootStackParamList
    navigation.navigate("OrderTrackerScreen", { orderId: "123" });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await fetchCategories();
        const hasKoleksiCuple = fetchedCategories.some((category) => category.slug === "koleksi-cuple");
        setCategories(hasKoleksiCuple ? fetchedCategories : [{ _id: "koleksi-cuple", name: "Koleksi Cuple", slug: "koleksi-cuple" }, ...fetchedCategories]);

        // ambil 3 produk (Koleksi Cuple)
        const fetchedProduct = await fetchProductsByCategory("koleksi-cuple", 3);
        setProducts(fetchedProduct);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryPress = async (slug: string) => {
    setLoading(true);
    try {
      const fetchedProducts = await fetchProductsByCategory(slug, 3); // Kirim slug kategori
      setProducts(fetchedProducts);
      setSelectedCategory(slug);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectProduct = (product: Product) => {
    navigation.navigate("ProductDetail", { product });
  };
  const handleAddToCart = (product: Product) => {
    /* buaat nambah ke kranjang nanti */
    console.log("Added to cart:", product.name);
  };

  const ImgDeliv = require("../../../assets/rafiki.png");
  const ImgPick = require("../../../assets/amico.png");

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <TouchableOpacity style={styles.iconTop}>
                  <Image source={require("../../../assets/notification.png")} style={styles.notifIcon} />
                </TouchableOpacity>
                <View style={styles.locationContainer}>
                  <Text>📍 Sumbang, Ind</Text>
                </View>
                <TouchableOpacity style={styles.iconTop} onPress={goToOrderTracker}>
                  <Image source={require("../../../assets/note.png")} style={styles.notifIcon} />
                </TouchableOpacity>
              </View>

              <View style={styles.pointsCard}>
                <Image source={require("../../../assets/vectorPoint.png")} style={styles.bgPoint} />
                <View>
                  <Text style={styles.pointsTitle}>My Points</Text>
                  <Text style={styles.pointsTitle}>12 Point</Text>
                </View>
              </View>

              <View style={styles.productsHeader}>
                <Text style={styles.productHeaderText}>Menu Kami</Text>
                <TouchableOpacity onPress={() => navigation.navigate("MainTab", { screen: "Menu" })} style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>Lihat Semua</Text>
                  <Svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                    <Path
                      d="M8.89995 5.99999C8.89995 6.34999 8.76495 6.69999 8.49995 6.96499L5.23995 10.225C5.09495 10.37 4.85495 10.37 4.70995 10.225C4.56495 10.08 4.56495 9.83999 4.70995 9.69499L7.96995 6.43499C8.20995 6.19499 8.20995 5.80499 7.96995 5.56499L4.70995 2.30499C4.56495 2.15999 4.56495 1.91999 4.70995 1.77499C4.85495 1.62999 5.09495 1.62999 5.23995 1.77499L8.49995 5.03499C8.76495 5.29999 8.89995 5.64999 8.89995 5.99999Z"
                      fill="#ADADAD"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.categoryButton, selectedCategory == item.slug && styles.selectedCategoryButton]} onPress={() => handleCategoryPress(item.slug)}>
                    <Text style={[styles.categoryText, selectedCategory == item.slug && styles.selectedCategoryText]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
              />
            </>
          }
          data={products}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard} onPress={() => handleSelectProduct(item)}>
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>Rp {item.price.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          ListFooterComponent={
            <>
              <View style={styles.fiturContainer}>
                <Text style={styles.fiturTitle}>Ingin Pesan Langsung?</Text>
                <View style={styles.fiturType}>
                  <TouchableOpacity style={styles.fiturItem}>
                    <Image source={ImgPick} style={styles.fiturImg} />
                    <Text style={styles.fiturSubTitle}>Pick Up</Text>
                    <Text style={styles.fiturDesc}>Ambil di Tempat tanpa antri</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.fiturItem}>
                    <Image source={ImgDeliv} style={styles.fiturImg} width={81} />
                    <Text style={styles.fiturSubTitle}>Delivery</Text>
                    <Text style={styles.fiturDesc}>Siap Antar ke Lokasimu</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.whatsappContainer}>
                <Text style={styles.textWA}>Butuh Bantuan?</Text>
                <TouchableOpacity style={styles.WAContent}>
                  <View style={styles.iconWAContainer}>
                    <Svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <Path
                        d="M28.5749 7.36502C27.1995 5.97618 25.5615 4.87497 23.7562 4.12556C21.9509 3.37616 20.0146 2.99354 18.0599 3.00002C9.86995 3.00002 3.19495 9.67502 3.19495 17.865C3.19495 20.49 3.88495 23.04 5.17495 25.29L3.07495 33L10.95 30.93C13.125 32.115 15.57 32.745 18.0599 32.745C26.2499 32.745 32.925 26.07 32.925 17.88C32.925 13.905 31.3799 10.17 28.5749 7.36502ZM18.0599 30.225C15.8399 30.225 13.665 29.625 11.76 28.5L11.3099 28.23L6.62995 29.46L7.87495 24.9L7.57495 24.435C6.34127 22.4656 5.68634 20.1889 5.68495 17.865C5.68495 11.055 11.235 5.50502 18.0449 5.50502C21.3449 5.50502 24.4499 6.79502 26.775 9.13502C27.9264 10.2808 28.8388 11.6438 29.4594 13.145C30.0799 14.6462 30.3962 16.2556 30.3899 17.88C30.42 24.69 24.8699 30.225 18.0599 30.225ZM24.8399 20.985C24.4649 20.805 22.6349 19.905 22.3049 19.77C21.9599 19.65 21.7199 19.59 21.465 19.95C21.2099 20.325 20.5049 21.165 20.2949 21.405C20.0849 21.66 19.8599 21.69 19.4849 21.495C19.1099 21.315 17.9099 20.91 16.4999 19.65C15.3899 18.66 14.655 17.445 14.4299 17.07C14.2199 16.695 14.3999 16.5 14.5949 16.305C14.7599 16.14 14.97 15.87 15.15 15.66C15.33 15.45 15.405 15.285 15.525 15.045C15.645 14.79 15.5849 14.58 15.4949 14.4C15.405 14.22 14.6549 12.39 14.3549 11.64C14.0549 10.92 13.74 11.01 13.515 10.995H12.7949C12.5399 10.995 12.15 11.085 11.8049 11.46C11.4749 11.835 10.515 12.735 10.515 14.565C10.515 16.395 11.85 18.165 12.03 18.405C12.21 18.66 14.655 22.41 18.3749 24.015C19.2599 24.405 19.9499 24.63 20.49 24.795C21.3749 25.08 22.1849 25.035 22.83 24.945C23.5499 24.84 25.0349 24.045 25.3349 23.175C25.6499 22.305 25.65 21.57 25.545 21.405C25.44 21.24 25.2149 21.165 24.8399 20.985Z"
                        fill="#3AAB47"
                      />
                    </Svg>
                    <View>
                      <Text style={styles.whatsappText}>
                        Admin Care Shop
                        <Text style={styles.whatsappTextmore}> (chat only)</Text>
                      </Text>
                      <Text style={styles.whatsappNumber}>0822-4346-7890</Text>
                    </View>
                  </View>
                  <View style={styles.iconArrowWA}>
                    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <Path
                        d="M12.6 8.99998C12.6 9.52498 12.3975 10.05 12 10.4475L7.10998 15.3375C6.89248 15.555 6.53248 15.555 6.31498 15.3375C6.09748 15.12 6.09748 14.76 6.31498 14.5425L11.205 9.65249C11.565 9.29249 11.565 8.70748 11.205 8.34748L6.31498 3.45749C6.09748 3.23999 6.09748 2.87999 6.31498 2.66249C6.53248 2.44499 6.89248 2.44499 7.10998 2.66249L12 7.55248C12.3975 7.94998 12.6 8.47498 12.6 8.99998Z"
                        fill="#ADADAD"
                      />
                    </Svg>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsCard: {
    backgroundColor: "#DC335D",
    margin: 15,
    padding: 20,
    height: 143,
    borderRadius: 10,
  },
  pointsTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  notifIcon: {
    width: 24,
    height: 24,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  productHeaderText: {
    fontSize: 20,
    fontFamily: "Manrope-SemiBold",
    color: "#292D32",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: "#ADADAD",
    marginRight: 5,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  productsContainer: {
    padding: 15,
  },
  iconTop: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: "100%",
  },
  bgPoint: {
    resizeMode: "cover",
    width: 248,
    right: -60,
    position: "absolute",
    height: 186,
  },
  selectedCategoryButton: {
    backgroundColor: "#DC335D",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 100,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    color: "#292D32",
    fontFamily: "Manrope-Medium",
  },
  selectedCategoryText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Manrope-Medium",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#FF4B83",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#FF4B83",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 20,
  },
  whatsappContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 15,
    gap: 14,
    marginBottom: 80,
  },
  textWA: {
    fontSize: 16,
    fontFamily: "Manrope-SemiBold",
    color: "#292D32",
  },
  WAContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    width: "100%",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(173, 173, 173, 0.20)",
    borderRadius: 10,
    justifyContent: "space-between",
  },
  iconWAContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
  iconArrowWA: {
    alignItems: "center",
    justifyContent: "center",
  },
  whatsappText: {
    fontFamily: "Manrope-SemiBold",
    fontSize: 14,
    color: "#000000",
  },
  whatsappTextmore: {
    fontFamily: "Manrope-SemiBold",
    fontSize: 14,
    color: "#ADADAD",
  },
  whatsappNumber: {
    fontSize: 16,
    fontFamily: "Manrope-SemiBold",
    color: "#DC335D",
    marginTop: 5,
  },
  fiturContainer: {
    padding: 15,
  },
  fiturTitle: {
    fontSize: 16,
    fontWeight: "semibold",
    marginBottom: 10,
  },
  fiturSubTitle: {
    marginTop: 15,
    fontSize: 14,
    fontFamily: "Manrope-SemiBold",
    color: "#000",
  },
  fiturDesc: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: "Manrope-Medium",
    color: "#ADADAD",
    textAlign: "center",
    width: "68%",
  },
  fiturType: {
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 21,
    justifyContent: "space-between",
  },
  fiturImg: {
    height: 60,
    resizeMode: "contain",
  },
  fiturItem: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(173, 173, 173, 0.20)",
    flex: 1,
  },
});
