import LiveChatWidget from "@/components/chat/LiveChatWidget";

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="/" className="footer-logo" aria-label="Amigos Maler home">
              <img src="/New-Logo.png" alt="Amigos Maler" />
            </a>
            <p>
              Premium painting, renovation and property value preservation for homes, buildings and real estate assets
              in Olten and surrounding areas.
            </p>
            <div className="footer-socials" aria-label="Social links">
              <a href="https://wa.me/41790000000" aria-label="WhatsApp" rel="noopener noreferrer" target="_blank">
                <svg aria-hidden="true" viewBox="0 0 32 32">
                  <path d="M16.04 3.2c-7.02 0-12.73 5.7-12.73 12.72 0 2.25.59 4.44 1.72 6.37L3.2 28.8l6.67-1.75a12.67 12.67 0 0 0 6.16 1.57h.01c7.02 0 12.73-5.7 12.73-12.72S23.06 3.2 16.04 3.2Zm0 23.27h-.01c-1.95 0-3.86-.52-5.53-1.5l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.51 10.51 0 0 1-1.61-5.59c0-5.84 4.76-10.59 10.61-10.59 2.83 0 5.49 1.1 7.49 3.1a10.52 10.52 0 0 1 3.11 7.49c0 5.84-4.76 10.55-10.5 10.55Zm5.81-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.81 1.03-.99 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.23 3.4 5.4 4.77.75.32 1.34.52 1.8.66.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.26-.74.26-1.38.18-1.51-.08-.13-.29-.21-.61-.37Z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M14 8.5V6.8c0-.8.3-1.2 1.3-1.2H17V2.4c-.8-.1-1.7-.2-2.5-.2-2.7 0-4.5 1.6-4.5 4.6v1.7H7v3.6h3V22h4v-9.9h2.9l.5-3.6H14Z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <rect width="16" height="16" x="4" y="4" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M15.5 11.4a3.5 3.5 0 1 1-6.9 1.2 3.5 3.5 0 0 1 6.9-1.2Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M17.5 6.8h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </a>
            </div>
            <p className="footer-mobile-copyright">© 2025 Amigos Maler GmbH. All rights reserved.</p>
          </div>

          <nav className="footer-column" aria-label="Footer navigation">
            <h4>Navigation</h4>
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/services">Services</a>
            <a href="/property-value-preservation">Werterhalt</a>
            <a href="https://amigos-immo.vercel.app/" rel="noopener noreferrer" target="_blank">Projects</a>
            <a href="/partners">Partners</a>
            <a href="/contact">Contact</a>
          </nav>

          <nav className="footer-column" aria-label="Footer services">
            <h4>Services</h4>
            <a href="/interior-painting">Interior Painting</a>
            <a href="/exterior-painting">Exterior Painting</a>
            <a href="/Facade-Renovation">Facade Renovation</a>
            <a href="/spray-painting">Spray Painting</a>
            <a href="/water-damage">Damage Remediation</a>
            <a href="/property-value-preservation">Werterhalt</a>
          </nav>

          <div className="footer-column footer-contact">
            <h4>Contact</h4>
            <p>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
              Industriestrasse 14<br />4600 Olten<br />Switzerland
            </p>
            <a href="tel:+41622129012">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" stroke="currentColor" strokeWidth="2" />
              </svg>
              062 212 90 12
            </a>
            <a href="mailto:info@amigos-maler.ch">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
                <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2" />
              </svg>
              info@amigos-maler.ch
            </a>
          </div>

          <nav className="footer-column" aria-label="Customer portal">
            <h4>Customer Portal</h4>
            <a href="/customer/login">Login</a>
            <a href="/customer/register">Register</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-desktop-copyright">© 2025 Amigos Maler GmbH. All rights reserved.</p>
          <div>
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
            <a href="#">AGB</a>
          </div>
        </div>
      </footer>

      <LiveChatWidget />

      <button className="scroll-top-btn" id="scrollTopBtn" aria-label="Scroll to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 19V5M12 5l-7 7M12 5l7 7"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
