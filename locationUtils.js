import * as Location from 'expo-location';
import { firestore } from './firebaseConfig'; // Adjust the import path as necessary

export async function getLocationAsync() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  return location;
}

export async function updateUserLocation(userId, location) {
  const userRef = firestore.collection('users').doc(userId);
  await userRef.update({
    location: new firestore.GeoPoint(location.coords.latitude, location.coords.longitude)
  });
}

export function findNearbyUsers(center, radiusKm) {
  const earthRadiusKm = 6371;
  const latChange = radiusKm / earthRadiusKm;
  const lonChange = radiusKm / (earthRadiusKm * Math.cos((Math.PI * center.latitude) / 180));

  const query = firestore.collection('users').where('location', '>=', {
    latitude: center.latitude - latChange,
    longitude: center.longitude - lonChange,
  }).where('location', '<=', {
    latitude: center.latitude + latChange,
    longitude: center.longitude + lonChange,
  });

  return query.get().then(/* handle the results */);
}
