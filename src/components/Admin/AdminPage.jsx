import React, { useState, useEffect, useCallback } from 'react';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import UserAvatar from '../Chat/UserAvatar';
import AdminToggle from './AdminToggle';
import { BACKEND_URL } from '../../backend';

const AdminPage = ({ currentUser, navigateToChat }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pakai currentUser.firebase sebagai user Firebase
  const firebaseUser = currentUser?.firebase || currentUser; // fallback kalau langsung passing user

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosWithAuth(firebaseUser, {
        method: 'GET',
        url: `${BACKEND_URL}/api/admin/users`,
      });
      setUsers(response.data);
    } catch (err) {
      setError('Gagal memuat data pengguna atau akses ditolak.');
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (uid) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        await axiosWithAuth(firebaseUser, {
          method: 'DELETE',
          url: `${BACKEND_URL}/api/admin/users/${uid}`,
        });
        fetchUsers();
      } catch (err) {
        alert('Gagal menghapus pengguna.');
      }
    }
  };

  const handleAdminStatusChange = async (uid, newStatus) => {
    try {
      await axiosWithAuth(firebaseUser, {
        method: 'PUT',
        url: `${BACKEND_URL}/api/admin/users/${uid}/admin-status`,
        data: { isAdmin: newStatus },
      });
      fetchUsers();
    } catch (err) {
      alert('Gagal mengubah status admin.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Panel Admin</h1>
        <button onClick={navigateToChat} className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700">
          Kembali ke Chat
        </button>
      </div>
      {loading && <p>Memuat pengguna...</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="flex-1 overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.uid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserAvatar user={user} size="small" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.displayName}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">@{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AdminToggle
                        isAdmin={user.isAdmin}
                        onChange={(newStatus) => handleAdminStatusChange(user.uid, newStatus)}
                        disabled={user.uid === firebaseUser.uid}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.uid)}
                        className="text-red-400 hover:text-red-600 disabled:text-gray-500 disabled:cursor-not-allowed"
                        disabled={user.uid === firebaseUser.uid}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
