import { useState, useEffect, useRef, useCallback } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config/firebase";

import AuthPage from "./components/Auth/AuthPage";
import ChatPage from "./components/Chat/ChatPage";
import AdminPage from "./components/Admin/AdminPage";
import EmailVerificationPage from "./components/Auth/EmailVerificationPage";
import { axiosWithAuth } from './utils/axiosWithAuth';
import { BACKEND_URL } from './backend';
import socket from "./utils/socket";

// const socket = io(BACKEND_URL);


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('chat');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  // REFRESH USER DATA & FIREBASE EMAIL VERIFIED
  const refreshUserData = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      await firebaseUser.reload(); // <-- ini penting untuk emailVerified status!
      const profileRes = await axiosWithAuth(firebaseUser, {
        method: 'GET',
        url: `${BACKEND_URL}/api/users/${firebaseUser.uid}/profile`
      });
      // HANYA TAMBAHKAN property profile, JANGAN override instance-nya
      firebaseUser.profile = profileRes.data;
      firebaseUser.isAdmin = profileRes.data.isAdmin;
      setUser(firebaseUser);
    } catch (error) {
      setUser(firebaseUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProfileUpdate = async () => {
    const currentFirebaseUser = auth.currentUser;
    await refreshUserData(currentFirebaseUser);
  };

  // Listen Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      refreshUserData(currentUser);
    });
    return () => unsubscribe();
  }, [refreshUserData]);

  const handleLogout = () => signOut(auth);

  // Socket listener
  useEffect(() => {
    const handleNewMessage = (message) => {
      const isSender = message.senderId === user?.uid;
      const displayText = isSender
        ? message.originalText
        : (message.translations?.[user.languagePreference] || message.originalText);

      const isRelevant = selectedChat && [message.senderId, message.recipientId].includes(selectedChat.uid);
      if (isRelevant) {
        setMessages(prev => [...prev, { ...message, text: displayText }]);
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [selectedChat, user]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const handleSelectChat = async (contact) => {
    setSelectedChat(contact);
    setMessages([]);
    try {
      const roomId = [user.uid, contact.uid].sort().join('_');
      const response = await axiosWithAuth(user, {
        method: 'GET',
        url: `${BACKEND_URL}/api/messages/${roomId}?limit=30`
      });
      const formattedMessages = response.data
        .sort((a, b) => {
          const timeA = a.timestamp?.seconds || a.timestamp?._seconds || new Date(a.timestamp).getTime() / 1000;
          const timeB = b.timestamp?.seconds || b.timestamp?._seconds || new Date(b.timestamp).getTime() / 1000;
          return timeA - timeB;
        })
        .map(msg => {
          const isSender = msg.senderId === user.uid;
          return {
            ...msg,
            text: isSender ? msg.originalText : (msg.translations?.[user.languagePreference] || msg.originalText)
          };
        });
      setMessages(formattedMessages);

      setTimeout(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    } catch (err) {
      console.error('Gagal memuat riwayat pesan:', err);
    }
  };

  if (loading)
    return (
      <div className="bg-gray-900 h-screen flex items-center justify-center">
        <p className="text-white text-xl">Memuat...</p>
      </div>
    );

  // --------- PAGE RENDERING LOGIC -------------
  const renderPage = () => {
    if (!user) return <AuthPage />;
    // Tahan di halaman verifikasi jika email belum verified!
    if (!user.emailVerified) {
      return (
        <EmailVerificationPage
          user={user}
          onVerified={async () => {
            await refreshUserData(auth.currentUser);
          }}
          onLogout={handleLogout}
        />
      );
    }
    if (currentPage === 'admin' && user.isAdmin) {
      return <AdminPage currentUser={user} navigateToChat={() => setCurrentPage('chat')} />;
    }
    return (
      <ChatPage
        currentUser={user}
        selectedChat={selectedChat}
        messages={messages}
        onSelectChat={handleSelectChat}
        onLogout={handleLogout}
        chatRef={chatContainerRef}
        onProfileUpdate={handleProfileUpdate}
        navigateToAdmin={() => setCurrentPage('admin')}
      />
    );
  };

  return (
    <div className="bg-gray-800 text-white h-screen w-screen overflow-hidden font-sans">
      {renderPage()}
    </div>
  );
}

export default App;
