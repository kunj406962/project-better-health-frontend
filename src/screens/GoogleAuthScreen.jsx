import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoogleAuthScreen = ({ navigation }) => {
  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    
    // Check if we got redirected with a token
    if (url.includes('auth/success')) {
      const token = new URL(url).searchParams.get('token');
      
      if (token) {
        // Save token and navigate to Water screen
        AsyncStorage.setItem('authToken', token)
          .then(() => {
            navigation.replace('Water');
          })
          .catch(error => {
            Alert.alert('Error', 'Failed to save token');
          });
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'http://localhost:5000/api/auth/google' }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </View>
  );
};

export default GoogleAuthScreen;