// screens/LoginScreen.js
import { useState } from 'react';
import { Button, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAx09DEJkfvqENGvFQIEkDTJ5IKdIS5KMA",
  authDomain: "project-better-health.firebaseapp.com",
  projectId: "project-better-health",
  storageBucket: "project-better-health.firebasestorage.app",
  messagingSenderId: "421411588056",
  appId: "1:421411588056:web:3537305d04ea8ffc4194ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Firebase handles the entire OAuth flow
      const provider = new GoogleAuthProvider();
      
      // For React Native/Expo, we need to use a web flow
      const result = await WebBrowser.openAuthSessionAsync(
        `https://project-better-health.firebaseapp.com/__/auth/handler`,
        'yourapp://callback',
        {
          showTitle: false,
          enableDefaultShare: false,
          ephemeralWebSession: false,
        }
      );

      // Alternative: Use Firebase's React Native library
      // const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      
      // Get the Firebase ID token
      const idToken = await user.getIdToken();
      
      // Send to your backend (your existing code)
      const backendResponse = await fetch(
        `${API_BASE_URL}/auth/google-simple`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL,
            firebaseToken: idToken
          }),
        }
      );

      const data = await backendResponse.json();
      
      if (data.success) {
        console.log('✅ Login success:', data.user);
        // TODO: Save token to AsyncStorage
        // TODO: Navigate to Home
      } else {
        Alert.alert('Error', data.message);
      }
      
    } catch (error) {
      console.error('❌ Firebase auth error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      title={loading ? "Signing in..." : "Sign in with Google"}
      onPress={signInWithGoogle}
    />
  );
}