import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { styles } from './AppStyles.js';


function CreateAccount({ navigation }) {
  const auth = getAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const db = getFirestore();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        // User has been successfully created
        const user = userCredentials.user;
        console.log('Registered with:', user.email);

        const userRef = doc(db, "users", user.uid);
        setDoc(userRef, {
          name: name,
          age: age,
          height: height,
          weight: weight,
          bio: bio,
        }).then(() => {
          console.log('User additional info added to Firestore')
          navigation.navigate('MainApp');
        }).catch((error) => {
          console.error("Error adding user data to FireStore: ", error);
        });
      })
        .catch((error) => {
          console.error(error);
          Alert.alert("Sign Up Error", error.message);
        });
  };

return (
    <View style={styles.container}>
      <Text style={styles.title}>Squareup App</Text>
      <Text style={styles.smalltitle}>Fill out some info before squaring up</Text>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}/>
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#999"
        value={age}
        onChangeText={setAge}/>
      <TextInput
        style={styles.input}
        placeholder="Height"
        placeholderTextColor="#999"
        value={height}
        onChangeText={setHeight}/>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        placeholderTextColor="#999"
        value={weight}
        onChangeText={setWeight}/>
      <TextInput
        style={styles.importantinput}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}/>
        <TextInput
        style={styles.importantinput}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      </KeyboardAvoidingView>
      <TouchableOpacity style={styles.button} onPress={(handleSignUp)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CreateAccount;