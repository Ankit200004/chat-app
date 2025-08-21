import React from 'react';
import { View, Text } from 'react-native';
import { Message } from '../types';

const getId = (p: string | { _id: string }) =>
  typeof p === 'string' ? p : p?._id;

type Props = {
  msg: Message;
  currentUserId: string;
};

const ChatMessage: React.FC<Props> = ({ msg, currentUserId }) => {
  const isMine = getId(msg.sender) === currentUserId;

  return (
    <View
      style={{
        alignSelf: isMine ? 'flex-end' : 'flex-start',
        backgroundColor: isMine ? '#D1FADF' : '#EEF2FF',
        marginVertical: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        maxWidth: '80%',
      }}
    >
      <Text style={{ fontSize: 15 }}>{msg.text}</Text>
      <Text style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
        {new Date(msg.createdAt).toLocaleTimeString().slice(0, 5)} •{' '}
        {msg.status}
      </Text>
    </View>
  );
};

export default ChatMessage;
