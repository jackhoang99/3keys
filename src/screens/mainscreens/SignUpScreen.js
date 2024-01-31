import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Loader from "/Users/jackhoang/Desktop/threekeys/src/utils/loader.js";
import { supabase } from "/Users/jackhoang/Desktop/threekeys/src/services/supabase.js";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const checkEmailExists = async (email) => {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();
    return data ? true : false;
  };

  const signUpWithEmail = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      Alert.alert("Error", "Email already in use, please have another email.");
      return;
    }
    setLoading(true);
    setLoadingMessage("Signing Up...");
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert("Sign Up Error", error.message);
      setLoading(false);
      setLoadingMessage("");
    } else {
      Alert.alert(
        "Success",
        "Successfully signed up! Please confirm your email before logging in.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Loader isLoading={loading} message={loadingMessage} />
      <View style={styles.socialButtonContainer}>
        <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
          <Image
            source={require("/Users/jackhoang/Desktop/threekeys/src/img/icons8-google-48.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
          <Image
            source={require("/Users/jackhoang/Desktop/threekeys/src/img/icons8-facebook-48.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.orText}>Or, register with email ...</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setEmail}
        value={email}
        placeholder="Email ID"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TouchableOpacity
        disabled={loading}
        onPress={signUpWithEmail}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start", // Content aligned to the top
    alignItems: "center",
    backgroundColor: "#fff", // Assuming a white background
    paddingTop: 50, // Adjust the padding as needed
  },
  headerContainer: {
    marginBottom: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000", // Change color according to your theme
  },
  textInput: {
    backgroundColor: "#f2f2f2", // Light gray background for input fields
    width: "90%", // Input field width
    borderRadius: 25, // Rounded corners for input fields
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    marginVertical: 10, // Space between each input field
  },
  buttonContainer: {
    backgroundColor: "#34c759", // Green button for sign up
    borderRadius: 25,
    width: "90%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  socialButton: {
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    elevation: 3,
    // Icons should be imported and styled accordingly
  },
  orText: {
    color: "#a1a1a1",
    fontSize: 16,
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: "#34c759",
    textAlign: "center",
    marginTop: 25,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  // Add additional styles for any other elements
});
