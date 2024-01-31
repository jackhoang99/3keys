// SubScreen.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function SubScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>The Master</Text>
      <Text style={styles.description}>For small business</Text>
      <Text style={styles.price}>$14.99 /yearly</Text>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefit}>
          ✓ Access to most of your city's adventures
        </Text>
        <Text style={styles.benefit}>✓ General incentives</Text>
        <Text style={styles.benefit}>
          ✓ Personalized location recommendations
        </Text>
        <Text style={styles.benefit}>✓ Unlimited ally formations</Text>
      </View>

      <TouchableOpacity style={styles.upgradeButton}>
        <Text style={styles.upgradeButtonText}>Upgrade</Text>
      </TouchableOpacity>

      <Text style={styles.quote}>
        "Travel far and wide; there is no substitute for experience."
      </Text>
      <Text style={styles.author}>– Euripides</Text>

      <TouchableOpacity style={styles.viewGlobalMembershipButton}>
        <Text style={styles.viewGlobalMembershipButtonText}>
          View Global Membership
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "grey",
    textAlign: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  benefitsContainer: {
    marginTop: 20,
  },
  benefit: {
    fontSize: 16,
    marginLeft: 10,
    marginVertical: 5,
  },
  upgradeButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
    marginTop: 20,
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  quote: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  author: {
    textAlign: "center",
    marginBottom: 20,
  },
  viewGlobalMembershipButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
    marginBottom: 30,
  },
  viewGlobalMembershipButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
