import React, { useState, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);

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
        Create a new account and start chatting instantly.
      </Text>

      {/* Username */}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderRadius: 10,
          padding: 14,
          marginBottom: 16,
          backgroundColor: '#f8fafc',
          fontSize: 15,
        }}
      />

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

      {/* Register Button */}
      <TouchableOpacity
        onPress={() => register(username, email, password)}
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
          Register
        </Text>
      </TouchableOpacity>

      {/* Switch to Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ textAlign: 'center', color: '#475569', fontSize: 14 }}>
          Already have an account?{' '}
          <Text style={{ fontWeight: '700', color: '#16a34a' }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
