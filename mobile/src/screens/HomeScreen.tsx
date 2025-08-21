import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, Alert } from 'react-native';
import { getUsers } from '../api/users';
import { User } from '../types';
import UserListItem from '../components/UserListItem';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log('📱 [HomeScreen] Mounted → Fetching users...');
    (async () => {
      try {
        const data = await getUsers();
        console.log('✅ [HomeScreen] Users fetched successfully:', data.length);
        setUsers(data);
      } catch (e: any) {
        console.log('❌ [HomeScreen] Error fetching users:', e?.message);
        Alert.alert(
          'Error',
          e?.response?.data?.message || 'Failed to load users',
        );
        if (e?.response?.status === 401) {
          console.log('🔑 [HomeScreen] Unauthorized → Logging out user');
          logout();
        }
      } finally {
        setLoading(false);
        console.log('⏹️ [HomeScreen] Finished loading users');
      }
    })();
  }, [logout]);

  if (loading) {
    console.log('⏳ [HomeScreen] Showing loading spinner...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 48 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
        Welcome, {user?.username}
      </Text>

      <FlatList
        data={users}
        keyExtractor={item => {
          console.log('🔑 [HomeScreen] KeyExtractor:', item._id);
          return item._id;
        }}
        renderItem={({ item }) => {
          console.log('👤 [HomeScreen] Rendering user:', item.username);
          return (
            <UserListItem
              user={item}
              onPress={() => {
                console.log(
                  `➡️ [HomeScreen] Navigating to Chat with ${item.username} (${item._id})`,
                );
                nav.navigate('Chat', {
                  userId: item._id,
                  username: item.username,
                });
              }}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No users found.
          </Text>
        )}
      />
    </View>
  );
};

export default HomeScreen;
