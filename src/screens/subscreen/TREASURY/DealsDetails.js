import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGameState } from "../../../utils/GameStateContext";
import { supabase, getKeysCollected } from "../../../services/supabase.js";
import * as Location from "expo-location";
import Loader from "../../../utils/loader";

const DealDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { deal } = route.params;
  const [userKeys, setUserKeys] = useState(0);
  const [dealHistory, setDealHistory] = useState(deal.history);
  const { userId } = useGameState();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Opening map to location..."
  );

  const destinations = [
    {
      coordinates: {
        latitude: deal.lat,
        longitude: deal.long,
      },
    },
  ];

  const redeemDeal = async (userKeys, deal, userId, setUserKeys) => {
    Alert.alert(
      "Redeem Offer",
      `Are you sure you want to spend ${deal.keys} keys on this offer?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            if (userKeys < deal.keys) {
              Alert.alert(
                "Not enough keys",
                "You do not have enough keys to redeem this offer."
              );
              return;
            }

            const newKeyCount = userKeys - deal.keys;
            setUserKeys(newKeyCount);

            const { error } = await supabase
              .from("users")
              .update({ keys_collected: newKeyCount })
              .eq("id", userId);

            if (error) {
              Alert.alert("Error", "Unable to update keys in the database.");
            } else {
              const promoCode = Math.random()
                .toString(36)
                .substr(2, 9)
                .toUpperCase();
              Alert.alert("Promo Code", `Your promo code is: ${promoCode}`);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    const fetchAndUpdateKeys = async () => {
      const keysCollected = await getKeysCollected(userId);
      setUserKeys(keysCollected);
    };

    if (userId) {
      fetchAndUpdateKeys();
    }
  }, [userId, setUserKeys]);

  const handleRedeemDeal = async () => {
    redeemDeal(userKeys, deal, userId, setUserKeys);
  };

  const currentlocation = async () => {
    setLoading(true); // Start loading
    setLoadingMessage("Opening map to location...");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Cannot access the location");
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      navigation.navigate("ShopMap", {
        destinationCoordinates: destinations[0].coordinates,
        originCoordinates: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        location_name: deal.title,
      });
    } catch (error) {
      Alert.alert(
        "Location error",
        "Could not get location. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.keysCounter}>
          <MaterialCommunityIcons name="key-variant" size={24} color="black" />
          <Text style={styles.keysCount}>{userKeys}</Text>
        </View>
      </View>
      <Image source={{ uri: deal.shop_image }} style={styles.dealImage} />
      <View style={styles.content}>
        <Text style={styles.title}>{deal.title}</Text>
        <Text style={styles.description}>{deal.description}</Text>
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>History</Text>
          <ScrollView
            style={styles.historyScrollView}
            contentContainerStyle={styles.historyScrollContent}
          >
            <Text style={styles.historyText}>{dealHistory}</Text>
          </ScrollView>
        </View>
        <TouchableOpacity
          style={styles.redeemButton}
          onPress={handleRedeemDeal}
        >
          <Text style={styles.redeemButtonText}>
            Redeem for {deal.keys} Keys
          </Text>
        </TouchableOpacity>

        <Loader isLoading={loading} message={loadingMessage} />
        <TouchableOpacity style={styles.mapButton} onPress={currentlocation}>
          <Text style={styles.redeemButtonText}>Open Map</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  keysCounter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
  },
  keysCount: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  dealImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "grey",
    marginBottom: 16,
  },
  historyContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  historyScrollView: {
    maxHeight: 150,
  },
  historyScrollContent: {
    flexGrow: 1,
  },
  historyText: {
    fontSize: 18,
    color: "grey",
  },
  redeemButton: {
    backgroundColor: "green",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  mapButton: {
    backgroundColor: "#eabc20",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
});

export default DealDetailsScreen;
