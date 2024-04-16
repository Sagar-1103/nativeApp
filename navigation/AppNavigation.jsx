import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../components/LoginPage';
import Auth from "../components/Auth";
import Eye from "../components/Eye";
import Pdf from "../components/Pdf";
import AdminPage from "../components/AdminPage";
import Files from "../components/Files";
import { useLogin } from '../context/LoginProvider';
import AdminDetailsPage from '../components/AdminDetailsPage';
import EyeImages from '../components/EyeImages';
import ImageDownload from '../components/ImageDownload';

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
    const {role,setRole} = useLogin();
    useEffect(()=>{
      storageAccess();
      setTimeout(() => {
      }, 1000);
   },[]);
  
   const storageAccess = async()=>{
      const tempRole = await AsyncStorage.getItem('role');
      setRole(tempRole);
   }
   
  return (
      !role ? (
        <Stack.Navigator initialRouteName="LoginPage" screenOptions={{headerShown: false,}}>
        <Stack.Screen name="LoginPage" options={{title:'LoginPage'}} component={LoginPage}/>
        <Stack.Screen name="AdminDetailsPage" options={{title:'AdminDetailsPage'}} component={AdminDetailsPage}/>
      </Stack.Navigator>
      ):role==="user"?(
        <Stack.Navigator initialRouteName="Auth" screenOptions={{headerShown: false,}}>
        <Stack.Screen name="Auth" options={{title:'Auth'}} component={Auth}/>
        <Stack.Screen name="Eye" options={{title:'Eye'}} component={Eye} />
        <Stack.Screen name="Pdf" options={{title:'Pdf'}} component={Pdf} />
      </Stack.Navigator>
      ):(
        <Stack.Navigator initialRouteName="AdminPage" screenOptions={{headerShown: false,}}>
        <Stack.Screen name="AdminPage" options={{title:'AdminPage'}} component={AdminPage}/>
        <Stack.Screen name="Files" options={{title:'Files'}} component={Files}/>
          <Stack.Screen name="Pdf" options={{title:'Pdf'}} component={Pdf} />
          <Stack.Screen name="ImageDownload" options={{title:'ImageDownload'}} component={ImageDownload} />
          <Stack.Screen name="EyeImages" options={{title:'EyeImages'}} component={EyeImages} />
        </Stack.Navigator>
)
  );
};

export default AppNavigation;
