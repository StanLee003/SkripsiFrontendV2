// components/Auth/AuthPage.jsx
import React, { useState } from "react";
import InputField from "./InputField";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { auth } from "../../config/firebase";
import { BACKEND_URL } from '../../backend';

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return;
    }
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Langkah 1: Register ke Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Langkah 2: Kirim verifikasi email
      await sendEmailVerification(user);

      // Langkah 3: Simpan profile ke Firestore lewat backend
      await axios.post(`${BACKEND_URL}/api/auth/register-profile`, {
        uid: user.uid,
        email,
        displayName,
        username,
      });

      setSuccessMessage('Registrasi berhasil! Cek email Anda untuk verifikasi, lalu login.');
      setTimeout(() => {
        setIsLoginMode(true);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar. Silakan login atau gunakan email lain.");
      } else {
        setError(err.response?.data?.message || err.message || 'Gagal melakukan registrasi');
      }
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Email Anda belum diverifikasi. Silakan cek email dan klik tautan verifikasi.');
        try {
          await user.sendEmailVerification(); // opsional: kirim ulang jika ingin
        } catch (_) {}
        setLoading(false);
        return;
      }

      // ... lanjutkan login (set user, dsb)
    } catch (err) {
      // Tangani semua kemungkinan error login
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Email atau password salah!"); // lebih aman, user friendly
      } else if (err.code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan login. Coba beberapa saat lagi.");
      } else {
        setError(err.message || "Gagal login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-gray-800 rounded-lg shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-indigo-400">
          {isLoginMode ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
        </h1>
        <p className="text-center text-gray-400 text-sm md:text-base">
          {isLoginMode ? 'Masuk untuk melanjutkan obrolan.' : 'Isi data untuk memulai.'}
        </p>
        <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">
          {!isLoginMode && (
            <>
              <InputField label="Nama Tampilan" type="text" value={displayName} onChange={setDisplayName} placeholder="Nama Lengkap Anda" required />
              <InputField label="Username" type="text" value={username} onChange={setUsername} placeholder="username_unik" required />
            </>
          )}
          <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="anda@example.com" required />
          <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {successMessage && <p className="text-sm text-green-400 text-center">{successMessage}</p>}
          <button type="submit" disabled={loading} className="w-full px-4 py-3 text-base font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-indigo-500 disabled:cursor-not-allowed transition-all duration-300">
            {loading ? 'Memproses...' : (isLoginMode ? 'Login' : 'Register')}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          {isLoginMode ? "Belum punya akun?" : "Sudah punya akun?"}
          <button onClick={toggleMode} className="ml-2 font-semibold text-indigo-400 hover:text-indigo-500 focus:outline-none">
            {isLoginMode ? 'Register di sini' : 'Login di sini'}
          </button>
        </p>
        {showForgot ? (
          <>
            <ForgotPasswordForm language="id" />
            <button
              className="text-indigo-400 hover:text-indigo-500 mt-4 block mx-auto"
              onClick={() => setShowForgot(false)}
            >
              Kembali ke Login
            </button>
          </>
        ) : (
          <p className="text-sm text-center mt-2">
            <button
              className="text-indigo-400 hover:text-indigo-500"
              onClick={() => setShowForgot(true)}
            >
              Lupa Password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;