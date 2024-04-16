import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/LoginProvider';

const AdminPage = ({ navigation }) => {
  const {setRole} = useLogin();
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setRole(null)
      navigation.navigate('LoginPage');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Files")}>
        <Text style={styles.buttonText}>Files</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("EyeImages")}>
        <Text style={styles.buttonText}>Eye Images</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
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
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default AdminPage;
