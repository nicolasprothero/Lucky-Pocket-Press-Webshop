import React from 'react';
import { Retailer } from '@/types';
import './RetailerCard.css';

interface RetailerCardProps {
  retailer: Retailer;
}

export const RetailerCard: React.FC<RetailerCardProps> = ({ retailer }) => {
  const handleStoreClick = () => {
    if (retailer.link) {
      window.open(retailer.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="retailer-card">
      <div className="retailer-card-content">
        <div className="retailer-card-header">
          <h3 
            className={`retailer-card-title ${retailer.link ? 'clickable' : ''}`}
            onClick={retailer.link ? handleStoreClick : undefined}
          >
            {retailer.name}
          </h3>
          <div className="retailer-card-region">
            {retailer.region}
          </div>
        </div>

        <div className="retailer-card-info">
          <div className="retailer-card-left">
            <div className="retailer-card-location">
              {retailer.location}
            </div>
          </div>

          <div className="retailer-card-right">
            {retailer.link && (
              <span 
                onClick={handleStoreClick}
                className="retailer-card-button"
              >
                View More
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};