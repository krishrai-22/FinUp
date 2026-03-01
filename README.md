# FinUp — Silent Household Financial Crisis Detector

> 🏆 Built for **AMD Slingshot Hackathon 2026** · Powered by **H2S (Human Imagination Built with AI)**

FinUp is an AI-powered MERN stack application that proactively detects financial stress in households using a composite risk scoring engine, 3-month savings projections, a what-if simulator, and family mode — without connecting to any real bank APIs.

---

## �️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2 | UI component framework |
| **Vite** | 5.2 | Dev server & build tool |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Recharts** | 2.12 | 3-month savings projection chart |
| **React Router v6** | 6.22 | Client-side routing (Landing → Login → Dashboard) |
| **Axios** | 1.6 | HTTP client with Bearer token injection |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18 | JavaScript runtime |
| **Express** | 4.18 | REST API server |
| **Mongoose** | 8.2 | MongoDB ODM & schema validation |
| **bcryptjs** | 2.4 | Password hashing (12 salt rounds) |
| **jsonwebtoken** | 9.0 | JWT generation & verification |
| **cors** | 2.8 | Cross-origin request handling |
| **dotenv** | 16.4 | Environment variable loading |
| **nodemon** | 3.1 | Dev auto-restart |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB** | Stores all risk assessment records and registered users |

### Architecture Overview
```
Browser (React + Vite)  ←→  Express API (Node.js)  ←→  MongoDB
        ↑ Tailwind CSS          ↑ JWT Auth
        ↑ Recharts              ↑ Risk Engine
        ↑ React Router          ↑ Projection Engine
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **MongoDB** running locally on `27017` (or a MongoDB Atlas URI)

### 1. Backend
```bash
cd server
cp .env.example .env        # edit MONGO_URI + JWT_SECRET if needed
npm install
npm run dev                 # → http://localhost:5000
```

### 2. Seed demo data (optional)
```bash
cd server
node seed/seedData.js       # inserts 6 demo family members
```

### 3. Frontend
```bash
cd client
npm install
npm run dev                 # → http://localhost:5173
```

> **Windows users:** if PowerShell blocks npm scripts, prefix with `cmd /c "npm install"`.

---

## 📁 Project Structure

```
FinUp/
├─ client/                          # React + Vite frontend
│  ├─ public/hero.png               # Hero background photo
│  └─ src/
│     ├─ pages/
│     │  ├─ LandingPage.jsx         # Migital-style public landing page
│     │  ├─ LoginPage.jsx
│     │  ├─ RegisterPage.jsx
│     │  └─ Dashboard.jsx           # Protected analysis page
│     ├─ components/
│     │  ├─ RiskMeter.jsx           # SVG circular gauge (0–100)
│     │  ├─ ProjectionChart.jsx     # Recharts 3-month line chart
│     │  ├─ Simulator.jsx           # What-if modal with live sliders
│     │  ├─ FamilyMode.jsx          # Multi-member input panel
│     │  └─ Navbar.jsx
│     ├─ context/AuthContext.jsx    # JWT auth global state
│     ├─ api.js                     # Axios with Bearer header
│     └─ index.css                  # Tailwind + custom component classes
│
├─ server/                          # Express + Mongoose backend
│  ├─ server.js                     # Entry point — DB connect + routes
│  ├─ models/
│  │  ├─ FinancialData.js           # Risk assessment Mongoose schema
│  │  └─ User.js                    # User schema with bcrypt pre-save hook
│  ├─ controllers/
│  │  ├─ riskController.js          # calculateRisk, simulate, history
│  │  └─ authController.js          # register, login, getMe
│  ├─ routes/
│  │  ├─ riskRoutes.js              # Protected: POST/GET risk endpoints
│  │  └─ authRoutes.js              # Public: auth endpoints
│  ├─ middleware/auth.js            # JWT Bearer token validation
│  ├─ utils/
│  │  ├─ riskEngine.js              # 4-rule composite scoring logic
│  │  └─ projectionEngine.js        # 3-month savings trajectory
│  └─ seed/seedData.js              # 6 demo members (Safe / Warning / High Risk)
│
├─ .env.example
└─ README.md
```

---

## � Environment Variables

Copy `server/.env.example` → `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/FinUp
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

