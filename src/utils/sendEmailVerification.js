// src/utils/sendEmailVerification.js
import { getAuth, sendEmailVerification } from "firebase/auth";

/**
 * Kirim email verifikasi ke user aktif
 * @param {string} language -
 */
export async function sendVerificationEmail(language = 'en') {
  const auth = getAuth();
  auth.languageCode = language;
  if (!auth.currentUser) throw new Error('No user is logged in');
  await sendEmailVerification(auth.currentUser);
}
