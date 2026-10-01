import React, { useState, useEffect, useRef } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import toast from "react-hot-toast";

const SPARKLE_CONFIGS = [
  { dx: 0, dy: -24, color: "#EF4444", delay: 0 },
  { dx: 18, dy: -18, color: "#F43F5E", delay: 40 },
  { dx: 24, dy: 0, color: "#FB7185", delay: 20 },
  { dx: 18, dy: 18, color: "#F59E0B", delay: 60 },
  { dx: 0, dy: 24, color: "#EC4899", delay: 10 },
  { dx: -18, dy: 18, color: "#A855F7", delay: 50 },
  { dx: -24, dy: 0, color: "#EF4444", delay: 30 },
  { dx: -18, dy: -18, color: "#F43F5E", delay: 70 },
];

export default function WishlistButton({
  product,
  size = 32,
  iconSize = 13,
  showText = false,
  className = "",
  style = {},
  onToggle,
}) {
  const [isLiked, setIsLiked] = useState(() => isProductInWishlist(product?.name || product?.title));
  const [isBursting, setIsBursting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setIsLiked(isProductInWishlist(product?.name || product?.title));

    const handleUpdate = () => {
      setIsLiked(isProductInWishlist(product?.name || product?.title));
    };

    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => {
      window.removeEventListener("wishlistUpdated", handleUpdate);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [product?.name, product?.title]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!product) return;

    const { added } = toggleWishlistItem(product);
    setIsLiked(added);

    if (added) {
      setIsBursting(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsBursting(false);
      }, 800);

      toast.success("Saved to wishlist! ❤️", { id: "wishlist-toast" });
    } else {
      setIsBursting(false);
      toast("Removed from wishlist", { icon: "💔", id: "wishlist-toast" });
    }

    if (onToggle) onToggle(added);
  };

  return (
    <div className="heart-btn-wrapper" style={{ position: "relative", display: "inline-flex" }}>
      {/* Ripple Ring Animation */}
      {isBursting && <div className="heart-burst-ring" />}

      {/* Sparkle Confetti Particles */}
      {isBursting &&
        SPARKLE_CONFIGS.map((sp, idx) => (
          <div
            key={idx}
            className="heart-sparkle"
            style={{
              "--dx": `${sp.dx}px`,
              "--dy": `${sp.dy}px`,
              backgroundColor: sp.color,
              animationDelay: `${sp.delay}ms`,
            }}
          />
        ))}

      {/* Floating Mini Hearts */}
      {isBursting && (
        <>
          <span
            className="heart-floating-mini"
            style={{ "--fx": "-12px", "--rot": "-18deg", animationDelay: "0ms" }}
          >
            💖
          </span>
          <span
            className="heart-floating-mini"
            style={{ "--fx": "12px", "--rot": "16deg", animationDelay: "100ms" }}
          >
            ✨
          </span>
        </>
      )}

      {/* The Actual Button */}
      <button
        type="button"
        onClick={handleClick}
        title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        className={`wishlist-trigger-btn ${className}`}
        style={{
          width: showText ? "auto" : size,
          height: size,
          padding: showText ? "0 14px" : 0,
          gap: showText ? 8 : 0,
          borderRadius: showText ? "var(--radius-md)" : "50%",
          background: isLiked ? "rgba(239, 68, 68, 0.12)" : "var(--surface)",
          border: isLiked ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid var(--border)",
          color: isLiked ? "#EF4444" : "var(--text-400)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 2,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isLiked
            ? "0 2px 8px -2px rgba(239, 68, 68, 0.35)"
            : "var(--shadow-xs)",
          outline: "none",
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!isLiked) {
            e.currentTarget.style.borderColor = "#EF4444";
            e.currentTarget.style.color = "#EF4444";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLiked) {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-400)";
          }
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className={isBursting ? "heart-pop-active" : ""}
        >
          {isLiked ? (
            <FaHeart size={iconSize} color="#EF4444" />
          ) : (
            <FiHeart size={iconSize} />
          )}
        </span>
        {showText && (
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {isLiked ? "Saved" : "Save"}
          </span>
        )}
      </button>
    </div>
  );
}
