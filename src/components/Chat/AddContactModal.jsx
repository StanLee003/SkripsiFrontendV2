import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import { BACKEND_URL } from '../../backend';

// Label multi-bahasa
const labels = {
  en: {
    title: "Add New Contact",
    placeholder: "Search by username...",
    added: "Added",
    add: "Add",
    errorSearch: "Error while searching.",
    notFound: "User not found.",
    errorAdd: "Failed to add contact."
  },
  id: {
    title: "Tambah Kontak Baru",
    placeholder: "Cari dengan username...",
    added: "Ditambahkan",
    add: "Tambah",
    errorSearch: "Error saat mencari.",
    notFound: "Pengguna tidak ditemukan.",
    errorAdd: "Gagal menambah kontak."
  },
  zh: {
    title: "添加新联系人",
    placeholder: "按用户名搜索...",
    added: "已添加",
    add: "添加",
    errorSearch: "搜索时出错。",
    notFound: "未找到用户。",
    errorAdd: "添加联系人失败。"
  }
};

const AddContactModal = ({ currentUser, closeModal, onContactAdded, language = 'en' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [addStatus, setAddStatus] = useState({});

  const lang = labels[language] || labels.en; // fallback ke English jika tidak tersedia

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setError('');
    setLoading(true);
    try {
      const response = await axiosWithAuth(currentUser.firebase || currentUser, {
        method: 'GET',
        url: `${BACKEND_URL}/api/users/search`,
        params: { query: searchTerm },
      });
      setSearchResults(response.data ? [response.data] : []);
    } catch (err) {
      setSearchResults([]);
      if (err.response?.status === 404) {
        setError(lang.notFound);
      } else {
        setError(err.response?.data?.message || lang.errorSearch);
      }
    }
    setLoading(false);
  };

  const handleAddContact = async (targetUser) => {
    setAddStatus({ ...addStatus, [targetUser.uid]: 'loading' });
    try {
      await axiosWithAuth(currentUser.firebase || currentUser, {
        method: 'POST',
        url: `${BACKEND_URL}/api/users/contacts`,
        data: {
          currentUserId: currentUser.uid,
          targetUserId: targetUser.uid
        }
      });
      setAddStatus({ ...addStatus, [targetUser.uid]: 'success' });
      onContactAdded();
    } catch (err) {
      setAddStatus({ ...addStatus, [targetUser.uid]: 'error' });
      setError(err.response?.data?.message || lang.errorAdd);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{lang.title}</h2>
          <button onClick={closeModal}>
            <X className="h-6 w-6 text-gray-400 hover:text-white" />
          </button>
        </div>
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang.placeholder}
              className="flex-1 px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-500"
            >
              {loading ? '...' : <Search />}
            </button>
          </form>
          <div className="mt-4 min-h-[100px]">
            {error && <p className="text-center text-red-400">{error}</p>}
            {searchResults.map(user => (
              <div key={user.uid} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700">
                <div>
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
                <button
                  onClick={() => handleAddContact(user)}
                  disabled={addStatus[user.uid] === 'loading' || addStatus[user.uid] === 'success'}
                  className="px-3 py-1 text-sm rounded-md bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {addStatus[user.uid] === 'loading'
                    ? '...'
                    : addStatus[user.uid] === 'success'
                      ? lang.added
                      : lang.add}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
