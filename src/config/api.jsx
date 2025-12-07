import { Platform } from 'react-native';

const getApiUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android Emulator uses 10.0.2.2 to access host machine's localhost
      return 'http://10.0.2.2:5001/api';
    } else {
      // iOS Simulator can use localhost directly
      return 'http://localhost:5001/api';
    }
  }
  // Production URL (change this when deploying)
  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getApiUrl();