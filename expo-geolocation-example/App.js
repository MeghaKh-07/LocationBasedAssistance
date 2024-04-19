import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Address from './Screens/Address';
import Home from './Screens/Home';
import HelpPage from './Screens/HelpPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome' headerShown='false'>
        <Stack.Screen name='Address' component={Address} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='HelpPage' component={HelpPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


