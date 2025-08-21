// // // src/screens/ChatScreen.tsx
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator } from 'react-native';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import type { RootStackParamList } from '../navigation/AppNavigator';
// import { AuthContext } from '../context/AuthContext';
// import {
//   getConversation,
//   sendMessage as sendMessageRest,
// } from '../api/messages';
// import { Message } from '../types';
// import ChatMessage from '../components/ChatMessage';
// import InputBox from '../components/InputBox';
// import { SocketContext } from '../context/SocketContext';

// type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;

// const getId = (p: string | { _id?: string }) =>
//   typeof p === 'string' ? p : p?._id ?? '';

// const ChatScreen: React.FC = () => {
//   const { params } = useRoute<ChatRouteProp>();
//   const { user } = useContext(AuthContext);
//   const { socket } = useContext(SocketContext);
//   const [loading, setLoading] = useState(true);
//   const [msgs, setMsgs] = useState<Message[]>([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const flatRef = useRef<FlatList>(null);

//   const partnerId = params.userId;
//   const currentUserId = user?._id ?? '';

//   // Load initial messages (REST)
//   const loadMessages = async () => {
//     try {
//       console.log('🔄 [Chat] loading messages...');
//       const data = await getConversation(partnerId);
//       setMsgs(data);
//       setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100);
//     } catch (e: any) {
//       console.log('❌ [Chat] load error', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMessages();

//     // socket listeners
//     if (!socket) return;

//     const onNewMessage = (msg: Message) => {
//       console.log('📩 [Socket] message:new', msg._id);
//       // if message belongs to this chat, append
//       const senderId = getId(msg.sender);
//       const receiverId = getId(msg.receiver);
//       if (
//         (senderId === partnerId && receiverId === currentUserId) ||
//         (senderId === currentUserId && receiverId === partnerId)
//       ) {
//         setMsgs(prev => [...prev, msg]);
//         // if the current user is the receiver, mark read
//         if (receiverId === currentUserId) {
//           socket.emit('message:read', { messageId: msg._id });
//         }
//       }
//     };

//     const onTypingStart = ({ from }: { from: string }) => {
//       if (from === partnerId) {
//         setIsTyping(true);
//       }
//     };

//     const onTypingStop = ({ from }: { from: string }) => {
//       if (from === partnerId) {
//         setIsTyping(false);
//       }
//     };

//     const onMessageRead = (updatedMsg: Message) => {
//       setMsgs(prev =>
//         prev.map(m => (m._id === updatedMsg._id ? updatedMsg : m)),
//       );
//     };

//     socket.on('message:new', onNewMessage);
//     socket.on('typing:start', onTypingStart);
//     socket.on('typing:stop', onTypingStop);
//     socket.on('message:read', onMessageRead);

//     // cleanup
//     return () => {
//       socket.off('message:new', onNewMessage);
//       socket.off('typing:start', onTypingStart);
//       socket.off('typing:stop', onTypingStop);
//       socket.off('message:read', onMessageRead);
//     };
//   }, [socket, partnerId]);

//   // When chat opens, mark unread messages (that are for me) as read
//   useEffect(() => {
//     if (!socket) return;
//     msgs.forEach(m => {
//       const senderId = getId(m.sender);
//       const receiverId = getId(m.receiver);
//       if (receiverId === currentUserId && m.status !== 'read') {
//         socket.emit('message:read', { messageId: m._id });
//       }
//     });
//   }, [msgs, socket]);

