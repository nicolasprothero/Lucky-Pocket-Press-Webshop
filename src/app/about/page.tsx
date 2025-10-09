
"use client";
import './page.css';
import Image from 'next/image';
import { useSheetData } from '@/hooks/useSheetData';

interface Update {
  date?: string;
  update?: string;
}

const UPDATES_RANGE = 'Updates!A:B';

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

export default function AboutPage() {
  const { data: updates, loading, error } = useSheetData<Update>({
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '',
    range: UPDATES_RANGE,
  });

  // Sort updates by date, newest first
  const sortedUpdates = updates?.slice().sort((a, b) => {
    if (!a.date || !b.date) return 0;
    
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // If dates are invalid, keep original order
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
    
    return dateB.getTime() - dateA.getTime(); // Newest first
  }) || [];

  return (
    <div className="about-responsive-container">
      <div className="about-header">
        <h1 className="about-main-title">ABOUT US</h1>
        <div className="about-main-description">
          Lucky Pocket Press is an indie risograph press, artist collective, and indie comics micro publisher. We’re a small team of independent artists and printmakers, formed in January of 2019 by Sara Hagstrom and Steph Bulante with the goal of publishing comics from artists that inspire us.        </div>
      </div>
      
      <div className="about-sections">
        <div className="about-box">
          <div className="about-title">Updates</div>
          <div className="about-content">
            {loading && <div>Loading updates...</div>}
            {error && <div style={{ color: 'red' }}>Failed to load updates.</div>}
            {!loading && !error && (
              <div className="updates-container">
                {sortedUpdates && sortedUpdates.length > 0 ? (
                  sortedUpdates.map((update, idx) => (
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
          <div className="about-content newsletter-content">
            <a href="https://buttondown.com/luckypocketpress" target="_blank" rel="noopener noreferrer" className="newsletter-image-link">
              <Image src="/image/newsletter.png" alt="Newsletter" className="newsletter-image" width={400} height={200} />
            </a>
            <div className="newsletter-text">
              Sign up to our newsletter for updates about what we are doing, a first look at new publications, and some extra good luck!
            </div>
          </div>
        </div>
        
        <div className="about-box">
          <div className="about-title">Our Links</div>
          <div className="about-content">
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              <li>
                <a href="https://instagram.com/luckypocketpress" target="_blank" rel="noopener noreferrer">
                  <Image src="/svg/instagram.svg" alt="Instagram" className="social-logo" width={32} height={32} />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/pocketini" target="_blank" rel="noopener noreferrer">
                  <Image src="/svg/twitter.svg" alt="Twitter" className="social-logo" width={32} height={32} />
                </a>
              </li>
              <li>
                <a href="mailto:info@luckypocketpress.com">
                  <Image src="/svg/email.svg" alt="Email" className="social-logo" width={32} height={32} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}