// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types';
import * as AuthAPI from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const data: AuthResponse = await AuthAPI.login(email, password);
    setUser(data.user);
    setToken(data.token);
    await AsyncStorage.setItem('token', data.token);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const data: AuthResponse = await AuthAPI.register(
      username,
      email,
      password,
    );
    setUser(data.user);
    setToken(data.token);
    await AsyncStorage.setItem('token', data.token);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
