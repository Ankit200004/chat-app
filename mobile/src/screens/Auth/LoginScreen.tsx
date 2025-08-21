import React, { useState, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#ffffff',
      }}
    >
      {/* Brand Header */}
      <Text
        style={{
          fontSize: 34,
          fontWeight: '800',
          marginBottom: 8,
          textAlign: 'center',
          color: '#27ae60',
        }}
      >
        Chatly 💬
      </Text>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: '#64748b',
          marginBottom: 32,
        }}
      >
        Welcome back! Log in to continue chatting.
      </Text>

      {/* Email */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderRadius: 10,
          padding: 14,
          marginBottom: 16,
          backgroundColor: '#f8fafc',
          fontSize: 15,
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderRadius: 10,
          padding: 14,
          marginBottom: 20,
          backgroundColor: '#f8fafc',
          fontSize: 15,
        }}
      />

      {/* Login Button */}
      <TouchableOpacity
        onPress={() => login(email, password)}
        style={{
          backgroundColor: '#1abc9c',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>
          Login
        </Text>
      </TouchableOpacity>

      {/* Switch to Register */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{ textAlign: 'center', color: '#475569', fontSize: 14 }}>
          Don’t have an account?{' '}
          <Text style={{ fontWeight: '700', color: '#2563eb' }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
