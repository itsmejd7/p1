import React from 'react';
import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Tata Motors</h3>
          <p>Building the future of mobility with innovative solutions and sustainable practices.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#facebook" title="Facebook">f</a>
            <a href="#twitter" title="Twitter">𝕏</a>
            <a href="#linkedin" title="LinkedIn">in</a>
            <a href="#instagram" title="Instagram">📷</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Tata Motors. All rights reserved.</p>
      </div>
    </footer>
  );
}