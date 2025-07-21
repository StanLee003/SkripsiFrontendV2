// src/utils/sendPasswordReset.js
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

/**
 * Kirim email reset password sesuai bahasa user
 * @param {string} email - email user
 * @param {string} language - kode bahasa, misal 'id', 'en'
 */
export async function sendResetEmail(email, language = 'en') {
  const auth = getAuth();
  auth.languageCode = language; // Bahasa email
  await sendPasswordResetEmail(auth, email);
}
