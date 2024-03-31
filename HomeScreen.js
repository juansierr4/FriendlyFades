import 'expo-dev-client';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, Animated, Alert, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { getFirestore, collection, query, where, doc, setDoc, getDocs, addDoc, serverTimestamp, orderBy, startAt, endAt } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { geohashForLocation, geohashQueryBounds, distanceBetween } from 'geofire-common';
import { styles } from './AppStyles.js';

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
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

  const requestLocationPermission = async () => {
    console.log("Checking for location permission");
    let permissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    console.log("Current location permission status: ${permissionResult}");
    if (permissionResult === RESULTS.DENIED) {
      permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    return permissionResult === RESULTS.GRANTED;
  };

  const fetchAndStoreUserLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Location Permission', 'Location permission is required to find users near you.');
      return;
    }

    console.log("Attempting to fetch current position");
    Geolocation.getCurrentPosition(
      async position => {
        console.log(`Location fetched: ${position.coords.latitude}, ${position.coords.longitude}`); // Log here
        const { latitude, longitude } = position.coords;
        const geohash = geohashForLocation([latitude, longitude]);
        const currentUserUid = auth.currentUser.uid;
        await setDoc(doc(db, "users", currentUserUid), { location: { latitude, longitude, geohash } }, { merge: true });
      },
      error => {
        console.error("Failed to fetch location", error);
        Alert.alert('Error', 'Failed to get your location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
    );
  };

  const fetchCurrentUserLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  useEffect(() => {
    console.log("useEffect triggered");
    const fetchUsersData = async () => {
      const { latitude, longitude } = await fetchCurrentUserLocation();
      const currentUserUid = auth.currentUser.uid;
      const swipesRef = collection(db, "swipes");
      const swipesQuery = query(swipesRef, where("swiperId", "==", currentUserUid));
      const swipesSnapshot = await getDocs(swipesQuery);
      const swipedUserIds = swipesSnapshot.docs.map(doc => doc.data().swipedId);

      const radiusInM = 10000; // Define search radius
      const bounds = geohashQueryBounds([latitude, longitude], radiusInM);
      const promises = bounds.map(b => {
        const q = query(collection(db, "users"), orderBy("location.geohash"), startAt(b[0]), endAt(b[1]));
        return getDocs(q);
      });

      const snapshots = await Promise.all(promises);
      let matchingDocs = [];

      snapshots.forEach(snap => {
        snap.docs.forEach(doc => {
          const location = doc.data().location;
          const distanceInM = distanceBetween([location.latitude, location.longitude], [latitude, longitude]);
          if (distanceInM <= radiusInM && !swipedUserIds.includes(doc.id)) {
            matchingDocs.push({ ...doc.data(), id: doc.id });
          }
        });
      });

      setUsers(matchingDocs);
    };

    fetchAndStoreUserLocation().then(fetchUsersData);
  }, []); // Dependency array left empty to run once on mount

  const [allUsersLoaded, setAllUsersLoaded] = useState(false); 

  const handleSwipe = (cardIndex) => {
    //Remove swiped users from local state
    setUsers(prevUsers => {
      const newUsers = prevUsers.filter((_, index) => index !== cardIndex);

      if (newUsers.length === 0) {
        setAllUsersLoaded(true);
      }
      return newUsers;
    });

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

  const handleTapImage = (userId) => {
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [userId]: (prevIndices[userId] !== undefined ? (prevIndices[userId] + 1) % users.find(user => user.id === userId).profileImageUrls.length : 1),
    }));
    setSwiperKey(prevkey => prevkey + 1);
  };

  const handleMoreOptions = (userId) => {
    setSelectedUser(users.find(user => user.id === userId));
    setModalVisible(true);
  };

  const handleReportUser = async (reportedUserId, reason) => {
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
        setMatchedUserImageUrl(matchedUser.profileImageUrls[0]); // Assuming images[0] is the profile image
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
                //******************************undefined is not an object currentimageindex instead of 0 */
                  source={{ uri: user.profileImageUrls[currentImageIndex] }}
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
              <Button title="Block User" onPress={() => handleBlockUser(selectedUser.id)} />
              <Button title="Report User" onPress={() => handleReportUser(selectedUser.id)} />
              <Button title="Cancel" onPress={() => setModalVisible(!modalVisible)} />
            </View>
          </View>
        </Modal>
      </>
    ) : allUsersLoaded ? (
      <Text style = {styles.text}>There are no more users in your area. Come back another time...</Text>
    ) : (
      <Text style = {styles.text}>Loading more users...</Text>
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
  