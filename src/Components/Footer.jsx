import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-16 bg-gray-900 text-white rounded-t-3xl">

      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo */}

          <div>

            <h1 className="text-3xl font-bold text-indigo-400">
              PriceScout
            </h1>

            <p className="mt-4 text-gray-300">
              Compare products from multiple shopping websites
              and always buy at the best price.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h2 className="text-xl font-semibold mb-4">
              Quick Links
            </h2>

            <ul className="space-y-2 text-gray-300">

              <li className="hover:text-white cursor-pointer">
                Home
              </li>

              <li className="hover:text-white cursor-pointer">
                Products
              </li>

              <li className="hover:text-white cursor-pointer">
                Categories
              </li>

              <li className="hover:text-white cursor-pointer">
                Contact
              </li>

            </ul>

          </div>

          {/* Services */}

          <div>

            <h2 className="text-xl font-semibold mb-4">
              Services
            </h2>

            <ul className="space-y-2 text-gray-300">

              <li>Price Comparison</li>

              <li>Product Search</li>

              <li>Wishlist</li>

              <li>Price Alerts</li>

            </ul>

          </div>

          {/* Social */}

          <div>

            <h2 className="text-xl font-semibold mb-4">
              Follow Us
            </h2>

            <div className="flex gap-4 text-2xl">

              <FaFacebook className="cursor-pointer hover:text-blue-500 transition" />

              <FaInstagram className="cursor-pointer hover:text-pink-500 transition" />

              <FaLinkedin className="cursor-pointer hover:text-blue-400 transition" />

              <FaGithub className="cursor-pointer hover:text-gray-400 transition" />

              <FaTwitter className="cursor-pointer hover:text-sky-400 transition" />

            </div>

          </div>

        </div>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">

          <p>
            © 2026 Product Search Automation. All Rights Reserved.
          </p>

          <p>
            Developed with ❤️ using React & Tailwind CSS
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;