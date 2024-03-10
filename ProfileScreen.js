import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Alert } from 'react-native';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'; // Import Firestore
import { getAuth, deleteUser, signOut } from 'firebase/auth'; // Import FirebaseAuth
import { styles } from './AppStyles.js';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const settingsIcon = require('./images/Settings.png');
const editIcon = require('./images/editIcon.png');

//Beginning of ProfileScreen Component
const ProfileScreen = ({ navigation }) => {
    const [userDetails, setUserDetails] = useState({}); // State to store user details
    const [showSettings, setShowSettings] = useState(false);
    const settingsPanelPosition = useRef(new Animated.Value(width)).current; // Start off-screen

    const db = getFirestore();
    const auth = getAuth();

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log("Fetching document for user UID:", user.uid);
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log('Fetched user details:', docSnap.data());
        } else {
          console.log("No such document for user UID:", user.uid);
        }
      }
    };

    useEffect(() => {
      fetchUserData();
    }, []);
  
    const animateSettingsPanel = (show) => {
      Animated.timing(settingsPanelPosition, {
        toValue: show ? 0 : width, // Adjust based on state
        duration: 300,
        useNativeDriver: true,
      }).start();
    };
  
    const toggleSettings = () => {
      setShowSettings(previousState => !previousState); // Toggle the state
      animateSettingsPanel(showSettings); // Trigger the animation with the new state
    };
  
    useEffect(() => {
      animateSettingsPanel(showSettings);
    }, [showSettings]);
  
    const handleDeleteAccount = () => {
      // First confirmation
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Yes", onPress: () => secondConfirmation() 
          }
        ]
      );
    };
    
    const secondConfirmation = () => {
      // Second confirmation
      Alert.alert(
        "Confirm Delete",
        "Are you absolutely sure? All your data will be lost.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Delete", onPress: () => deleteAccountAndData() 
          }
        ]
      );
    };
    
    const deleteAccountAndData = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
    
      if (user) {
        // Delete Firestore data
        const userRef = doc(db, "users", user.uid);
        try {
          // Try to delete Firestore data
          await deleteDoc(userRef);
          // Firestore data deleted, now try to delete the authentication account
          await deleteUser(user);
          Alert.alert("Account Deleted", "Your account has been successfully deleted.");
          navigation.navigate('SignUp'); 
        } catch (error) {
          // Handle any errors that occurred during deletion
          console.error("Error during account deletion: ", error);
          Alert.alert("Error", error.message);
        }
      }
    };
    const GoPremium = ({ onPress }) => (
      <View style={styles.goPremiumContainer}>
        <Text style={styles.goPremiumTitle}>Go Premium</Text>
        <Text style={styles.goPremiumText}>Unlock exclusive features:</Text>
        <Text style={styles.goPremiumBenefit}>- Ad-free experience</Text>
        <Text style={styles.goPremiumBenefit}>- Unlimited access</Text>
        <Text style={styles.goPremiumBenefit}>- Priority support</Text>
        <TouchableOpacity style={styles.goPremiumButton} onPress={onPress}>
          <Text style={styles.goPremiumButtonText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>
    );
    const handleLogout = () => {
      signOut(auth)
        .then(() => {
          // Navigate to the login screen or any other screen you prefer after logout
          navigation.navigate('Login');
        })
        .catch(error => {
          console.error("Error signing out: ", error);
          Alert.alert("Error", "Failed to sign out. Please try again.");
        });
    };

    return (
        <View style={styles.profileImageContainer}>
        {userDetails.profileImageUrl ? (
                <Image source={{ uri: userDetails.profileImageUrl }} style={styles.profileImage} />
            ) : (
                // A placeholder image can be shown here if no profile image URL is found
                <Image source={require('./images/Profile.png')} style={styles.profileImage} />
            )}
            <TouchableOpacity 
                style={styles.editImageButton}
                onPress={() => navigation.navigate('ViewSelfProfile', { userData: userDetails })} // Assuming 'EditProfileScreen' is the route name
            ><Image source={editIcon} style={styles.editIcon} />
            </TouchableOpacity>
        <Text style={styles.detailText}>{userDetails.name}</Text>
        <Text style={styles.detailText}>Age: {userDetails.age}</Text>
        <Text style={styles.detailText}>Height: {userDetails.height}</Text>
        <Text style={styles.detailText}>Weight: {userDetails.weight}</Text>
        <GoPremium onPress={() => navigation.navigate('Premium')} />
        <TouchableOpacity style={styles.settingsIcon} onPress={toggleSettings}>
          <Image source={settingsIcon} style={styles.settingsImage} />
        </TouchableOpacity>
  
    <Animated.View style={[
      styles.settingsMenu,
      {
        transform: [{ translateX: settingsPanelPosition }],
      },
    ]}> 
    <TouchableOpacity style={styles.settingsIcon} onPress={toggleSettings}>
          <Image source={settingsIcon} style={styles.settingsImage} />
        </TouchableOpacity>
    <TouchableOpacity onPress={() => Alert.alert('Contact Support')}><Text style={styles.menuItem} >Contact Support</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('termsOfService')}><Text style={styles.menuItem} >Terms of Service</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => Alert.alert('Friendly Fades Premium')}><Text style={styles.menuItem} >Friendly Fades Premium</Text></TouchableOpacity>
    <TouchableOpacity onPress={handleLogout}><Text style={styles.menuItem} >Logout</Text></TouchableOpacity>
    <TouchableOpacity onPress={handleDeleteAccount}><Text style={styles.menuItem} >Delete Account</Text></TouchableOpacity>
  </Animated.View>
      </View>
    );
  }
  //End of ProfileScreen Component 

  export default ProfileScreen;