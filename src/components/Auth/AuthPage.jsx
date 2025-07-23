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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await axios.post(`${BACKEND_URL}/api/auth/register-profile`, {
        uid: user.uid,
        email,
        displayName,
        username,
      });

      setSuccessMessage('Registration successful! Please check your email to verify, then log in.');
      setTimeout(() => {
        setIsLoginMode(true);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Please log in or use a different email.");
      } else {
        setError(err.response?.data?.message || err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Your email is not verified yet. Please check your email and click the verification link.');
        try {
          await user.sendEmailVerification();
        } catch (_) {}
        setLoading(false);
        return;
      }

    } catch (err) {
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Incorrect email or password!");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError(err.message || "Login failed.");
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
          {isLoginMode ? 'Welcome Back' : 'Create a New Account'}
        </h1>
        <p className="text-center text-gray-400 text-sm md:text-base">
          {isLoginMode ? 'Log in to continue.' : 'Fill in the details to get started.'}
        </p>
        <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">
          {!isLoginMode && (
            <>
              <InputField label="Display Name" type="text" value={displayName} onChange={setDisplayName} placeholder="Your Full Name" required />
              <InputField label="Username" type="text" value={username} onChange={setUsername} placeholder="unique_username" required />
            </>
          )}
          <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
          <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {successMessage && <p className="text-sm text-green-400 text-center">{successMessage}</p>}
          <button type="submit" disabled={loading} className="w-full px-4 py-3 text-base font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-indigo-500 disabled:cursor-not-allowed transition-all duration-300">
            {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleMode} className="ml-2 font-semibold text-indigo-400 hover:text-indigo-500 focus:outline-none">
            {isLoginMode ? 'Register here' : 'Login here'}
          </button>
        </p>
        {showForgot ? (
          <>
            <ForgotPasswordForm language="en" />
            <button
              className="text-indigo-400 hover:text-indigo-500 mt-4 block mx-auto"
              onClick={() => setShowForgot(false)}
            >
              Back to Login
            </button>
          </>
        ) : (
          <p className="text-sm text-center mt-2">
            <button
              className="text-indigo-400 hover:text-indigo-500"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;