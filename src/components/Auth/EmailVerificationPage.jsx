import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { sendEmailVerification } from "firebase/auth";

const EmailVerificationPage = ({ user, onVerified }) => {
  const [sending, setSending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    // POLLING: cek status emailVerified setiap 3 detik
    const interval = setInterval(async () => {
      try {
        await user.reload();
        if (auth.currentUser && auth.currentUser.emailVerified) {
          setSuccess("Email sudah diverifikasi! Masuk ke aplikasi...");
          setTimeout(() => {
            onVerified();
          }, 1200);
        }
      } catch (err) {
        // optional: set error polling
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [user, onVerified]);

  const handleResend = async () => {
    setSending(true);
    setError("");
    setSuccess("");
    try {
      await sendEmailVerification(user);
      setResent(true);
      setSuccess("Link verifikasi sudah dikirim! Cek inbox atau folder spam.");
      setTimeout(() => setResent(false), 3000); // Nonaktifkan tombol resend selama 3 detik
    } catch (err) {
      console.error("Resend verification error:", err);
      setError(
        "Gagal mengirim ulang email verifikasi. " +
          (err?.message || "") +
          (err?.code ? ` (code: ${err.code})` : "")
      );
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Verifikasi Email Anda</h2>
        <p>
          Silakan cek email <b>{user.email}</b> untuk verifikasi akun.<br />
          <span className="text-gray-400 text-sm">(Cek folder <b>Spam</b> jika tidak ditemukan)</span>
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Setelah verifikasi, halaman ini akan otomatis masuk ke aplikasi.
        </p>
        <button
          onClick={handleResend}
          disabled={sending || resent}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-gray-700 font-semibold transition-all"
        >
          {sending
            ? "Mengirim..."
            : resent
            ? "Terkirim!"
            : "Kirim Ulang Email Verifikasi"}
        </button>
        {success && <p className="text-green-400 mt-2">{success}</p>}
        {error && <p className="text-red-400 mt-2">{error}</p>}
        <button
          className="mt-4 text-gray-400 underline"
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationPage;