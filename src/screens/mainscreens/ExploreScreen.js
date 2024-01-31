import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../services/supabase.js";
import { fetchCityImage } from "../../services/supabase.js";

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [adventures, setAdventures] = useState([]);

  useEffect(() => {
    async function fetchAdventures() {
      try {
        const { data, error } = await supabase
          .from("Cities")
          .select("city_name, id");

        if (error) {
          console.error("Error fetching city names:", error);
          return;
        }

        if (data && data.length > 0) {
          const fetchedAdventures = await Promise.all(
            data.map(async (cityData) => {
              const cityDetails = await fetchCityImage(cityData.city_name);
              if (cityDetails) {
                return {
                  id: cityDetails.id.toString(), // Convert id to a string
                  city: cityDetails.cityName,
                  keys: "123 Keys Hidden", // Example data, replace with actual data if available
                  amount: "$" + cityDetails.money, // Corrected string concatenation
                  players: cityDetails.players + " players", // Corrected string concatenation
                  image: { uri: cityDetails.cityImage },
                  description: cityDetails.description, // Ensure this is the correct field name
                  achievement1: cityDetails.PossibleAchievement_1, // Assuming this is already an array
                  achievement2: cityDetails.PossibleAchievement_2, // Assuming this is already an array
                };
              }
              return null;
            })
          );

          setAdventures(fetchedAdventures.filter(Boolean));
        }
      } catch (error) {
        console.error("Unexpected error fetching adventures:", error);
      }
    }

    fetchAdventures();
  }, []);

  const navigateToDetail = (item) => {
    navigation.navigate("Details", { ...item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Next Adventures</Text>
      <FlatList
        data={adventures}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetail(item)}>
            <View style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.city}</Text>
                <Text style={styles.cardAmount}>{item.amount}</Text>
                <Text style={styles.cardPlayers}>{item.players}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View all</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 20,
    color: "grey",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3, // for Android shadow
    shadowOpacity: 0.1, // for iOS shadow
    shadowRadius: 10,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    color: "grey",
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cardPlayers: {
    fontSize: 14,
    color: "grey",
  },
  viewAllButton: {
    backgroundColor: "green", // Choose a color that fits your theme
    padding: 10, // Reduced padding
    borderRadius: 20, // Adjusted border radius
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10, // Reduced vertical margin
    alignSelf: "center", // Add this to align the button in the center
    width: 150, // Define a specific width for the button
  },
  viewAllText: {
    color: "#fff",
    fontSize: 14, // Reduced font size
  },
});
