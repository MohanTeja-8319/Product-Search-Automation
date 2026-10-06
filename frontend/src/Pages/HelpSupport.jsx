import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiHelpCircle,
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiCheckCircle,
  FiTag,
  FiInfo,
  FiArrowRight,
} from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const KNOWLEDGE_BASE = [
  {
    id: 1,
    category: "General",
    question: "What is Comparely?",
    answer:
      "Comparely is an intelligent automated shopping assistant and price comparison platform. It aggregates live pricing, store offers, and delivery terms across top e-commerce retailers (like Amazon, Flipkart, Myntra, and more) into one unified, easy-to-read interface.",
    tags: ["about", "overview", "comparely", "platform", "features"],
  },
  {
    id: 2,
    category: "Deals & Stores",
    question: "How does Comparely find the best deals?",
    answer:
      "Our system continuously tracks live prices and analyzes product variants across verified online stores. We normalize product names and specifications to provide clear side-by-side comparison tables, highlighting the 'Best Deal' based on the lowest price, verified seller rating, and immediate availability.",
    tags: ["best deal", "discounts", "lowest price", "savings", "compare"],
  },
  {
    id: 3,
    category: "Price Alerts",
    question: "How do Price Alerts and Notifications work?",
    answer:
      "You can set a target price on any product page. Our background monitor checks pricing around the clock. The moment a retailer drops the price to or below your target threshold, you'll receive an instant email and browser push notification with a direct purchase link.",
    tags: ["price drop", "alerts", "notification", "email", "tracking", "target"],
  },
  {
    id: 4,
    category: "Deals & Stores",
    question: "Which stores are currently supported for live price comparison?",
    answer:
      "Comparely currently supports live product data from Amazon, Flipkart, BlinkIt, Zepto, Swiggy, BigBasket, Myntra, and Nykaa via unified QuickCommerce APIs.",
    tags: ["stores", "amazon", "flipkart", "blinkit", "zepto", "swiggy", "bigbasket", "myntra", "retailers", "platforms"],
  },
  {
    id: 5,
    category: "Deals & Stores",
    question: "Can prices change after I visit the merchant store?",
    answer:
      "Yes. Retailers frequently update their prices, flash sales, coupon codes, and bank discounts in real time. We display the most recent cached or live API quote, but the final price is determined at checkout on the seller's official website.",
    tags: ["price change", "fluctuation", "coupons", "checkout", "accuracy"],
  },
  {
    id: 6,
    category: "General",
    question: "Are the displayed prices inclusive of taxes and shipping?",
    answer:
      "Prices shown generally reflect the listed retail price inclusive of GST. However, optional seller delivery fees, expedited shipping, or regional postal surcharges may apply at the merchant's final payment step.",
    tags: ["taxes", "gst", "shipping", "delivery charges", "cost"],
  },
  {
    id: 7,
    category: "Account & Security",
    question: "Is my personal data and search history secure?",
    answer:
      "Absolutely. We utilize industry-standard bcrypt hashing for passwords and secure JSON Web Tokens (JWT) for authentication. We never sell your personal contact details, wishlist items, or search habits to advertisers or third-party brokers.",
    tags: ["privacy", "security", "encryption", "password", "data", "account"],
  },
  {
    id: 8,
    category: "Account & Security",
    question: "How do I reset my password if I forgot it?",
    answer:
      "On the Sign In page, click 'Forgot Password?'. Enter your registered email address to receive a secure 6-digit OTP verification code. Once verified, you can immediately create a new password and log back into your account.",
    tags: ["forgot password", "reset", "otp", "login", "recover"],
  },
  {
    id: 9,
    category: "General",
    question: "Does Comparely sell products directly or process payments?",
    answer:
      "No. Comparely is strictly a price aggregation, comparison, and discovery platform. We do not sell items directly or handle credit card payments. When you select a deal, we redirect you directly to the verified merchant's official checkout page.",
    tags: ["payment", "direct sell", "orders", "shipping", "returns"],
  },
  {
    id: 10,
    category: "Price Alerts",
    question: "How can I manage or delete my active price alerts?",
    answer:
      "Navigate to the 'Price Alert' page from the main navigation menu or your profile dashboard. There you can view all actively tracked items, adjust your target price threshold, toggle notifications on or off, or delete alerts you no longer need.",
    tags: ["manage alerts", "delete alert", "edit target", "dashboard"],
  },
];

