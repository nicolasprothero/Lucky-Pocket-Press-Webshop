'use client';

import { useEffect, useState } from 'react';
import { useSheetData } from '@/hooks/useSheetData';
import { ArchiveBook, ArchiveEvent, ArchiveMerch, ArchiveCategory, ArchiveItem } from '@/types';
import './page.css';

export default function ArchivePage() {
  const [currentCategory, setCurrentCategory] = useState<ArchiveCategory>('books');
  const [currentPage, setCurrentPage] = useState(0);

  // Hide footer on archive page
  useEffect(() => {
    document.body.classList.add('archive-page-active');
    
    return () => {
      document.body.classList.remove('archive-page-active');
    };
  }, []);

  // Fetch data from Google Sheets (same sheet as events/retailers)
  // Note: These sheets may not exist yet, so we'll handle errors gracefully
  const { data: booksData, loading: booksLoading, error: booksError } = useSheetData<ArchiveBook>({
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
    range: 'Archive-Books!A:D'
  });

  const { data: eventsData, loading: eventsLoading, error: eventsError } = useSheetData<ArchiveEvent>({
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
    range: 'Archive-Events!A:D'
  });

  const { data: merchData, loading: merchLoading, error: merchError } = useSheetData<ArchiveMerch>({
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
    range: 'Archive-Merch!A:D'
  });

  // Get current data based on selected category
  const getCurrentData = (): ArchiveItem[] => {
    switch (currentCategory) {
      case 'books':
        return booksData || [];
      case 'events':
        return eventsData || [];
      case 'merch':
        return merchData || [];
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const isLoading = booksLoading || eventsLoading || merchLoading;
  const hasErrors = booksError || eventsError || merchError;

  // Navigation functions - handle desktop (2 items) vs mobile (1 item)
  const nextPage = () => {
    const increment = window.innerWidth >= 768 ? 2 : 1; // 2 items on desktop, 1 on mobile
    if (currentPage + increment <= currentData.length - 1) {
      setCurrentPage(currentPage + increment);
    } else if (currentPage < currentData.length - 1) {
      // If we can't show a full spread, just go to the last item(s)
      setCurrentPage(currentData.length - 1);
    }
  };

  const prevPage = () => {
    const decrement = window.innerWidth >= 768 ? 2 : 1; // 2 items on desktop, 1 on mobile
    if (currentPage - decrement >= 0) {
      setCurrentPage(currentPage - decrement);
    } else {
      setCurrentPage(0);
    }
  };

  const switchCategory = (category: ArchiveCategory) => {
    setCurrentCategory(category);
    setCurrentPage(0); // Reset to first page when switching categories
  };

  // Get current items for display (1 on mobile, 2 on desktop)
  const getCurrentItems = () => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    if (isDesktop) {
      // Desktop: show current item and next item (if exists)
      const items = [currentData[currentPage]];
      if (currentPage + 1 < currentData.length) {
        items.push(currentData[currentPage + 1]);
      }
      return items.filter(Boolean); // Remove undefined items
    } else {
      // Mobile: show only current item
      return currentData[currentPage] ? [currentData[currentPage]] : [];
    }
  };

  const currentItems = getCurrentItems();

  return (
    <div className="archive-page">
      <div className="archive-container">
        {/* Category Selector */}
        <div className="archive-nav">
          <button
            className={`category-btn ${currentCategory === 'books' ? 'active' : ''}`}
            onClick={() => switchCategory('books')}
          >
            BOOKS
          </button>
          <button
            className={`category-btn ${currentCategory === 'events' ? 'active' : ''}`}
            onClick={() => switchCategory('events')}
          >
            EVENTS
          </button>
          <button
            className={`category-btn ${currentCategory === 'merch' ? 'active' : ''}`}
            onClick={() => switchCategory('merch')}
          >
            MERCH
          </button>
        </div>

        {/* Book Interface */}
        <div className="book-container">
          {isLoading ? (
            <div className="book-loading">
              <p>Loading archive...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="book-empty">
              {hasErrors ? (
                <>
                  <p>Archive sheets not found.</p>
                  <p>Please create the following sheets in your Google Sheets document:</p>
                  <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
                    <li>Archive-Books (columns: title, info, year, image)</li>
                    <li>Archive-Events (columns: title, info, year, image)</li>
                    <li>Archive-Merch (columns: title, info, year, image)</li>
                  </ul>
                </>
              ) : (
                <p>No {currentCategory} found in archive.</p>
              )}
            </div>
          ) : (
            <>
              {/* Book Content */}
              <div className="book-content">
                <div className="book-page">
                  {currentItems.map((item, index) => (
                    <div key={`${currentPage}-${index}`} className="page-spread">
                      <div className="page-image">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="archive-image"
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                      <div className="page-info-section">
                        <h2 className="page-title">{item.title}</h2>
                        <div className="page-details">
                          <p className="page-info">{item.info}</p>
                          <p className="page-year">{item.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show "last page" message on desktop when there's only one item */}
                  {typeof window !== 'undefined' && window.innerWidth >= 768 && currentItems.length === 1 && (
                    <div className="page-spread last-page">
                      <div className="last-page-content">
                        <h2 className="last-page-message">
                          This is the last page,<br />
                          thanks for looking :)
                        </h2>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="book-controls">
                <button
                  className="page-nav-btn prev"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  &lt;
                </button>
                
                <div className="page-indicator">
                  {Math.floor(currentPage / (typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1)) + 1} / {Math.ceil(currentData.length / (typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1))}
                </div>
                
                <button
                  className="page-nav-btn next"
                  onClick={nextPage}
                  disabled={currentPage >= currentData.length - 1}
                >
                  &gt;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}