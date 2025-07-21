import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage({ defaultLanguage = 'en' }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const auth = getAuth();
      auth.languageCode = defaultLanguage;
      await sendPasswordResetEmail(auth, email);
      setMessage('Cek email Anda untuk link reset password!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleReset} className="bg-gray-800 p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="mb-4 text-white text-2xl font-semibold">Lupa Password</h2>
        <input
          type="email"
          placeholder="Masukkan email terdaftar"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mb-4 px-4 py-2 rounded w-full bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded text-white font-semibold"
        >Kirim Link Reset</button>
        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </form>
    </div>
  );
}
