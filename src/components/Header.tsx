'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from './CartDrawer';
import './Header.css';

export const Header: React.FC = () => {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'SHOP', href: '/shop' },
    { name: 'ARCHIVE', href: '/archive' },
    { name: 'EVENTS', href: '/events' },
    { name: 'RETAILERS', href: '/retailers' },
    { name: 'ABOUT US', href: '/about' },
  ];

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              <div className="hamburger-icon">
                <span
                  className={`hamburger-line ${
                    isMobileMenuOpen ? 'hamburger-line-1-open' : ''
                  }`}
                ></span>
                <span
                  className={`hamburger-line ${
                    isMobileMenuOpen ? 'hamburger-line-2-open' : ''
                  }`}
                ></span>
                <span
                  className={`hamburger-line ${
                    isMobileMenuOpen ? 'hamburger-line-3-open' : ''
                  }`}
                ></span>
              </div>
            </button>

            {/* Logo - Center on mobile, left on desktop */}
            <div className="logo-container">
              <Link href="/" className="logo-link">
                LLP Webshop
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="desktop-nav">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Cart Button - Top Right */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="cart-btn"
            >
              <span className="cart-text">Cart</span>
              <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8.5M7 13v0a2 2 0 002 2h8a2 2 0 002-2v0" />
              </svg>
              {cart.totalItems > 0 && (
                <span className="cart-badge">
                  {cart.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Full Screen Mobile Navigation Menu */}
        <div
          className={`mobile-menu ${
            isMobileMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'
          }`}
        >
          <div className="mobile-menu-inner">
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Umbrella-style full circles at bottom */}
        <div className="umbrella-container">
          <div className="umbrella-circles">
            <div className="umbrella-circles-inner">
              {Array.from({ length: 20 }, (_, i) => (
                <div 
                  key={i}
                  className="umbrella-circle"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};