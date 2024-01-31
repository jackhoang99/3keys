import React, { Component } from "react";
import { Modal, View, Image, StyleSheet, Text } from "react-native";

class Loader extends Component {
  render() {
    const { isLoading, message } = this.props;

    return (
      <Modal
        transparent={true}
        animationType={"none"}
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {/* Replace ActivityIndicator with an Image component for the GIF */}
            <Image
              source={require("/Users/jackhoang/Desktop/threekeys/src/img/icons8-key.gif")}
              style={styles.gif}
            />
            <Text style={styles.loadingText}>{message}</Text>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  activityIndicatorWrapper: {
    backgroundColor: "white",
    height: 100,
    width: 200,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1, // Add border width
    borderColor: "#000", // Change this to black
  },

  gif: {
    width: 40, // Adjust as necessary for your GIF
    height: 40, // Adjust as necessary for your GIF
  },

  loadingText: {
    marginTop: 0,
    fontSize: 17,
    color: "black",
    textAlign: "center",
    fontFamily: "Arial", // Or any other system-available font
    fontWeight: "bold",
  },
});

export default Loader;
