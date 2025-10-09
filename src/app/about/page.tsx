
"use client";
import './page.css';
import { useSheetData } from '@/hooks/useSheetData';

interface Update {
  date?: string;
  update?: string;
}

const UPDATES_RANGE = 'Updates!A:B';

// Function to format date to DD-MM-YY format
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid date
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    
    return `${day}-${month}-${year}`;
  } catch {
    return dateString; // Return original if error
  }
};

export default function AboutPage() {
  const { data: updates, loading, error } = useSheetData<Update>({
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
    range: UPDATES_RANGE,
  });

  return (
    <div className="about-responsive-container">
      <div className="about-header">
        <h1 className="about-main-title">ABOUT US</h1>
        <div className="about-main-description">
          Lucky Pocket Press is an independent publisher and creative collective. We believe in the power of print, collaboration, and community. Our mission is to bring unique voices and stories to life through beautifully crafted publications.
        </div>
      </div>
      
      <div className="about-sections">
        <div className="about-box">
          <div className="about-title">Updates</div>
          <div className="about-content">
            {loading && <div>Loading updates...</div>}
            {error && <div style={{ color: 'red' }}>Failed to load updates.</div>}
            {!loading && !error && (
              <div className="updates-container">
                {updates && updates.length > 0 ? (
                  updates.map((update, idx) => (
                    <div key={idx} className="update-row">
                      <div className="update-date">
                        {update.date ? formatDate(update.date) : ''}
                      </div>
                      <div className="update-content">
                        {update.update ? update.update : ''}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="update-row">
                    <div className="update-content">No updates yet.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="about-box">
          <div className="about-title">Newsletter</div>
          <div className="about-content">
            {/* Replace with your newsletter signup or info */}
            Subscribe to our newsletter for the latest updates, releases, and events! Coming soon.
          </div>
        </div>
        
        <div className="about-box">
          <div className="about-title">Our Links</div>
          <div className="about-content">
            {/* Replace with your actual links */}
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              <li><a href="https://instagram.com/luckypocketpress" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="mailto:info@luckypocketpress.com">Email</a></li>
              {/* Add more links as needed */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}