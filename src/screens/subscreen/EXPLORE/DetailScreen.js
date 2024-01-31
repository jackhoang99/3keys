import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const DetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    city,
    description,
    keys,
    amount,
    players,
    image,
    achievement1,
    achievement2,
  } = route.params;

  const navigateToCityDetail = () => {
    navigation.navigate("CityDetailScreen", { cityName: city });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{city}</Text>
      <Text style={styles.subtitle}>{description}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{keys} </Text>
        <Text style={styles.infoText}>{players} Players</Text>
        <Text style={styles.infoText}>Total Player Earnings: {amount}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={navigateToCityDetail}>
        <Text style={styles.buttonText}>View Games</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Possible Achievements</Text>
      <View style={styles.achievementsContainer}>
        <Text style={styles.achievementText}>{achievement1}</Text>
        <View style={styles.separator} />
        <Text style={styles.achievementText}>{achievement2}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  infoContainer: {
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 10,
  },
  achievementsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 20,
  },
  achievementText: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },

  achievement: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 5, // Adjust spacing between achievements if needed
  },
  separator: {
    height: "80%",
    width: 1,
    backgroundColor: "#000",
  },
});

export default DetailScreen;
