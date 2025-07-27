import React, { useState, useEffect, useRef } from 'react';
import { X, Camera } from 'lucide-react';

import InputField from '../Auth/InputField';
import languages from '../../utils/languages';
import { BACKEND_URL } from '../../backend';
import { axiosWithAuth } from '../../utils/axiosWithAuth';

const translations = {
  en: {
    editProfile: 'Edit Profile',
    displayName: 'Display Name',
    language: 'Language Preference',
    cancel: 'Cancel',
    save: 'Save',
    profileUpdated: 'Profile updated successfully!',
    updating: 'Saving...',
    choosePhoto: 'Choose Photo',
    maxPhotoSize: 'Maximum photo size is 5MB.',
  },
  id: {
    editProfile: 'Edit Profil',
    displayName: 'Nama Tampilan',
    language: 'Bahasa Pilihan',
    cancel: 'Batal',
    save: 'Simpan',
    profileUpdated: 'Profil berhasil diperbarui!',
    updating: 'Menyimpan...',
    choosePhoto: 'Pilih Foto',
    maxPhotoSize: 'Ukuran foto maksimum 5MB.',
  },
  zh: {
    editProfile: '编辑资料',
    displayName: '显示名称',
    language: '语言偏好',
    cancel: '取消',
    save: '保存',
    profileUpdated: '资料更新成功！',
    updating: '保存中...',
    choosePhoto: '选择照片',
    maxPhotoSize: '照片最大尺寸为5MB。',
  },
};

const EditProfileModal = ({ currentUser, closeModal, onProfileUpdate }) => {
  const [displayName, setDisplayName] = useState(
    currentUser.profile?.displayName || currentUser.displayName || ''
  );
  const [languagePreference, setLanguagePreference] = useState(
    currentUser.profile?.languagePreference || currentUser.languagePreference || 'en'
  );
  const [systemLanguage, setSystemLanguage] = useState(
    currentUser.profile?.systemLanguage || currentUser.systemLanguage || 'en'
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentUser.photoURL || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const t = translations[systemLanguage] || translations.en;

  useEffect(() => {
    setError('');
    setSuccess(false);
    setDisplayName(currentUser.profile?.displayName || currentUser.displayName || '');
    setLanguagePreference(currentUser.profile?.languagePreference || currentUser.languagePreference || 'en');
    setSystemLanguage(currentUser.profile?.systemLanguage || currentUser.systemLanguage || 'en');
    setSelectedFile(null);
    setPreview(currentUser.photoURL || null);
  }, [currentUser, closeModal]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      let photoURL = currentUser.photoURL;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        const res = await axiosWithAuth(currentUser.firebase || currentUser, {
          method: 'POST',
          url: `${BACKEND_URL}/api/users/${currentUser.uid}/avatar`,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoURL = res.data.photoURL;
      }

      await axiosWithAuth(currentUser.firebase || currentUser, {
        method: 'PUT',
        url: `${BACKEND_URL}/api/users/${currentUser.uid}`,
        data: {
          displayName,
          languagePreference,
          systemLanguage,
          photoURL,
        },
      });

      setSuccess(true);
      if (onProfileUpdate) await onProfileUpdate();
      setTimeout(() => {
        setSuccess(false);
        setError('');
        closeModal && closeModal();
      }, 800);

    } catch (err) {
      setError(err.response?.data?.message || t.maxPhotoSize);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t.editProfile}</h2>
          <button onClick={closeModal}><X className="h-6 w-6 text-gray-400 hover:text-white" /></button>
        </div>
        <form onSubmit={handleUpdate} className="p-4 space-y-4">
          <div className="flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              className="relative cursor-pointer group"
              onClick={() => fileInputRef.current.click()}
              title={t.choosePhoto}
            >
              <img
                src={preview || `https://ui-avatars.com/api/?name=${displayName || currentUser.email}&background=random`}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover bg-gray-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <InputField
            label={t.displayName}
            type="text"
            value={displayName}
            onChange={setDisplayName}
          />
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">{t.language}</label>
            <select
              value={languagePreference}
              onChange={e => setLanguagePreference(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              System Language (UI)
            </label>
            <select
              value={systemLanguage}
              onChange={e => setSystemLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          {error && !success && <p className="text-sm text-red-400 text-center">{error}</p>}
          {success && !error && <p className="text-sm text-green-400 text-center">{t.profileUpdated}</p>}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 mr-2 rounded-md text-gray-300 hover:bg-gray-700"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-500"
            >
              {loading ? t.updating : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
