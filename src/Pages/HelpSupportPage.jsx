import React, { useState } from "react";
import { FiHelpCircle, FiMail, FiMessageCircle, FiPhone, FiCheck } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "How does PriceScout compare prices?",
      a: "We track and verify product prices across online retail channels like Amazon, Flipkart, and Croma in real-time, matching products by specifications and name to display the absolute lowest price.",
    },
    {
      q: "How do I create a price drop alert?",
      a: "To set an alert, visit a product details page, click the 'Set Price Alert' button, specify your target threshold and email address, and we'll notify you automatically.",
    },
    {
      q: "How frequently are prices updated?",
      a: "Prices are updated continuously throughout the day to ensure we catch active drops, lightning deals, and coupon discounts.",
    },
    {
      q: "Is there any fee to use PriceScout?",
      a: "No, PriceScout is completely free to use. We help you find deals and compare prices at zero cost.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      <Sidebar />
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Help & Support</h1>
            <p className="text-gray-500 text-sm mb-8">Get help with searching, tracking, and managing your price alerts.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* FAQ and Search Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 mb-6"
                  />

                  <div className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                      <p className="text-sm text-gray-400 font-semibold text-center py-6">No matching FAQs found.</p>
                    ) : (
                      filteredFaqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                          <h3 className="font-bold text-sm text-gray-900 mb-1">{faq.q}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed font-semibold">{faq.a}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Support Section */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">Contact Us</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                      <FiMail className="text-indigo-600 text-base" />
                      <span>support@pricescout.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                      <FiPhone className="text-indigo-600 text-base" />
                      <span>+1 (800) 555-0199</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                      <FiMessageCircle className="text-indigo-600 text-base" />
                      <span>Live Chat (Mon-Fri)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Send a Message</h2>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Message</label>
                      <textarea
                        name="message"
                        required
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-indigo-100 cursor-pointer"
                    >
                      Submit Ticket
                    </button>

                    {submitted && (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3 text-xs mt-3 flex items-center gap-2">
                        <FiCheck className="text-base" /> Ticket submitted successfully!
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpSupportPage;
