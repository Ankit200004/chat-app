import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../config/env';
import { AuthContext } from './AuthContext';

type SocketContextType = {
  socket: Socket | null;
  onlineUsers: Record<string, string>;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string>>({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user || !token) {
      // ensure disconnected if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // initialize socket once
    if (!socketRef.current) {
      console.log('⚡️ [Socket] connecting to', BASE_URL);
      const socket = io(BASE_URL, {
        auth: { token }, // optional - server can use this if you validate tokens on socket connect
        transports: ['websocket'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('⚡️ [Socket] connected', socket.id);
        // notify server that user is online
        socket.emit('user:online', user._id);
      });

      socket.on('disconnect', reason => {
        console.log('⚡️ [Socket] disconnected', reason);
      });

      socket.on(
        'user:status',
        (payload: { userId: string; online: boolean }) => {
          console.log('👥 [Socket] user:status', payload);
          setOnlineUsers(prev => {
            const copy = { ...prev };
            if (payload.online)
              copy[payload.userId] = prev[payload.userId] ?? 'ONLINE';
            else delete copy[payload.userId];
            return copy;
          });
        },
      );

      // if server emits full online list (optional)
      socket.on('online:list', (list: Record<string, string>) => {
        console.log('👥 [Socket] online list', list);
        setOnlineUsers(list);
      });
    }

    // cleanup on unmount or user change
    return () => {
      // do NOT disconnect immediately on small nav changes; only when user logs out or component unmount
      // we disconnect when user becomes null above
    };
  }, [user, token]);

  // expose socketRef.current
  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// src/context/SocketContext.tsx
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { BASE_URL } from '../config/env';
// import { AuthContext } from './AuthContext';

// type SocketContextType = {
//   socket: Socket | null;
//   onlineUsers: Set<string>; // userIds of online users
// };

// export const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   onlineUsers: new Set(),
// });

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user, token } = useContext(AuthContext);
//   const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     if (!user || !token) {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//       return;
//     }

//     if (!socketRef.current) {
//       console.log('⚡️ [Socket] connecting to', BASE_URL);
//       const socket = io(BASE_URL, {
//         auth: { token },
//         transports: ['websocket'],
//       });

//       socketRef.current = socket;

//       socket.on('connect', () => {
//         console.log('⚡️ [Socket] connected', socket.id);
//         socket.emit('user:online', user._id);
//       });

//       socket.on('disconnect', reason => {
//         console.log('⚡️ [Socket] disconnected', reason);
//       });

//       // 🔥 Listen to user status changes
//       socket.on(
//         'user:status',
//         ({ userId, online }: { userId: string; online: boolean }) => {
//           setOnlineUsers(prev => {
//             const copy = new Set(prev);
//             if (online) copy.add(userId);
//             else copy.delete(userId);
//             return copy;
//           });
//         },
//       );
//     }
//   }, [user, token]);

//   return (
//     <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
