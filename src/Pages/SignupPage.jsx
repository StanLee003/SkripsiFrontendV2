// src/pages/SignupPage.jsx
import { sendVerificationEmail } from "../utils/sendEmailVerification";

// ...pada bagian signup, misal setelah berhasil signup:
await sendVerificationEmail(userLanguage || 'en');
alert('Link verifikasi sudah dikirim ke email Anda.');
