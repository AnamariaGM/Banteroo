import { TouchableOpacity, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function Button({ title, onPress }) {
    const scaleValue = new Animated.Value(1); // Initial scale value for the button

    // Function to handle button press animation
    const handlePressIn = () => {
        // Scale down the button when pressed
        Animated.timing(scaleValue, {
            toValue: 0.95,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    // Function to handle button release animation
    const handlePressOut = () => {
        // Scale up the button to its original size when released
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
        >
            <Animated.View
                style={[
                    styles.buttonContainer,
                    { transform: [{ scale: scaleValue }] }, // Apply scale animation to the button
                ]}
            >
                <LinearGradient
                    colors={['#ff7e67', '#ff4b5c']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                >
                    <Text style={styles.buttonText}>{title}</Text>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 26,
        overflow: 'hidden',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    buttonGradient: {
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Button;
