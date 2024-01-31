import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useGameState } from "../../../utils/GameStateContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  fetchUserProgress,
  updateUserProgress,
} from "../../../services/supabase";
import Loader from "/Users/jackhoang/Desktop/threekeys/src/utils/loader.js";

export default function RiddleScreen({ route }) {
  const navigation = useNavigation();
  const { currentRiddleIndex, setCurrentRiddleIndex, userId } = useGameState();
  const [answer, setAnswer] = useState("");
  const {
    selectedGameName,
    location1,
    location2,
    location3,
    riddle1,
    riddle2,
    riddle3,
    lat1,
    lat2,
    lat3,
    long1,
    long2,
    long3,
  } = useGameState();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Verifying your answer...."
  );

  const destinations = [
    {
      name: location1,
      riddle: riddle1,
      answer: location1,
      coordinates: { latitude: lat1, longitude: long1 },
    },
    {
      name: location2,
      riddle: riddle2,
      answer: location2,
      coordinates: { latitude: lat2, longitude: long2 },
    },
    {
      name: location3,
      riddle: riddle3,
      answer: location3,
      coordinates: { latitude: lat3, longitude: long3 },
    },
  ];

  const currentRiddle = destinations[currentRiddleIndex] || destinations[0];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (userId) {
          console.log("Fetching user progress for user ID:", userId);
          const progress = await fetchUserProgress(userId, selectedGameName);
          console.log("User progress fetched:", progress);
          if (progress && progress[0]) {
            console.log(
              "Current stage completed:",
              progress[0].stage_completed
            );
            setCurrentRiddleIndex(progress[0].stage_completed);
          }
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    fetchProgress();
  }, [userId, selectedGameName, setCurrentRiddleIndex]);

  const checkAnswer = async () => {
    console.log(
      `Checking answer: ${answer}, expected: ${currentRiddle.answer}`
    );
    setLoading(true); // Start loading
    setLoadingMessage("Verifying your answer...");

    if (answer.toLowerCase() === currentRiddle.answer.toLowerCase()) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Cannot access the location");
          setLoading(false); // Stop loading
          return;
        }
        const userLocation = await Location.getCurrentPositionAsync({});
        console.log("Location permission granted, updating user progress...");

        const updatedProgress = await updateUserProgress(
          userId,
          selectedGameName,
          currentRiddleIndex + 1
        );

        console.log("Supabase response:", updatedProgress);

        if (updatedProgress && updatedProgress.error) {
          console.error(
            "Failed to update user progress:",
            updatedProgress.error
          );
          Alert.alert("Update Failed", "Failed to update user progress.");
        } else {
          setCurrentRiddleIndex(currentRiddleIndex + 1);
          console.log("User progress updated, navigating to MapScreen...");
          navigation.navigate("DirectionScreen", {
            destinationCoordinates: currentRiddle.coordinates,
            originCoordinates: {
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            },
            currentRiddleIndex: currentRiddleIndex,
          });
        }
      } catch (error) {
        console.error("An error occurred while checking the answer:", error);
        Alert.alert(
          "Error",
          "An error occurred while checking the answer. Please try again."
        );
      } finally {
        setLoading(false); // Stop loading in any case
      }
    } else {
      Alert.alert("Incorrect", "That is not the right answer. Try again!");
      setLoading(false); // Stop loading
    }
    setAnswer("");
  };

  useEffect(() => {
    if (route.params?.currentRiddleIndex !== undefined) {
      setCurrentRiddleIndex(route.params.currentRiddleIndex);
    }
  }, [route.params?.currentRiddleIndex, setCurrentRiddleIndex]);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      extraScrollHeight={20}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.gameTitle}>Game: {selectedGameName}</Text>
      <View style={styles.keyIconContainer}>
        <Image
          source={require("/Users/jackhoang/Desktop/threekeys/src/img/riddles.png")}
          style={styles.keyIcon}
        />
      </View>
      <Text style={styles.riddleTitle}>{`Key ${currentRiddleIndex + 1}`}</Text>
      <Text style={styles.riddleText}>{currentRiddle.riddle}</Text>
      <TextInput
        style={styles.answerInput}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Enter your answer"
        autoCapitalize="none"
      />
      <Loader isLoading={loading} message={loadingMessage} />
      <TouchableOpacity onPress={checkAnswer} style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("MapScreen")}
        style={styles.openAtlasButton}
      >
        <Text style={styles.openAtlasButtonText}>Open Map</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 0,
  },
  keyImage: {
    width: 10,
    height: 100,
    marginVertical: 2,
  },

  keyIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  riddleTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 0,
  },
  riddleText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 25,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    width: "80%",
  },
  verifyButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: "80%",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  openAtlasButton: {
    backgroundColor: "#eabc20",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: "80%",
  },
  openAtlasButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
