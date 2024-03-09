import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyATxtjVIbLR6Xxs5pQAKlvrQ6mjPYtE7W0",
    authDomain: "squareupapp-2024.firebaseapp.com",
    projectId: "squareupapp-2024",
    storageBucket: "squareupapp-2024.appspot.com",
    messagingSenderId: "177546169082",
    appId: "1:177546169082:ios:05f6df3bf255ab4b341743",
    measurementId: "7575397297"
  };

  const app = initializeApp(firebaseConfig);

  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  export { app, auth };