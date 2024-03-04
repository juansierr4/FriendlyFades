import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from './AppStyles.js';
import { auth } from './firebaseConfig.js'; 


export function PhoneNumberScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const sendVerificationCode = async () => {
    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      if (formattedPhoneNumber.length < 10) { // Adjust minimum length as needed
        Alert.alert('Error', 'Please enter a valid phone number (minimum 10 digits).');
        return;
      }

      const confirmationResult = await auth.signInWithPhoneNumber(formattedPhoneNumber);
      setConfirmation(confirmationResult);
      navigation.navigate('ConfirmationScreen', { confirmation: confirmationResult });
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', error.message); // Inform user about the error
    }
  };

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
      <TouchableOpacity style={styles.button} onPress={sendVerificationCode}>
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
}

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
        <Text style={styles.title}>Welcome to Squareup App</Text>
        <Text style={styles.text}>Before you start, here are some house rules:</Text>
        {/* Insert your app's house rules here */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.buttonText}>Agree and Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
