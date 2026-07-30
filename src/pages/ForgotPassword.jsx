import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    alert("Password reset link has been sent to your email.");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-5">

      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-gray-800">
            Forgot Password?
          </h1>

          <p className="text-gray-500 mt-3">
            Enter your registered email address.
            We'll send you a password reset link.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <div className="relative">

            <FaEnvelope className="absolute top-4 left-4 text-gray-500" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            Send Reset Link
          </button>

        </form>

        <div className="text-center mt-6">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <FaArrowLeft />
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;