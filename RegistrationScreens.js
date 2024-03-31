import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from './AppStyles.js';
import auth from '@react-native-firebase/auth';
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

  const formatPhoneNumberToE164 = (phoneNumber) => {
    const cleaned = (`${phoneNumber}`).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{10})$/);
    return match ? `+1${match[1]}` : null;
  };

  const sendVerificationCode = async () => {
    const formattedPhoneNumber = formatPhoneNumberToE164(phoneNumber);
    
    if (!formattedPhoneNumber){
      Alert.alert('Invalid Phone Number', 'The phone number entered is not valid. Please enter a 10-digit US phone number. With only numbers');
      return;
    }
    try{
      const confirmationResult = await auth().signInWithPhoneNumber(formattedPhoneNumber); // Assuming this is necessary for your logic
      setConfirmation(confirmationResult);
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', error.message);
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
      <TouchableOpacity style={styles.button} onPress={handleSendCodePress}>
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
    try {
      if (code.length !==6) {
        Alert.alert('Error', 'Please enter a valid 6-digit code.');
        return;
      }
      await confirmation.confirm(code);
      navigation.navigate('WelcomeScreen');
    } catch(error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', error.message);
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

  export function WelcomeScreen({ navigation }) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to Friendly Fades</Text>
        <Text style={styles.title}>Before you start, here are some house rules:</Text>
        <Text style={styles.text}>Swipe up, Square up: Find your match, then bring your best game.</Text>
        <Text style={styles.text}>Respect your Rival: Every fade's friendly. Respect on and off the mat</Text>
        <Text style={styles.text}>Safety First: Sparring's fun with supervision. Only roll with pros watching.</Text>
        <Text style={styles.text}>Keep it real: Genuine profiles only. Highlight your real skills and experience</Text>
        <Text style={styles.text}>Manage Your Matches: Your fades, your rules. But always play fair.</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NameInput')}>
          <Text style={styles.buttonText}>Agree and Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
