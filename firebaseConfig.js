import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: ,
    authDomain: ,
    projectId: ,
    storageBucket: ,
    messagingSenderId: ,
    appId: ,
    measurementId: 
  };

  const app = initializeApp(firebaseConfig);

  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  export { app, auth };
