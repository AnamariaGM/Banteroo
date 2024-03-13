// import React, { useState } from "react";
// import { View, Text, TextInput, Animated, Easing } from "react-native";

// function Input({ title, value, setValue, error, setError, secureTextEntry = false }) {
//     const [focusedAnim] = useState(new Animated.Value(0)); // Animated value for focus animation

//     // Function to handle input focus animation
//     const handleFocus = () => {
//         Animated.timing(focusedAnim, {
//             toValue: 1,
//             duration: 150,
//             easing: Easing.linear,
//             useNativeDriver: true,
//         }).start();
//     };

//     // Function to handle input blur animation
//     const handleBlur = () => {
//         Animated.timing(focusedAnim, {
//             toValue: 0,
//             duration: 150,
//             easing: Easing.linear,
//             useNativeDriver: true,
//         }).start();
//     };

//     // Apply scale animation to input container
//     const inputStyle = {
//         transform: [
//             {
//                 scale: focusedAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [1, 0.95],
//                 }),
//             },
//         ],
//     };

//     return (
//         <View>
//             <Text
//                 style={{
//                     color: error ? 'red' : "#70747a",
//                     marginVertical: 6,
//                     paddingLeft: 16,
//                 }}
//             >
//                 {error ? error : title}
//             </Text>
//             <Animated.View style={[inputStyle]}>
//                 <TextInput
//                     autoCapitalize="none"
//                     autoComplete="off"
//                     onFocus={handleFocus}
//                     onBlur={handleBlur}
//                     onChangeText={(text) => {
//                         setValue(text);
//                         if (error) {
//                             setError('');
//                         }
//                     }}
//                     secureTextEntry={secureTextEntry}
//                     style={{
//                         backgroundColor: "white",
//                         borderWidth: 1,
//                         borderColor: error ? 'red' : 'transparent',
//                         borderRadius: 26,
//                         height: 52,
//                         paddingHorizontal: 16,
//                         fontSize: 16,
//                         color: "#333", // Darker text color for better visibility
//                     }}
//                     value={value}
//                 />
//             </Animated.View>
//         </View>
//     );
// }

// export default Input;

import { View, Text, TextInput,  } from "react-native";

function Input({ title, value, setValue, error, setError, secureTextEntry=false }) {
    return (

        <View>
        <Text
          style={{
            color: error ? 'red': "#70747a",
            marginVertical: 6,
            paddingLeft: 16,
          }}
        >
          {error? error: title}
        </Text>
        <TextInput
        autoCapitalize="none"
        autoComplete="off"
        onChangeText={text => {
            setValue(text)
            if (error){
                setError ('')
            }
          }}
        secureTextEntry={secureTextEntry}
          style={{
            backgroundColor: "white",
            borderWidth:1,
            borderColor: error ? 'red': 'transparent',
            borderRadius: 26,
            height: 52,
            paddingHorizontal: 16,
            fontSize: 16,
          }}
          value={value}

        ></TextInput>
      </View>
    );
  }


  export default Input;