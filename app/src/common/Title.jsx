import React from "react";
import { Text} from "react-native";
import {
  useFonts,
  LeckerliOne_400Regular,
} from "@expo-google-fonts/leckerli-one";

export default ({ text, color }) => {
  let [fontsLoaded] = useFonts({
    LeckerliOne_400Regular,
  });

  let fontSize = 40;
  let paddingVertical = 6;

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  } else {
    return (
      
        <Text
          style={{
            textAlign:'center',
            color: color,
            fontSize: 50,
            paddingVertical,
            fontFamily: "LeckerliOne_400Regular",
            marginBottom: 30,
            textShadowColor: 'rgba(0, 0, 0, 0.5)', // Shadow color
            textShadowOffset: { width: 2, height: 2 }, // Shadow offset
            textShadowRadius: 5, // Shadow radius

          }}
        >
          {text}
        </Text>
    );
  }
};
