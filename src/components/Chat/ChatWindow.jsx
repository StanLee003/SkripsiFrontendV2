import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Menu } from 'lucide-react';

import UserAvatar from './UserAvatar';
import MessageBubble from './MessageBubble';

// Label multibahasa
const labels = {
  en: {
    online: "Online",
    searchPlaceholder: "Search this conversation...",
    typeMessage: "Type a message..."
  },
  id: {
    online: "Online",
    searchPlaceholder: "Cari di percakapan ini...",
    typeMessage: "Ketik pesan..."
  },
  zh: {
    online: "在线",
    searchPlaceholder: "搜索此对话...",
    typeMessage: "输入消息..."
  }
};

const ChatWindow = ({ chatPartner, messages, currentUser, newMessage, setNewMessage, handleSendMessage, setSidebarOpen }) => {
  const messagesEndRef = useRef(null);
  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(messages);

  const userLang = currentUser?.profile?.systemLanguage || currentUser?.systemLanguage || 'en';
  const lang = labels[userLang] || labels.en;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
    else setSearchTerm("");
  }, [showSearch]);

  useEffect(() => {
    if (!searchTerm) setFilteredMessages(messages);
    else {
      const q = searchTerm.toLowerCase();
      setFilteredMessages(messages.filter(
        m =>
          (m.text && m.text.toLowerCase().includes(q)) ||
          (m.originalText && m.originalText.toLowerCase().includes(q))
      ));
    }
  }, [searchTerm, messages]);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-900 overflow-hidden relative">
      {/* HEADER - Desktop */}
      <div className="hidden md:flex sticky top-0 z-10 w-full p-3 border-b border-gray-700 bg-gray-800 items-center flex-shrink-0">
        <UserAvatar user={chatPartner} size="small" />
        <div className="ml-3">
          <h2 className="text-md font-semibold text-white">{chatPartner.displayName}</h2>
          <p className="text-xs text-gray-400">{lang.online}</p>
        </div>
        <button
          className="ml-auto p-2 rounded-full hover:bg-gray-700 transition flex items-center justify-center"
          onClick={() => setShowSearch((s) => !s)}
          aria-label="Search Chat"
        >
          <Search className="h-6 w-6 text-gray-300" />
        </button>
      </div>

      {/* HEADER - Mobile */}
      <div className="flex md:hidden sticky top-0 z-10 p-3 bg-gray-800 justify-between items-center shadow-md">
        <button onClick={() => setSidebarOpen && setSidebarOpen(true)}>
          <Menu className="h-6 w-6 text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold text-white">{chatPartner ? chatPartner.displayName : "Chat"}</h2>
        <button
          className="p-2 rounded-full hover:bg-gray-700"
          onClick={() => setShowSearch((s) => !s)}
          aria-label="Search Chat"
        >
          <Search className="h-5 w-5 text-gray-300" />
        </button>
      </div>

      {/* SEARCH BAR */}
      {showSearch && (
        <>
          {/* Search bar mobile (top-0) */}
          <div className="md:hidden p-3 bg-gray-900 sticky top-0 z-20">
            <input
              type="text"
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang.searchPlaceholder}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Search bar desktop (top-[3.5rem]) */}
          <div className="hidden md:block p-3 bg-gray-900 sticky top-[3.5rem] z-20">
            <input
              type="text"
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang.searchPlaceholder}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </>
      )}

      {/* MESSAGE LIST */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-2">
          {filteredMessages.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg}
              isSender={msg.senderId === currentUser.uid}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex-shrink-0 z-10">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={lang.typeMessage}
            className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
          <button
            type="submit"
            className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors flex-shrink-0"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
