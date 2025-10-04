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

            {/* Logo - Center on both mobile and desktop */}
            <div className="logo-container">
              <Link href="/" className="logo-link">
                <img 
                  src="/svg/luckypocketlogotype.svg" 
                  alt="Lucky Pocket Press" 
                  className="logo-svg"
                />
              </Link>
            </div>
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

        {/* Tablecloth Bottom Border - Inside header */}
        <div className={`tablecloth-border ${isMobileMenuOpen ? 'tablecloth-border-moved' : ''}`}>
          <div className="scallop-container">
            <div className="scallop-row">
              {Array.from({ length: 50 }, (_, i) => (
                <div key={i} className="scallop-circle"></div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onOpen={() => setIsCartOpen(true)}
      />
    </>
  );
};