## 📡 API Reference

All `/api/calculate-risk`, `/api/simulate`, and `/api/history` endpoints require a **Bearer JWT** token.

> **All monetary inputs are MONTHLY values (income, expenses, EMI, savings).**

### Auth endpoints (public)

| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/auth/me` | — (token required) |

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"secret123"}'
```

#### Login → get token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"secret123"}'

export TOKEN="eyJ..."   # copy from response
```

---

### Risk endpoints (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/calculate-risk` | Score + suggestions + projection, saved to DB |
| POST | `/api/simulate` | What-if recalculation (no DB save unless `save:true`) |
| GET | `/api/history` | Last 20 records; optional `?memberName=` filter |

#### Calculate Risk
```bash
curl -X POST http://localhost:5000/api/calculate-risk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "memberName":"bob","income":2500,"expenses":2667,
    "emi":667,"creditUtilization":0.85,"savings":2000
  }'
```

**Example response:**
```json
{
  "success": true,
  "riskScore": 90,
  "category": "High Risk",
  "breakdown": {
    "emiRatioPercent": 26.67,
    "savingsMonths": 0.75,
    "creditUsagePercent": 85,
    "savingsRatePercent": 6.67
  },
  "suggestions": [
    "Annual expenses (₹32,000) exceed income (₹30,000). Reduce discretionary spend...",
    "Credit utilization is at 85%. Reduce credit usage to below 30%...",
    "Your savings (₹2,000) cover less than 2 months of expenses..."
  ],
  "projection": [-833, -1667, -2500]
}
```

#### Simulate (what-if)
```bash
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"memberName":"bob","income":2500,"expenses":2667,"emi":667,
       "creditUtilization":0.85,"savings":2000,
       "adjustExpensePercent":-20,"adjustIncomePercent":10,"adjustEMI":0}'
```

#### History
```bash
curl "http://localhost:5000/api/history?memberName=alice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧮 Risk Scoring Rules

| Rule | Condition | Points |
|---|---|---|
| High EMI burden | `EMI / Income > 40%` | **+30** |
| Overspending | `Expenses > Income` | **+40** |
| High credit utilization | `Credit utilization > 80%` | **+30** |
| Low savings buffer | `Savings < 2 × monthly expenses` | **+20** |

**Score capped at 100. Categories:** `0–30` ✅ Safe · `31–60` ⚠️ Warning · `61–100` 🔴 High Risk

---

### Demo Scenarios

| Scenario | Monthly Income | Monthly Expenses | Monthly EMI | Credit Util. | Expected Category |
|---|---|---|---|---|---|
| Alice | ₹10,000/mo | ₹5,000/mo | ₹1,500/mo | 20% | ✅ Safe |
| Carol | ₹5,000/mo | ₹4,300/mo | ₹1,667/mo | 55% | ⚠️ Warning |
| Eve | ₹3,333/mo | ₹3,750/mo | ₹1,500/mo | 85% | 🔴 High Risk |

---

## ✨ Feature Highlights

| Feature | Details |
|---|---|
| **Risk Engine** | 4-rule composite scorer with detailed breakdown object |
| **3-Month Projection** | Linear monthly cash-flow model → Recharts line chart |
| **What-If Simulator** | Slider modal for income / expense / EMI adjustments, live recalculation |
| **Family Mode** | Up to 3 members, individual + averaged combined household score |
| **AI Suggestions** | Contextual per-rule interventions (e.g. "Reduce food delivery by 40%") |
| **JWT Auth** | Register / login, token in localStorage, protected routes |
| **MongoDB Persistence** | All assessments stored, searchable by member name |
| **Seeder** | `node seed/seedData.js` inserts 6 demo records covering all categories |
| **Strict Privacy** | No bank API, no third-party data sharing, demo data only |

---

