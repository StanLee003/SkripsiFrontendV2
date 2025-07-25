import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Reset Password</h2>
        <ForgotPasswordForm />
        <a
          href="/login"
          className="block text-center text-indigo-400 hover:text-indigo-500 mt-4"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}
