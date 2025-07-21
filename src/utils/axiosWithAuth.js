// utils/axiosWithAuth.js
import axios from "axios";

// user di sini adalah user dari Firebase (firebase.auth().currentUser)
export async function axiosWithAuth(user, config) {
  if (!user || typeof user.getIdToken !== "function") {
    throw new Error("Parameter 'user' harus instance Firebase Auth User, bukan object biasa.");
  }
  const token = await user.getIdToken();
  return axios({
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
