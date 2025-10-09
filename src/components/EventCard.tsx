import React from 'react';
import { Event } from '@/types';
import './EventCard.css';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  const formatDateRange = () => {
    const startDate = formatDate(event.date);
    
    if (event['end date']) {
      const endDate = formatDate(event['end date']);
      // If same month and year, show abbreviated format
      const start = new Date(event.date);
      const end = new Date(event['end date']);
      
      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
      } else {
        return `${startDate} - ${endDate}`;
      }
    }
    
    return startDate;
  };

  const handleLearnMore = () => {
    if (event.link) {
      window.open(event.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="event-card">
      <div className="event-card-content">
        <h3 
          className={`event-card-title ${event.link ? 'clickable' : ''}`}
          onClick={event.link ? handleLearnMore : undefined}
        >
          {event.title}
        </h3>
        
        <div className="event-card-info">
          <div className="event-card-left">
            <div className="event-card-location">
              {event.location}
            </div>
            <div className="event-card-date">
              {formatDateRange()}
            </div>
          </div>
          
          <div className="event-card-right">
            {event.link && (
              <span 
                onClick={handleLearnMore}
                className="event-card-button"
              >
                Learn More
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};