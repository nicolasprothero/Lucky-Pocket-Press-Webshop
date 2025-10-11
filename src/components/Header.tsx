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

            <div className="logo-container">
              <Link
                href="/"
                className="logo-link"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDesktopMenuOpen(false);
                }}
                aria-label="Home"
              >
                <svg className="logo-svg" width="130" height="37" viewBox="0 0 263 75" xmlns="http://www.w3.org/2000/svg">
                  <defs><style>{`.cls-1{fill:#f8f8f8;}`}</style></defs>
                  <path className="cls-1" d="M15.5,46.93h15.67s0,2.33,0,2.33H12.17c-.66-.66,2.74-10.32,3-11.95-1.68.75-3.17.75-5,.66l.15-2.01c.19-.27,5.05-1.51,6.01-2.64.73-.86,1.64-5.37,2.6-7.04.61-1.06,1.5-2.36,2.77-2.56,4.98-.78,4.92,2.15,3.31,5.95-1.7,4-5.2,4.29-6.31,5.99-.74,1.14-2.01,5.95-2.42,7.54-.15.57-.98,3.5-.76,3.72ZM23.16,26.36c-.55-.57-2.87,3.28-2.66,3.98.81-.17,2.98-3.65,2.66-3.98Z"/>
                  <path className="cls-1" d="M130.18,29.69l-2.71,9.58-2.3.04c.02-.6-.06-1.23,0-1.83.32-3.15,3.38-12.34,4.58-15.68.26-.72.87-2.9,1.42-3.23.68-.41,7.53.65,8.68.99,6.07,1.81,4,10.2-1.17,10.79-2.79.32-5.8,0-8.49-.66ZM131.17,27.36c3.49.39,5.42,2.19,8.35-.81,3.92-4.03-3.06-5.31-6.12-5.46-.74.23-2.51,5.99-2.23,6.27Z"/>
                  <path className="cls-1" d="M83.17,27.69c.42.52,1.49-1.54,1.68-1.82.92-1.37,3.43-6.51,4.15-7.15.61-.54,1.43-.31,2.17-.33.43,3.67-2.6,6.48-4,9.62,2.48-.74,6.24,3.2,7.85,3.31,1.89.13,3.81-1.83,5.82-1.32.25,2.45-.1,2.64-2.27,3.22-1.64.44-3.81.63-5.49.35-2.83-.48-6.37-5.78-9.06-1.56-.7,1.09-.18.95-.18,1.47v5.14h-2.34s-.33-18.58-.33-18.58h2s0,7.63,0,7.63Z"/>
                  <path className="cls-1" d="M197.17,34.33h-2s-1-17.26-1-17.26h2.34c.08,1.64.13,3.53.33,5.15.04.34-.08.71.5.49,1.6-.63,4.23-4.8,4.85-6.45.31-.84.53-3.23,1.2-3.45l2.13-.04c.04,3.51-1.43,6.88-3.33,9.77,1.72.95,4.42,3.81,6.24,4.12,1.25.21,2.95-1.07,4.42-.61l-.06,2.27c-5.13,2.37-8.97-.5-12.84-3.55l-2.77,1.62v7.96Z"/>
                  <path className="cls-1" d="M229.17,11.43c-1.87.73-3.37-1.41-4.81-1.33-1.16.07-4.02,3.05-3.8,4.1.02.1,1.06,1.55,1.16,1.57,1.1.18,3.13-2.15,4.79-1.36.79,3.59-1.7,2.93-3.5,4.65-2.75,2.63,1.09,5.12,4.15,3.13,2.17-1.41,1.91-4.35,5.35-3.47.25,3.28-2.93,6.29-6.17,6.64-4.68.51-7.65-.63-7.15-5.79.05-.53.58-1.11.56-1.35-.02-.32-1.4-1.11-1.59-2.64-.68-5.62,3.38-9.68,9-7.63,1.95.71,2.23,1.38,2.01,3.48Z"/>
                  <path className="cls-1" d="M152.08,29.42c2.21-.45,5.9-.09,7.43,1.75,2.98,3.58,2.24,8.74-1.83,11.13-6.15,3.61-13.36.02-12.16-7.46.28-1.75,4.89-5.08,6.56-5.42ZM153.74,32.07c-1.1.11-5.79,3.3-5.79,4.41,0,1.71,2.89,4.67,4.77,4.73,1.62.05,6.15-3.55,6.09-5.06-.05-1.43-3.43-4.24-5.07-4.08Z"/>
                  <path className="cls-1" d="M114.5,66.52h-2s-.19-13.63-.19-13.63c2.13-1,9.08-.92,10.71.67.97.95.6,4.62-.54,5.48-.43.32-1.25.31-1.65.67-1.64,1.48,3.69,3.96,5.01,3.68v2.14c-3.27.38-7.99-.62-8.01-4.64l-3.33.49v5.14ZM120.83,55.57c-2.2-1-3.97-1.12-6.33-.67.17.84-.54,3.88.69,3.85.79-.02,6.41-2.13,5.64-3.19Z"/>
                  <path className="cls-1" d="M182.5,29.02c-2.94,1.07-2.62-2.31-4.58-2.6-2.35-.35-7.4,5.49-6.61,7.93.35,1.1,3.2,3.45,4.38,3.62,3.87.58,3.92-4.35,7.81-3.31.68,2.5-2.6,5.31-4.86,5.61-6.73.91-11.13-2.15-9.66-9.28,1.36-6.58,13.42-11.67,13.52-1.97Z"/>
                  <path className="cls-1" d="M50.83,31.01c-.63,4.22-1.16,13.25-5.02,15.75-1.67,1.08-6.56,1.34-8.16.19-2.13-1.52-2.08-7.08-1.8-9.44.07-.56,1.29-5.28,1.46-5.51.38-.51,1.98-.51,2.36,0,.49.65-1.35,5.95-1.48,7.18-.38,3.72,1.85,8.14,5.8,5.11,3.4-2.62,3.33-9.43,4.55-13.23l2.29-.04Z"/>
                  <path className="cls-1" d="M71.83,32c-2.82.95-2.36-1.61-3.57-1.95-2.5-.69-5,3.24-5.69,5.17s-1.03,2.92.58,4.59c2.31,2.39,4.78.55,6.5-1.52.99-1.19.11-1.65,2.85-1.31.86,5.61-5.58,7.43-9.95,6.09-5.19-1.6-2.92-11.48.45-14.05s9.59-2.67,8.83,2.99Z"/>
                  <path className="cls-1" d="M139.5,58.55c-.08,1.31.53,3.33-1.17,3.64-1.31.24-2.97-.66-3.4,1.18,2.49,3.51,3.87.06,6.91.49,1.05,4.02-4.78,4.26-7.35,3.17-2.39-1.02-2.49-2.25-2.34-4.68.04-.64.55-1.07.56-1.32.02-.29-.51-.95-.55-1.64-.33-5.14,1.96-7.31,7.1-6.4,2.25.4,1.99,1.62,1.91,3.57-2.22.62-2.14-.62-3.08-1.09-1.71-.87-3.22,1.64-3.25,3.08h4.67Z"/>
                  <path className="cls-1" d="M113.5,10.1l-2.33,21.24h-2.34s.62-10.91.62-10.91c-1.5-1.01-9.65-3.79-10.21-4.76-.3-.51.05-1.9-.07-2.59,2.21-.46,3.37,1.11,5.22,1.95s3.85,1.62,5.78,2.37l1.04-7.26,2.3-.04Z"/>
                  <path className="cls-1" d="M98.17,67.51l-2.34-.33-.18-12.96c.81-1.15,8.79-.78,10.04,0,1.32.82,1.12,5.41-.09,6.34-2.1,1.61-5.35.32-7.43,1.48v5.48ZM98.17,59.55c6.95-.1,8.35-4.66.33-3.47l-.53.64.2,2.84Z"/>
                  <path className="cls-1" d="M252.84,11.76v2.33c-3,.11-6.1-.85-8.84.65-.35,2.81-.1,5.66-.15,8.48-.02.88-.38,1.7-.38,2.64,0,2.16,1.69,5.5-1.97,4.81l.32-16.24c-2.4-.99-6.67,1.83-5.98-2.34l17-.33Z"/>
                  <path className="cls-1" d="M170.75,51.99l.41,2.58c-2.55.49-3.87-1.95-5.66.83,1.7,1.82,5.5.73,5.97,3.67.35,2.16-.31,4.8-2.8,5.14-1.54.21-6.2.3-6.21-1.84-.01-2.33,3.03-.26,4.51-.49,1.19-.19,2.75-1.77.65-2.63-3.3-1.35-5.1.04-4.47-5.18.42-3.5,5.07-2.67,7.59-2.07Z"/>
                  <path className="cls-1" d="M156.5,56.23c-.77-.06-1.71.16-2.44-.07-1.2-.37-.98-1.74-2.89.56,1.91,2.18,4.98.14,5.34,3.97.4,4.29-.4,5.5-4.84,5.15-1.19-.09-2.86-.13-2.87-1.49,0-2.49,3.9-.06,5.05-1.64,1.88-2.58-4.44-2.6-5.19-3.84-.54-.89-.17-4.05.61-4.88,1.66-1.77,8.65-2.01,7.23,2.22Z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

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

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onOpen={() => setIsCartOpen(true)}
      />
    </>
  );
};