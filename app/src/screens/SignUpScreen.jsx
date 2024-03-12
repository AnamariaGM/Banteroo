import {
  SafeAreaView,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { useLayoutEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import api from "../core/api";
import utils from "../core/utils";
import useGlobal from "../core/global";

function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [firstNameError, setFirstnameError] = useState("");
  const [lastNameError, setLastnameError] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2Error, setPassword2Error] = useState("");

  const login = useGlobal(state=> state.login)


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  function onSignUp() {
    //check username
    const failUsername = !username || username.length < 5;
    if (failUsername) {
      setUsernameError("Username must be >= 5 characters");
    }

    //check firstname
    const failFirstName = !firstName;
    if (failFirstName) {
      setFirstnameError("First Name was not provided");
    }

    //check lastname
    const failLastName = !lastName;
    if (failLastName) {
      setLastnameError("Last Name was not provided");
    }

    //check password
    const failPassword1 = !password1 || password1 < 8;
    if (failPassword1) {
      setPassword1Error("Password is too short");
    }

    //check password match

    const failPassword2 = password1 !== password2;
    if (failPassword2) {
      setPassword2Error("Passwords don't match");
    }

    //break out of this function

    if (
      failUsername ||
      failFirstName ||
      failLastName ||
      failPassword1 ||
      failPassword2
    ) {
      return;
    }

    api({
      method: "POST",
      url: "/chat/signup/",
      data: {
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password1,
      },
    })
      .then((response) => {
        const credentials ={
          username:username,
          password:password1
        }
        utils.log("Sign Up:", response.data);
        login(credentials, response.data.user, response.data.tokens)
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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}
          >
            <Text
              style={{
                textAlign: "center",
                marginBottom: 24,
                fontSize: 36,
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Text>

            <Input
              title="Username"
              value={username}
              error={usernameError}
              setValue={setUsername}
              setError={setUsernameError}
            />
            <Input
              title="First Name"
              value={firstName}
              error={firstNameError}
              setValue={setFirstName}
              setError={setFirstnameError}
            />
            <Input
              title="Last Name"
              value={lastName}
              error={lastNameError}
              setValue={setLastName}
              setError={setLastnameError}
            />
            <Input
              title="Password"
              value={password1}
              error={password1Error}
              setValue={setPassword1}
              setError={setPassword1Error}
              secureTextEntry={true}
            />
            <Input
              title="Retype Password"
              value={password2}
              error={password2Error}
              setValue={setPassword2}
              setError={setPassword2Error}
              secureTextEntry={true}
            />

            <Button title="Sign Up" onPress={onSignUp}></Button>

            <Text
              style={{
                textAlign: "center",
                marginTop: 40,
              }}
            >
              Already have an account?{" "}
              <Text
                onPress={() => {
                  navigation.navigate("SignIn");
                }}
                style={{
                  color: "blue",
                }}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default SignUpScreen;
