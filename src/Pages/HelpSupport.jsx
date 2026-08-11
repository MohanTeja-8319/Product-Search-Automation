import React, { useState } from "react";
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
  FiX
} from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    name: "User",
    email: "user@email.com",
    category: "Technical Issue",
    subject: "",
    message: ""
  });

  const [attachmentName, setAttachmentName] = useState("");

  const faqs = [
    {
      id: 1,
      category: "search-rules",
      question: "How do I set up a price drop alert for a product?",
      answer: "Go to the 'Price Alerts' page or any product details page, enter your target price, select your preferred store (Amazon, Flipkart, eBay), and click 'Create Alert'."
    },
    {
      id: 2,
      category: "store-integrations",
      question: "Which store price comparisons are supported?",
      answer: "We support real-time price tracking and comparison across Amazon, Flipkart, eBay, Walmart, and Best Buy."
    },
    {
      id: 3,
      category: "price-alerts",
      question: "How quickly are price drop notifications sent?",
      answer: "Alerts are processed every 15 minutes. When a store listing drops to or below your target price, you'll receive an instant email and push notification."
    },
    {
      id: 4,
      category: "account-limits",
      question: "Can I compare historical price charts for products?",
      answer: "Yes! Open any product detail page and scroll to 'Price History' to view interactive high/low price trends over the past 30, 90, or 365 days."
    },
    {
      id: 5,
      category: "search-rules",
      question: "How does product comparison table ranking work?",
      answer: "Our comparison engine evaluates price, shipping fees, seller ratings, bank offers, and warranty terms to display the best value store option."
    }
  ];

  const categories = [
    { id: "search-rules", name: "Price Alerts & Triggers", icon: FiZap, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { id: "store-integrations", name: "Store Integrations", icon: FiShoppingCart, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "price-alerts", name: "Notifications & Alerts", icon: FiBell, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { id: "account-limits", name: "Price History & Data", icon: FiShield, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({ ...prev, [name]: value }));
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

    showToast(`Support ticket #${Math.floor(100000 + Math.random() * 900000)} submitted successfully!`, "success");
    setTicketForm(prev => ({ ...prev, subject: "", message: "" }));
    setAttachmentName("");
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      <Sidebar />
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-4 md:p-8 flex-1">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* HERO BANNER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-indigo-100">
              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-indigo-100 text-xs font-semibold uppercase tracking-wider">
                  <FiHelpCircle className="w-3.5 h-3.5" />
                  Product Search Support Center
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  How can we help you?
                </h1>
                <p className="text-indigo-100 text-xs md:text-sm opacity-90">
                  Search answers on price tracking, store offers, comparison tables, and alerts.
                </p>

                {/* Search Box */}
                <div className="pt-3 relative max-w-xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions (e.g. 'Amazon', 'Price alert', 'Comparison')..."
                      className="w-full pl-12 pr-4 py-3 bg-white text-gray-800 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 text-sm font-medium transition-all"
                    />
                    <FiSearch className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK CATEGORY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? "all" : cat.id)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected 
                        ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-md" 
                        : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Common answers & tips</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* FAQS & SUPPORT TICKET FORM GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: FAQ Accordion */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Quick guides for your product search</p>
                    </div>
                    {selectedCategory !== "all" && (
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg cursor-pointer"
                      >
                        Show All
                      </button>
                    )}
                  </div>

                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                      <FiHelpCircle className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-sm font-medium text-gray-600">No matching questions found</p>
                      <p className="text-xs text-gray-400">Try adjusting your search query.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredFaqs.map((faq) => {
                        const isOpen = openFaqId === faq.id;
                        return (
                          <div 
                            key={faq.id}
                            className="border border-gray-100 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => toggleFaq(faq.id)}
                              className="w-full p-4 text-left font-bold text-gray-800 text-sm flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer"
                            >
                              <span>{faq.question}</span>
                              {isOpen ? (
                                <FiChevronUp className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              ) : (
                                <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                            </button>

                            {isOpen && (
                              <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/40 space-y-3">
                                <p>{faq.answer}</p>
                                <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                                  <span>Was this helpful?</span>
                                  <button 
                                    type="button"
                                    onClick={() => showToast("Thank you for your feedback!", "success")} 
                                    className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                                  >
                                    Yes
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => showToast("Feedback recorded. We will update this answer.", "info")} 
                                    className="text-gray-500 hover:underline cursor-pointer"
                                  >
                                    No
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

              {/* Right Column: Ticket Form & Contact Info */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Submit Support Ticket Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Submit a Ticket</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Need help? Send a ticket to support.</p>
                  </div>

                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Issue Category
                      </label>
                      <select
                        name="category"
                        value={ticketForm.category}
                        onChange={handleTicketChange}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Store Integration Request">Store Integration Request</option>
                        <option value="Price Alert Error">Price Alert Error</option>
                        <option value="Feature Request">Feature Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={ticketForm.subject}
                        onChange={handleTicketChange}
                        placeholder="e.g. Price alert did not trigger on laptop deal"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={ticketForm.message}
                        onChange={handleTicketChange}
                        placeholder="Describe your issue or product search details..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                        <FiPaperclip className="w-3.5 h-3.5" />
                        <span>Attach File</span>
                        <input type="file" onChange={handleFileAttachment} className="hidden" />
                      </label>
                      {attachmentName && (
                        <span className="text-[11px] text-gray-500 truncate max-w-[150px]">
                          {attachmentName}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <FiSend className="w-3.5 h-3.5" />
                      Submit Ticket
                    </button>
                  </form>
                </div>

                {/* Direct Support Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl space-y-4 shadow-lg">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <FiMessageSquare className="w-4 h-4 text-emerald-400" />
                    Direct Support Channels
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Support</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                        Online
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2.5">
                        <FiMail className="w-3.5 h-3.5 text-gray-400" />
                        <span>Email Us</span>
                      </div>
                      <span className="text-[11px] text-gray-300 font-mono">
                        support@pricescout.io
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
          <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-xl bg-white ${
            toast.type === "error" ? "border-red-200 text-red-800" : "border-indigo-200 text-indigo-900"
          }`}>
            <FiCheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span className="text-xs font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-auto text-gray-400 hover:text-gray-600">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
