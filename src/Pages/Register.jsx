import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Registration Successful!");
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 flex items-center justify-center p-5">

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full grid md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 to-blue-900 text-white p-10">

          <h1 className="text-5xl font-bold mb-4">
            Join Us 🚀
          </h1>

          <p className="text-center text-lg leading-8">
            Create your account and start comparing products
            from multiple e-commerce websites.
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="Register"
            className="w-56 mt-10"
          />

        </div>

        {/* Right Side */}
        <div className="p-10">

          <h2 className="text-4xl font-bold text-center text-gray-800">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Register to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div className="relative">

              <FaUser className="absolute top-5 left-4 text-gray-500" />

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            {/* Email */}
            <div className="relative">

              <FaEnvelope className="absolute top-5 left-4 text-gray-500" />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            {/* Password */}
            <div className="relative">

              <FaLock className="absolute top-5 left-4 text-gray-500" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-5 right-4 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

            {/* Confirm Password */}
            <div className="relative">

              <FaLock className="absolute top-5 left-4 text-gray-500" />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-5 right-4 text-gray-500"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

            {/* Terms */}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" required />
              I agree to the Terms & Conditions
            </label>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg transition"
            >
              Register
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-8">

            <div className="flex-1 border"></div>

            <span className="px-4 text-gray-400">
              OR
            </span>

            <div className="flex-1 border"></div>

          </div>

          {/* Google Button */}
          <button
            className="w-full border py-4 rounded-xl flex justify-center items-center gap-3 hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500 text-xl" />
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="text-center mt-8">

            Already have an account?

            <Link
              to="/"
              className="text-indigo-600 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;