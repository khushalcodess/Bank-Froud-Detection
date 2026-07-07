import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: "#0F3D3E",
      color: "white",
      padding: "30px 50px",
      marginTop: "auto"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>

        {/* Left - Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🛡️</span>
          <div>
            <p style={{ margin: 0, fontWeight: "700", fontSize: "16px" }}>
              FraudGuard
            </p>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
              Secure Banking & Fraud Detection
            </p>
          </div>
        </div>

        {/* Center - Info */}
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>
            Built with React · Node.js · Python · XGBoost
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.6 }}>
            ML Model: AUC 0.9158 · 87% Accuracy
          </p>
        </div>

        {/* Right - Copyright */}
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>
            © 2026 FraudGuard
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.6 }}>
            Developed for Internship Project
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;