//   const handleLocalSend = async (text: string) => {
//     // optimistic update using REST fallback: try socket send, but also POST to REST if you want persistence
//     // For reliability: send via socket, server will save and emit back to us (message:new)
//     if (socket) {
//       console.log('📨 [Chat] emit message:send via socket', {
//         to: partnerId,
//         text,
//       });
//       socket.emit('message:send', {
//         senderId: currentUserId,
//         receiverId: partnerId,
//         text,
//       });
//       // optimistic local append (will be replaced by real msg from server)
//       const optimistic: Message = {
//         _id: `temp-${Date.now()}`,
//         text,
//         status: 'sent',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         sender: currentUserId,
//         receiver: partnerId,
//       };
//       setMsgs(p => [...p, optimistic]);
//       requestAnimationFrame(() =>
//         flatRef.current?.scrollToEnd({ animated: true }),
//       );
//     } else {
//       // fallback to REST if socket not available
//       try {
//         const newMsg = await sendMessageRest(partnerId, text);
//         setMsgs(p => [...p, newMsg]);
//       } catch (e) {
//         console.log('❌ [Chat] send via REST failed', e);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center' }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
//       <View
//         style={{
//           paddingTop: 48,
//           paddingHorizontal: 16,
//           paddingBottom: 12,
//           backgroundColor: '#fff',
//           borderBottomWidth: 0.5,
//           borderColor: '#eee',
//         }}
//       >
//         <Text style={{ fontSize: 18, fontWeight: '700' }}>
//           {params.username}
//           {isTyping ? ' • typing…' : ''}
//         </Text>
//       </View>

//       <FlatList
//         ref={flatRef}
//         data={msgs}
//         keyExtractor={item => item._id}
//         contentContainerStyle={{ padding: 12 }}
//         renderItem={({ item }) => (
//           <ChatMessage msg={item} currentUserId={currentUserId} />
//         )}
//         onContentSizeChange={() =>
//           flatRef.current?.scrollToEnd({ animated: true })
//         }
//       />

//       <InputBox onSendLocal={handleLocalSend} partnerId={partnerId} />
//     </View>
//   );
// };

// export default ChatScreen;

// src/screens/ChatScreen.tsx
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator } from 'react-native';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import type { RootStackParamList } from '../navigation/AppNavigator';
// import { AuthContext } from '../context/AuthContext';
// import {
//   getConversation,
//   sendMessage as sendMessageRest,
// } from '../api/messages';
// import { Message } from '../types';
// import ChatMessage from '../components/ChatMessage';
// import InputBox from '../components/InputBox';
// import { SocketContext } from '../context/SocketContext';

// type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;

// const getId = (p: string | { _id?: string }) =>
//   typeof p === 'string' ? p : p?._id ?? '';

// const ChatScreen: React.FC = () => {
//   const { params } = useRoute<ChatRouteProp>();
//   const { user } = useContext(AuthContext);
//   const { socket } = useContext(SocketContext);
//   const [loading, setLoading] = useState(true);
//   const [msgs, setMsgs] = useState<Message[]>([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [partnerOnline, setPartnerOnline] = useState(false);
//   const flatRef = useRef<FlatList>(null);

//   const partnerId = params.userId;
//   const currentUserId = user?._id ?? '';

//   // Load initial messages
//   const loadMessages = async () => {
//     try {
//       console.log('🔄 [Chat] loading messages...');
//       const data = await getConversation(partnerId);
//       setMsgs(data);
//       setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100);
//     } catch (e: any) {
//       console.log('❌ [Chat] load error', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMessages();

//     if (!socket) return;

//     // ✅ New message
//     const onNewMessage = (msg: Message) => {
//       console.log('📩 [Socket] message:new', msg._id);
//       const senderId = getId(msg.sender);
//       const receiverId = getId(msg.receiver);

//       if (
//         (senderId === partnerId && receiverId === currentUserId) ||
//         (senderId === currentUserId && receiverId === partnerId)
//       ) {
//         setMsgs(prev => [...prev, msg]);
//         if (receiverId === currentUserId) {
//           socket.emit('message:read', { messageId: msg._id });
//         }
//       }
//     };

//     // ✅ Typing events
//     const onTypingStart = ({ from }: { from: string }) => {
//       if (from === partnerId) setIsTyping(true);
//     };
//     const onTypingStop = ({ from }: { from: string }) => {
//       if (from === partnerId) setIsTyping(false);
//     };

