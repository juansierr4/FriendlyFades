import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Modal, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { styles } from './AppStyles.js';
import { getFirestore, collection, query, doc, where, getDoc, getDocs, addDoc, serverTimestamp, onSnapshot, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

//Beginning of MessagesScreen Component
const MessagesScreen = ({ navigation }) => {
    const [activeChat, setActiveChat] = useState(null);
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [messages, setMessages] = useState([]); // Initialize state to store messages
    const [currentMessage, setCurrentMessage] = useState(""); // State for the input field
    const [currentUserData, setCurrentUserData] = useState(null);
    const db = getFirestore();
    const auth = getAuth();
  
    
    useEffect(() => {
      const fetchCurrentUserData = async () => {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
    
        if (docSnap.exists()) {
          setCurrentUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };
    
      fetchCurrentUserData();
    }, []);

    useEffect(() => {
      const fetchMatchedUsers = async () => {
        const currentUser = auth.currentUser;
        const matchesRef = collection(db, "matches");
        const q = query(matchesRef, where("userIds", "array-contains", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const matches = [];
    
        for (const doc of querySnapshot.docs) {
          const { userIds } = doc.data();
          const otherUserId = userIds.find(id => id !== currentUser.uid);
          const userRef = collection(db, "users");
          const qUser = query(userRef, where("uid", "==", otherUserId));
          const otherUserDoc = await getDocs(qUser);
          otherUserDoc.forEach(doc => {
            matches.push({ id: doc.id, ...doc.data() });
          });
        }
        setMatchedUsers(matches);
      };
      fetchMatchedUsers();
    }, []);

    const sendMessage = async () => {
      if (currentMessage.trim().length > 0 && currentUserData){
        const chatId = [auth.currentUser.uid, activeChat.id].sort().join('_');
        const messagesRef = collection(db, "chats", chatId, "messages");
        const newMessage = {
          text: currentMessage,
          createdAt: serverTimestamp(), // Timestamp for sorting
          senderName: currentUserData.name, // This should be dynamically fetched or stored in state/context
          senderId: auth.currentUser.uid, // Sender ID
        };

        try {
          await addDoc(messagesRef, newMessage);
          setCurrentMessage("");
        } catch (error) {
          console.error("Error sending message: ", error);
        }

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setCurrentMessage("");
      }
    };

    const renderMessage = ({ item }) => {
      const isMessageOutgoing = item.senderId === auth.currentUser.uid;
      const messageStyle = isMessageOutgoing ? styles.messageBubbleOutgoing : styles.messageBubble;
      const messageText = `${item.senderName}: ${item.text}`;

      return(
        <View style={styles.messageContainer}>
      <View style={messageStyle}>
      <Text style={styles.messageText}>{messageText}</Text>
      </View>
      </View>
      );
    };

    const renderConversation = ({ item }) => (
      <TouchableOpacity
      style={styles.conversation}
      onPress={() => setActiveChat(item)}>
        <Image source={{ uri: item.profileImageUrl }} style={{width: 50, height: 50, borderRadius: 25}} />
        <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      </TouchableOpacity>
    );

  const navigateToSelectedUser = (userData) => {
    setActiveChat(null); // This will close the modal view
    navigation.navigate('SelectedUser', { userData });
  };

    useEffect(() => {
      if (activeChat) {
        const chatId = [auth.currentUser.uid, activeChat.id].sort().join('_');
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedMessages = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Use Firestore document ID
            ...doc.data(),
          }));
          console.log(fetchedMessages);
          setMessages(fetchedMessages);
        });
    
        return () => unsubscribe(); // Unsubscribe from messages listener when component unmounts
      }
    }, [activeChat, db]);

      return (
      <View style={styles.container}>
        <FlatList
          data={matchedUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}/>
          {activeChat && (
        <Modal
            animationType="slide"
            transparent={true}
            visible={activeChat !== null}
            onRequestClose={() => setActiveChat(null)}
        >
          
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => navigateToSelectedUser(activeChat)}>
              <Image source={{ uri: activeChat.profileImageUrl }} style={{width: 100, height: 100, borderRadius: 50}} />
            </TouchableOpacity>
            <Text style={[styles.name, { color: 'gray' }]}>{activeChat.name}</Text>
            {/* Chat messages */}
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id || `fallback-${Math.random()}`}
              renderItem={renderMessage}
            />
            {/* Message input and send button */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <TextInput
                style={styles.chatinput}
                placeholder="Type a message..."
                value={currentMessage}
                onChangeText={setCurrentMessage}
              />
              
            </KeyboardAvoidingView>
              {activeChat.images && Array.isArray(activeChat.images) && (
                <ScrollView horizontal={true}>
                  {activeChat.images.map((image, index) => (
                      <Image key={index} source={{ uri: image }} style={{width: 100, height: 100}} />
                  ))}
              </ScrollView>
              )}

              <TouchableOpacity style={styles.messagesButton} onPress={sendMessage}>
              <Text style={{ color: 'white', fontFamily: 'Impact' }}>Send</Text>
              </TouchableOpacity>  
              <TouchableOpacity style={styles.messagesButton} onPress={() => setActiveChat(null)}>
              <Text style={{ color: 'white', fontFamily: 'Impact' }}>Close</Text>
              </TouchableOpacity>  
          </View>
      </Modal>
  )
}
      </View>
      );
  }
  //End of MessagesScreen Component

  export default MessagesScreen;