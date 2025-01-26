import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
    apiKey: "AIzaSyB-OvowzjPX7jnJlXG9WmzUzRzdyz4AwcE",
    authDomain: "taxi-app-6d50d.firebaseapp.com",
    databaseURL: "https://taxi-app-6d50d-default-rtdb.firebaseio.com",
    projectId: "taxi-app-6d50d",
    storageBucket: "taxi-app-6d50d.firebasestorage.app",
    messagingSenderId: "652630519256",
    appId: "1:652630519256:android:5c0e05849401d2f74bd6ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Configure auth settings for development
if (__DEV__) {
    auth.settings.appVerificationDisabledForTesting = true;
}

// Helper function to get current user
export const getCurrentUser = async () => {
    try {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

// Helper function to persist auth state
export const persistAuth = async (user: any) => {
    if (!user) {
        await AsyncStorage.removeItem('user');
        return;
    }
    
    try {
        const userData = {
            uid: user.uid,
            email: user.email,
            phoneNumber: user.phoneNumber,
            displayName: user.displayName,
            photoURL: user.photoURL,
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
        console.error('Error persisting auth state:', error);
    }
};

export const db = getFirestore(app); 