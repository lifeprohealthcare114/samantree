import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/globle.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} SamanTree Medical SA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;