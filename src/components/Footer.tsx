"use client";
import React from "react";
import Image from 'next/image';
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="shop-footer">
      <button
        className="footer-jump-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Jump to top"
      >
  <Image src="/svg/arrow-up.svg" alt="Jump to top" width={32} height={32} />
      </button>
      <span className="footer-copyright">© Lucky Pocket Press, 2025</span>
    </footer>
  );
}