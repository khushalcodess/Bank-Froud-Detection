import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="fg-footer">
      <div className="fg-footer-container">

        {/* =========================
            TOP FOOTER
           ========================= */}

        <div className="fg-footer-grid">

          {/* Brand */}
          <div className="fg-footer-brand">

            <Link to="/" className="fg-footer-logo">
              <img
                src="/LOGO.png"
                alt="FraudGuard logo"
              />

              <span>FraudGuard</span>
            </Link>

            <p>
              A real-time transaction scoring platform built
              as a fraud-detection portfolio project.
            </p>

          </div>


          {/* Footer Links */}
          <div className="fg-footer-columns">

            {/* Product */}
            <div className="fg-footer-column">

              <h5>Product</h5>

              <a href="/#how">
                How it works
              </a>

              <a href="/#features">
                Platform
              </a>

              <a href="/#security">
                Security
              </a>

            </div>


            {/* Account */}
            <div className="fg-footer-column">

              <h5>Account</h5>

              <Link to="/">
                Log in
              </Link>

              <Link to="/Signup">
                Register
              </Link>

            </div>

          </div>

        </div>


        {/* =========================
            BOTTOM FOOTER
           ========================= */}

        <div className="fg-footer-bottom">

          <p>
            Built for educational and demo purposes as part
            of a fraud-detection portfolio project.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;