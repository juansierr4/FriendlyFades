import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from './AppStyles.js';
//import messaging from '@react-native-firebase/messaging';

export function PhoneNumberScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (confirmation) {
            // Navigate to the confirmation screen once confirmation state is set
      navigation.navigate('ConfirmationScreen', { confirmation });
    }
  }, [confirmation, navigation]);

  const sendVerificationCode = async () => {
    try {
      const fcmToken = await messaging().getToken(); // Assuming this is necessary for your logic
  
      const response = await fetch('https://us-central1-squareupapp-2024.cloudfunctions.net/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, fcmToken }),
      });
  
      const responseData = await response.json();
      console.log('Verification triggered successfully:', responseData);
      // Assuming the server responds with the confirmation object or some identifier
      setConfirmation(responseData.confirmation);
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    }
  };
  const handleSendCodePress = async () => {
    await sendVerificationCode();
    }



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={navigation.navigate('NameInput')}>
        <Text style={styles.buttonText}>Send Code</Text>
      </TouchableOpacity>
      {confirmation && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ConfirmationScreen', { confirmation })}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export function ConfirmationScreen({ navigation, route }) {
  const { confirmation } = route.params; // Destructure confirmation from route params
  const [code, setCode] = useState('');

  const verifyCode = async () => {
    if (!confirmation) {
      console.error('Confirmation object is undefined. Handle the error gracefully.');
      return; // Optionally navigate back or show an error message.
    }

    try {
      if (code.length !== 6) {
        Alert.alert('Error', 'Please enter a valid 6-digit code.');
        return;
      }

      await confirmation.confirm(code);
      // Code is correct, navigate to the next screen or do something else
      navigation.navigate('EmailInputScreen');
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', error.message); // Inform user about the error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the Confirmation Code</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit Code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={verifyCode}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

export function EmailInputScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's Your Email?</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('WelcomeScreen')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
  export function WelcomeScreen({ navigation }) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to Friendly Fades</Text>
        <Text style={styles.text}>Before you start, here are some house rules:</Text>
        {/* Insert your app's house rules here */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.buttonText}>Agree and Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
