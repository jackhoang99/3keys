import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useGameState } from "../../utils/GameStateContext.js";
import { supabase } from "../../services/supabase.js";

const locaInventaData = [
  {
    id: "1",
    name: "Oxford, UK",
    keysFound: 12,
    earnings: "$52",
    rank: "#125",
    imageUrl: require("/Users/jackhoang/Desktop/threekeys/src/img/oxford.jpeg"),
  },
  {
    id: "2",
    name: "Manhattan, NY",
    keysFound: 18,
    earnings: "$36",
    rank: "#1124",
    imageUrl: require("/Users/jackhoang/Desktop/threekeys/src/img/newyork.jpeg"),
  },
];
export default function AnimusScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({ explorer: "", explorer_name: "" });
  const [citiesData, setCitiesData] = useState([]);
  const { userId } = useGameState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [selectedTab, setSelectedTab] = useState("chronicles");

  const onCityPress = (city) => {
    navigation.navigate("Exploranda");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("name,img,explorer,explorer_name,nationality")
        .eq("id", userId)
        .single();

      if (!error) {
        setUserName(data.name);
        setUserImage(data.img);
        setUserData({
          explorer_name: data.explorer_name,
          explorer: data.explorer,
          nationality: data.nationality,
        });
      }
    };

    const fetchCities = async () => {
      let { data, error } = await supabase.from("Cities").select("*");

      if (!error) {
        setCitiesData(data);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
    fetchCities();
  }, [userId]);
  const renderLocaInventaItem = ({ item }) => (
    <View style={styles.locationCard}>
      <Image source={{ uri: item.city_img }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.locationName}>{item.city_name}</Text>
        {/* Use other data from item as needed */}
      </View>
    </View>
  );

  const renderExplorandaItem = ({ item }) => (
    <TouchableOpacity onPress={() => onCityPress(item)}>
      <View style={styles.locationCard}>
        <Image source={{ uri: item.city_img }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.locationName}>{item.city_name}</Text>
          {/* Other data from item as needed */}
        </View>
      </View>
    </TouchableOpacity>
  );
  const renderLedger = () => (
    <View style={styles.ledgerContainer}>
      <Text style={styles.ledgerTitle}>Ledger of {userName}</Text>
      <Text style={styles.ledgerLevel}>Level 1</Text>
      <Text style={styles.ledgerRole}>{userData.explorer}</Text>

      <View style={styles.ledgerItem}>
        <Icon name="map-marker" style={styles.ledgerIcon} />
        <Text style={styles.ledgerText}>Locations Discovered: 29</Text>
      </View>

      <View style={styles.ledgerItem}>
        <Icon name="map-marker-distance" style={styles.ledgerIcon} />
        <Text style={styles.ledgerText}>Distance Traveled: 49 miles</Text>
      </View>

      <View style={styles.ledgerItem}>
        <Icon name="puzzle" style={styles.ledgerIcon} />
        <Text style={styles.ledgerText}>Riddles Solved: 60</Text>
      </View>

      <View style={styles.ledgerItem}>
        <Icon name="account-multiple" style={styles.ledgerIcon} />
        <Text style={styles.ledgerText}>Allies Formed: 5</Text>
      </View>

      <View style={styles.ledgerItem}>
        <Icon name="cash" style={styles.ledgerIcon} />
        <Text style={styles.ledgerText}>Total Coin Earnings: $152</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("/Users/jackhoang/Desktop/threekeys/src/img/BALI.jpg")}
          style={styles.headerImage}
        />
        <Image
          source={
            userImage
              ? { uri: userImage }
              : require("/Users/jackhoang/Desktop/threekeys/src/img/profile.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userName}</Text>
        <Text style={styles.profileTitle}>{userData.explorer}</Text>
        <Text style={styles.profileTitle}>{userData.explorer_name}</Text>
        <Text style={styles.profileLocation}>{userData.nationality}</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setSelectedTab("chronicles")}
          style={selectedTab === "chronicles" ? styles.tabSelected : styles.tab}
        >
          <Text>Chronicles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("ledger")}
          style={selectedTab === "ledger" ? styles.tabSelected : styles.tab}
        >
          <Text>Ledger</Text>
        </TouchableOpacity>
      </View>
      {selectedTab === "chronicles" && (
        <>
          <FlatList
            data={citiesData}
            renderItem={renderExplorandaItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.locationsList}
          />
          <FlatList
            data={citiesData}
            renderItem={renderExplorandaItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.locationsList}
          />
        </>
      )}

      {selectedTab === "ledger" && renderLedger()}
      {}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden", // Ensures the image doesn't bleed outside the borderRadius
  },

  headerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "absolute",
    top: 150,
    left: 20,
  },

  profileName: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 20,
    marginLeft: 20,
  },
  profileTitle: {
    fontSize: 18,
    color: "#666",
    marginLeft: 20,
  },
  profileLocation: {
    fontSize: 16,
    color: "#999",
    marginLeft: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  tab: {
    padding: 10,
    color: "#666",
  },
  tabSelected: {
    padding: 10,
    color: "#000",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  locationCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
    width: 200,
  },

  cardImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 8,
  },
  locationName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  locationKeys: {
    fontSize: 14,
    color: "#555",
  },
  locationEarnings: {
    fontSize: 14,
    color: "#777",
  },
  locationRank: {
    fontSize: 14,
    color: "#999",
  },

  ledgerContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: "flex-start",
  },
  ledgerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ledgerLevel: {
    fontSize: 18,
    marginBottom: 15,
  },
  ledgerRole: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 25,
  },
  ledgerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ledgerIcon: {
    fontSize: 24,
    marginRight: 10,
    width: 24,
    height: 24,
    textAlign: "center",
  },
  ledgerText: {
    fontSize: 16,
    flex: 1,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  tab: {
    flex: 1, // This ensures that the tabs have equal width and align properly
    alignItems: "center", // This centers the text horizontally
    paddingVertical: 10, // This adds some padding at the top and bottom of each tab
  },
  tabSelected: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },

  ledgerIcon: {
    fontSize: 20,
    color: "#000",
    marginRight: 10,
  },
});
