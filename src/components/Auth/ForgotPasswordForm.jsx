import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordForm = ({ language = "id" }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setSent(false);
    setError("");
    try {
      const auth = getAuth();
      auth.languageCode = language;
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-4 mt-2">
      <input
        className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none"
        type="email"
        placeholder="Email terdaftar"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 text-white"
      >
        {sent ? "Terkirim!" : "Kirim Link Reset"}
      </button>
      {sent && <p className="text-green-400 text-sm text-center">Cek email Anda!</p>}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
};

export default ForgotPasswordForm;