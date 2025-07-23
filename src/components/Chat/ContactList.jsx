import { UserPlus, Search, ShieldCheck, Settings, LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { highlightText } from '../../utils/highlightText';

// Label multibahasa
const labels = {
  en: {
    chats: "Chats",
    searchPlaceholder: "Search username",
    noContacts: "Click the add icon to find friends.",
    adminPanel: "Admin Panel",
    user: "User",
    logout: "Logout"
  },
  id: {
    chats: "Percakapan",
    searchPlaceholder: "Cari username",
    noContacts: "Klik ikon tambah untuk mencari teman.",
    adminPanel: "Panel Admin",
    user: "Pengguna",
    logout: "Keluar"
  },
  zh: {
    chats: "聊天",
    searchPlaceholder: "搜索用户名",
    noContacts: "点击添加图标寻找朋友。",
    adminPanel: "管理员面板",
    user: "用户",
    logout: "登出"
  }
};

const ContactList = ({
  currentUser, contacts, onSelectChat, onLogout, openAddContact, openEditProfile,
  navigateToAdmin, searchTerm, setSearchTerm
}) => {
  const userProfile = currentUser?.profile || currentUser || {};

  // Ambil preferensi bahasa user, fallback ke 'en'
  const userLang = currentUser?.languagePreference || currentUser?.profile?.languagePreference || 'en';
  const lang = labels[userLang] || labels.en;

  return (
    <div className="flex flex-col h-full text-gray-200">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-semibold text-white">{lang.chats}</h2>
        <button onClick={openAddContact} className="p-1 text-gray-300 hover:text-white"><UserPlus /></button>
      </div>
      <div className="p-2 flex-shrink-0">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder={lang.searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.length > 0 ? contacts.map(contact => (
          <div
            key={contact.uid}
            onClick={() => onSelectChat(contact)}
            className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700/50"
          >
            <UserAvatar user={contact} />
            <div className="flex-1 overflow-hidden ml-3">
              <p className="font-semibold text-white truncate">
                {highlightText(contact.displayName, searchTerm)}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {contact.lastMessage ? contact.lastMessage : `@${highlightText(contact.username, searchTerm)}`}
              </p>
            </div>
          </div>
        )) : (
          <p className="p-4 text-center text-gray-400">{lang.noContacts}</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        {userProfile.isAdmin && (
          <button onClick={navigateToAdmin} className="w-full flex items-center justify-center p-2 mb-2 rounded-lg text-yellow-400 hover:bg-yellow-500 hover:text-white transition-colors">
            <ShieldCheck className="h-5 w-5 mr-2" />
            {lang.adminPanel}
          </button>
        )}
        <div className="flex items-center mb-4">
          <UserAvatar user={userProfile} size="small" />
          <div className="ml-3 overflow-hidden min-w-0 flex-1">
            <p className="font-semibold text-white truncate">{userProfile.displayName || lang.user}</p>
            <p className="text-xs text-gray-400 truncate">@{userProfile.username}</p>
          </div>
          <button onClick={openEditProfile} className="p-2 text-gray-400 hover:text-white"><Settings className="h-5 w-5"/></button>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center p-2 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors">
          <LogOut className="h-5 w-5 mr-2" />
          {lang.logout}
        </button>
      </div>
    </div>
  );
};

export default ContactList;