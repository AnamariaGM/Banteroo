import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SplashScreen from "./src/screens/Splash";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/Home";
import SearchScreen from "./src/screens/SearchScreen";
import MessagesScreen from "./src/screens/MessagesScreen";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import './src/core/fontawesome';
import useGlobal from "./src/core/global";

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, background: 'pink'
  }
}

const Stack = createNativeStackNavigator();

function App() {
  const [showSplash, setShowSplash] = useState(true); // State to control showing splash screen
  // Global state initialization
  const initialized = useGlobal(state => state.initialized);

  const authenticated = useGlobal(state => state.authenticated);

  const init = useGlobal(state => state.init);



  useEffect(() => {
    init(); // Initialize global state



    // Set a timeout to hide splash screen after 1000 milliseconds (1 second)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    // Clear the timeout on unmount to prevent memory leaks
    return () => clearTimeout(timer);
  }, []);

  // Render splash screen if showSplash is true, otherwise render other screens based on initialized and authenticated states
  return (
    <NavigationContainer theme={LightTheme}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator>
        {showSplash ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            {!initialized || !authenticated ? (
              <>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="Messages" component={MessagesScreen} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
