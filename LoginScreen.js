import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebaseConfig.js';
import { styles } from './AppStyles.js';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth(app);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        Alert.alert("Logged in with: ", user.email);
        navigation.navigate('MainApp');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("LoginError", error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
      <View style={[styles.container, { justifyContent: 'center', paddingBottom: 120 }]}>
        <Text style={[styles.title, { marginBottom: 40 }]}>Friendly Fades</Text>
        <Text style={styles.tmtitle}>Swipe up</Text>
        <Text style={styles.tmtitle2}>to Square Up</Text>
        
        <TextInput
          style={styles.importantinput}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          autoFocus={true}
        />
        <TextInput
          style={styles.importantinput}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default LoginScreen;
