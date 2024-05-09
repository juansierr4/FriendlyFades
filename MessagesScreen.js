import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Modal, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { getFirestore, collection, query, doc, where, getDoc, getDocs, addDoc, serverTimestamp, onSnapshot, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styles } from './AppStyles.js';

const MessagesScreen = ({ navigation }) => {
    const [activeChat, setActiveChat] = useState(null);
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
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
        let matches = [];
    
        // Fetch all block statuses once and store in a set for quick lookup
        const blocksRef = collection(db, "blocks");
        const blocksQuery = query(blocksRef, where("blockerId", "==", currentUser.uid));
        const blockedSnapshot = await getDocs(blocksQuery);
        const blockedUsers = new Set(blockedSnapshot.docs.map(doc => doc.data().blockedUserId)); // Note the field name
    
        for (const doc of querySnapshot.docs) {
          const { userIds } = doc.data();
          const otherUserId = userIds.find(id => id !== currentUser.uid);
    
          // Continue if the other user is in the blockedUsers set
          if (blockedUsers.has(otherUserId)) {
            continue; // Skip this user entirely
          }
    
          const userRef = collection(db, "users");
          const qUser = query(userRef, where("uid", "==", otherUserId));
          const otherUserDoc = await getDocs(qUser);
          if (!otherUserDoc.empty) {
            const userData = otherUserDoc.docs[0].data();
            matches.push({ id: otherUserDoc.docs[0].id, ...userData });
          }
        }
        setMatchedUsers(matches);
      };
      fetchMatchedUsers();
    }, [auth.currentUser]);    
    
    const sendMessage = async () => {
      if (currentMessage.trim().length > 0 && currentUserData){
        const chatId = [auth.currentUser.uid, activeChat.id].sort().join('_');
        const messagesRef = collection(db, "chats", chatId, "messages");
        const newMessage = {
          text: currentMessage,
          createdAt: serverTimestamp(),
          senderName: currentUserData.name,
          senderId: auth.currentUser.uid,
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
                <TouchableOpacity onPress={() => {
                  setActiveChat(null);
                  navigation.navigate('SelectedUser', {userData: activeChat})}}>
                  <Image source={{ uri: activeChat.profileImageUrl }} style={{width: 100, height: 100, borderRadius: 50}} />
                </TouchableOpacity>
                <Text style={[styles.name, { color: 'gray' }]}>{activeChat.name}</Text>
                <FlatList
                  data={messages}
                  keyExtractor={(item) => item.id || `fallback-${Math.random()}`}
                  renderItem={renderMessage}
                />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                  <TextInput
                    style={styles.chatinput}
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChangeText={setCurrentMessage}
                  />
                </KeyboardAvoidingView>
                <TouchableOpacity style={styles.messagesButton} onPress={sendMessage}>
                  <Text style={{ color: 'white', fontFamily: 'Impact' }}>Send</Text>
                </TouchableOpacity>  
                <TouchableOpacity style={styles.messagesButton} onPress={() => setActiveChat(null)}>
                  <Text style={{ color: 'white', fontFamily: 'Impact' }}>Close</Text>
                </TouchableOpacity>  
              </View>
            </Modal>
        )}
      </View>
    );
};

export default MessagesScreen;