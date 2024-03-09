import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithCredential, OAuthProvider } from 'firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { styles } from './AppStyles.js';


/* Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '177546169082-jt4j2fiv6m9ol0i20nriiraunr2hlhor.apps.googleusercontent.com', // Replace with your actual web client ID
}); */

function SignUpScreen({ navigation }) {
  const auth = getAuth();

  /*
  const signInWithGoogleAsync = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
      // Handle the successful sign-up here (e.g., navigate to your main app screen)
      navigation.navigate('MainApp');
    } catch (error) {
      Alert.alert("Google Sign-Up Error", error.message);
    }
  };*/

  const signInWithAppleAsync = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const credential = new OAuthProvider('apple.com').credential({
        idToken: appleAuthRequestResponse.identityToken,
      });

      await signInWithCredential(auth, credential);
      // Handle the successful sign-up here (e.g., navigate to your main app screen)
      navigation.navigate('MainApp');
    } catch (error) {
      Alert.alert("Apple Sign-Up Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Squareup App</Text>
      <Text style={styles.tmtitle}>Swipe up</Text>
      <Text style={styles.tmtitle2}>to Square Up</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PhoneNumberScreen')}>
        <Text style={styles.buttonText}>Create an Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={signInWithAppleAsync}>
        <Text style={styles.buttonText}>Sign Up with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignUpScreen;
