import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginProvider from './context/LoginProvider';
import AppNavigation from './navigation/AppNavigation';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

const App = () => {
 
  return (
    <LoginProvider>
    <NavigationContainer>
      <AppNavigation/>
    </NavigationContainer>
    </LoginProvider>
  );
};

export default App;
