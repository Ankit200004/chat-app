import { Platform } from 'react-native';

export const BASE_URL =
  Platform.OS === 'android'
    ? 'http://192.168.0.109:3000'   
    : 'http://localhost:5000'; 

