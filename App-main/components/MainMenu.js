import React, { Component, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { initializeApp } from 'firebase/app';
import { useFocusEffect } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const firebaseConfig = { // this should probably be hidden if public release.
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

const MainMenu = ({ route, navigation }) => {
    const [businessList, setBusinessList] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      // Retrieve the login status from navigation params
      const isLoggedInParam = route.params?.isLoggedIn || false;
      setIsLoggedIn(isLoggedInParam);
  
      // Fetch the list of businesses from Firestore
      getBusinesses();
    }, [route.params?.isLoggedIn]);

    // Get a list of cities from your database
    async function getBusinesses() {
        try {
          const businessCol = collection(db, 'businesses');
          const businessSnapshot = await getDocs(businessCol);
    
          const businessList = await Promise.all(businessSnapshot.docs.map(async (doc) => {
            const productInventoryCol = collection(doc.ref, 'productInventory');
            const productInventorySnapshot = await getDocs(productInventoryCol);
            if (!productInventorySnapshot.empty) {
              return doc.data().businessName;
            }
            return null;
          }));
    
          const filteredBusinessList = businessList.filter(business => business !== null);
          setBusinessList(filteredBusinessList);
        } catch (error) {
          console.error("Error fetching businesses:", error);
        }
      }
    
      return (
        <View style={styles.container}>
          {businessList.map((business, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => navigation.navigate('My Data', { business })}
            >
              <Text style={styles.buttonText}>{business}</Text>
            </TouchableOpacity>
          ))}
          {isLoggedIn && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Inventory')}
              style={{ position: 'absolute', bottom: 20, right: 20 }}
            >
              <Text style={{ fontSize: 30, color: 'white', backgroundColor: 'blue', padding: 10, borderRadius: 50 }}>+</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.lockButton}
            onPress={() => navigation.navigate('Login')}
          >
            {/* Use the Icon component to display the lock icon */}
            <Icon name="lock" size={30} color="white" />
          </TouchableOpacity>
        </View>
      );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30
    },
    button: {
        backgroundColor: '#0080ff',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    circleButton: {
        backgroundColor: '#0080ff',
        width: 250,
        height: 250,
        borderRadius: 150,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 150,
    },
    circleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24
    },
    lockButton: {
        backgroundColor: 'blue',
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MainMenu;
