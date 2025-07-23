import { useState, useEffect, useCallback } from 'react';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import ContactList from './ContactList';
import AddContactModal from './AddContactModal';
import EditProfileModal from './EditProfileModal';
import ChatWindow from './ChatWindow';
import WelcomeScreen from './WelcomeScreen';
import socket from '../../utils/socket';
import { BACKEND_URL } from '../../backend';
import { Menu } from 'lucide-react';

const ChatPage = ({ currentUser, onLogout, onProfileUpdate, navigateToAdmin }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddContactModalOpen, setAddContactModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Pastikan UID dan language selalu diambil dari root user, atau dari .profile jika memang begitu
  const userUid = currentUser?.uid;
  const userLang =
    currentUser?.languagePreference ||
    currentUser?.profile?.languagePreference ||
    "en";

  // UTILITY: Tutup sidebar
  const closeSidebar = () => setSidebarOpen(false);

  // Ambil pesan terakhir
  const getLastMessage = async (userUid, contactUid) => {
    const roomId = [userUid, contactUid].sort().join('_');
    try {
      const res = await axiosWithAuth(currentUser, {
        method: 'GET',
        url: `${BACKEND_URL}/api/messages/${roomId}?limit=1`
      });
      if (res.data && res.data.length > 0) {
        const msg = res.data[0];
        return msg.senderId === userUid
          ? msg.originalText
          : (msg.translations?.[userLang] || msg.originalText);
      }
      return "";
    } catch {
      return "";
    }
  };

  // Fetch kontak
  const fetchContacts = useCallback(async () => {
    if (!userUid) return;
    try {
      const response = await axiosWithAuth(currentUser, {
        method: 'GET',
        url: `${BACKEND_URL}/api/users/${userUid}/contacts`
      });
      const contactsWithLastMsg = await Promise.all(
        response.data.map(async contact => {
          const lastMessage = await getLastMessage(userUid, contact.uid);
          return { ...contact, lastMessage };
        })
      );
      setContacts(contactsWithLastMsg);
    } catch (error) {
      console.error("Gagal mengambil kontak:", error);
    }
  }, [currentUser, userUid]);

  useEffect(() => {
    fetchContacts();
    if (userUid) socket.emit('joinPersonalRoom', userUid);

    const handleNewMessage = (message) => {
      if (selectedChat && (message.senderId === selectedChat.uid || message.recipientId === selectedChat.uid)) {
        setMessages(prev => [...prev, message]);
      }
      fetchContacts();
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [userUid, selectedChat, fetchContacts]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
      return;
    }
    const query = searchTerm.toLowerCase();
    setFilteredContacts(
      contacts.filter(contact =>
        (contact.displayName && contact.displayName.toLowerCase().includes(query)) ||
        (contact.username && contact.username.toLowerCase().includes(query))
      )
    );
  }, [searchTerm, contacts]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    const messageData = { senderId: userUid, recipientId: selectedChat.uid, message: newMessage };
    socket.emit('chatMessage', messageData);
    setNewMessage("");
    fetchContacts();
  };

  // Pilih chat: fetch messages room, pakai axiosWithAuth
  const handleSelectChat = async (contact) => {
    setSelectedChat(contact);
    setMessages([]);
    closeSidebar();
    try {
      const roomId = [userUid, contact.uid].sort().join('_');
      const response = await axiosWithAuth(currentUser, {
        method: 'GET',
        url: `${BACKEND_URL}/api/messages/${roomId}`
      });
      const formattedMessages = response.data
        .sort((a, b) => {
          const timeA = a.timestamp?.seconds || a.timestamp?._seconds || new Date(a.timestamp).getTime() / 1000;
          const timeB = b.timestamp?.seconds || b.timestamp?._seconds || new Date(b.timestamp).getTime() / 1000;
          return timeA - timeB;
        })
        .map(msg => {
          const isSender = msg.senderId === userUid;
          return {
            ...msg,
            text: isSender ? msg.originalText : (msg.translations?.[userLang] || msg.originalText)
          };
        });
      setMessages(formattedMessages);
      setTimeout(() => {
        const container = document.getElementById('chatScrollContainer');
        if (container) container.scrollTop = container.scrollHeight;
      }, 100);

    } catch (err) {
      console.error('Gagal memuat riwayat pesan:', err);
    }
  };

  return (
    <>
      <div className="h-full w-full flex">
        {/* === SIDEBAR === */}
        {!isAddContactModalOpen && !isEditProfileModalOpen && (
          <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-full sm:w-80 lg:w-96 border-r border-gray-700 bg-gray-800 z-30`}>
            <ContactList
              currentUser={currentUser}
              contacts={filteredContacts}
              onSelectChat={handleSelectChat}
              onLogout={onLogout}
              openAddContact={() => {
                setAddContactModalOpen(true);
                setSidebarOpen(false);
              }}
              openEditProfile={() => {
                setEditProfileModalOpen(true);
                setSidebarOpen(false);
              }}
              navigateToAdmin={navigateToAdmin}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onProfileUpdate={onProfileUpdate}
            />
          </div>
        )}
        {/* === OVERLAY MOBILE SIDEBAR === */}
        {sidebarOpen && !isAddContactModalOpen && !isEditProfileModalOpen && (
          <div className="fixed inset-0 bg-black opacity-50 md:hidden z-20" onClick={() => setSidebarOpen(false)}></div>
        )}
        {/* === MAIN CHAT CONTENT === */}
        <div className="flex-1 flex flex-col">
          <div className="md:hidden p-3 bg-gray-800 flex justify-between items-center shadow-md">
            <button onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6 text-gray-300" /></button>
            <h2 className="text-lg font-semibold text-white">{selectedChat ? selectedChat.displayName : "Chat"}</h2>
            <div className="w-6"></div>
          </div>
          {selectedChat ? (
            <ChatWindow
              chatPartner={selectedChat}
              messages={messages}
              currentUser={currentUser}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
            />
          ) : (
            <WelcomeScreen 
              language={userLang}
            />
          )}
        </div>
      </div>
      {/* === MODALS === */}
      {isAddContactModalOpen && (
        <AddContactModal
          currentUser={currentUser}
          closeModal={() => setAddContactModalOpen(false)}
          onContactAdded={fetchContacts}
          language={userLang}
        />
      )}
      {isEditProfileModalOpen && (
        <EditProfileModal
          currentUser={currentUser}
          closeModal={() => setEditProfileModalOpen(false)}
          onProfileUpdate={onProfileUpdate}
          language={userLang}
        />
      )}
    </>
  );
};

export default ChatPage;