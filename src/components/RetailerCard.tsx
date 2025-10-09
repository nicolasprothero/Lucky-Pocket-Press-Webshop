import React from 'react';
import { Retailer } from '@/types';
import './RetailerCard.css';

interface RetailerCardProps {
  retailer: Retailer;
}

export const RetailerCard: React.FC<RetailerCardProps> = ({ retailer }) => {
  const handleLearnMore = () => {
    if (retailer.link) {
      window.open(retailer.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="retailer-card">
      <div className="retailer-card-content">
        <h3 
          className={`retailer-card-title`}        >
          {retailer.name}
        </h3>
        
        <div className="retailer-card-info">
          <div className="retailer-card-left">
            <div className="retailer-card-location">
              {retailer.location}
            </div>
          </div>
          
          <div className="retailer-card-right">
            <div className="retailer-card-region">
              {retailer.region}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};