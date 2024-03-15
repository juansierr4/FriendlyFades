import { doc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { geohashForLocation } from 'geofire-common';

export const updateUserLocation = async (latitude, longitude, userId) => {
  const db = getFirestore();
  const userRef = doc(db, "users", userId);

  const geohash = geohashForLocation([latitude, longitude]);

  try {
    await updateDoc(userRef, {
      location: { latitude, longitude }, // Store the location as a nested object
      geohash: geohash // Store the geohash
    });
    console.log("User location updated successfully.");
  } catch (error) {
    console.error("Error updating user location:", error);
  }
};
