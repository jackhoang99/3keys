import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useGameState } from "/Users/jackhoang/Desktop/threekeys/src/utils/GameStateContext.js";
import { fetchDataFromTable } from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js";
import Loader from "/Users/jackhoang/Desktop/threekeys/src/utils/loader.js";
import { supabase } from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js";

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

const findNearestLocationGame = (userData, locations) => {
  let nearestLocation = null;
  let smallestDistance = Infinity;
  locations.forEach((location) => {
    const distance = calculateDistance(
      userData.latitude,
      userData.longitude,
      location.lat,
      location.long
    );
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearestLocation = location;
    }
  });
  return nearestLocation;
};

const WelcomeBackScreen = ({ route }) => {
  const navigation = useNavigation();
  const { startNewGame } = useGameState();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Finding a game near your location..."
  );
  const [userData, setUserData] = useState({ explorer: "", explorer_name: "" });
  const { userId } = useGameState("");

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  };

  const getCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const handlePress = async () => {
    setLoading(true);
    setLoadingMessage("Finding a game near your location...");

    const hasPermission = await getLocationPermission();
    if (!hasPermission) {
      setLoadingMessage("Location permission is required to find games.");
      setLoading(false);
      return;
    }

    const userLocation = await getCurrentLocation();
    const data = await fetchDataFromTable();
    const nearestGame = findNearestLocationGame(userLocation, data);

    if (nearestGame) {
      setLoadingMessage(`Nearest game found: ${nearestGame.game_name}`);
      setTimeout(() => {
        setLoading(false);
        startNewGame(
          nearestGame.game_name,
          nearestGame.img,
          nearestGame.riddle1,
          nearestGame.riddle2,
          nearestGame.riddle3,
          nearestGame.location1,
          nearestGame.location2,
          nearestGame.location3,
          nearestGame.lat1,
          nearestGame.lat2,
          nearestGame.lat3,
          nearestGame.long1,
          nearestGame.long2,
          nearestGame.long3,
          nearestGame.lat,
          nearestGame.long,
          nearestGame.description,
          nearestGame.img2,
          nearestGame.id
        );
        navigation.navigate("MainApp");
      }, 2000);
    } else {
      setLoadingMessage("No game found nearby.");
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("name,img,explorer,explorer_name")
        .eq("id", userId)
        .single();

      if (error) {
        Alert.alert("Error", "Failed to retrieve user profile.");
      } else {
        setUserName(data.name);
        setUserImage(data.img);
        setUserData({
          explorer_name: data.explorer_name,
          explorer: data.explorer,
        });
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      {userImage ? (
        <Image source={{ uri: userImage }} style={styles.profileImage} />
      ) : null}
      <Text style={styles.name}>Welcome Back, {userName}!</Text>
      <Text style={styles.bio}>Explorer: {userData.explorer_name}</Text>
      <Text style={styles.bio}>Types: {userData.explorer}</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Begin your adventure...</Text>
      </TouchableOpacity>
      {loading && <Loader isLoading={loading} message={loadingMessage} />}
      {/* You can add more UI components here as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  // Your provided styles
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4", // You might want to set a background color
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  bio: {
    fontSize: 17,
    color: "gray",
    marginTop: 5,
  },
  button: {
    backgroundColor: "green",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 50,
    marginTop: 60,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
});

export default WelcomeBackScreen;
