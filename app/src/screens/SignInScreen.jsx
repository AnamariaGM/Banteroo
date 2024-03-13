
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,StyleSheet
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLayoutEffect, useState } from "react";
import Title from "../common/Title";
import Input from "../common/Input";
import Button from "../common/Button";
import axios from "axios";

import api from "../core/api";
import utils from "../core/utils";
import useGlobal from "../core/global";

function SignInScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const login = useGlobal((state) => state.login);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  function onSignIn() {
    console.log("onSignIn", username, password);

    //check username
    const failUsername = !username;
    if (failUsername) {
      setUsernameError("Username not provided");
    }

    //check password
    const failPassword = !password;
    if (failPassword) {
      setPasswordError("Password not provided");
    }

    //break out of this function if there were any issues
    if (failUsername || failPassword) {
      return;
    }

    //make signin request

    api({
      method: "POST",
      url: "/chat/signin/",
      data: {
        username: username,
        password: password,
      },
    })
      .then((response) => {
        const credentials = {
          username: username,
          password: password,
        };
        utils.log("Sign In:", response.data);
        login(credentials, response.data.user, response.data.tokens);
      })
      .catch((error) => {
        if (error.response) {
          console.log("Error", error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log("Error", error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log("Error", error.config);
      });
  }

  return (
    <LinearGradient
      colors={["#6a9cfd", "#ffb8d0"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="height" style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.contentContainer}>
              <Title text="Banteroo" color="white" />

              <Input
                title="Username"
                value={username}
                error={usernameError}
                setValue={setUsername}
                setError={setUsernameError}
              />

              <Input
                title="Password"
                value={password}
                error={passwordError}
                setValue={setPassword}
                setError={setPasswordError}
                secureTextEntry={true}
              />

              <Button title="Sign In" onPress={onSignIn}></Button>

              <Text style={styles.signUpText}>
                Don't have an account?{" "}
                <Text
                  onPress={() => {
                    navigation.navigate("SignUp");
                  }}
                  style={styles.signUpLink}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  signUpText: {
    textAlign: "center",
    marginTop: 40,
    color: "white",
  },
  signUpLink: {
    color: "blue",
  },
});

export default SignInScreen;