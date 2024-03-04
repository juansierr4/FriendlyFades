import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './AppStyles.js';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig'; // Assuming your config is exported from this file

const conversations = [
  {id: '1', name: 'User 1', lastMessage: 'Hey, How are you?'},
  {id: '2', name: 'User 2', lastMessage: 'When we fighting?'},
];
//Beginning of MessagesScreen Component
const MessagesScreen = () => {
    const [activeChat, setActiveChat] = useState(null);
  
    const renderConversation = ({ item }) => (
      <TouchableOpacity
      style={styles.conversation}
      onPress={() => setActiveChat(item.name)}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </TouchableOpacity>
    );
      return (
      <View style={styles.container}>
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderConversation}/>
            <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.chatInputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#fff"
            />
            <Button title="Send" onPress={() => {}}/>
          </KeyboardAvoidingView>
      </View>
      );
  }
  //End of MessagesScreen Component

  export default MessagesScreen;