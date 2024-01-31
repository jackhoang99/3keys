import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGameState } from "../../../utils/GameStateContext";

const CongratScreen = ({ navigation }) => {
  const openTreasury = () => {
    navigation.navigate("Treasury"); // Make sure 'TreasuryScreen' is the correct name in your navigator config
  };

  const { selectedGameName } = useGameState();

  return (
    <View style={styles.container}>
      <Text style={styles.gameTitle}>Game: {selectedGameName}</Text>
      <Text style={styles.heading}>The Third Key!</Text>
      <View style={styles.keyIconsContainer}>
        <Image
          source={require("/Users/jackhoang/Desktop/threekeys/src/img/key1.png")}
          style={styles.keyIcon}
        />
        <Image
          source={require("/Users/jackhoang/Desktop/threekeys/src/img/key2.png")}
          style={styles.keyIcon}
        />
        <Image
          source={require("/Users/jackhoang/Desktop/threekeys/src/img/key3.png")}
          style={styles.keyIcon}
        />
      </View>
      <Text style={styles.congratulationsText}>Congratulations, traveler!</Text>
      <Text style={styles.congratulationsText}>
        You have finished {selectedGameName}.
      </Text>
      <Image
        source={require("/Users/jackhoang/Desktop/threekeys/src/img/medal.png")}
        style={styles.medalIcon}
      />
      <TouchableOpacity style={styles.treasuryButton} onPress={openTreasury}>
        <Text style={styles.treasuryButtonText}>Open Local Treasury</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
  },
  keyIconsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  keyIcon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  congratulationsText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  medalIcon: {
    width: 80,
    height: 80,
    marginVertical: 20,
  },
  treasuryButton: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  treasuryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CongratScreen;
