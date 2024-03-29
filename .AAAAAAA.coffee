import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, Animated, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Geolocation from 'react-native-geolocation-service';
import { requestTrackingAuthorization, getTrackingStatus } from 'react-native-tracking-transparency';
import { getGeoHashRange } from 'geofire-common'; // Ensure this is correctly imported
import { styles } from './AppStyles.js';
import { updateUserLocation } from './locationUtils.js'; // Ensure this util is correctly implemented

const HomeScreen = () => {
    const [users, setUsers] = useState([]); // State to store other users' data
    const [currentImageIndices, setCurrentImageIndices] = useState({});
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [swiperKey, setSwiperKey] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [matchModalVisible, setMatchModalVisible] = useState(false);
    const [matchedUserName, setMatchedUserName] = useState('');
    const [matchedUserImageUrl, setMatchedUserImageUrl] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current; 
    
    const db = getFirestore();
    const auth = getAuth();

  useEffect(() => {
    const prepareApp = async () => {
      const trackingStatus = await getTrackingStatus();
      if (trackingStatus === 'not-determined') {
        await requestTrackingAuthorization();
      }
    }

    const requestLocationPermissionAndFetchUsers = () => {
      Geolocation.requestAuthorization('whenInUse');
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Location obtained: ${latitude}, ${longitude}`);
          if (auth.currentUser && auth.currentUser.uid) { // Ensure currentUser and UID are present
            console.log('Updating user location...');
            updateUserLocation(latitude, longitude, auth.currentUser.uid); // Update user location
            console.log('Fetching nearby users...');
            fetchUsersData(latitude, longitude); // Fetch nearby users
          } else {
            console.error('Auth currentUser UID is undefined.');
          }
        },
        (error) => {
          console.error('Error obtaining location:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

    requestLocationPermissionAndFetchUsers();
  };

    if (auth.currentUser) {
      prepareApp();
    }
  }, [auth.currentUser]); // This useEffect depends on the auth.currentUser

  const fetchUsersData = async (latitude, longitude) => {
    if (!auth.currentUser || !latitude || !longitude) {
      console.error('Missing user information or geolocation data.');
      return;
    }
  
    const { lower, upper } = getGeoHashRange(latitude, longitude, 48280); // 48280 meters ≈ 30 miles
  
    if (!lower || !upper) {
      console.error('Invalid geohash range.');
      return;
    }
    
    const swipesRef = collection(db, "swipes");
    const swipesQuery = query(swipesRef, where("swiperId", "==", auth.currentUser.uid));
    const swipesSnapshot = await getDocs(swipesQuery);
    const swipedUserIds = swipesSnapshot.docs.map(doc => doc.data().swipedId);

    const usersRef = collection(db, "users");
    const usersWithinGeohashRange = query(
      usersRef,
      where("geohash", ">=", lower),
      where("geohash", "<=", upper),
      where("uid", "not-in", [auth.currentUser.uid, ...swipedUserIds])
    );
    
    const usersSnapshot = await getDocs(usersWithinGeohashRange);
    const potentialMatches = usersSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => !swipedUserIds.includes(user.uid));

    setUsers(potentialMatches);
  };

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
  const q = query(swipesRef, where("swiperId", "==", swipedUserId), where("swipedId", "==", swiperId), where("action", "==", "like"));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Find matched user's data
    // Match found, create a new document in the 'matches' collection
    const matchEntry = {
      userIds: [swiperId, swipedUserId],
      timestamp: serverTimestamp(),
    };
    const matchedUser = users.find(user => user.id === swipedUserId);
    if (matchedUser) {
      setMatchedUserImageUrl(matchedUser.images[0]); // Assuming images[0] is the profile image
      setMatchedUserName(matchedUser.name); // Store the matched user's name
      setMatchModalVisible(true);
      showModal();
    }
    await addDoc(collection(db, "matches"), matchEntry);
    console.log(`Match found between ${swiperId} and ${swipedUserId}`);
  }
};

const showModal = () => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true, // Add this line
  }).start();

  setTimeout(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true, // Add this line
    }).start(() => setMatchModalVisible(false));
  }, 3000);
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
                      <Text style={styles.detailsText}>Weight: {user.weight}lbs</Text>
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
      <Text  style={styles.text}>There are no more users in your area. Come back another time...</Text>
    )}
    <Modal
        animationType="none"
        transparent={true}
        visible={matchModalVisible}
        onRequestClose={() => {
          setMatchModalVisible(!matchModalVisible);
        }}>
        <View style={styles.centeredView}>
          <Animated.View style={[styles.matchedModalView, {opacity: fadeAnim}]}>
            <Image
              source={{ uri: matchedUserImageUrl }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMode="cover"
            />
            <Text style={{ marginTop: 10, fontSize: 20, color: 'white', fontWeight: 'bold' }}>MATCHED with {matchedUserName}</Text>
            <Text style={{ marginTop: 20, fontSize: 20, color: 'white', fontWeight: 'bold' }}> FIGHT </Text>

          </Animated.View>
        </View>
      </Modal>
  </View>
);
}; //End of Home Screen Component

  export default HomeScreen;
