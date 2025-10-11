"use client";
import { useSheetData } from '@/hooks/useSheetData';
import React, { useRef, useEffect, useState } from 'react';
import './UpdateBanner.css';

interface Update {
  date?: string;
  update?: string;
}

const UPDATES_RANGE = 'Updates!A:B';

export default function UpdateBanner() {
  const { data: updates, loading, error } = useSheetData<Update>({
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
    range: UPDATES_RANGE,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const sortedUpdates = updates?.slice().sort((a, b) => {
    if (!a.date || !b.date) return 0;
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
    return dateB.getTime() - dateA.getTime();
  }) || [];

  const latest = sortedUpdates[0];

  const isHomepage = typeof window !== 'undefined' && window.location.pathname === '/';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      const shouldShowBanner = !(!loading && !error && (!latest || !latest.update));
      
      if (shouldShowBanner && isHomepage) {
        htmlElement.classList.add('has-update-banner-homepage');
      } else {
        htmlElement.classList.remove('has-update-banner-homepage');
      }
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('has-update-banner-homepage');
      }
    };
  }, [latest, loading, error, isHomepage]);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current && containerRef.current) {
        const contentWidth = contentRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        setIsOverflowing(contentWidth > containerWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    return () => window.removeEventListener('resize', checkOverflow);
  }, [latest, loading, error]);

  const renderContent = () => {
    if (loading) return <span>&nbsp;</span>;
    if (error) return <span style={{ color: 'red' }}>Failed to load update.</span>;
    
    return (
      <span className="update-banner-content">{latest.update}</span>
    );
  };

  if (!loading && !error && (!latest || !latest.update)) {
    return null;
  }

  return (
    <div className="update-banner" ref={containerRef}>
      <div 
        className={`update-banner-inner ${isOverflowing ? 'marquee' : ''}`}
        ref={contentRef}
      >
        {renderContent()}
        {isOverflowing && (
          <div className="marquee-duplicate">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
}
