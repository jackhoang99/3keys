import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // Import createStackNavigator
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GameStateProvider } from "./src/utils/GameStateContext.js";
import "react-native-url-polyfill/auto";
import AtlasScreen from "./src/screens/mainscreens/AtlasScreen.js";
import ExploreScreen from "./src/screens/mainscreens/ExploreScreen.js";
import TreasuryScreen from "./src/screens/mainscreens/TreasuryScreen";
import AnimusScreen from "./src/screens/mainscreens/AnimusScreen";
import MapScreen from "./src/screens/subscreen/ATLAS/MapScreen.js";
import DetailScreen from "./src/screens/subscreen/EXPLORE/DetailScreen";
import SubScreen from "./src/screens/subscreen/TREASURY/SubScreen.js";
import LocationDescriptionScreen from "./src/screens/subscreen/ATLAS/LocationDescriptionScreen.js";
import MarketScreen from "./src/screens/subscreen/TREASURY/MarketScreen.js";
import RiddleScreen from "./src/screens/subscreen/ATLAS/RiddleScreen";
import DirectionScreen from "./src/screens/subscreen/ATLAS/DirectionScreen.js";
import CongratScreen from "./src/screens/subscreen/ATLAS/CongratScreen.js";
import NewGameScreen from "./src/screens/subscreen/ATLAS/NewGameScreen.js";
import LoginScreen from "./src/screens/mainscreens/LoginScreen.js";
import SignUpScreen from "./src/screens/mainscreens/SignUpScreen.js";
import OnboardingScreen from "./src/screens/mainscreens/OnboardingScreen.js";
import ExplorerProfileScreen from "./src/screens/mainscreens/ExplorerProfileScreen.js";
import WelcomeBack from "./src/screens/mainscreens/WelcomeBack.js";
import DealsDetails from "./src/screens/subscreen/TREASURY/DealsDetails.js";
import CityDetailScreen from "./src/screens/subscreen/EXPLORE/CityDetailScreen.js";
import ShopMap from "./src/screens/subscreen/TREASURY/ShopMap.js";

const Tab = createBottomTabNavigator();
const AtlasStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const TreasuryStack = createStackNavigator();
const RootStack = createStackNavigator();

function AtlasStackScreen() {
  return (
    <AtlasStack.Navigator>
      <AtlasStack.Screen
        name="AtlasScreen"
        component={AtlasScreen}
        options={{ headerShown: false }}
      />
      <AtlasStack.Screen
        name="LocationDescriptionScreen"
        component={LocationDescriptionScreen}
        options={{ headerShown: false }}
      />
      <AtlasStack.Screen
        name="RiddleScreen"
        component={RiddleScreen}
        options={{ headerShown: false }}
      />
      <AtlasStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerShown: false }}
      />

      <AtlasStack.Screen
        name="DirectionScreen"
        component={DirectionScreen}
        options={{ headerShown: false }}
      />

      <AtlasStack.Screen
        name="CongratScreen"
        component={CongratScreen}
        options={{ headerShown: false }}
      />

      <AtlasStack.Screen
        name="NewGameScreen"
        component={NewGameScreen}
        options={{ headerShown: false }}
      />
    </AtlasStack.Navigator>
  );
}

function ExploreStackScreen() {
  return (
    <ExploreStack.Navigator>
      <ExploreStack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <ExploreStack.Screen
        name="Details"
        component={DetailScreen}
        options={{ headerShown: true }}
      />

      <ExploreStack.Screen
        name="CityDetailScreen"
        component={CityDetailScreen}
        options={{ headerShown: false }}
      />
    </ExploreStack.Navigator>
  );
}

function TreasuryStackScreen() {
  return (
    <TreasuryStack.Navigator>
      <TreasuryStack.Screen
        name="TreasuryHome"
        component={TreasuryScreen}
        options={{ headerShown: false }}
      />
      <TreasuryStack.Screen
        name="SubScreen"
        component={SubScreen}
        options={{ headerShown: false }}
      />

      <TreasuryStack.Screen
        name="MarketScreen"
        component={MarketScreen}
        options={{ headerShown: false }}
      />

      <TreasuryStack.Screen
        name="DealsDetails"
        component={DealsDetails}
        options={{ headerShown: false }}
      />

      <TreasuryStack.Screen
        name="ShopMap"
        component={ShopMap}
        options={{ headerShown: false }}
      />
    </TreasuryStack.Navigator>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName=" =LoginScreen">
          <RootStack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />

          <RootStack.Screen
            name="ExplorerProfile"
            component={ExplorerProfileScreen}
            options={{ headerShown: false }}
          />

          <RootStack.Screen
            name="WelcomeBack"
            component={WelcomeBack}
            options={{ headerShown: false }}
          />

          <RootStack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />

          <RootStack.Screen
            name="MainApp"
            component={MainApp}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </GameStateProvider>
  );
}

function MainApp() {
  return (
    <Tab.Navigator
      initialRouteName="Atlas"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Atlas") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Exploranda") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Treasury") {
            iconName = focused ? "treasure-chest" : "treasure-chest";
          } else if (route.name === "Animus") {
            iconName = focused ? "ghost" : "ghost-outline";
          }
          // Return the icon component
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Atlas" component={AtlasStackScreen} />
      <Tab.Screen name="Exploranda" component={ExploreStackScreen} />
      <Tab.Screen name="Treasury" component={TreasuryStackScreen} />
      <Tab.Screen name="Animus" component={AnimusScreen} />
    </Tab.Navigator>
  );
}
