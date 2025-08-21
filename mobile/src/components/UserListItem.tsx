import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User } from '../types';

type Props = {
  user: User;
  onPress: () => void;
};

const UserListItem: React.FC<Props> = ({ user, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: user.online ? '#20c997' : '#c4c4c4',
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{user.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserListItem;
