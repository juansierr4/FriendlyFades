import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { styles } from './AppStyles.js'; // Ensure your styles are defined to reflect your app's design

function NameInputScreen({ navigation }) {
  const [name, setName] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.title}>Enter your name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AgeInputScreen', { name })}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
