import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import * as Animatable from "react-native-animatable";
import { useGameState } from "../../../utils/GameStateContext";
import stickmanImage from "../../../img/relaxing-walk.png";
import keyImage from "../../../img/gold-key.png";
import { supabase } from "../../../services/supabase";
export default function DirectionScreen() {
  const keyAnimationRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { originCoordinates, destinationCoordinates, currentRiddleIndex } =
    route.params;
  const isLastRiddle = currentRiddleIndex === 2;
  const [userLocation, setUserLocation] = useState(null);
  const [routeLine, setRouteLine] = useState(null);
  const { setGameCompleted } = useGameState();
  const [keyFound, setKeyFound] = useState(false);
  const { userId } = useGameState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const watchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
        },
        (location) => {
          const newUserLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(newUserLocation);
          checkProximity(newUserLocation, destinationCoordinates);
        }
      );
      return subscription;
    };

    const getDirections = async () => {
      const origin = `${originCoordinates.latitude},${originCoordinates.longitude}`;
      const destination = `${destinationCoordinates.latitude},${destinationCoordinates.longitude}`;
      const directionsUrl = `....`;

      try {
        const response = await fetch(directionsUrl);
        const json = await response.json();
        if (json.routes.length) {
          const points = polyline.decode(
            json.routes[0].overview_polyline.points
          );
          const coords = points.map((point) => ({
            latitude: point[0],
            longitude: point[1],
          }));
          setRouteLine(coords);
        }
      } catch (error) {
        Alert.alert(
          "Directions Error",
          "Unable to get directions. Please try again later."
        );
      }
    };

    watchLocation();
    getDirections();
  }, [originCoordinates, destinationCoordinates]);

  const checkProximity = (userLoc, destCoordinates) => {
    const R = 6371;
    const dLat =
      ((destCoordinates.latitude - userLoc.latitude) * Math.PI) / 180;
    const dLon =
      ((destCoordinates.longitude - userLoc.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLoc.latitude * Math.PI) / 180) *
        Math.cos((destCoordinates.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const proximityThreshold = 0.1;

    if (distance < proximityThreshold && !keyFound) {
      setKeyFound(true);
    }
  };

  // This state determines if the key has already been collected
  const [hasCollectedKey, setHasCollectedKey] = useState(false);

  const onKeyPress = () => {
    if (!hasCollectedKey && keyFound) {
      updateKeysCollected();
    }
  };

  const updateKeysCollected = async () => {
    if (hasCollectedKey) {
      // If the key has already been collected, don't do anything
      return;
    }

    setLoading(true); // Assuming you have a loading state

    try {
      let { data: userData, error: userError } = await supabase
        .from("users")
        .select("keys_collected")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      // Initialize keys_collected to 0 if it is NULL, then increment by 1
      const updatedKeysCollected = (userData.keys_collected || 0) + 1;

      const { error } = await supabase
        .from("users")
        .update({ keys_collected: updatedKeysCollected })
        .eq("id", userId);

      if (error) throw error;

      console.log("Keys collected updated successfully");
      Alert.alert("A new key just got added to your treasury");

      // Set hasCollectedKey to true so the key cannot be collected again
      setHasCollectedKey(true);

      // Stop the animation by controlling the state that triggers it
      setKeyFound(false);
    } catch (error) {
      console.error("Error updating keys collected:", error.message);
      Alert.alert("Update Error", "Unable to update keys collected.");
    } finally {
      setLoading(false); // Ensure you always turn off loading, even if there is an error
    }
  };

  const handleRiddleNavigation = () => {
    if (isLastRiddle) {
      setGameCompleted(true);
      navigation.navigate("CongratScreen");
    } else {
      navigation.navigate("RiddleScreen", {
        currentRiddleIndex: currentRiddleIndex + 1,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude:
            (originCoordinates.latitude + destinationCoordinates.latitude) / 2,
          longitude:
            (originCoordinates.longitude + destinationCoordinates.longitude) /
            2,
          latitudeDelta:
            Math.abs(
              originCoordinates.latitude - destinationCoordinates.latitude
            ) * 2,
          longitudeDelta:
            Math.abs(
              originCoordinates.longitude - destinationCoordinates.longitude
            ) * 2,
        }}
      >
        <Marker
          coordinate={destinationCoordinates}
          title="Treasury Key"
          onPress={onKeyPress}
        >
          <Animatable.View
            ref={keyAnimationRef}
            animation={keyFound && !hasCollectedKey ? "bounce" : undefined}
            iterationCount="infinite"
            duration={1500}
            useNativeDriver={true}
          >
            <Image source={keyImage} style={{ width: 30, height: 30 }} />
          </Animatable.View>
        </Marker>

        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location">
            <Image source={stickmanImage} style={{ width: 30, height: 30 }} />
          </Marker>
        )}
        {routeLine && (
          <Polyline
            coordinates={routeLine}
            strokeColor="#0000FF"
            strokeWidth={3}
          />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={handleRiddleNavigation}
      >
        <Text style={styles.navigationButtonText}>
          {isLastRiddle ? "Finish Game" : "Next Riddle"}
        </Text>
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
  navigationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  navigationButtonText: {
    fontSize: 16,
    color: "white",
  },
  keyStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 20,
    right: 20,
  },
});
