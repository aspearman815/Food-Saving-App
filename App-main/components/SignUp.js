import React, { Component } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyB4GLO6MfaIv9EyTBfNiGz1Ul0er3iBdLo",
    authDomain: "labs-api-379322.firebaseapp.com",
    projectId: "labs-api-379322",
    storageBucket: "labs-api-379322.appspot.com",
    messagingSenderId: "739148695691",
    appId: "1:739148695691:web:bf85ee765326d77970ec8e",
    measurementId: "G-CDMB3FCH02"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessName: "",
      username: ""
    };
  }

  handleSignUp = async () => {
    const { businessName, username } = this.state;

    try {
      // Create a new document under the "businesses" collection
      const docRef = await addDoc(collection(db, "businesses"), {
        businessName,
        username
      });

      console.log("Document created with ID: ", docRef.id);

      // Display a success message
      Alert.alert("Sign Up Successful", "New user has been registered.");

      // Clear the input fields
      this.setState({ businessName: "", username: "" });
    } catch (error) {
      console.error("Error creating document: ", error);
      Alert.alert("Sign Up Failed", "An error occurred while registering.");
    }
    this.props.navigation.navigate("MainMenu");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          onChangeText={(businessName) => this.setState({ businessName })}
          value={this.state.businessName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username}
        />
        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.emailText}>Email eaguilera1@student.gsu.edu to get a password</Text>
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
    paddingTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: "#0080ff",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18
  },
  emailText: {
    marginTop: 20,
    color: "gray"
  }
});

export default SignUp;
