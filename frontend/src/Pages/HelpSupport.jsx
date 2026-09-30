import React, { useState } from "react";
import { FiSearch, FiHelpCircle, FiMail, FiMessageSquare, FiChevronDown, FiChevronUp, FiCheckCircle } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function HelpSupport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(1);
  const [toast, setToast] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is Comparely?",
      answer: "Comparely is an intelligent platform that automatically searches for products across major e-commerce websites like Amazon, Flipkart, Myntra, and more. It aggregates the product data to help you find exactly what you are looking for in one unified interface."
    },
    {
      id: 2,
      question: "How does the platform help me find the best deals?",
      answer: "Our system continuously tracks and compares product prices across multiple retailers in real-time. We provide side-by-side comparison tables and highlight the absolute lowest prices so you can maximize your savings."
    },
    {
      id: 3,
      question: "How do Price Alerts work?",
      answer: "You can track your favorite items by setting a target price. We monitor the product 24/7 and send you a notification (and email) the exact moment the price drops to or below your target."
    },
    {
      id: 4,
      question: "Is my data secure?",
      answer: "Yes! We use enterprise-grade encryption to store your preferences. We never share your personal data with third parties or the retailers we track."
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setToast("Message sent successfully! We'll get back to you soon.");
    setTimeout(() => setToast(null), 3000);
    e.target.reset();
  };

  const handleFaqSearch = () => {
    setToast("Knowledge base search coming soon!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">

          {toast && (
            <div style={{ position: "fixed", top: 24, right: 24, padding: "16px 24px", background: "var(--success)", color: "white", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", zIndex: 1000, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <FiCheckCircle /> {toast}
            </div>
          )}

          <div style={{ textAlign: "center", padding: "20px 20px 60px", maxWidth: 640, margin: "0 auto" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: "transparent", color: "var(--text-900)", border: "1px solid var(--text-900)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28
            }}>
              <FiHelpCircle />
            </div>
            
            <h1 className="font-heading" style={{ fontSize: 40, fontWeight: 400, color: "var(--text-900)", marginBottom: 16 }}>
              How can we help you?
            </h1>
            
            <p style={{ fontSize: 16, color: "var(--text-500)", lineHeight: 1.6, marginBottom: 40 }}>
              Search our knowledge base or browse the frequently asked questions below.
            </p>

            <div style={{ display: "flex", background: "var(--surface)", borderRadius: "var(--radius-full)", padding: "8px 8px 8px 24px", border: "1px solid var(--border)" }}>
              <FiSearch size={20} color="var(--text-400)" style={{ alignSelf: "center", flexShrink: 0 }} />
              <input type="text" placeholder="Search for answers..." style={{ flex: 1, border: "none", outline: "none", padding: "14px 16px", fontSize: 15, background: "transparent", color: "var(--text-900)" }} />
              <button onClick={handleFaqSearch} className="btn btn-primary btn-pill" style={{ padding: "12px 28px" }}>Search</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 32, maxWidth: 1000, margin: "0 auto", flexWrap: "wrap" }}>
            
            <div style={{ flex: "2 1 500px" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-900)", marginBottom: 20 }}>Frequently Asked Questions</h2>
              <div className="card" style={{ padding: 12 }}>
                {faqs.map((faq, index) => (
                  <div key={faq.id} style={{ borderBottom: index !== faqs.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <button 
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      style={{ width: "100%", textAlign: "left", padding: "20px 16px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 600, color: openFaq === faq.id ? "var(--primary)" : "var(--text-900)" }}>{faq.question}</span>
                      {openFaq === faq.id ? <FiChevronUp color="var(--primary)" /> : <FiChevronDown color="var(--text-400)" />}
                    </button>
                    {openFaq === faq.id && (
                      <div style={{ padding: "0 16px 20px", fontSize: 14, color: "var(--text-500)", lineHeight: 1.6 }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>



          </div>

        </div>
      </div>
    </div>
  );
}
