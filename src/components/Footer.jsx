import LiveChatWidget from "@/components/chat/LiveChatWidget";

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="footer-left">
          <h3>AMIGOS MALER GMBH</h3>
          <p>EXPERTISE CONNECTS.</p>
        </div>

        <div className="footer-center">
          <h4>Amigos Maler GmbH</h4>
          <p>Olten, Switzerland</p>
        </div>

        <div className="footer-right">
          <a href="#">Legal Notice</a>
          <span>|</span>
          <a href="#">Privacy</a>
          <span>|</span>
          <a href="#">Terms</a>
          <span>|</span>
          <a href="/contact">Contact</a>
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
