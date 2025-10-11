'use client';

import React from 'react';
import { EventCard } from '@/components/EventCard';
import { useSheetData } from '@/hooks/useSheetData';
import { Event } from '@/types';
import './page.css';

export default function EventsPage() {
  const { data: events, loading, error } = useSheetData<Event>({
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
    range: 'Events!A:E'
  });

  return (
    <div className="events-page">
      <div className="events-container">
        <div className="events-header">
          <h1 className="events-title">EVENTS</h1>
          <div className="events-description">
            Upcoming events that we plan to be at.<br />Whether that is tabling and selling or helping out with facilitation.<br /><br />Come see us here!
          </div>
        </div>

        {loading ? (
          <div className="events-loading">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="events-error">
            <p>Unable to load events at this time.</p>
            <p className="error-detail">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="no-events">
            <p>No upcoming events at this time.</p>
            <p>Check back soon for new announcements!</p>
          </div>
        ) : (
          <div className="events-list">
            {events.map((event, index) => (
              <div
                key={index}
                className="event-card-wrapper"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}