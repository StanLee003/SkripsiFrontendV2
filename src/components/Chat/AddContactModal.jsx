import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { axiosWithAuth } from '../../utils/axiosWithAuth'; // Tambahkan import ini!
import { BACKEND_URL } from '../../backend';                // Pastikan juga ini ada

const AddContactModal = ({ currentUser, closeModal, onContactAdded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [addStatus, setAddStatus] = useState({});

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
      setError(err.response?.data?.message || 'Error saat mencari.');
    } finally {
      setLoading(false);
    }
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
      setError(err.response?.data?.message || 'Gagal menambah kontak.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Tambah Kontak Baru</h2>
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
              placeholder="Cari dengan username..."
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
                      ? 'Ditambahkan'
                      : 'Tambah'}
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
