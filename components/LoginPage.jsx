import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/LoginProvider';

const LoginPage = ({navigation}) => {
    const {role,setRole} = useLogin();
    const userAuthentication = async()=>{
        await AsyncStorage.setItem('role','user');
        setRole("user");
        navigation.navigate("Auth");
    }
    const adminAuthentication = async()=>{
        // await AsyncStorage.setItem('role','admin');
        // setRole("admin");
        navigation.navigate("AdminDetailsPage");
    }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={adminAuthentication}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.userButton]} onPress={userAuthentication}>
        <Text style={styles.buttonText}>User</Text>
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
  userButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default LoginPage;
