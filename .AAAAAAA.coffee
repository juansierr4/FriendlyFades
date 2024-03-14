import 'expo-dev-client';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, Animated, Alert } from 'react-native';
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
    let permissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
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

    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const geohash = geohashForLocation([latitude, longitude]);
        const currentUserUid = auth.currentUser.uid;
        await setDoc(doc(db, "users", currentUserUid), { location: { latitude, longitude, geohash } }, { merge: true });
      },
      error => {
        console.error(error);
        Alert.alert('Error', 'Failed to get your location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
    );
  };

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

  useEffect(() => {
    fetchAndStoreUserLocation().then(fetchUsersData);
  }, []); // Dependency array left empty to run once on mount

  const fetchCurrentUserLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  };
