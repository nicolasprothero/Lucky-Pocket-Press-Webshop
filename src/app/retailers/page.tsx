'use client';

import React, { useMemo, useState } from 'react';
import { RetailerCard } from '@/components/RetailerCard';
import { useSheetData } from '@/hooks/useSheetData';
import { Retailer } from '@/types';
import './page.css';

export default function RetailersPage() {
  const { data: retailers, loading, error } = useSheetData<Retailer>({
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
    range: 'Retailers!A:Z'
  });

  console.log('Retailers debug:', {
    loading,
    error,
    retailersCount: retailers?.length,
    retailers: retailers?.slice(0, 2)
  });

  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = useMemo(() => {
    if (!retailers) return [];
    const regionSet = new Set<string>();
    retailers.forEach(r => {
      if (r.region && r.region.trim()) regionSet.add(r.region.trim());
    });
    return Array.from(regionSet).sort();
  }, [retailers]);

  const filteredRetailers = useMemo(() => {
    if (!retailers) return [];
    if (selectedRegion === 'All') return retailers;
    return retailers.filter(r => r.region === selectedRegion);
  }, [retailers, selectedRegion]);

  return (
    <div className="retailers-page">
      <div className="retailers-container">
        <div className="retailers-header">
          <h1 className="retailers-title">RETAILERS</h1>
          <div className="retailers-description">
            Here is a list of retailers that sell our books! <br /><br /> If you would like to stock our books please contact us!
          </div>
        </div>

        {!loading && !error && regions.length > 0 && (
          <div className="retailers-region-filters">
            <button
              className={`region-filter-btn${selectedRegion === 'All' ? ' active' : ''}`}
              onClick={() => setSelectedRegion('All')}
            >
              All
            </button>
            {regions.map(region => (
              <button
                key={region}
                className={`region-filter-btn${selectedRegion === region ? ' active' : ''}`}
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="retailers-loading">
            <div className="loading-spinner"></div>
            <p>Loading retailers...</p>
          </div>
        ) : error ? (
          <div className="retailers-error">
            <p>Unable to load retailers at this time.</p>
            <p className="error-detail">{error}</p>
          </div>
        ) : filteredRetailers.length === 0 ? (
          <div className="no-retailers">
            <p>No retailers available at this time.</p>
            <p>Check back soon for new announcements!</p>
          </div>
        ) : (
          <div className="retailers-list">
            {filteredRetailers.map((retailer, index) => (
              <div
                key={index}
                className="retailer-card-wrapper"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RetailerCard retailer={retailer} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}