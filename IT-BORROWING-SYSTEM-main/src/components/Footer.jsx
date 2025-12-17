import React from "react";
import "./Footer.css";
import logoImg from "../img/img2.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Main Description */}
          <div className="footer-section">
            <h3 className="footer-title">
              <img
                src={logoImg}
                alt="UTAS Logo"
                className="footer-logo"
              />
              Efficient IT equipment management for UTAS
            </h3>
            <p className="footer-description">
              Streamlining device borrowing and management for students and staff at the University of Technology and Applied Sciences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">
              <i className="bi bi-link-45deg me-2"></i>Quick Links
            </h4>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link">
                  <i className="bi bi-house me-2"></i>Home
                </a>
              </li>
              <li>
                <a href="/#about" className="footer-link">
                  <i className="bi bi-info-circle me-2"></i>About Us
                </a>
              </li>
              <li>
                <a href="/#contact" className="footer-link">
                  <i className="bi bi-envelope me-2"></i>Contact
                </a>
              </li>
              <li>
                <a href="/#support" className="footer-link">
                  <i className="bi bi-headset me-2"></i>Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-section">
            <h4 className="footer-heading">
              <i className="bi bi-telephone me-2"></i>Contact
            </h4>
            <div className="footer-contact">
              <p className="footer-organization">
                <i className="bi bi-building me-2"></i>
                University of Technology and Applied Sciences
              </p>
              <p className="footer-email">
                <i className="bi bi-envelope-at me-2"></i>
                <a href="mailto:it.support@utas.edu.om" className="footer-link">
                  it.support@utas.edu.om
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            <i className="bi bi-c-circle me-2"></i>
            2025 University of Technology and Applied Sciences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

