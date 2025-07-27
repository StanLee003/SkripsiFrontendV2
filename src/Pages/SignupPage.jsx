// src/pages/SignupPage.jsx
import { sendVerificationEmail } from "../utils/sendEmailVerification";

await sendVerificationEmail(userLanguage || 'en');
alert('Link verifikasi sudah dikirim ke email Anda.');
