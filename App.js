import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import MessagesScreen from './MessagesScreen';
import ProfileScreen from './ProfileScreen';
import SignUpScreen from './SignUpScreen';
import { PhoneNumberScreen, ConfirmationScreen, EmailInputScreen, WelcomeScreen } from './RegistrationScreens';
import CreateAccountScreen from './CreateAccountScreen';
import LoginScreen from './LoginScreen';

import AppIcon from './images/SquareUpAppLogo.png';
import MessageIcon from './images/Message.png';
import ProfileIcon from './images/Profile.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;
          if (route.name === 'Home') iconSource = AppIcon;
          else if (route.name === 'Messages') iconSource = MessageIcon;
          else if (route.name === 'Profile') iconSource = ProfileIcon;
          const iconStyle = focused ? { width: 28, height: 28 } : { width: 24, height: 24 };
          return <Image source={iconSource} style={iconStyle} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailInputScreen" component={EmailInputScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PhoneNumberScreen" component={PhoneNumberScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
