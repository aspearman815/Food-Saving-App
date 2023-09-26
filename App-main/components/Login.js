import React, { Component } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = { // this should probably be hidden if public release.
  apiKey: "AIzaSyB4GLO6MfaIv9EyTBfNiGz1Ul0er3iBdLo",
  authDomain: "labs-api-379322.firebaseapp.com",
  projectId: "labs-api-379322",
  storageBucket: "labs-api-379322.appspot.com",
  messagingSenderId: "739148695691",
  appId: "1:739148695691:web:bf85ee765326d77970ec8e",
  measurementId: "G-CDMB3FCH02"
};

const app = initializeApp(firebaseConfig); //setup firebase
const db = getFirestore(app);


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleLogin = async () => {
    const { username, password } = this.state;

    // Query the Firestore collection for the entered username and password
    const querySnapshot = await getDocs(
      query(collection(db, "businesses"), where("username", "==", username), where("password", "==", password))
    );

    if (querySnapshot.empty) {
      Alert.alert("Login Failed", "Invalid username or password");
      return;
    }

    const user = querySnapshot.docs[0].data();
    businessName = String(user.businessName)
    console.log("Logged in as " + businessName)

    // Navigate to the Main Menu screen with the retrieved business data
    this.props.navigation.navigate("MainMenu", {businessName, isLoggedIn: true});
  };


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login Screen</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => this.props.navigation.navigate("Sign Up")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#0080ff",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: "#ff8000",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Login;
