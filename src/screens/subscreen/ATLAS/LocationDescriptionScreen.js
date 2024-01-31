import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGameState } from "../../../utils/GameStateContext";

export default function LocationDescriptionScreen() {
  const navigation = useNavigation();
  const { description } = useGameState();
  const { img2 } = useGameState();
  const { locationnanme } = useGameState();

  const locationDescription = {
    name: locationnanme,
    description: description,
    image_url: img2,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to {locationDescription.name}, Traveler !
      </Text>
      <Image
        source={{ uri: locationDescription.image_url }}
        style={styles.locationImage}
      />
      <Text style={styles.descriptionText}>
        {locationDescription.description}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RiddleScreen")}
        // Make sure you have a RiddleScreen in your navigation stack
      >
        <Text style={styles.buttonText}>Begin Adventure</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 20,
    textAlign: "center",
  },
  locationImage: {
    width: "100%",
    height: 200, // Adjust as needed
    resizeMode: "cover",
  },
  descriptionText: {
    fontSize: 16,
    margin: 20,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  // Add any other styles you need here
});