//     // ✅ Read receipts
//     const onMessageRead = (updatedMsg: Message) => {
//       console.log('👀 [Socket] message:read', updatedMsg._id);
//       setMsgs(prev =>
//         prev.map(m => (m._id === updatedMsg._id ? updatedMsg : m)),
//       );
//     };

//     // ✅ Online/offline status
//     const onUserStatus = ({
//       userId,
//       online,
//     }: {
//       userId: string;
//       online: boolean;
//     }) => {
//       if (userId === partnerId) {
//         console.log('🟢 [Socket] user:status', userId, online);
//         setPartnerOnline(online);
//       }
//     };

//     socket.on('message:new', onNewMessage);
//     socket.on('typing:start', onTypingStart);
//     socket.on('typing:stop', onTypingStop);
//     socket.on('message:read', onMessageRead);
//     socket.on('user:status', onUserStatus);

//     return () => {
//       socket.off('message:new', onNewMessage);
//       socket.off('typing:start', onTypingStart);
//       socket.off('typing:stop', onTypingStop);
//       socket.off('message:read', onMessageRead);
//       socket.off('user:status', onUserStatus);
//     };
//   }, [socket, partnerId]);

//   // Mark messages as read when opening
//   useEffect(() => {
//     if (!socket) return;
//     msgs.forEach(m => {
//       const senderId = getId(m.sender);
//       const receiverId = getId(m.receiver);
//       if (receiverId === currentUserId && m.status !== 'read') {
//         socket.emit('message:read', { messageId: m._id });
//       }
//     });
//   }, [msgs, socket]);

//   const handleLocalSend = async (text: string) => {
//     if (!text.trim()) return;

//     if (socket) {
//       console.log('📨 [Chat] emit message:send via socket', {
//         to: partnerId,
//         text,
//       });
//       socket.emit('message:send', {
//         senderId: currentUserId,
//         receiverId: partnerId,
//         text,
//       });

//       // Optimistic append
//       const optimistic: Message = {
//         _id: `temp-${Date.now()}`,
//         text,
//         status: 'sent',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         sender: currentUserId,
//         receiver: partnerId,
//       };
//       setMsgs(p => [...p, optimistic]);
//       requestAnimationFrame(() =>
//         flatRef.current?.scrollToEnd({ animated: true }),
//       );
//     } else {
//       try {
//         const newMsg = await sendMessageRest(partnerId, text);
//         setMsgs(p => [...p, newMsg]);
//       } catch (e) {
//         console.log('❌ [Chat] send via REST failed', e);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center' }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
//       {/* ✅ Header with online + typing */}
//       <View
//         style={{
//           paddingTop: 48,
//           paddingHorizontal: 16,
//           paddingBottom: 12,
//           backgroundColor: '#fff',
//           borderBottomWidth: 0.5,
//           borderColor: '#eee',
//         }}
//       >
//         <Text style={{ fontSize: 18, fontWeight: '700' }}>
//           {params.username} {partnerOnline ? '🟢' : '⚪️'}
//           {isTyping ? ' • typing…' : ''}
//         </Text>
//       </View>

//       <FlatList
//         ref={flatRef}
//         data={msgs}
//         keyExtractor={item => item._id}
//         contentContainerStyle={{ padding: 12 }}
//         renderItem={({ item }) => (
//           <ChatMessage msg={item} currentUserId={currentUserId} />
//         )}
//         onContentSizeChange={() =>
//           flatRef.current?.scrollToEnd({ animated: true })
//         }
//       />

//       <InputBox onSendLocal={handleLocalSend} partnerId={partnerId} />
//     </View>
//   );
// };

// export default ChatScreen;

// src/screens/ChatScreen.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { AuthContext } from '../context/AuthContext';
import {
  getConversation,
  sendMessage as sendMessageRest,
} from '../api/messages';
import { Message } from '../types';
import ChatMessage from '../components/ChatMessage';
import InputBox from '../components/InputBox';
import { SocketContext } from '../context/SocketContext';

