import React, { useEffect, useState } from "react";
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
import * as Location from "expo-location";
import Loader from "/Users/jackhoang/Desktop/threekeys/src/utils/loader.js"; // Assuming Loader is in the same directory
import { supabase } from "../../services/supabase";
import { useGameState } from "/Users/jackhoang/Desktop/threekeys/src/utils/GameStateContext.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { setUserId } = useGameState("");
  const { userId } = useGameState();

  useEffect(() => {
    // This effect will run whenever `userId` changes.
    // If `userId` is truthy (meaning it has been set), then call `checkOnboardingStatusAndNavigate`.
    if (userId) {
      checkOnboardingStatusAndNavigate(userId);
    }
  }, [userId]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is needed to use this app."
        );
      }
    } catch (error) {
      console.error("Location permission error: ", error);
    }
  };

  const handleSignInUpResponse = async (response, isSignUp = false) => {
    setLoading(false);
    if (response.error) {
      if (!isSignUp && response.error.message.includes("does not exist")) {
        Alert.alert("Sign In Error", "Account does not exist. Please sign up.");
      } else {
        Alert.alert(
          isSignUp ? "Sign Up Error" : "Sign In Error",
          response.error.message
        );
      }
    } else {
      setEmail("");
      setPassword("");
      // Here we just set the `userId`. We don't call `checkOnboardingStatusAndNavigate` directly.
      const id = response.data.user.id;
      setUserId(id);
      // The `useEffect` hook will take care of calling `checkOnboardingStatusAndNavigate` after `userId` is set.
    }
  };

  const signInWithEmail = async () => {
    setLoading(true);
    setLoadingMessage("Signing In...");
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    await handleSignInUpResponse(response);
  };

  const checkOnboardingStatusAndNavigate = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("onboarding_completed")
      .eq("id", userId)
      .single();

    if (error) {
      Alert.alert("Error", "Failed to retrieve user data.");
      return;
    }

    if (data.onboarding_completed) {
      navigation.navigate("WelcomeBack", { userId: userId });
    } else {
      navigation.navigate("OnboardingScreen");
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Loader isLoading={loading} message={loadingMessage} />
      <Image
        source={require("/Users/jackhoang/Desktop/threekeys/src/img/Free_Sample_By_Wix-removebg-preview.png")}
        style={styles.logo}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize={"none"}
      />
      <TouchableOpacity
        disabled={loading}
        onPress={signInWithEmail}
        style={[styles.buttonContainer, styles.loginButton]}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      <View style={styles.socialButtonContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("/Users/jackhoang/Desktop/threekeys/src/img/icons8-google-48.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("/Users/jackhoang/Desktop/threekeys/src/img/icons8-facebook-48.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUpScreen")}
        style={styles.signUpButton}
      >
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Added to make sure the container can grow
    justifyContent: "center", // Centers content when it's not scrollable
    alignItems: "stretch", // Added to stretch children to match the width
    padding: 30,
    backgroundColor: "#f4f4f4",
  },

  headerText: {
    fontSize: 32,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 30,
    fontSize: 16,
    paddingLeft: 20,
    height: 55,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    backgroundColor: "#34c759", // Green primary color
    borderRadius: 30,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#a1a1a1",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
  },
  socialButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1, // This will ensure both buttons take up equal space
    marginHorizontal: 5, // Adds spacing between the buttons
  },
  socialButtonText: {
    marginLeft: 10,
    fontWeight: "bold",
  },

  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  signUpButton: {
    marginTop: 25,
  },
  signUpText: {
    fontSize: 16,
    color: "#34c759", // Green color for the sign-up text
    textAlign: "center",
  },
  // ... Add any other styles you need here

  logo: {
    width: 200, // Adjust the size as needed
    height: 200, // Adjust the size as needed
    resizeMode: "contain", // This ensures the logo scales without distortion
    alignSelf: "center", // Centers the logo horizontally
    marginBottom: 0, // Adds some space below the logo
    marginRight: 10, // Moves the logo to the right by 10 pixels
  },
});
