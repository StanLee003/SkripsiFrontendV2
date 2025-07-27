import React, { useState, useEffect, useCallback } from 'react';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import UserAvatar from '../Chat/UserAvatar';
import AdminToggle from './AdminToggle';
import { BACKEND_URL } from '../../backend';

const translations = {
  en: {
    adminPanel: 'Admin Panel',
    backToChat: 'Back to Chat',
    loading: 'Loading users...',
    user: 'User',
    username: 'Username',
    admin: 'Admin',
    actions: 'Actions',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this user? This action cannot be undone.',
    deleteFail: 'Failed to delete user.',
    changeAdminFail: 'Failed to change admin status.',
  },
  id: {
    adminPanel: 'Panel Admin',
    backToChat: 'Kembali ke Chat',
    loading: 'Memuat pengguna...',
    user: 'Pengguna',
    username: 'Username',
    admin: 'Admin',
    actions: 'Aksi',
    delete: 'Hapus',
    deleteConfirm: 'Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.',
    deleteFail: 'Gagal menghapus pengguna.',
    changeAdminFail: 'Gagal mengubah status admin.',
  },
  zh: {
    adminPanel: '管理员面板',
    backToChat: '返回聊天',
    loading: '加载用户中...',
    user: '用户',
    username: '用户名',
    admin: '管理员',
    actions: '操作',
    delete: '删除',
    deleteConfirm: '确定要删除此用户吗？此操作无法撤销。',
    deleteFail: '删除用户失败。',
    changeAdminFail: '更改管理员状态失败。',
  },
  ja: {
    adminPanel: '管理者パネル',
    backToChat: 'チャットに戻る',
    loading: 'ユーザーを読み込み中...',
    user: 'ユーザー',
    username: 'ユーザー名',
    admin: '管理者',
    actions: '操作',
    delete: '削除',
    deleteConfirm: 'このユーザーを削除してもよろしいですか？この操作は元に戻せません。',
    deleteFail: 'ユーザーの削除に失敗しました。',
    changeAdminFail: '管理者権限の変更に失敗しました。',
  },
};

const AdminPage = ({ currentUser, navigateToChat }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const firebaseUser = currentUser?.firebase || currentUser;
  const lang = currentUser.profile?.systemLanguage || 'en';
  const t = translations[lang] || translations.en;

  console.log("systemLanguage di AdminPage:", lang);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosWithAuth(firebaseUser, {
        method: 'GET',
        url: `${BACKEND_URL}/api/admin/users`,
      });
      setUsers(response.data);
    } catch (err) {
      setError(t.loading);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, t.loading]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (uid) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await axiosWithAuth(firebaseUser, {
          method: 'DELETE',
          url: `${BACKEND_URL}/api/admin/users/${uid}`,
        });
        fetchUsers();
      } catch (err) {
        alert(t.deleteFail);
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
      alert(t.changeAdminFail);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">{t.adminPanel}</h1>
        <button onClick={navigateToChat} className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700">
          {t.backToChat}
        </button>
      </div>
      {loading && <p>{t.loading}</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="flex-1 overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t.user}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t.username}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t.admin}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t.actions}
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
                        {t.delete}
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
