# AI-Powered Citizen Call Intelligence Platform 🚀

A full-stack, enterprise-grade civic response application that transforms citizen audio call complaints into structured, actionable intelligence.

Powered by speech-to-text and AI extraction services, the platform automates category extraction, emergency prioritization, department routing, duplicate complaint detection, and officer dispatching.

---

## 🌟 Key Features

- **Dark-Mode Enterprise Aesthetic**: Designed with Apple, Linear, Stripe & Vercel visual polish, glassmorphism, and dynamic animations.
-- **Speech-to-Text Pipeline**: Sub-second audio transcription supporting WAV, MP3, M4A, OGG, and WEBM formats.
-- **AI Extraction**: Returns structured JSON containing Category, Priority, Department, Summary, Sentiment, Citizen Emotion, Urgency, Confidence Score, Duplicate Risk, Location, and Suggested Actions.
- **Emergency Dispatch Triage**: Real-time high-priority alerts for life-threatening incidents (flooding, dangling power wires, fires).
- **Duplicate Prevention Engine**: Detects matching incidents in the same geographical vicinity to reduce redundant deployments.
- **GIS Leaflet Map**: Interactive map with priority color-coded markers.
- **Recharts Analytics**: Cross-department metrics, response times, monthly trends, and officer workload distribution.
- **Role-Based Auth (JWT + bcrypt)**: Dedicated portals for **Citizens**, **Officers**, and **Administrators**.

---

## 📁 Folder Structure

```
citizen-call-intelligence/
├── client/                           # React 19 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/               # Header, Footer, AudioUploader, AudioRecorder, Modals, LiveDemo
│   │   ├── contexts/                 # AuthContext, NotificationContext
│   │   ├── pages/                    # LandingPage, Citizen, Officer, Admin dashboards
│   │   ├── routes/                   # Protected AppRoutes
│   │   ├── services/                 # Axios API Client
│   │   └── types/                    # TypeScript Data Interfaces
├── server/                           # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/                   # Env & Supabase Initialization
│   │   ├── controllers/              # Auth, Complaint, AI, Officer, Admin, Analytics
│   │   ├── middleware/               # Auth JWT, Multer Audio Upload, Rate Limit, Error Handler
│   │   ├── routes/                   # Express Endpoint Handlers
│   │   ├── services/                 # Speech-to-Text, AI Extraction, Complaint DB Store
│   │   └── utils/                    # Prompts, Password & JWT Helpers
│   └── schema.sql                    # PostgreSQL Database Schema
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, React Leaflet
- **Backend**: Node.js, Express, TypeScript, Multer, JWT, bcryptjs
- **Database**: Supabase PostgreSQL (with automatic in-memory fallback store)

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=super-secret-jwt-key-citizen-intelligence-2026

# Database
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

CLIENT_URL=http://localhost:5173
```

---

## 🚀 Quick Start & Installation

### 1. Install Server Dependencies & Start
```bash
cd server
npm install
npm run dev
```
*Server starts on `http://localhost:5001`*

### 2. Install Client Dependencies & Start
```bash
cd client
npm install
npm run dev
```
*Client starts on `http://localhost:5173`*

---

## 🔑 One-Click Preset Credentials

- **Citizen Demo**: `citizen@city.gov` / `password123`
- **Officer Demo**: `officer@water.gov` / `password123`
- **Admin Demo**: `admin@city.gov` / `password123`

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Import `client/` directory to Vercel.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`

### Backend (Render)
1. Deploy `server/` directory as a Web Service on Render.
2. Build Command: `npm run build`
3. Start Command: `node dist/app.js`
4. Configure environment variables as needed for your AI and database services.
