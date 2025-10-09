"use client";
import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="shop-footer">
      <button
        className="footer-jump-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Jump to top"
      >
        Jump to top
      </button>
      <span className="footer-copyright">© Lucky Pocket Press, 2025</span>
    </footer>
  );
}