import React, { createContext, useState, useContext } from "react";
const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedGameImageUrl, setSelectedGameImageUrl] = useState();
  const [selectedGameName, setSelectedGameName] = useState("");
  const [userId, setUserId] = useState(null);
  const [riddle1, setRiddle1] = useState("");
  const [riddle2, setRiddle2] = useState("");
  const [riddle3, setRiddle3] = useState("");
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [location3, setLocation3] = useState("");
  const [lat1, setLat1] = useState();
  const [lat2, setLat2] = useState();
  const [lat3, setLat3] = useState();
  const [long1, setLong1] = useState();
  const [long2, setLong2] = useState();
  const [long3, setLong3] = useState();
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [description, setDescription] = useState("");
  const [img2, setImg2] = useState("");
  const [locationnanme, setLocationname] = useState("");

  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userData, setUserData] = useState({ explorer_name: "", explorer: "" });

  // Function to fetch user profile

  const startNewGame = (
    gameName,
    imageUrl,
    riddle1,
    riddle2,
    riddle3,
    location1,
    location2,
    location3,
    lat1,
    lat2,
    lat3,
    long1,
    long2,
    long3,
    lat,
    long,
    description,
    img2,
    locationnanme
  ) => {
    setCurrentRiddleIndex(0);
    setGameCompleted(false);
    setSelectedGameImageUrl(imageUrl);
    setSelectedGameName(gameName);

    setRiddle1(riddle1);
    setRiddle2(riddle2);
    setRiddle3(riddle3);
    setLocation1(location1);
    setLocation2(location2);
    setLocation3(location3);
    setLat1(lat1);
    setLat2(lat2);
    setLat3(lat3);
    setLong1(long1);
    setLong2(long2);
    setLong3(long3);
    setLat(lat);
    setLong(long);
    setDescription(description);
    setImg2(img2);
    setLocationname(locationnanme);
  };

  return (
    <GameStateContext.Provider
      value={{
        currentRiddleIndex,
        setCurrentRiddleIndex,
        gameCompleted,
        setGameCompleted,
        startNewGame,
        selectedGameImageUrl,
        selectedGameName,
        riddle1,
        riddle2,
        riddle3,
        location1,
        location2,
        location3,
        lat1,
        lat2,
        lat3,
        long1,
        long2,
        long3,
        lat,
        long,
        description,
        img2,
        locationnanme,
        userId, // add this
        setUserId, // and this
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);
