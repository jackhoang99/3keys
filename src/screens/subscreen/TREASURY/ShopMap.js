import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import stickmanImage from "/Users/jackhoang/Desktop/threekeys/src/img/relaxing-walk.png";
import keyImage from "/Users/jackhoang/Desktop/threekeys/src/img/store.png";
import Loader from "../../../utils/loader";

export default function DirectionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { originCoordinates, destinationCoordinates, location_name } =
    route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [routeLine, setRouteLine] = useState(null);

  const goBackToDeals = () => {
    navigation.goBack(); // Go back to the previous screen
  };

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
        }
      );
      return subscription;
    };

    const getDirections = async () => {
      const origin = `${originCoordinates.latitude},${originCoordinates.longitude}`;
      const destination = `${destinationCoordinates.latitude},${destinationCoordinates.longitude}`;
      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=`;

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

  const isValidCoordinate = (coord) => {
    return (
      coord &&
      typeof coord.latitude === "number" &&
      !isNaN(coord.latitude) &&
      typeof coord.longitude === "number" &&
      !isNaN(coord.longitude)
    );
  };

  return (
    <View style={styles.container}>
      {isValidCoordinate(originCoordinates) &&
      isValidCoordinate(destinationCoordinates) ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude:
              (originCoordinates.latitude + destinationCoordinates.latitude) /
              2,
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
          <Marker coordinate={destinationCoordinates} title={location_name}>
            <Image source={keyImage} style={{ width: 30, height: 30 }} />
          </Marker>

          {isValidCoordinate(userLocation) && (
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
      ) : (
        <Text>Loading map...</Text>
      )}
      <TouchableOpacity style={styles.navigationButton} onPress={goBackToDeals}>
        <Text style={styles.navigationButtonText}>Back To Deals</Text>
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
