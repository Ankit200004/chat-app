# 📱 Real-Time Chat App

This project is a **real-time 1:1 chat application** built using **React Native (frontend)** and **Node.js + Socket.IO (backend)**. It allows users to register, log in, view a list of other users, and start real-time conversations. The app is designed with a modern UI using **React Native Paper** with a customized theme.

---

## ✨ Features

- **Authentication**
  - Secure registration and login using JWT-based authentication.
  - Persistent user sessions with context-based state management.

- **User List**
  - Displays all registered users in the system.
  - Each user item is interactive, allowing you to start a conversation.

- **Real-Time Chat**
  - One-to-one messaging powered by **Socket.IO**.
  - Messages are instantly sent and received without refreshing.
  - Chat history is stored in the backend database for persistence.

- **Error Handling**
  - Alerts for network issues, invalid credentials, and unauthorized access.
  - Automatic logout if the session expires (401 handling).

- **UI/UX**
  - Built with **React Native Paper** and a custom theme:
    - `primary` → Green (#4CAF50)
    - `secondary` → Amber (#FFC107)
    - Clean typography and modern design.
  - Loading indicators and user-friendly messages for smooth navigation.

---

## 🛠 Tech Stack

- **Frontend:** React Native, React Navigation, React Native Paper, Context API
- **Backend:** Node.js, Express.js, Socket.IO
- **Database:** MongoDB / PostgreSQL (depending on setup)
- **Authentication:** JWT (JSON Web Tokens)

---

## 📂 Project Structure

- **Frontend**
  - `screens/` → Pages like Login, Register, Home, Chat
  - `components/` → Reusable UI components (e.g., UserListItem, ChatBubble)
  - `api/` → Axios services for authentication & user APIs
  - `context/` → AuthContext for global state
  - `navigation/` → Stack navigation setup
  - `theme/` → Centralized theme (colors, typography)

- **Backend**
  - `routes/` → Authentication and chat APIs
  - `sockets/` → Socket.IO real-time messaging logic
  - `models/` → Database schemas
  - `controllers/` → Business logic for auth and chat

---

## 🚀 How It Works

1. A new user **registers** or logs in.
2. After login, they are redirected to the **Home screen**, where all users are listed.
3. Tapping a user opens the **Chat screen**, where messages are exchanged in real time.
4. Messages are persisted in the database, so they remain available even after app restarts.
5. The **theme system** ensures consistent design across all screens.

---

## 🎯 Goal

The goal of this project is to provide a **foundation for a production-ready chat application** that is:
- **Scalable**
- **User-friendly**
- **Secure**
- **Easily customizable** (thanks to modularized components and theming)

---

## 📌 Future Enhancements

- Group chats
- Push notifications
- Typing indicators
- Read receipts
- Media (image, video, file) sharing
- Dark mode support
