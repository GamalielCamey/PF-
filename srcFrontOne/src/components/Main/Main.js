import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import FootBar from '../FootBar/FootBar';
import HomePage from '../HomePage/HomePage';
import About from '../About/About';
import Profile from '../Profile/Profile';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Main = () => {
    const Stack = createNativeStackNavigator()
    return (
        <NavigationContainer>
           <Stack.Navigator>
            <Stack.Screen name='Home' component={HomePage}></Stack.Screen>
            <Stack.Screen name='About' component={About}></Stack.Screen>
            <Stack.Screen name='Profile' component={Profile}></Stack.Screen>
           </Stack.Navigator>
           <FootBar />
        </NavigationContainer>  
    )
}

export default Main;