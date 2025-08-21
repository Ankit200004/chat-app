import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/env';

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Safe logging
  const method = config.method?.toUpperCase() ?? "UNKNOWN";
  const base = config.baseURL ?? "";
  const url = config.url ?? "";
  console.log("🌐 [REQ]", method, base + url, config.data || "");

  return config;
});

client.interceptors.response.use(
  (res) => {
    console.log("✅ [RES]", res.status, res.config.url ?? "NO_URL");
    return res;
  },
  (err) => {
    console.log(
      "❌ [ERR]",
      err?.response?.status ?? "NO_STATUS",
      err?.config?.url ?? "NO_URL",
      err?.response?.data ?? err.message
    );
    return Promise.reject(err);
  }
);

export default client;
