import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGameState } from "../../utils/GameStateContext";
import { fetchUserProgress, fetchDataFromTable } from "../../services/supabase";
import * as Location from "expo-location";
import Loader from "../../utils/loader.js";

export default function AtlasScreen() {
  const navigation = useNavigation();
  const {
    currentRiddleIndex,
    setCurrentRiddleIndex,
    userId,
    selectedGameImageUrl,
    selectedGameName,
  } = useGameState();
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(
    "Finding a game near your location..."
  );

  const keyIcons = [
    require("/Users/jackhoang/Desktop/threekeys/src/img/key1.png"),
    require("/Users/jackhoang/Desktop/threekeys/src/img/key2.png"),
    require("/Users/jackhoang/Desktop/threekeys/src/img/three-keys.jpg"),
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      if (userId) {
        const progress = await fetchUserProgress(userId, selectedGameName);
        if (progress && progress[0]) {
          setCurrentRiddleIndex(progress[0].stage_completed);
        }
      }
    };

    fetchProgress();
  }, [userId, selectedGameName, setCurrentRiddleIndex]);

  useEffect(() => {
    const fetchGames = async () => {
      const data = await fetchDataFromTable();
      setGames(data || []);
    };

    fetchGames();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const getCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const findNewGame = async () => {
    setLoading(true);
    setLoadingMessage("Finding games near your location...");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      setLoading(false);
      return;
    }

    const userLocation = await getCurrentLocation();
    const nearbyGames = games.filter((game) => {
      if (game.lat && game.long) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          game.lat,
          game.long
        );
        return distance <= 321.869;
      }
      return false;
    });

    setLoading(false);
    setLoadingMessage(`Nearest game founds`);
    navigation.navigate("NewGameScreen", { gamesData: nearbyGames });
  };

  const renderCurrentKeyIcon = () => {
    const iconIndex = currentRiddleIndex >= 0 ? currentRiddleIndex : 0;
    const icon = keyIcons[iconIndex] || keyIcons[0];
    return (
      <TouchableOpacity onPress={() => navigation.navigate("RiddleScreen")}>
        <Image source={icon} style={styles.keyIconImage} />
      </TouchableOpacity>
    );
  };

  const goToLocationDescriptionScreen = () => {
    navigation.navigate("LocationDescriptionScreen");
  };

  const backgroundImage = selectedGameImageUrl
    ? { uri: selectedGameImageUrl }
    : require("/Users/jackhoang/Desktop/threekeys/src/img/three-keys.jpg");

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      resizeMode="cover"
    >
      {currentRiddleIndex >= 3 ? (
        <View style={styles.congratsContainer}>
          <Text style={styles.congratsText}>Congratulations, traveler!</Text>
          <Text>You have finished {selectedGameName}</Text>
          <Loader isLoading={loading} message={loadingMessage} />

          <TouchableOpacity style={styles.newGameButton} onPress={findNewGame}>
            <Text style={styles.newGameButtonText}>Find New Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.keyIconContainer}>{renderCurrentKeyIcon()}</View>
          <TouchableOpacity
            style={styles.button}
            onPress={goToLocationDescriptionScreen}
          >
            <Text style={styles.buttonText}>Begin Adventure</Text>
          </TouchableOpacity>
          <Loader isLoading={loading} message={loadingMessage} />

          <TouchableOpacity style={styles.button1} onPress={findNewGame}>
            <Text style={styles.buttonText}>Find Other Games</Text>
          </TouchableOpacity>
        </>
      )}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 80, // Adjusted position for this button
    width: 200, // Set a consistent width
    justifyContent: "center", // Align items in the center
    alignItems: "center",
  },

  button1: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 30, // Original position for this button
    width: 200, // Set a consistent width
    justifyContent: "center", // Align items in the center
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
  keyIconContainer: {
    position: "absolute",
    top: 50,
    right: 30,
  },
  keyIconImage: {
    width: 50,
    height: 50,
  },

  congratsContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  congratsText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  newGameButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },

  newGameButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
