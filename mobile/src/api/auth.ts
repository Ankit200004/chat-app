// import axios from 'axios';
// import { AuthResponse } from '../types';

// const BASE_URL = 'http://192.168.0.109:3000';

// export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
//   const res = await axios.post(`${BASE_URL}/auth/register`, { username, email, password });
//   return res.data;
// };

// export const login = async (email: string, password: string): Promise<AuthResponse> => {
//   const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
//   return res.data;
// };


// src/api/auth.ts
import axios from "axios";
import { AuthResponse } from "../types";
import { BASE_URL } from "../config/env";

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  console.log("📩 [Auth API] Register request:", { username, email });
  const res = await axios.post(`${BASE_URL}/auth/register`, {
    username,
    email,
    password,
  });
  console.log("✅ [Auth API] Register response:", res.data);
  return res.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  console.log("📩 [Auth API] Login request:", { email });
  const res = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });
  console.log("✅ [Auth API] Login response:", res.data);
  return res.data;
};
