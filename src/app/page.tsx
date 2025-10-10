'use client';

import Link from 'next/link';
import Image from 'next/image';
import './page.css';

export default function HomePage() {
  const homeNavItems = [
    { name: 'SHOP', href: '/shop', icon: '/svg/shop-icon.svg' },
    { name: 'ARCHIVE', href: '/archive', icon: '/svg/archive-icon.svg' },
    { name: 'EVENTS', href: '/events', icon: '/svg/events-icon.svg' },
    { name: 'RETAILERS', href: '/retailers', icon: '/svg/retailers-icon.svg' },
    { name: 'ABOUT', href: '/about', icon: '/svg/about-icon.svg' },
  ];

  return (
    <div className="home-page">
      <div className="home-logo-container">
        <Image
          src="/image/logo.webp"
          alt="Lucky Pocket Press"
          className="home-logo"
          width={2000}
          height={2000}
          priority
          unoptimized
        />
      </div>

      <div className="floating-nav-container">
        {homeNavItems.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className={`floating-nav-icon floating-nav-icon-${index + 1}`}
            aria-label={item.name}
          >
            <Image
              src={item.icon}
              alt={item.name}
              className="floating-icon-image"
              width={40}
              height={40}
            />
            <span className="floating-icon-text">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}