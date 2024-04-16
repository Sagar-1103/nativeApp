import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDetailsPage = ({navigation}) => {
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const {setRole} = useLogin();
  const name = "Omkar";
  const email = "omkar@gmail.com";
  const password = "12345678";

  const handleSignUp = async() => {
    if (!adminEmail || !adminName || !adminPassword) {
      Alert.alert("Please enter all the details.");
      return;
    }
    if (adminName!==name || adminEmail!==email || adminPassword!==password ) {
      Alert.alert("Please enter correct Credentials");
      return;
    }
    await AsyncStorage.setItem('role','admin');
    setRole("admin");
    navigation.navigate("AdminPage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={adminName}
        onChangeText={setAdminName}
        placeholderTextColor={"gray"}
        autoCapitalize='words'
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={adminEmail}
        onChangeText={setAdminEmail}
        keyboardType="email-address"
        placeholderTextColor={"gray"}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={adminPassword}
        onChangeText={setAdminPassword}
        placeholderTextColor={"gray"}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:"black"
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color:"black"
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminDetailsPage;
