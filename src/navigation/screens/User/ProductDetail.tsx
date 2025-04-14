/** @format */

import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../index";
import Svg, { Path } from "react-native-svg";
import { useCart } from "../../context/cartContext";

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

export default function ProductDetailScreen({ route }: { route: ProductDetailScreenRouteProp }) {
  const { product } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [quantity, setQuantity] = useState(1);
  const [selectedIceOption, setSelectedIceOption] = useState("Normal Ice");
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    const productWithQuantity = {
      ...product, // object produk dari detail screen
      quantity: quantity, // ini state quantity user pilih
    };

    addToCart(productWithQuantity);
    navigation.navigate("MainTab", { screen: "Menu" });
  };

  /* // Set default values if not provided
  const rating = product.rating || 4.4;
  const category = product.category || "Minuman";
  const isBestSeller = product.isBestSeller !== undefined ? product.isBestSeller : true; */

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const renderIceOption = (option: string) => {
    const isSelected = selectedIceOption === option;

    return (
      <View style={styles.iceOptionRow} key={option}>
        <Text style={[styles.iceOptionText, isSelected ? styles.selectedIceOptionText : {}]}>{option}</Text>
        <TouchableOpacity style={[styles.radioButton, isSelected ? styles.radioButtonSelected : {}]} onPress={() => setSelectedIceOption(option)}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
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

        <TouchableOpacity>
          <View style={styles.iconHeader}>
            <Svg width="20" height="18" viewBox="0 0 14 12" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.84819 1.21195C1.76791 1.69792 0.976744 2.85449 0.976744 4.23353C0.976744 5.64206 1.56279 6.72811 2.40149 7.65901C3.09367 8.42578 3.93107 9.06177 4.74763 9.68109C4.94211 9.82854 5.1342 9.97557 5.32391 10.1222C5.66642 10.3882 5.97181 10.621 6.26679 10.7909C6.56177 10.9608 6.79814 11.0377 7 11.0377C7.20186 11.0377 7.43888 10.9608 7.73321 10.7909C8.02819 10.621 8.33358 10.3882 8.67609 10.1222C8.8658 9.97514 9.05789 9.82833 9.25237 9.68173C10.0689 9.06113 10.9063 8.42578 11.5985 7.65901C12.4379 6.72811 13.0233 5.64206 13.0233 4.23353C13.0233 2.85513 12.2321 1.69792 11.1518 1.21195C10.1021 0.739448 8.69172 0.864466 7.35163 2.23581C7.30607 2.28235 7.25145 2.31936 7.19104 2.34465C7.13062 2.36993 7.06565 2.38296 7 2.38296C6.93435 2.38296 6.86938 2.36993 6.80896 2.34465C6.74855 2.31936 6.69393 2.28235 6.64837 2.23581C5.30828 0.864466 3.89786 0.739448 2.84819 1.21195ZM7 1.23503C5.49451 -0.0920785 3.80865 -0.278002 2.44186 0.336828C1.00019 0.98756 0 2.49546 0 4.23417C0 5.94274 0.722791 7.24677 1.67153 8.2982C2.43079 9.13998 3.36 9.84457 4.18112 10.4665C4.36778 10.6075 4.54707 10.7447 4.71898 10.878C5.05302 11.1371 5.41116 11.4127 5.77386 11.6217C6.13656 11.8307 6.5507 12 7 12C7.4493 12 7.86344 11.8301 8.22614 11.6217C8.58949 11.4127 8.94698 11.1371 9.28102 10.878C9.45293 10.7447 9.63222 10.6075 9.81888 10.4665C10.6393 9.84457 11.5692 9.13934 12.3285 8.2982C13.2772 7.24677 14 5.94274 14 4.23417C14 2.49546 13.0005 0.98756 11.5581 0.33811C10.1913 -0.277361 8.50549 -0.0914375 7 1.23503Z"
                fill="black"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.productImage} resizeMode="contain" />
      </View>
      <ScrollView style={styles.productContainer}>
        {/* Product Details */}
        <View style={styles.productDetailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.tagsContainer}>
            {/* {isBestSeller && (
              <View style={styles.bestSellerTag}>
                <Text style={styles.bestSellerText}>Best Seller</Text>
              </View>
            )} */}
            <Text style={styles.metaText}>Minuman, Rekomendasi, Under 10k</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Kategori</Text>
              {/* <Text style={styles.infoValue}>{category}</Text> */}
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Rating</Text>
              {/* <Text style={styles.infoValue}>{rating}</Text> */}
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Harga</Text>
              <Text style={styles.infoValue}>Rp. {product.price.toLocaleString()}</Text>
            </View>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Pilihan Tersedia</Text>

            <View style={styles.optionTypeContainer}>
              <View style={styles.optionTypeIcon}>
                <Svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                  <Path
                    d="M19.0534 5.55998C19.0531 5.10858 18.9001 4.67054 18.6193 4.31711C18.3385 3.96368 17.9464 3.71564 17.5067 3.61332L17.0001 1.77332C16.9078 1.47567 16.7214 1.21599 16.469 1.03328C16.2166 0.850558 15.9117 0.754661 15.6001 0.759984H4.38674C4.0764 0.753172 3.77245 0.848716 3.52183 1.03186C3.27121 1.21501 3.08785 1.47558 3.00007 1.77332L2.4934 3.61332C2.03809 3.72891 1.63617 3.99712 1.35471 4.37322C1.07324 4.74931 0.929244 5.21055 0.946738 5.67998C0.946494 6.10582 1.08401 6.5203 1.33874 6.86154C1.59346 7.20279 1.95175 7.45247 2.36007 7.57332L2.4934 11.2667C2.27993 11.3013 2.08344 11.4042 1.9334 11.56C1.83929 11.6595 1.76603 11.7768 1.71795 11.905C1.66986 12.0333 1.64792 12.1698 1.6534 12.3067L1.9734 19.9867C1.98338 20.2226 2.07543 20.4476 2.23367 20.6229C2.39191 20.7982 2.60639 20.9127 2.84007 20.9466L2.94674 23.9067C2.97453 24.8027 3.35101 25.6525 3.99602 26.2751C4.64103 26.8977 5.50361 27.2439 6.40007 27.24H13.5867C14.4855 27.2474 15.3515 26.9027 15.9993 26.2798C16.6472 25.6568 17.0256 24.805 17.0534 23.9067L17.1601 20.9466C17.3913 20.9099 17.6027 20.7941 17.7583 20.6191C17.9138 20.4441 18.004 20.2206 18.0134 19.9867L18.3334 12.3067C18.3389 12.1698 18.3169 12.0333 18.2689 11.905C18.2208 11.7768 18.1475 11.6595 18.0534 11.56C17.9087 11.4044 17.7164 11.3012 17.5067 11.2667L17.6401 7.57332C18.0622 7.43645 18.4283 7.16604 18.6832 6.80286C18.9382 6.43969 19.0681 6.00346 19.0534 5.55998ZM4.38674 2.09332L15.7067 2.13332L16.1067 3.55998H3.92007L4.38674 2.09332ZM15.7201 23.8666C15.7027 24.4184 15.4694 24.9412 15.0704 25.3227C14.6715 25.7042 14.1387 25.9139 13.5867 25.9067H6.40007C5.84991 25.9121 5.31957 25.7014 4.92312 25.32C4.52667 24.9385 4.29576 24.4166 4.28007 23.8666L4.1734 20.96H15.8267L15.7201 23.8666ZM7.20007 16.1067C7.20007 15.5529 7.36429 15.0115 7.67196 14.5511C7.97962 14.0906 8.41692 13.7317 8.92856 13.5198C9.44019 13.3079 10.0032 13.2524 10.5463 13.3605C11.0895 13.4685 11.5884 13.7352 11.98 14.1268C12.3716 14.5183 12.6382 15.0173 12.7463 15.5604C12.8543 16.1035 12.7989 16.6665 12.5869 17.1782C12.375 17.6898 12.0161 18.1271 11.5557 18.4348C11.0952 18.7424 10.5539 18.9067 10.0001 18.9067C9.25746 18.9067 8.54527 18.6117 8.02017 18.0865C7.49507 17.5614 7.20007 16.8493 7.20007 16.1067ZM16.1734 11.24H3.82674L3.6934 7.67998H16.2934L16.1734 11.24ZM17.0534 6.34665H2.94674C2.84953 6.3438 2.75401 6.32054 2.66639 6.27836C2.57876 6.23619 2.50098 6.17606 2.43811 6.10187C2.37524 6.02768 2.32868 5.9411 2.30145 5.84774C2.27422 5.75438 2.26694 5.65634 2.28007 5.55998C2.28007 5.38317 2.35031 5.2136 2.47533 5.08858C2.60036 4.96356 2.76993 4.89332 2.94674 4.89332H17.0534C17.1499 4.89815 17.2444 4.92274 17.3311 4.96555C17.4177 5.00836 17.4947 5.06849 17.5572 5.14222C17.6196 5.21596 17.6663 5.30172 17.6944 5.39422C17.7224 5.48671 17.7311 5.58397 17.7201 5.67998C17.7201 5.8568 17.6498 6.02636 17.5248 6.15139C17.3998 6.27641 17.2302 6.34665 17.0534 6.34665Z"
                    fill="#DC335D"
                  />
                </Svg>
              </View>
              <Text style={styles.optionTypeText}>Iced</Text>
            </View>

            <View style={styles.iceOptionsContainer}>
              <View style={styles.iceOptionsHeader}>
                <Text style={styles.iceOptionsTitle}>Ice Cube</Text>
                <Text style={styles.iceOptionsRequired}>Wajib, Pilih 1</Text>
              </View>

              {renderIceOption("Normal Ice")}
              {renderIceOption("Less Ice")}
              {renderIceOption("More Ice")}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Quantity and Add to Cart */}
      <View style={styles.actionContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity style={[styles.quantityButton, styles.increaseButton]} onPress={increaseQuantity}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  header: {
    position: "absolute",
    zIndex: 100,
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  backButton: {
    borderRadius: 100,
    borderWidth: 0.77,
    padding: 10,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  iconHeader: {
    borderRadius: 100,
    borderWidth: 0.77,
    padding: 10,
    borderColor: "#D9D9D9",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonText: {
    fontSize: 20,
  },
  imageContainer: {
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
  },
  productImage: {
    width: 400,
    height: 400,
  },
  productContainer: {
    flex: 1,
    zIndex: 10,
    bottom: 0,
    position: "relative",
    paddingTop: 300,
  },
  productDetailsContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 100,
  },
  productName: {
    fontSize: 22,
    fontFamily: "Manrope-SemiBold",
    fontWeight: "bold",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  bestSellerTag: {
    backgroundColor: "#DC335D",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  bestSellerText: {
    color: "white",
    fontWeight: "bold",
  },
  metaText: {
    fontFamily: "Manrope-Medium",
    fontSize: 14,
    color: "#adadad",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    color: "#adadad",
    fontFamily: "Manrope-Medium",
    fontSize: 14,
    marginBottom: 5,
  },
  infoValue: {
    fontWeight: "bold",
    fontSize: 16,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  optionTypeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFEBEE",
    padding: 15,
    gap: 8,
    borderRadius: 15,
    width: 80,
    marginBottom: 20,
  },
  optionTypeIcon: {
    alignItems: "center",
  },
  optionTypeText: {
    color: "#DC335D",
    fontFamily: "Manrope-SemiBold",
    textAlign: "center",
  },
  iceOptionsContainer: {
    marginBottom: 20,
  },
  iceOptionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  iceOptionsTitle: {
    fontSize: 18,
    fontFamily: "Manrope-SemiBold",
    color: "#000",
  },
  iceOptionsRequired: {
    color: "#adadad",
    fontFamily: "Manrope-Medium",
  },
  iceOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 12,
    gap: 8,
    marginBottom: 15,
  },
  iceOptionText: {
    fontSize: 16,
  },
  selectedIceOptionText: {
    color: "#DC335D",
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: "#DC335D",
  },
  radioButtonInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#DC335D",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 20,
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  increaseButton: {
    backgroundColor: "#DC335D",
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  addToCartButton: {
    flex: 1,
    height: 50,
    backgroundColor: "#DC335D",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