const CATEGORIES = ["All", "General", "Deals & Stores", "Price Alerts", "Account & Security"];

export default function HelpSupport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter FAQs based on search query and selected category
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return KNOWLEDGE_BASE.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inCategory = item.category.toLowerCase().includes(q);
      const inTags = item.tags.some((tag) => tag.toLowerCase().includes(q));

      return inQuestion || inAnswer || inCategory || inTags;
    });
  }, [searchQuery, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredFaqs.length > 0) {
      setOpenFaq(filteredFaqs[0].id);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setOpenFaq(1);
  };

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <div className="page-body">
          {toastMessage && (
            <div
              style={{
                position: "fixed",
                top: 24,
                right: 24,
                padding: "14px 20px",
                background: "var(--success)",
                color: "white",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 1000,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiCheckCircle size={18} /> {toastMessage}
            </div>
          )}

          {/* Hero Section */}
          <div
            style={{
              textAlign: "center",
              padding: "20px 20px 40px",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "transparent",
                color: "var(--text-900)",
                border: "1px solid var(--text-900)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 28,
              }}
            >
              <FiHelpCircle />
            </div>

            <h1
              className="font-heading"
              style={{
                fontSize: 36,
                fontWeight: 600,
                color: "var(--text-900)",
                marginBottom: 12,
              }}
            >
              How can we help you?
            </h1>

            <p
              style={{
                fontSize: 15,
                color: "var(--text-500)",
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Search our knowledge base or browse frequently asked questions
              below.
            </p>

            {/* Interactive Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--surface)",
                borderRadius: "var(--radius-full)",
                padding: "6px 8px 6px 20px",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                maxWidth: 640,
                margin: "0 auto",
              }}
            >
              <FiSearch
                size={20}
                color="var(--text-400)"
                style={{ flexShrink: 0 }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (openFaq === null && filteredFaqs.length > 0) {
                    setOpenFaq(filteredFaqs[0].id);
                  }
                }}
                placeholder="Search topics (e.g., price alerts, delivery, refund, security)..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "12px 14px",
                  fontSize: 15,
                  background: "transparent",
                  color: "var(--text-900)",
                }}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px 10px",
                    color: "var(--text-400)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FiX size={18} />
                </button>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-pill"
                style={{ padding: "10px 24px", flexShrink: 0 }}
              >
                Search
              </button>
            </form>

            {/* Category Filter Chips */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 24,
              }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpenFaq(null);
                    }}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "var(--radius-full)",
                      fontSize: 13,
                      fontWeight: 600,
                      border: isActive
                        ? "1px solid var(--primary)"
                        : "1px solid var(--border)",
                      background: isActive ? "var(--primary)" : "var(--surface)",
                      color: isActive ? "#FFFFFF" : "var(--text-600)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary */}
          <div style={{ maxWidth: 900, margin: "0 auto 16px" }}>
            {searchQuery && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  color: "var(--text-600)",
                  marginBottom: 16,
                }}
              >
                <span>
                  Found <strong>{filteredFaqs.length}</strong> article
                  {filteredFaqs.length !== 1 ? "s" : ""} matching "
                  <strong>{searchQuery}</strong>"
                </span>
                <button
                  onClick={handleClearSearch}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

          {/* Content Layout */}
          <div
            style={{
              display: "flex",
              gap: 32,
              maxWidth: 900,
              margin: "0 auto 60px",
              flexWrap: "wrap",
            }}
          >
            {/* FAQ Accordion List */}
            <div style={{ flex: "1 1 540px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text-900)",
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <span style={{ fontSize: 13, color: "var(--text-500)" }}>
                  {filteredFaqs.length} topic
                  {filteredFaqs.length !== 1 ? "s" : ""}
                </span>
              </div>

              {filteredFaqs.length === 0 ? (
                <div
                  className="card"
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    border: "1px dashed var(--border)",
                  }}
                >
                  <FiInfo
                    size={36}
                    color="var(--text-400)"
                    style={{ margin: "0 auto 16px" }}
                  />
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-900)",
                      marginBottom: 8,
                    }}
                  >
                    No matching answers found
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-500)",
                      maxWidth: 400,
                      margin: "0 auto 20px",
                      lineHeight: 1.5,
                    }}
                  >
                    We couldn't find any help articles matching "
                    {searchQuery}". Try different search terms or contact our
                    support team directly.
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="btn btn-outline"
                    style={{ padding: "8px 20px", fontSize: 13 }}
                  >
                    Clear Search & Show All
                  </button>
                </div>
              ) : (
                <div className="card" style={{ padding: 8 }}>
                  {filteredFaqs.map((faq, index) => {
                    const isOpen = openFaq === faq.id;
                    return (
                      <div
                        key={faq.id}
                        style={{
                          borderBottom:
                            index !== filteredFaqs.length - 1
                              ? "1px solid var(--border)"
                              : "none",
                        }}
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "18px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  background: "var(--border)",
                                  color: "var(--text-600)",
                                }}
                              >
                                {faq.category}
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: isOpen
                                  ? "var(--primary)"
                                  : "var(--text-900)",
                                transition: "color 0.15s ease",
                              }}
                            >
                              {faq.question}
                            </span>
                          </div>
                          <span style={{ flexShrink: 0 }}>
                            {isOpen ? (
                              <FiChevronUp color="var(--primary)" size={18} />
                            ) : (
                              <FiChevronDown color="var(--text-400)" size={18} />
                            )}
                          </span>
                        </button>

                        {isOpen && (
                          <div
                            style={{
                              padding: "0 16px 20px",
                              fontSize: 14,
                              color: "var(--text-600)",
                              lineHeight: 1.7,
                            }}
                          >
                            <p style={{ margin: 0 }}>{faq.answer}</p>
                            <div
                              style={{
                                marginTop: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                flexWrap: "wrap",
                              }}
                            >
                              <FiTag size={12} color="var(--text-400)" />
                              {faq.tags.map((tag) => (
                                <span
                                  key={tag}
                                  onClick={() => setSearchQuery(tag)}
                                  style={{
                                    fontSize: 11,
                                    color: "var(--text-400)",
                                    background: "rgba(0,0,0,0.03)",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Contact Card */}
            <div style={{ flex: "1 1 280px" }}>
              <div
                className="card"
                style={{
                  padding: 24,
                  border: "1px solid var(--border)",
                  position: "sticky",
                  top: 24,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <FiMail size={22} color="var(--text-900)" />
                </div>

                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--text-900)",
                    marginBottom: 8,
                  }}
                >
                  Still need assistance?
                </h3>

                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-500)",
                    lineHeight: 1.6,
                    marginBottom: 20,
                  }}
                >
                  Can't find the answers you're looking for? Reach out to our
                  dedicated support team directly.
                </p>

                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 14px",
                    marginBottom: 16,
                    wordBreak: "break-all",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-400)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 4,
                    }}
                  >
                    Direct Support Email
                  </div>
                  <a
                    href="mailto:geddadaleelasatyavaraprasad@gmail.com"
                    style={{
                      fontSize: 13,
                      color: "var(--primary)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    geddadaleelasatyavaraprasad@gmail.com
                  </a>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "geddadaleelasatyavaraprasad@gmail.com"
                    );
                    showToast("Support email copied to clipboard!");
                  }}
                  className="btn btn-outline"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Copy Support Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