type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const getId = (p: string | { _id?: string }) =>
  typeof p === 'string' ? p : p?._id ?? '';

const ChatScreen: React.FC = () => {
  const { params } = useRoute<ChatRouteProp>();
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [loading, setLoading] = useState(true);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const partnerId = params.userId;
  const currentUserId = user?._id ?? '';

  const loadMessages = async () => {
    try {
      const data = await getConversation(partnerId);
      setMsgs(data);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100);
    } catch (e) {
      console.log('load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    if (!socket) return;

    const onNewMessage = (msg: Message) => {
      const senderId = getId(msg.sender);
      const receiverId = getId(msg.receiver);
      if (
        (senderId === partnerId && receiverId === currentUserId) ||
        (senderId === currentUserId && receiverId === partnerId)
      ) {
        setMsgs(prev => [...prev, msg]);
        if (receiverId === currentUserId) {
          socket.emit('message:read', { messageId: msg._id });
        }
      }
    };

    const onTypingStart = ({ from }: { from: string }) => {
      if (from === partnerId) setIsTyping(true);
    };
    const onTypingStop = ({ from }: { from: string }) => {
      if (from === partnerId) setIsTyping(false);
    };

    const onMessageRead = (updatedMsg: Message) => {
      setMsgs(prev =>
        prev.map(m => (m._id === updatedMsg._id ? updatedMsg : m)),
      );
    };

    const onUserStatus = ({
      userId,
      online,
    }: {
      userId: string;
      online: boolean;
    }) => {
      if (userId === partnerId) setPartnerOnline(online);
    };

    socket.on('message:new', onNewMessage);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);
    socket.on('message:read', onMessageRead);
    socket.on('user:status', onUserStatus);

    return () => {
      socket.off('message:new', onNewMessage);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      socket.off('message:read', onMessageRead);
      socket.off('user:status', onUserStatus);
    };
  }, [socket, partnerId]);

  useEffect(() => {
    if (!socket) return;
    msgs.forEach(m => {
      const senderId = getId(m.sender);
      const receiverId = getId(m.receiver);
      if (receiverId === currentUserId && m.status !== 'read') {
        socket.emit('message:read', { messageId: m._id });
      }
    });
  }, [msgs, socket]);

  const handleLocalSend = async (text: string) => {
    if (!text.trim()) return;

    if (socket) {
      socket.emit('message:send', {
        senderId: currentUserId,
        receiverId: partnerId,
        text,
      });

      const optimistic: Message = {
        _id: `temp-${Date.now()}`,
        text,
        status: 'sent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: currentUserId,
        receiver: partnerId,
      };
      setMsgs(p => [...p, optimistic]);
      requestAnimationFrame(() =>
        flatRef.current?.scrollToEnd({ animated: true }),
      );
    } else {
      try {
        const newMsg = await sendMessageRest(partnerId, text);
        setMsgs(p => [...p, newMsg]);
      } catch (e) {
        console.log('send error', e);
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* header */}
      <View
        style={{
          paddingTop: 48,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: '#fff',
          borderBottomWidth: 0.5,
          borderColor: '#eee',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            {params.username}
          </Text>
          <Text
            style={{ fontSize: 13, color: partnerOnline ? 'green' : 'gray' }}
          >
            {isTyping ? 'typing...' : partnerOnline ? 'online' : 'offline'}
          </Text>
        </View>
      </View>

      {/* messages */}
      <FlatList
        ref={flatRef}
        data={msgs}
        keyExtractor={item => item._id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <ChatMessage msg={item} currentUserId={currentUserId} />
        )}
        onContentSizeChange={() =>
          flatRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* input */}
      <InputBox onSendLocal={handleLocalSend} partnerId={partnerId} />
    </View>
  );
};

export default ChatScreen;
