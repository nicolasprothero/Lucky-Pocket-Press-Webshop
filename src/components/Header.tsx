'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartDrawer } from './CartDrawer';
import './Header.css';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const navItems = [
    { name: 'SHOP', href: '/shop', icon: '/svg/shop-icon.svg' },
    { name: 'ARCHIVE', href: '/archive', icon: '/svg/archive-icon.svg' },
    { name: 'EVENTS', href: '/events', icon: '/svg/events-icon.svg' },
    { name: 'RETAILERS', href: '/retailers', icon: '/svg/retailers-icon.svg' },
    { name: 'ABOUT US', href: '/about', icon: '/svg/about-icon.svg' },
  ];

  const handleMenuToggle = () => {
    // On mobile, use the mobile menu state
    // On desktop, use the desktop menu state
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsDesktopMenuOpen(!isDesktopMenuOpen);
    }
  };

  return (
    <>

      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <button
              onClick={handleMenuToggle}
              className="menu-btn"
              aria-label="Toggle menu"
            >
              <div className="hamburger-icon">
                <span
                  className={`hamburger-line ${
                    (isMobileMenuOpen || isDesktopMenuOpen) ? 'hamburger-line-1-open' : ''
                  }`}
                ></span>
                <span
                  className={`hamburger-line ${
                    (isMobileMenuOpen || isDesktopMenuOpen) ? 'hamburger-line-2-open' : ''
                  }`}
                ></span>
                <span
                  className={`hamburger-line ${
                    (isMobileMenuOpen || isDesktopMenuOpen) ? 'hamburger-line-3-open' : ''
                  }`}
                ></span>
              </div>
            </button>

            {/* Logo - Center on both mobile and desktop */}
            <div className="logo-container">
              <Link href="/" className="logo-link">
                <Image 
                  src="/svg/luckypocketlogotype.svg" 
                  alt="Lucky Pocket Press" 
                  className="logo-svg"
                  width={200}
                  height={40}
                  priority
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Dropdown Navigation Menu */}
        <div
          className={`desktop-menu ${
            isDesktopMenuOpen ? 'desktop-menu-open' : 'desktop-menu-closed'
          }`}
        >
          <div className="desktop-menu-inner">
            <nav className="desktop-nav">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsDesktopMenuOpen(false)}
                  className="desktop-nav-link"
                >
                  <Image 
                    src={item.icon} 
                    alt={item.name}
                    className="desktop-nav-icon"
                    width={24}
                    height={24}
                  />
                  <span className="desktop-nav-text">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Tablecloth Bottom Border for Desktop Menu */}
          <div className="tablecloth-border">
            <div className="scallop-container">
              <div className="scallop-row">
                {Array.from({ length: 100 }, (_, i) => (
                  <div key={i} className="scallop-circle"></div>
                ))}
              </div>
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

        {/* Tablecloth Bottom Border - Default position for mobile and closed desktop */}
        <div className={`tablecloth-border ${isMobileMenuOpen ? 'tablecloth-border-moved' : ''} ${isDesktopMenuOpen ? 'tablecloth-border-hidden' : ''}`}>
          <div className="scallop-container">
            <div className="scallop-row">
              {Array.from({ length: 100 }, (_, i) => (
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