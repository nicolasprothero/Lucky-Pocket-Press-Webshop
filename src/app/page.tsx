'use client';

import Link from 'next/link';
import Image from 'next/image';
import './page.css';

export default function HomePage() {
  const homeNavItems = [
    { name: 'SHOP', href: '/shop', icon: '/image/shop.png' },
    { name: 'ARCHIVE', href: '/archive', icon: '/image/archive.png' },
    { name: 'EVENTS', href: '/events', icon: '/image/events.png' },
    { name: 'RETAILERS', href: '/retailers', icon: '/image/retailers.png' },
    { name: 'ABOUT', href: '/about', icon: '/image/more-2.png' },
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
              width={80}
              height={80}
            />
            <span className="floating-icon-text">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}