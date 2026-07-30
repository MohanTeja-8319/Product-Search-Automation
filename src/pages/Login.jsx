import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login Successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-12">
          <h1 className="text-5xl font-bold mb-5">
            Product Search
          </h1>

          <h2 className="text-3xl font-semibold mb-4">
            Automation
          </h2>

          <p className="text-center text-lg leading-8">
            Search products from multiple shopping websites
            and compare prices instantly.
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="Shopping"
            className="w-48 mt-10"
          />
        </div>

        {/* Right Section */}
        <div className="p-10">

          <h2 className="text-4xl font-bold text-center text-gray-800">
            Welcome Back 👋
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Login to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>

              <label className="block mb-2 font-medium">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  className="w-full border rounded-xl p-4 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-5 text-gray-500"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            <div className="flex justify-between items-center text-sm">

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition"
            >
              Login
            </button>

          </form>

          <div className="flex items-center my-8">

            <div className="flex-1 border"></div>

            <span className="px-4 text-gray-400">
              OR
            </span>

            <div className="flex-1 border"></div>

          </div>

          <button className="w-full border rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-100 transition">

            <FaGoogle className="text-red-500 text-xl" />

            Continue with Google

          </button>

          <p className="text-center mt-8">

            Don't have an account?

            <Link
              to="/register"
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;
