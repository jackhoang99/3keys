import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  supabase,
  fetchExplorerData,
} from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js";
import { useGameState } from "/Users/jackhoang/Desktop/threekeys/src/utils/GameStateContext.js";

export default function OnboardingScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("");
  const [explorerType, setExplorerType] = useState(""); // Default value
  const [loading, setLoading] = useState(false);

  const { userId } = useGameState();

  const completeOnboarding = async () => {
    setLoading(true);

    // Fetch the explorer data based on the selected type
    const explorerData = await fetchExplorerData(explorerType);

    if (!explorerData) {
      setLoading(false);
      Alert.alert("Error", "Could not fetch explorer data.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({
        name: fullName,
        nationality: nationality,
        explorer: explorerType,
        img: explorerData.img,
        bio: explorerData.Player_Description,
        onboarding_completed: true,
        explorer_name: explorerData.name,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      Alert.alert("Onboarding Error", error.message);
    } else {
      navigation.navigate("ExplorerProfile", { explorerData });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Find Your Inner Explorer</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setFullName}
        value={fullName}
        placeholder="Full Name"
        autoCapitalize="words"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={setNationality}
        value={nationality}
        placeholder="Nationality"
        autoCapitalize="sentences"
      />
      <Picker
        selectedValue={explorerType}
        onValueChange={(itemValue, itemIndex) => setExplorerType(itemValue)}
        style={styles.picker}
      >
        {/* Dynamically generate Picker.Items based on your types */}
        <Picker.Item label="Select Your Explorer Type" value="null" />
        <Picker.Item label="Adventurer" value="Adventurer" />
        <Picker.Item label="Cartographer" value="Cartographer" />
        <Picker.Item label="Seeker" value="Seeker" />
        <Picker.Item label="Aristocrat" value="Aristocrat" />
        <Picker.Item label="Conqueror" value="Conqueror" />
        {/* Add other options here */}
      </Picker>
      <TouchableOpacity
        disabled={loading}
        onPress={completeOnboarding}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Complete Onboarding</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 30,
    backgroundColor: "#f4f4f4",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    fontSize: 16,
    padding: 15,
    height: 50,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: "#34c759",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
