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
import { fetchDataAndGroupByCity } from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js"; // Adjust the import path as necessary

const CityDetailScreen = ({ route }) => {
  const [cityAdventures, setCityAdventures] = useState([]);
  const navigation = useNavigation(); // use navigation
  const { cityName } = route.params;

  useEffect(() => {
    async function fetchAndGroupData() {
      const groupedData = await fetchDataAndGroupByCity();
      if (groupedData && groupedData[cityName]) {
        setCityAdventures(groupedData[cityName]);
      }
    }

    fetchAndGroupData();
  }, [cityName]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        // Handle item press if needed
      }}
    >
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.gameName}>{item.game_name}</Text>
        {/* Add other details you want to show */}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={cityAdventures}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};
// Reuse the styles you provided for consistent look and feel
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: "#fff", // add background color if needed
    borderRadius: 10, // if you want card-like items
    overflow: "hidden", // for borderRadius to take effect on images
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5, // shadow for Android
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // to make it circular
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center", // center text vertically
  },
  gameName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationId: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default CityDetailScreen;
