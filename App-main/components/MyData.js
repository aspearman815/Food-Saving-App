import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
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
const db = getFirestore(app)

class MyData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  async componentDidMount() {
    try {
      console.log(this.props.route.params.business)
      const businessName = this.props.route.params.business;

      const products = await this.getProductInventory(businessName);
      this.setState({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async getProductInventory(businessName) {
    const businessRef = doc(db, 'businesses', businessName);
    console.log(businessRef)
    const inventoryCol = collection(businessRef, 'productInventory');
    console.log(inventoryCol)
    const inventorySnapshot = await getDocs(inventoryCol, { source: "server", subcollections: true});
    console.log(inventorySnapshot)

    // Create an array to store the subcollection data
    const productList = [];
  
    // Loop through each document in the subcollection
    for (const docSnapshot of inventorySnapshot.docs) {
      const productData = docSnapshot.data();
      
      // Get the document ID and add it to the data object
      const productId = docSnapshot.id.toString();
      console.log(productId)
      productData.productId = productId;
      
      // Push the data to the array
      productList.push(productData);
    }
    return productList;
  }

  sortProductsByPrice = () => {
    const { products } = this.state;
    const sortedProducts = [...products].sort((a, b) => a.Price - b.Price);
    this.setState({ products: sortedProducts });
  };

  render() {
    const { products } = this.state;
    console.log(this.state.products)
    return (
      <View style={styles.container}>
        {products.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <Text style={styles.productName}>{product.productId}: ${product.Price} Quantity: {product.Quantity} Unit: {product.Unit}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.sortButtonContainer} onPress={this.sortProductsByPrice}>
          <Text style={styles.sortButtonText}>Sort by Price</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20
  },
  sortButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30
  },
  productItem: {
    marginBottom: 20
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  productPrice: {
    fontSize: 16
  },
  productQuantity: {
    fontSize: 16
  },
  productID: {
    fontSize: 16
  },
  productUnit: {
    fontSize: 16
  }
});
export default MyData;
