import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { SocketContext } from '../context/SocketContext';

type Props = {
  onSendLocal?: (text: string) => void;
  partnerId?: string;
};

const InputBox: React.FC<Props> = ({ onSendLocal, partnerId }) => {
  const [text, setText] = useState('');
  const { socket } = useContext(SocketContext);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  const sendTypingStart = () => {
    if (!socket || !partnerId) return;
    if (!isTypingRef.current) {
      socket.emit('typing:start', {
        from: (socket as any).id /* not ideal */,
        to: partnerId,
      });
      isTypingRef.current = true;
    }
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => {
      sendTypingStop();
    }, 1000);
  };

  const sendTypingStop = () => {
    if (!socket || !partnerId) return;
    if (isTypingRef.current) {
      socket.emit('typing:stop', { from: (socket as any).id, to: partnerId });
      isTypingRef.current = false;
    }
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
  };

  const handleSend = () => {
    const payload = text.trim();
    if (!payload) return;

    if (socket && partnerId) {
      const authUserId = (socket as any).authUserId ?? undefined; // optional
      socket.emit('message:send', {
        partnerId,
        text,
      });
    }
    onSendLocal?.(payload);
    setText('');
    sendTypingStop();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 0.5,
        borderColor: '#ddd',
        gap: 8,
      }}
    >
      <TextInput
        style={{
          flex: 1,
          padding: 12,
          backgroundColor: '#fff',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#eee',
        }}
        placeholder="Type a message"
        value={text}
        onChangeText={t => {
          setText(t);
          sendTypingStart();
        }}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <Pressable
        onPress={handleSend}
        style={{
          backgroundColor: '#16a34a',
          paddingHorizontal: 16,
          borderRadius: 10,
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
      </Pressable>
    </View>
  );
};

export default InputBox;
