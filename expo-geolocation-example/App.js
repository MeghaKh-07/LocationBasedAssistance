import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Address from './Screens/Address';
import Home from './Screens/Home';
import HelpPage from './Screens/HelpPage';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/RegisterScreen';
import HighwayAmenities from './Screens/HighwayAmenties/Restraunt';
import VehicleBreakdownPage from './Screens/HighwayAmenties/VehicleBreakdown';
import LockoutHelp from './Screens/HighwayAmenties/Lockout';
import FuelShortageService from './Screens/HighwayAmenties/FuelShortage';
import Fire from './Screens/HighwayAmenties/Fire';
import LostOrStrandedHelp from './Screens/HighwayAmenties/LostStranded';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' component={Home} headerShown='false'>
        <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
        <Stack.Screen name={'SignUpScreen'} component={SignupScreen} />
        <Stack.Screen name='Address' component={Address} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='HelpPage' component={HelpPage} />
        <Stack.Screen name="HighwayAmenities" component={HighwayAmenities} />
        <Stack.Screen name="VehicleBreakdownPage" component={VehicleBreakdownPage} />
        <Stack.Screen name="lockout" component={LockoutHelp}/>
        <Stack.Screen name="FuelShortage" component={FuelShortageService}/>
        <Stack.Screen name="FireEmergency" component={Fire}/>
        <Stack.Screen name="LostorStranded" component={LostOrStrandedHelp}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


