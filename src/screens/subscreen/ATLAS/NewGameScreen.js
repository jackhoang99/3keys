import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGameState } from "/Users/jackhoang/Desktop/threekeys/src/utils/GameStateContext";
import { fetchDataFromTable } from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js";
import Loader from "/Users/jackhoang/Desktop/threekeys/src/utils/loader.js";

const NewGameScreen = () => {
  const [isLoading, setIsLoading] = useState(false); // Define the loading state
  const route = useRoute();
  const { gamesData } = route.params;
  const navigation = useNavigation();
  const { startNewGame } = useGameState();

  console.log(gamesData);

  useEffect(() => {
    setIsLoading(true); // Set loading to true when the component mounts
    fetchDataFromTable()
      .then((data) => {
        // Assuming you need to set data here
        // If not required, you can remove this part
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false after fetching data
      });
  }, []);

  const handleGameSelection = (item) => {
    startNewGame(
      item.game_name,
      item.img,
      item.riddle1,
      item.riddle2,
      item.riddle3,
      item.location1,
      item.location2,
      item.location3,
      item.lat1,
      item.lat2,
      item.lat3,
      item.long1,
      item.long2,
      item.long3,
      item.lat,
      item.long,
      item.description,
      item.img2,
      item.id
    );
    navigation.navigate("AtlasScreen");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleGameSelection(item)}
    >
      {item.img ? (
        <Image source={{ uri: item.img }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.gameName}>{item.game_name}</Text>
        <Text style={styles.locationId}>{item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading} />
      <FlatList
        data={gamesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default NewGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e1e4e8",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
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
