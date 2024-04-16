import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import logo from '../assets/Logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/LoginProvider';

const Auth = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [referencePhoneNumber, setReferencePhoneNumber] = useState('');
  const {setRole} = useLogin();

  const validatePhoneNumber = (number) => {
    return /^\d{10}$/.test(number);
  };

  const submitPhoneNumber = () => {
    if ((referenceName && validatePhoneNumber(referencePhoneNumber)) || validatePhoneNumber(phoneNumber)) {
      console.log("Phone Number Submitted.");
      navigation.navigate("Eye", { phoneNumber: phoneNumber, referencePhoneNumber: referencePhoneNumber, referenceName: referenceName });
    } else {
      Alert.alert('Invalid Input', 'Please enter either a valid phone number \n\tOR \nBoth reference name and reference phone number.');
    }
  };

  const handleLogout = async() => {
    await AsyncStorage.clear();
    setRole(null);
    navigation.navigate("LoginPage");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <Image source={logo} style={styles.logo} />
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor={"gray"}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        <View style={styles.orContainer}>
          <Text style={styles.orText}>OR</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reference Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reference name"
            value={referenceName}
            placeholderTextColor={"gray"}
            onChangeText={(text) => setReferenceName(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reference Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reference phone number"
            value={referencePhoneNumber}
            placeholderTextColor={"gray"}
            onChangeText={(text) => setReferencePhoneNumber(text)}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={submitPhoneNumber}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Background color
  },
  formContainer: {
    width: '80%',
    padding: 20, // Increased padding for better spacing
    backgroundColor: 'white', // Form background color
    borderRadius: 10, // Rounded corners
    elevation: 5, // Add shadow
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'black',
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    color: "black",
  },
  button: {
    backgroundColor: 'blue',
    padding: 15, // Increased padding for larger button
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  orText: {
    fontWeight: 'bold',
    color: 'gray', // Color for OR text
  },
  logoutButton: {
    width: 80,
    height: 40,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    position: 'absolute', // Position the button absolutely
    top: 20, // Adjust top spacing as needed
    right: 20, // Align to the right
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default Auth;
