import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { useGameState } from "/Users/jackhoang/Desktop/threekeys/src/utils/GameStateContext.js";

export default function MapScreen() {
  // Coordinates for the Golden Gate Bridge
  const { lat } = useGameState();
  const { long } = useGameState();
  const { locationnanme } = useGameState();

  const Coords = {
    latitude: lat,
    longitude: long,
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...Coords,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
      >
        <Marker coordinate={Coords} title={locationnanme} />
      </MapView>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Use the goBack method to navigate back
      >
        <Text style={styles.backButtonText}>Back to Riddle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  backButtonText: {
    fontSize: 16,
    color: "green",
  },
});
