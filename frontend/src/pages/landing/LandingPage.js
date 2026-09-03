import React from "react";
import Navbar from "../../Components/common/Navbar";
import Footer from "../../Components/common/Footer";
import "../../styles/landing.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar variant="public" />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow-line">
                <span className="eyebrow-dot"></span>
                Scoring transactions as they happen
              </div>

              <h1>
                Catch fraud before the money moves, not after.
              </h1>

              <p className="lede">
                FraudGuard scores every transfer in real time with a model
                trained on real transaction behavior, then tells you exactly
                why a transaction looks risky — not just that it does.
              </p>

              <div className="hero-ctas">
                <a href="#" className="btn btn-solid btn-large">
                  Create free account
                </a>

                <a href="#how" className="btn btn-ghost btn-large">
                  See how scoring works
                </a>
              </div>

              <div className="hero-stats">
                <div>
                  <div className="stat-num">&lt;300ms</div>
                  <div className="stat-label">
                    Average scoring time
                  </div>
                </div>

                <div>
                  <div className="stat-num">4</div>
                  <div className="stat-label">
                    Signals per decision
                  </div>
                </div>

                <div>
                  <div className="stat-num">3</div>
                  <div className="stat-label">
                    Reasons shown per flag
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE SCAN CARD */}
            <div className="scan-card">
              <div className="scan-head">
                <span>Transaction #48213</span>

                <span className="scan-live">
                  <span className="scan-live-dot"></span>
                  Scoring live
                </span>
              </div>

              <div className="txn-row">
                <span>Amount</span>
                <span>₹52,000</span>
              </div>

              <div className="txn-row">
                <span>Time</span>
                <span>2:14 AM</span>
              </div>

              <div className="txn-row">
                <span>Receiver</span>
                <span>New account</span>
              </div>

              <div className="gauge-wrap">
                <div className="gauge">
                  <svg
                    viewBox="0 0 100 100"
                    width="104"
                    height="104"
                  >
                    <circle
                      className="gauge-track"
                      cx="50"
                      cy="50"
                      r="45"
                    />

                    <circle
                      className="gauge-fill"
                      cx="50"
                      cy="50"
                      r="45"
                    />
                  </svg>

                  <div className="gauge-num">84</div>
                </div>

                <div>
                  <div className="gauge-verdict">
                    Risk score out of 100
                  </div>

                  <div className="verdict-tag">
                    Flagged
                  </div>
                </div>
              </div>

              <div className="reason-chips">
                <span className="chip">
                  Unusual hour
                </span>

                <span className="chip">
                  First-time receiver
                </span>

                <span className="chip">
                  Amount above average
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" id="how">
          <div className="wrap">
            <div className="section-head">
              <h2>
                Every transfer goes through the same four checks
              </h2>

              <p>
                No manual queue, no waiting for a batch job. The model
                runs before the transaction is marked complete.
              </p>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>

                <h3>Transaction sent</h3>

                <p>
                  A user initiates a transfer from the dashboard,
                  including amount, receiver, and timing.
                </p>
              </div>

              <div className="step">
                <div className="step-num">2</div>

                <h3>Features extracted</h3>

                <p>
                  The backend pulls the account's history: typical
                  amounts, usual hours, and receiver familiarity.
                </p>
              </div>

              <div className="step">
                <div className="step-num">3</div>

                <h3>Model scores it</h3>

                <p>
                  An XGBoost model returns a risk score from 0–100,
                  run through a scaler trained on past transactions.
                </p>
              </div>

              <div className="step">
                <div className="step-num">4</div>

                <h3>Reasons attached</h3>

                <p>
                  SHAP explains the score with the top contributing
                  factors, so the verdict isn't a black box.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          className="section section-alt"
          id="features"
        >
          <div className="wrap">
            <div className="section-head">
              <h2>
                Built for people who have to act on the score, not
                just see it
              </h2>

              <p>
                Whether you're a user sending money or an admin
                reviewing alerts, the platform gives you a reason,
                not just a number.
              </p>
            </div>

            <div className="feature-grid">
              <div className="feature-main">
                <div>
                  <h3>Explainable by default</h3>

                  <p>
                    Every flagged transaction comes with its top
                    three contributing factors, so admins can review
                    a decision in seconds instead of guessing at it.
                  </p>

                  <div className="mini-shap">
                    <span>New receiver +32</span>
                    <span>Odd hour +21</span>
                    <span>Amount anomaly +18</span>
                  </div>
                </div>
              </div>

              <div className="feature-side">
                <div className="feature-card">
                  <h3>Admin oversight</h3>

                  <p>
                    Block or unblock accounts, review daily fraud
                    trends, and search across every user and
                    transaction from one dashboard.
                  </p>
                </div>

                <div className="feature-card">
                  <h3>Live alert feed</h3>

                  <p>
                    Suspicious and flagged transactions generate an
                    alert the moment they're scored, not after a
                    nightly report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="section" id="security">
          <div className="wrap">
            <div className="section-head">
              <h2>The basics, done properly</h2>

              <p>
                Fraud detection only matters if the platform
                underneath it is trustworthy.
              </p>
            </div>

            <div className="trust-band">
              <div className="trust-item">
                <h4>Authentication</h4>

                <p>
                  JWT-based sessions with role separation between
                  users and admins.
                </p>
              </div>

              <div className="trust-item">
                <h4>Password storage</h4>

                <p>
                  Passwords are hashed with bcrypt before they ever
                  reach the database.
                </p>
              </div>

              <div className="trust-item">
                <h4>Data</h4>

                <p>
                  Transactions and alerts are stored in MongoDB Atlas,
                  separated by account.
                </p>
              </div>

              <div className="trust-item">
                <h4>Access control</h4>

                <p>
                  Admin-only endpoints are gated separately from
                  standard user routes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" id="faq">
          <div className="wrap">
            <div className="cta-band">
              <div>
                <h2>
                  Try it with a transaction of your own
                </h2>

                <p>
                  Register an account, send a transfer, and watch the
                  score come back in real time.
                </p>
              </div>

              <a
                href="#"
                className="btn btn-solid btn-large"
              >
                Register free
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;