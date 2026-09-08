import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiHelpCircle,
  FiMessageSquare,
  FiMail,
  FiFileText,
  FiZap,
  FiShoppingCart,
  FiBell,
  FiShield,
  FiChevronDown,
  FiChevronUp,
  FiSend,
  FiPaperclip,
  FiCheckCircle,
  FiExternalLink,
  FiX,
  FiCheck,
  FiChevronRight,
  FiPhone,
  FiActivity,
} from "react-icons/fi";
import { FaWhatsapp, FaStore, FaQuestionCircle } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    name: "Mohan Teja",
    email: "mohan.teja@gmail.com",
    category: "Price Alert Issue",
    priority: "Medium",
    subject: "",
    message: "",
  });

  const [attachmentName, setAttachmentName] = useState("");

  const faqs = [
    {
      id: 1,
      category: "price-alerts",
      question: "How do I set up a real-time price drop alert for a product?",
      answer:
        "Open the 'Price Alerts' page or click the bell icon on any product card. Choose your desired target price (or use our 1-click discount presets like 10% Drop), select notification channels (Email, Browser Push, WhatsApp), and click 'Activate Price Alert'.",
    },
    {
      id: 2,
      category: "store-integrations",
      question: "Which e-commerce stores and retailers are supported?",
      answer:
        "We support live price comparison and stock tracking across Amazon India, Flipkart, Croma, Apple Store, Reliance Digital, Myntra, and Ajio. Prices are checked every hour.",
    },
    {
      id: 3,
      category: "comparison-engine",
      question: "How does the multi-store product comparison engine calculate savings?",
      answer:
        "Our engine compares the highest list price against the lowest verified seller price, factoring in active bank instant discounts and cashback to show the true maximum savings amount.",
    },
    {
      id: 4,
      category: "price-history",
      question: "Can I view historical price trends before making a purchase?",
      answer:
        "Yes! When viewing any product on the comparison page, scroll to 'Price History' to view interactive lowest, highest, and average price trends over the last 30, 90, or 365 days.",
    },
    {
      id: 5,
      category: "price-alerts",
      question: "How quickly are price drop notifications delivered?",
      answer:
        "Instant alerts are dispatched within seconds of a price reduction being detected on an authorized retailer.",
    },
    {
      id: 6,
      category: "account-privacy",
      question: "How can I manage or delete my saved wishlist and browsing data?",
      answer:
        "Navigate to 'Settings' or 'Browsing History' where you can selectively delete individual items or click 'Clear All History' to erase stored local data anytime.",
    },
  ];

  const categories = [
    {
      id: "price-alerts",
      name: "Price Alerts & Triggers",
      icon: FiZap,
      count: "3 Guides",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950 border-amber-200",
    },
    {
      id: "store-integrations",
      name: "Store Integrations",
      icon: FiShoppingCart,
      count: "2 Guides",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950 border-blue-200",
    },
    {
      id: "comparison-engine",
      name: "Specs & Comparison",
      icon: FiHelpCircle,
      count: "2 Guides",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border-indigo-200",
    },
    {
      id: "account-privacy",
      name: "Privacy & Account",
      icon: FiShield,
      count: "1 Guide",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 border-emerald-200",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      showToast("Please fill in the subject and message fields.", "error");
      return;
    }

    const ticketId = `#TK-${Math.floor(100000 + Math.random() * 900000)}`;
    showToast(`Support ticket ${ticketId} submitted successfully!`, "success");
    setTicketForm((prev) => ({ ...prev, subject: "", message: "" }));
    setAttachmentName("");
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-6xl w-full mx-auto pb-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Help & Support Center</span>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-10 mb-8 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold rounded-full">
                <FiHelpCircle className="text-amber-400 text-xs" />
                24/7 Knowledge Base & Support
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                How Can We Help You?
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Find answers on price tracking, store crawling, product comparison, or submit a support inquiry.
              </p>

              {/* Search Bar */}
              <div className="pt-2 relative max-w-xl mx-auto">
                <div className="relative">
                  <FiSearch className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search answers (e.g. 'Amazon alerts', 'Compare stores', 'History')..."
                    className="w-full pl-11 pr-16 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs sm:text-sm font-semibold transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-3 text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Platform Status Ribbon */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-4 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-sm font-bold">
                <FiActivity />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  PriceScout Crawler Engine: 100% Operational
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">
                  Amazon, Flipkart, Croma, Apple Store & Reliance Digital synced in real-time.
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200">
              All Systems Normal
            </span>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? "all" : cat.id)}
                  className={`p-5 rounded-3xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-md"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className={`p-2.5 rounded-2xl border ${cat.color}`}>
                      <Icon className="text-lg" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Common guides & FAQs</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main FAQ & Ticket Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: FAQ Accordion */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Instant answers to top platform inquiries
                    </p>
                  </div>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-xl cursor-pointer"
                    >
                      Show All FAQs
                    </button>
                  )}
                </div>

                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <FiHelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      No matching questions found
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Try searching with different keywords or submit a ticket.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFaqs.map((faq) => {
                      const isOpen = openFaqId === faq.id;

                      return (
                        <div
                          key={faq.id}
                          className="border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 rounded-2xl overflow-hidden transition"
                        >
                          <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full p-4 text-left font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-950 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            {isOpen ? (
                              <FiChevronUp className="text-indigo-600 dark:text-indigo-400 shrink-0 text-base" />
                            ) : (
                              <FiChevronDown className="text-slate-400 shrink-0 text-base" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 dark:bg-slate-900/50 dark:bg-slate-950 space-y-3">
                              <p className="pt-2">{faq.answer}</p>
                              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 dark:border-slate-800 font-semibold">
                                <span>Was this helpful?</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    showToast("Thank you for your feedback!", "success")
                                  }
                                  className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                >
                                  Yes, helpful
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    showToast(
                                      "Feedback recorded. We will improve this guide.",
                                      "info"
                                    )
                                  }
                                  className="text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                                >
                                  Needs improvement
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Support Ticket Form & Contacts */}
            <div className="lg:col-span-5 space-y-6">
              {/* Submit Ticket Card */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Submit Support Ticket
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Our technical support team replies within 2 hours
                  </p>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Issue Category
                    </label>
                    <select
                      name="category"
                      value={ticketForm.category}
                      onChange={handleTicketChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:bg-white dark:focus:bg-slate-900 dark:bg-slate-900 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Price Alert Issue">Price Alert Issue</option>
                      <option value="Store Crawler Sync">Store Crawler Sync</option>
                      <option value="Product Comparison Missing">
                        Product Comparison Missing
                      </option>
                      <option value="Account & Preferences">Account & Preferences</option>
                      <option value="Other Question">Other Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={ticketForm.subject}
                      onChange={handleTicketChange}
                      placeholder="e.g. Price drop alert not received on iPhone 16"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:bg-white dark:focus:bg-slate-900 dark:bg-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Message Details
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={ticketForm.message}
                      onChange={handleTicketChange}
                      placeholder="Describe your question or product link details..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:bg-white dark:focus:bg-slate-900 dark:bg-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer transition">
                      <FiPaperclip className="text-xs" />
                      <span>Attach Screenshot</span>
                      <input
                        type="file"
                        onChange={handleFileAttachment}
                        className="hidden"
                      />
                    </label>
                    {attachmentName && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px] font-semibold">
                        {attachmentName}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    <FiSend className="text-xs" />
                    <span>Send Support Ticket</span>
                  </button>
                </form>
              </div>

              {/* Direct Support Channels */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl space-y-4 shadow-lg">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <FiMessageSquare className="text-emerald-400" />
                  Direct Contact Channels
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-white/5 dark:bg-slate-900/5 dark:bg-slate-900 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold">Live Support Chat</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                      Online Now
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 dark:bg-slate-900/5 dark:bg-slate-900 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <FiMail className="text-slate-400" />
                      <span className="font-bold">Support Email</span>
                    </div>
                    <span className="text-[11px] text-slate-300 font-mono">
                      support@pricescout.io
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 text-xs font-bold animate-bounce backdrop-blur-md">
          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white">
            <FiCheck className="stroke-[3]" />
          </div>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
