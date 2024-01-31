import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  fetchDealFromTable,
  fetchCityImage,
} from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TreasuryScreen() {
  const navigation = useNavigation();
  const [cityDeals, setCityDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const groupDealsByCity = async () => {
      const allDeals = await fetchDealFromTable();
      const cityImages = {}; // Object to store city images

      // Get unique city names from all deals
      const cityNames = [...new Set(allDeals.map((deal) => deal.city))];
      // Fetch city images for each unique city
      for (const cityName of cityNames) {
        const details = await fetchCityImage(cityName);
        cityImages[cityName] = details.cityImage; // Store city images by city name
      }

      // Group deals by city and add the city image to each group
      const dealsByCity = allDeals.reduce((acc, deal) => {
        acc[deal.city] = acc[deal.city] || {
          deals: [],
          cityImage: cityImages[deal.city],
        };
        acc[deal.city].deals.push(deal);
        return acc;
      }, {});

      // Create an array from the dealsByCity object
      const dealsData = Object.keys(dealsByCity).map((city) => ({
        city,
        image: dealsByCity[city].cityImage, // Use the city image
        availableDeals: `${dealsByCity[city].deals.length} Available Deals`,
        rating: getAverageRatingForCity(dealsByCity[city].deals),
      }));

      setCityDeals(dealsData);
    };
    groupDealsByCity();
  }, []);

  const renderDealItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.dealCard}
        onPress={() => navigation.navigate("MarketScreen", { city: item.city })}
      >
        {/* Use the city image for the TreasuryScreen */}
        <Image
          source={{ uri: item.image }} // Make sure 'item.image' corresponds to the 'cityImage' property from the object
          style={styles.dealImage}
        />
        <View style={styles.dealInfo}>
          <Text style={styles.dealCity}>{item.city}</Text>
          <Text style={styles.dealAvailable}>{item.availableDeals}</Text>
          <Text style={styles.dealRating}>Average Rating: {item.rating}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Explore your rewards"
          value={searchTerm}
          onChangeText={setSearchTerm} // Set the search term state on change
        />
        <MaterialCommunityIcons name="magnify" size={24} color="black" />
      </View>
    </View>
  );

  const renderFooter = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate("SubScreen")}
      style={styles.membershipButton}
    >
      <Text style={styles.membershipButtonText}>Enlighten me...</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={cityDeals}
      renderItem={renderDealItem}
      keyExtractor={(item) => item.city}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
    />
  );
}

function getAverageRatingForCity(deals) {
  const totalRating = deals.reduce((acc, deal) => {
    // Parse the rating to a float and add it to the accumulator
    const rating = parseFloat(deal.rating);
    return acc + (isNaN(rating) ? 0 : rating);
  }, 0);

  // Calculate the average rating, ensuring we have at least one rating
  const averageRating = deals.length > 0 ? totalRating / deals.length : 0;

  // Return the average rating, fixed to one decimal place, as a string
  return averageRating.toFixed(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    margin: 15,
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  dealCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowRadius: 3,
    shadowOpacity: 0.1,
  },
  dealImage: {
    width: "100%",
    height: 150,
  },
  dealInfo: {
    padding: 10,
  },
  dealCity: {
    fontWeight: "bold",
    fontSize: 18,
  },
  dealAvailable: {
    fontSize: 16,
    color: "grey",
  },
  membershipButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  membershipButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
