import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Button, Modal } from 'react-native';
import { styles } from './AppStyles'; // Assuming this import path is correct
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const SelectedUser = ({ route, navigation }) => {
  const { userData } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [reportReason, setReportReason] = useState(""); // State to store the report reason


  const db = getFirestore();
  const auth = getAuth();

  // Determine if the current image is the first one to decide what details to show
  const showDetails = currentImageIndex === 0;

  const handleMoreOptions = () => {
    setModalVisible(!modalVisible);

  };

  const handleReportUser = async (reportedUserId, reason) => {
    if (!reportReason.trim()) {
      Alert.alert("Report Error", "Please provide a reason for reporting.");
      return;
    }
    const reporterId = auth.currentUser.uid;

    try {
      await addDoc(collection(db, "reports"), {
        reporterId,
        reportedUserId,
        reason,
        timestamp: serverTimestamp(),
      });
      Alert.alert("User Reported", "Thank you for reporting. We will investigate the matter.");
      console.log("User reported successfully.");
      // Optionally, show a confirmation message or navigate back
    } catch (error) {
      console.error("Error reporting user: ", error);
    }
    setModalVisible(false);
    setReportReason(""); // Reset the report reason
  };

  const handleBlockUser = async (blockedUserId) => {
    const blockerId = auth.currentUser.uid;

    try {
      await addDoc(collection(db, "blocks"), {
        blockerId,
        blockedUserId,
        timestamp: serverTimestamp(),
    });
    console.log("User blocked successfully.");
    // Optionally, navigate back or refresh the component to reflect the block
    Alert.alert("User Blocked", "The user has been successfully blocked.");
    setModalVisible(false);
    } catch (error) {
    console.error("Error blocking user: ", error);
    }
  };

  const handleTapImage = () => {
    const nextIndex = currentImageIndex + 1 < userData.profileImageUrls.length ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIndex);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={handleTapImage}
        activeOpacity={1}
      >
        <Image
          source={{ uri: userData.profileImageUrls[currentImageIndex] }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.moreOptionsButton} onPress={handleMoreOptions}>
          <Text style={styles.moreOptionsText}>•••</Text>
        </TouchableOpacity>

        <View style={styles.textSection}>
          <Text style={styles.nameText}>{userData.name}</Text>
          {showDetails ? (
            <>
              <Text style={styles.detailsText}>Age: {userData.age}</Text>
              <Text style={styles.detailsText}>Height: {userData.height}</Text>
              <Text style={styles.detailsText}>Weight: {userData.weight}lbs</Text>
            </>
          ) : (
            <Text style={styles.bioText}>{userData.bio}</Text>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button title="Block User" onPress={() => handleBlockUser(userData.id)} />
            <Button title="Report User" onPress={() => handleReportUser(userData.id)} />
            <Button title="Cancel" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.messagesButton} onPress={() => navigation.goBack()}>
        <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Impact' }}>Go Back</Text>
        </TouchableOpacity>     
        </View>
  );
};

export default SelectedUser;
