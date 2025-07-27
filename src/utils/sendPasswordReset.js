// src/utils/sendPasswordReset.js
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

/**
 * Kirim email reset password sesuai bahasa user
 * @param {string} email
 * @param {string} language
 */
export async function sendResetEmail(email, language = 'en') {
  const auth = getAuth();
  auth.languageCode = language;
  await sendPasswordResetEmail(auth, email);
}
