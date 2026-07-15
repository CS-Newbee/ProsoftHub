import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/g/1BBp4SmJaX/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
      color: "#1877f2",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/ikonic.dev?igsh=bnJwdWV2eXdhdXp2",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
      ),
      color: "#e1306c",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/prosoft-uet-rcet/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
      color: "#0a66c2",
    },
    {
      name: "Google",
      url: "https://share.google/lM4hjK1q7eiZnuqrL",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1Z"/>
        </svg>
      ),
      color: "#ea4335",
    },
  ];

  return (
    <footer className="footer">
      {/* Top wave divider */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#00162e"/>
        </svg>
      </div>

      <div className="footer-main">
        <div className="footer-grid">

          {/* Column 1 — Brand */}
          <div className="footer-col footer-brand">
            <h2 className="footer-logo">Prosoft Hub</h2>
            <p className="footer-tagline">
              Empowering students through technology, creativity, and collaboration.
            </p>
            {/* Social Icons */}
            <div className="footer-socials">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  style={{ "--hover-color": s.color }}
                  title={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Explore */}
          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li onClick={() => navigate("/")}>🏠 Home</li>
              <li onClick={() => navigate("/about")}>ℹ️ About Us</li>
              <li onClick={() => navigate("/gallery")}>🖼️ Gallery</li>
              <li onClick={() => navigate("/membership")}>👥 Membership</li>
            </ul>
          </div>

          {/* Column 3 — Events */}
          <div className="footer-col">
            <h3 className="footer-heading">Events</h3>
            <ul className="footer-links">
              <li onClick={() => navigate("/events")}>📅 All Events</li>
              <li onClick={() => navigate("/events")}>⚡ Ongoing</li>
              <li onClick={() => navigate("/events")}>🔜 Upcoming</li>
              <li onClick={() => navigate("/events")}>✅ Completed</li>
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div className="footer-col">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact-list">
              <li>
                <span>📧</span>
                <span>prosoft@university.edu</span>
              </li>
              <li>
                <span>📞</span>
                <span>+92 123-456-7890</span>
              </li>
              <li>
                <span>📍</span>
                <span>UET RCET, Gujranwala, Punjab</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© 2026 Prosoft Hub · All Rights Reserved</p>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
