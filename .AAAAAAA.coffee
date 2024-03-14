import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Button } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styles } from './AppStyles.js';

const HomeScreen = () => {
  const [users, setUsers] = useState([]); // State to store other users' data
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swiperKey, setSwiperKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

    useEffect(() => {
        const fetchUsersData = async () => {
        const currentUser = auth.currentUser;
        const dbSwipesRef = collection(db, "swipes");
        const swipesQuery = query(dbSwipesRef, where("swiperId", "==", currentUser.uid));
        let swipedUserIds = [];
    
        try {
            const swipesSnapshot = await getDocs(swipesQuery);
            swipedUserIds = swipesSnapshot.docs.map(doc => doc.data().swipedId);
    
            const usersRef = collection(db, "users");
            const usersQuery = query(usersRef, where("uid", "not-in", [...swipedUserIds, currentUser.uid]));
    
            const usersSnapshot = await getDocs(usersQuery);
            const usersData = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            images: doc.data().profileImageUrls // Adjust based on your actual image field
            }));
    
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        };
    
        fetchUsersData();
    }, [auth.currentUser]);

  const handleMoreOptions = (userId) => {
    setSelectedUser(userId);
    setModalVisible(true);
  };

  const handleBlockUser = async () => {
    console.log(`Blocking user ${selectedUser}`);
    // Implement blocking logic here...
    setModalVisible(false);
  };

  const handleReportUser = async () => {
    console.log(`Reporting user ${selectedUser}`);
    // Implement reporting logic here...
    setModalVisible(false);
  };

  const handleTapImage = (userId) => {
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [userId]: (prevIndices[userId] !== undefined ? (prevIndices[userId] + 1) % users.find(user => user.id === userId).images.length : 1),
    }));
    setSwiperKey(prevkey => prevkey + 1);
  };

  const handleSwipe = (cardIndex) => {
    setCurrentCardIndex(cardIndex + 1);
  };

  const handleSwipeTop = async (cardIndex) => {
    const swipedUserId = users[cardIndex].id;
    const swiperId = auth.currentUser.uid;

    await addDoc(collection(db, "swipes"), {
      swiperId,
      swipedId: swipedUserId,
      action: "like",
      timestamp: serverTimestamp(),
    });

    checkForMatch(swiperId, swipedUserId);
  }

const handleSwipeBottom = async (cardIndex) => {
  const swipedUserId = users[cardIndex].id;
  const swiperId = auth.currentUser.uid;

  await addDoc(collection(db, "swipes"), {
    swiperId,
    swipedId: swipedUserId,
    action: "dislike",
    timestamp: serverTimestamp(),
  });
};

const checkForMatch = async (swiperId, swipedUserId) => {
  const swipesRef = collection(db, "swipes");
  // Query for swipes where the swiped user has liked the swiper
  const q = query(swipesRef, where("swiperId", "==", swipedUserId), where("swipedId", "==", swiperId), where("action", "==", "like"));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Match found, create a new document in the 'matches' collection
    const matchEntry = {
      userIds: [swiperId, swipedUserId],
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "matches"), matchEntry);
    console.log(`Match found between ${swiperId} and ${swipedUserId}`);
  }
};

return (
  <View style={styles.container}>
    {users.length > 0 ? (
      <>
        <Swiper
          key={swiperKey}
          backgroundColor='#800000'
          cardHorizontalMargin={0}
          cardVerticalMargin={0}
          verticalSwipe={true}
          horizontalSwipe={false}
          onSwipedTop={handleSwipeTop}
          onSwipedBottom={handleSwipeBottom}
          onSwiped={handleSwipe}
          cardIndex={currentCardIndex}
          stackSize={3}
          stackSeparation={15}
          useViewOverflow={Platform.OS === 'ios'}
          cards={users}
          
          renderCard={(user) => {
            const currentImageIndex = currentImageIndices[user.id] || 0;
            const showDetails = currentImageIndex === 0;

            return (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => handleTapImage(user.id)}
                activeOpacity={1}
              >
                <Image
                  source={{ uri: user.images[currentImageIndex] }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <TouchableOpacity style={styles.moreOptionsButton} onPress={() => handleMoreOptions(user.id)}>
                  <Text style={styles.moreOptionsText}>•••</Text>
                </TouchableOpacity>
                <View style={styles.textSection}>
                  <Text style={styles.nameText}>{user.name}</Text>
                  {showDetails ? (
                    <>
                      <Text style={styles.detailsText}>Age: {user.age}</Text>
                      <Text style={styles.detailsText}>Height: {user.height}</Text>
                      <Text style={styles.detailsText}>Weight: {user.weight}</Text>
                    </>
                  ) : (
                    <Text style={styles.bioText}>{user.bio}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Button title="Block User" onPress={handleBlockUser} />
              <Button title="Report User" onPress={handleReportUser} />
              <Button title="Cancel" onPress={() => setModalVisible(!modalVisible)} />
            </View>
          </View>
        </Modal>
      </>
    ) : (
      <Text>Loading...</Text>
    )}
  </View>
);
}; //End of Home Screen Component

  export default HomeScreen;
