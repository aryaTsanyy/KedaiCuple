/** @format */

import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg";

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, "Onboarding">;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const { width } = Dimensions.get("window");

const onboardingData = [
  {
    id: "1",
    title: ["Satu ", "Sentuhan "],
    subtitle: ["Semua Menjadi ", "Mudah"],
    description: "Nikmati pengalaman terbaik dengan aplikasi yang dirancang untuk kenyamananmu!",
    image: require("../../../assets/onboarding1.png"),
  },
  {
    id: "2",
    title: ["Pesan ", "Cepat "],
    subtitle: ["Nikmati Lebih ", "Mudah"],
    description: "Temukan menu favoritmu dan lakukan pemesanan dalam hitungan detik!",
    image: require("../../../assets/onboarding2.png"),
  },
  {
    id: "3",
    title: "Bayar Dengan",
    subtitle: [" ", "Mudah", " dan ", "Aman"],
    description: "Tersedia berbagai metode pembayaran untuk kenyamanan transaksimu!",
    image: require("../../../assets/onboarding3.png"),
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef<FlatList>(null);

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  const handleGetStarted = async () => {
    try {
      // Mark that onboarding is completed
      await AsyncStorage.setItem("onboardingCompleted", "true");
      navigation.replace("Login"); // Navigate to Login after onboarding
    } catch (error) {
      console.log("Error saving onboarding status:", error);
    }
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentIndex + 1;
    if (nextSlideIndex != onboardingData.length) {
      const offset = nextSlideIndex * width;
      slideRef?.current?.scrollToOffset({ offset });
      setCurrentIndex(nextSlideIndex);
    } else {
      handleGetStarted();
    }
  };

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <Image source={item.image} style={styles.image} />
        <Image source={require("../../../assets/BGText.png")} style={styles.bgText} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {Array.isArray(item.title)
              ? item.title.map((word, index) =>
                  index % 2 === 1 ? (
                    <Text key={index} style={styles.highlightedText}>
                      {word}
                    </Text>
                  ) : (
                    word
                  )
                )
              : item.title}
            {Array.isArray(item.subtitle)
              ? item.subtitle.map((word, index) =>
                  index % 2 === 1 ? (
                    <Text key={index} style={styles.highlightedText}>
                      {word}
                    </Text>
                  ) : (
                    word
                  )
                )
              : item.subtitle}
          </Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <FlatList ref={slideRef} data={onboardingData} renderItem={renderItem} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={updateCurrentSlideIndex} />
        <View style={styles.sliderbottom}>
          <View style={styles.indicatorContainer}>
            {onboardingData.map((_, index) => (
              <View key={index} style={[styles.indicator, currentIndex === index && styles.activeIndicator]} />
            ))}
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={goToNextSlide}>
            <Text style={styles.nextButtonText}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M14.4301 18.8201C14.2401 18.8201 14.0501 18.7501 13.9001 18.6001C13.6101 18.3101 13.6101 17.8301 13.9001 17.5401L19.4401 12.0001L13.9001 6.46012C13.6101 6.17012 13.6101 5.69012 13.9001 5.40012C14.1901 5.11012 14.6701 5.11012 14.9601 5.40012L21.0301 11.4701C21.3201 11.7601 21.3201 12.2401 21.0301 12.5301L14.9601 18.6001C14.8101 18.7501 14.6201 18.8201 14.4301 18.8201Z"
                  fill="white"
                />
                <Path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="white" />
              </Svg>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    fontFamily: "Manrope-Bold",
    display: "flex",
    backgroundColor: "#DC335D",
    height: "100%",
    justifyContent: "flex-end",
    gap: 30,
  },
  slide: {
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 0,
    height: "100%",
    width: "100%",
  },
  image: {
    width: "85%",
    position: "absolute",
    bottom: "-20%",
    zIndex: 1,
    height: "100%",
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 40,
    position: "relative",
    width: "100%",
    display: "flex",
    gap: 10,
    zIndex: 3,
    marginBottom: 28,
    flexDirection: "column",
  },
  title: {
    fontSize: 28,
    width: "82%",
    lineHeight: 28,
    fontFamily: "Manrope-Bold",
    fontWeight: "bold",
    textAlign: "center",
  },
  bgText: {
    zIndex: 2,
    bottom: "-16%",
    resizeMode: "cover",
    position: "absolute",
    width: "100%",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  highlightedText: {
    color: "#FF4B83",
  },
  description: {
    width: "70%",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "medium",
    color: "#666666",
  },
  bottomContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "auto",
    zIndex: 3,
    position: "relative",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  sliderbottom: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeIndicator: {
    backgroundColor: "#FF4B83",
    width: 20,
  },
  nextButton: {
    width: 50,
    height: 50,
    backgroundColor: "#FF4B83",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 24,
  },
});

export default OnboardingScreen;
