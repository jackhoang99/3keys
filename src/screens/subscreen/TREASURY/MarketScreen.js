import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getKeysCollected,
  fetchDealFromTable,
} from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js";
import { useGameState } from "/Users/jackhoang/Desktop/threekeys/src/utils/GameStateContext.js";
import { supabase } from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js";

const TreasuryMarketScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook to get the selected city parameter
  const { city } = route.params; // Destructure to get city from the parameters

  const [userKeys, setUserKeys] = useState(0);
  const { userId } = useGameState();
  const [deals, setDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    const fetchKeysAndDeals = async () => {
      if (userId) {
        const keysCollected = await getKeysCollected(userId);
        setUserKeys(keysCollected);
      }

      const fetchedDeals = await fetchDealFromTable(); // Fetch all deals
      const filteredDeals = fetchedDeals.filter((deal) => deal.city === city); // Filter for the selected city
      setDeals(filteredDeals); // Set the filtered deals in the state
    };

    // Function to group deals by city
    const groupDealsByCity = (dealsArray) => {
      const grouped = dealsArray.reduce((acc, deal) => {
        (acc[deal.city] = acc[deal.city] || []).push(deal);
        return acc;
      }, {});
      setGroupedDeals(grouped); // Update the state with the grouped deals
    };
    fetchKeysAndDeals();
  }, [userId, city]);

  useEffect(() => {
    if (searchTerm) {
      const results = deals.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDeals(results);
    } else {
      // Reset the deals when the search term is cleared
    }
  }, [searchTerm]);

  const handleRedeemDeal = async (deal) => {
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

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{deals.title}</Text>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="explore your rewards"
          />
          <MaterialCommunityIcons name="magnify" size={24} color="black" />
        </View>
        <TouchableOpacity style={styles.keysCounter}>
          <MaterialCommunityIcons name="key-variant" size={24} color="black" />
          <Text style={styles.keysCount}>{userKeys}</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderFooter = () => (
    <TouchableOpacity
      style={styles.enlightenButton}
      onPress={() => navigation.navigate("SubScreen")}
    >
      <Text style={styles.enlightenButtonText}>
        Want more out of 3 Keys? Click below to view memberships.
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dealItem}
      onPress={() =>
        navigation.navigate("DealsDetails", {
          deal: item,
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      <View style={styles.dealContent}>
        <Text style={styles.dealTitle}>{item.title}</Text>
        <Text style={styles.dealDescription}>{item.description}</Text>
        <Text style={styles.offerText}>
          {item.offer} - {item.keys} Keys
        </Text>
        {item.popular && <Text style={styles.popularBadge}>Popular</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={deals}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  keysCount: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },

  searchBar: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
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
  },
  dealItem: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dealImage: {
    width: "100%",
    height: 150, // Adjust the size as needed
  },
  dealContent: {
    padding: 10,
  },
  dealTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  dealDescription: {
    color: "gray",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    // Add styles for the rating container
  },
  offerText: {
    fontWeight: "bold",
    // Add styles for offer text
  },
  popularBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "orange",
    color: "white",
    borderRadius: 5,
    padding: 5,
    fontSize: 12,
  },

  enlightenButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  enlightenButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default TreasuryMarketScreen;
