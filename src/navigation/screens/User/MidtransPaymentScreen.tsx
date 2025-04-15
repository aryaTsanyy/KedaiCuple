/** @format */

import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../index";
import { Ionicons } from "@expo/vector-icons";

type MidtransPaymentScreenProps = StackNavigationProp<RootStackParamList, "MidtransPaymentScreen">;
type MidtransPaymentRouteParams = {
  paymentUrl: string;
  orderId: string;
  orderDetails: any;
};

const MidtransPaymentScreen = () => {
  const navigation = useNavigation<MidtransPaymentScreenProps>();
  const route = useRoute();
  const { paymentUrl, orderId, orderDetails } = route.params as MidtransPaymentRouteParams;
  const [isLoading, setIsLoading] = useState(true);

  // Handle WebView navigation state changes
  const handleNavigationStateChange = (navState: any) => {
    // Check if the URL contains success, failure or other Midtrans callback parameters
    const url = navState.url;

    if (url.includes("transaction_status=settlement") || url.includes("transaction_status=capture") || url.includes("transaction_status=success")) {
      // Payment successful
      navigation.replace("OrderSuccessScreen", {
        orderId: orderId,
        orderDetails: orderDetails,
      });
    } else if (url.includes("transaction_status=deny") || url.includes("transaction_status=cancel") || url.includes("transaction_status=failure")) {
      // Payment failed
      navigation.goBack();
      // You can show an alert or navigate to a failure screen
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC335D" />
          <Text style={styles.loadingText}>Loading payment page...</Text>
        </View>
      )}

      <WebView
        source={{ uri: paymentUrl }}
        style={styles.webView}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: "#DC335D",
  },
});

export default MidtransPaymentScreen;
