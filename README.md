# 🛡️ FraudGuard — Real-Time Bank Fraud Detection System

> An end-to-end full-stack banking platform with an ML-powered fraud detection engine that scores every transaction in real time using XGBoost + SHAP explainability.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-ML%20API-000000?logo=flask&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-Model-EB5E28)
![SHAP](https://img.shields.io/badge/SHAP-Explainability-blueviolet)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend%20%2B%20ML-Render-46E3B7?logo=render&logoColor=white)

---

## 🚨 Problem Statement

Digital banking fraud is rising fast — fraudulent transfers, account takeovers, and money-mule networks cost users and banks billions every year, and most fraud detection happens *after* the money is already gone.

**FraudGuard** solves this by scoring every transaction **before** it completes, using a machine learning model trained on transaction behavior patterns (amount anomalies, odd hours, new receivers, transaction frequency) — flagging suspicious activity instantly instead of relying on manual review after the fact.

---

## 🌐 Live Demo

| Layer | URL |
|---|---|
| Frontend (Vercel) | `https://bank-froud-30nz8nles-khushal-s-projects-cd4b8ce2.vercel.app/` |
| Backend API (Render) | `https://fraudguard-backend-9ss1.onrender.com` |
| ML Service (Render) | *deployed separately as a Flask microservice* |

> ⚠️ Free-tier Render services spin down on inactivity — first request after idle may take ~50s to respond.

---

## 📸 Screenshots

| Login | User Dashboard | Admin Dashboard |
|---|---|---|
| *add screenshot* | *add screenshot* | *add screenshot* |

| Send Money (Safe) | Send Money (Flagged) | Fraud Alerts |
|---|---|---|
| ✅ Transaction approved | 🚩 High risk — blocked/flagged | Live alert feed for admins |

---

## 🏗️ Project Architecture

```
User (React Frontend — Vercel)
        │  HTTP requests (JWT auth)
        ▼
Node.js / Express Backend (Render)
        │
        ├── MongoDB Atlas ── users, transactions, alerts
        │
        └── POST /predict ──────────────► Flask ML Service (Render)
                                                  │
                                          scaler.transform(features)
                                                  ▼
                                          XGBoost Model (fraud_model_v2.pkl)
                                                  │
                                          risk_score (0–100) + SHAP reasons
                                                  ▼
                                     status: safe / suspicious / flagged
                                                  │
                                                  ▼
                              Transaction saved + Alert created (if risky)
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Bootstrap, Chart.js |
| Backend | Node.js, Express 5, JWT Auth, bcrypt |
| Database | MongoDB Atlas (Mongoose ODM) |
| ML Service | Python, Flask, XGBoost, scikit-learn, SHAP |
| Deployment | Vercel (frontend) · Render (backend + ML API) |

---

## ✨ Features

- 🔐 JWT-based authentication with role-based access (`user` / `admin`)
- 💸 Send-money flow scored live against the fraud model before completion
- 📊 Admin dashboard — daily/monthly/yearly stats, fraud trend charts, risk distribution
- 🚨 Automatic fraud alert generation for `suspicious` / `flagged` transactions
- 🧠 Explainable AI — every risk score comes with the top 3 contributing reasons (via SHAP)
- 👥 Admin user management — block/unblock accounts
- 🔍 Global search across users & transactions

---

## 🧪 Test Credentials

Use these to try the app immediately without registering:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@test.com` | `123456` |
| **User** | `yourname@gmail.com` | `123456` |

> Note: the admin account already exists in the database. The user account is a sample — register it once via `/Signup` (or swap in your own email) before logging in.

---

## 💳 Sample Test Transactions

The ML model scores transactions using amount, time of day, receiver history, and frequency. Use these scenarios via **Send Money** to see each verdict in action:

| Scenario | Amount | Time | Receiver | Expected Result |
|---|---|---|---|---|
| Normal transfer | ₹500 – ₹5,000 | Daytime (9 AM–9 PM) | Existing/known receiver | ✅ **Safe** (risk score < 31) |
| Odd hour + new receiver | ₹15,000+ | Late night (11 PM–5 AM) | New account, first-time | ⚡ **Suspicious** (risk score 31–70) |
| High-value anomaly | ₹50,000+ (well above your average) | Any time | Brand-new receiver | 🚩 **Flagged** (risk score ≥ 71) |
| Rapid-fire transfers | Multiple sends within the same hour | Any time | Any | ⚡/🚩 **Suspicious → Flagged** as frequency climbs |

> Tip: since a fresh account starts with no transaction history, `user_avg_amount` defaults low — so the *very first* large transfer you send is the easiest way to trigger a **Flagged** result for demo purposes.

---

## 🚀 Local Setup

### 1. Backend
```bash
cd backend
npm install
# create a .env file — see Environment Variables below
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

### 3. ML Service
```bash
cd ml-model
pip install -r requirements.txt
python app.py
```

---

## 🔑 Environment Variables

**backend/.env**
```
PORT=3001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
ML_API_URL=http://127.0.0.1:5000
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/profile` | Get logged-in user's profile |
| POST | `/api/transactions/send` | Send money (scored by ML model) |
| GET | `/api/transactions/my` | Get logged-in user's transactions |
| GET | `/api/transactions/all` | *(admin)* All transactions |
| GET | `/api/admin/stats` | *(admin)* Dashboard statistics |
| GET | `/api/admin/alerts` | *(admin)* Fraud alerts feed |
| GET | `/api/admin/users` | *(admin)* All registered users |

---

## 📄 License

This project is for educational/demo purposes as part of a fraud-detection portfolio project.
