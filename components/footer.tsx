import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
              </svg>
              <span>Sydney Events</span>
            </Link>
            <p className="footer-description">
              Discover the best events happening in Sydney, automatically curated and updated daily.
            </p>
          </div>

          <div className="footer-nav">
            <div className="footer-nav-group">
              <h3 className="footer-nav-title">Navigation</h3>
              <Link href="/" className="footer-nav-link">
                Home
              </Link>
              <Link href="/events" className="footer-nav-link">
                Events
              </Link>
              <Link href="/categories" className="footer-nav-link">
                Categories
              </Link>
              <Link href="/about" className="footer-nav-link">
                About
              </Link>
            </div>

            <div className="footer-nav-group">
              <h3 className="footer-nav-title">Categories</h3>
              <Link href="/categories/music" className="footer-nav-link">
                Music
              </Link>
              <Link href="/categories/arts" className="footer-nav-link">
                Arts & Culture
              </Link>
              <Link href="/categories/food" className="footer-nav-link">
                Food & Drink
              </Link>
              <Link href="/categories/sports" className="footer-nav-link">
                Sports
              </Link>
            </div>

            <div className="footer-nav-group">
              <h3 className="footer-nav-title">Support</h3>
              <Link href="/contact" className="footer-nav-link">
                Contact Us
              </Link>
              <Link href="/faq" className="footer-nav-link">
                FAQ
              </Link>
              <Link href="/privacy" className="footer-nav-link">
                Privacy Policy
              </Link>
              <Link href="/terms" className="footer-nav-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-social">
            <a href="#" className="footer-social-link" aria-label="Facebook">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="footer-social-link" aria-label="Twitter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" className="footer-social-link" aria-label="Instagram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>

          <p className="footer-copyright">© {currentYear} Sydney Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
