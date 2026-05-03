# 🎓 CampusFind — Frontend

> **AI-powered Lost & Found platform for college campuses**  
> Built with React · Deployed on Netlify · Connected to Render backend

[![Netlify Status](https://api.netlify.com/api/v1/badges/campusfoundandlost/deploy-status)](https://campusfoundandlost.netlify.app)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌐 Live Demo

| Platform | URL |
|----------|-----|
| 🌍 Web App | [campusfoundandlost.netlify.app](https://campusfoundandlost.netlify.app) |
| 📱 Android APK | Available in `/android/app/build/outputs/apk/debug/` |
| 🔧 Backend API | [findit-backend-0v6p.onrender.com/api](https://findit-backend-0v6p.onrender.com/api) |

---

## ✨ Features

### 🤖 AI Matching System
- Automatically matches LOST and FOUND items on submission
- 4-signal weighted scoring: **Title (30%) + Description (20%) + Category (20%) + Location (15%) + Date (10%) + AI Tags (5%)**
- Returns match confidence score (0–100%)
- Shows **"⚡ Possible Matches Found"** with reasons on the Report success screen

### 📩 Claim / Verification System
- Structured claim flow replacing direct email contact
- Finder → sends claim with message → Owner reviews → Accept / Reject
- Both parties notified at every step
- Item status automatically updates to **"Claimed"** on approval

### 🔔 In-App Notifications
- Real-time notification bell in Navbar (polls every 30s)
- Unread count badge on bell icon
- Notifications for: match found · claim received · claim approved/rejected
- Dropdown with full notification history

### 🧠 Smart Sorting
- Toggle between **🕐 By Recent** and **⚡ By Match Score**
- Match score badges (color-coded) shown on each item card
- AI match reasons displayed in item detail sheet

### 🔐 Authentication
- Email/password registration & login with JWT
- Google OAuth 2.0 (one-click sign in)
- Auto-redirect on 401, token stored in localStorage

### 📱 Mobile APK
- Built with Capacitor 8
- Android debug APK included
- Full native app experience

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                  Netlify CDN Deploy                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Browse  │  │  Report  │  │ AIMatch  │  │  Auth  │ │
│  │ + Claims │  │ + Matches│  │ (Gemini) │  │ Google │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Axios API Utility (src/utils/api.js)    │   │
│  │  • JWT auto-attach  • 401 auto-redirect         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Node/Express)                 │
│                   Render.com Deploy                      │
│                                                         │
│  /api/auth        /api/items         /api/ai            │
│  /api/notifications  /api/items/:id/claim               │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  MongoDB     │  │  Cloudinary  │  │   Gemini AI  │  │
│  │  Atlas       │  │  (Images)    │  │  (Tags/Match)│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html              # Meta tags, favicon, PWA config
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # 🔔 Notification bell + nav links
│   │   ├── AILogo.jsx          # Animated logo component
│   │   └── shared/             # Button, Card, Input, Badge, Skeleton
│   ├── pages/
│   │   ├── Home.jsx            # Landing with stats
│   │   ├── Browse.jsx          # ⚡ Match scores + Claim modal + Smart sort
│   │   ├── Report.jsx          # Submit form + auto-match results
│   │   ├── AIMatch.jsx         # Image-based AI search
│   │   ├── Dashboard.jsx       # My items + claim requests
│   │   ├── Login.jsx           # JWT + Google OAuth
│   │   └── Register.jsx        # New user registration
│   ├── utils/
│   │   └── api.js              # Axios instance + all API calls
│   └── utils/
│       └── tokens.js           # Design system tokens
├── android/                    # Capacitor Android project
├── capacitor.config.json       # App ID, webDir config
├── netlify.toml                # Redirect rules for SPA
└── .env                        # Environment variables
```

---

## ⚙️ Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
REACT_APP_API_URL=https://findit-backend-0v6p.onrender.com/api
```

> ⚠️ **Never commit `.env` to GitHub** — it's in `.gitignore`

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build
```

---

## 📦 Building the Android APK

### Prerequisites
- Android Studio installed
- Android SDK at `C:\Users\<you>\AppData\Local\Android\Sdk`

```bash
# 1. Build React production bundle
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Build APK (uses Android Studio's JDK 21)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
cd android
.\gradlew.bat assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🌍 Netlify Deployment

### Environment Variables (set in Netlify Dashboard)
```
REACT_APP_GOOGLE_CLIENT_ID = <your_client_id>
REACT_APP_API_URL           = https://findit-backend-0v6p.onrender.com/api
```

### `netlify.toml`
```toml
[[redirects]]
  from = "/*"
  to   = "/index.html"
  status = 200
```

### Google OAuth for Production
In [Google Cloud Console](https://console.cloud.google.com) → OAuth Client → add:
- **Authorized JavaScript Origins:** `https://campusfoundandlost.netlify.app`
- **Authorized Redirect URIs:** `https://campusfoundandlost.netlify.app`

---

## 🔌 API Reference

All requests go to `REACT_APP_API_URL` base URL.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register with email/password |
| `POST` | `/auth/login` | Login → returns JWT |
| `POST` | `/auth/google` | Google OAuth → returns JWT |
| `GET` | `/items` | Browse items (filter + sort) |
| `POST` | `/items` | Submit new item → auto-match runs |
| `GET` | `/items/:id` | Item detail with match data |
| `POST` | `/items/:id/claim` | Send claim request |
| `PATCH` | `/items/:id/claim/:claimId` | Approve/reject claim |
| `GET` | `/notifications` | Get my notifications |
| `PATCH` | `/notifications/read-all` | Mark all as read |
| `POST` | `/ai/match` | Image-based AI item matching |
| `POST` | `/ai/tags` | Generate AI tags for item |

---

## 👩‍💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Styling | Vanilla CSS (inline design tokens) |
| HTTP Client | Axios |
| Auth | JWT + Google OAuth 2.0 (`@react-oauth/google`) |
| AI Search | Google Gemini 1.5 Flash |
| Mobile | Capacitor 8 (Android APK) |
| Hosting | Netlify |
| CI/CD | GitHub → Netlify auto-deploy |

---

## 👥 Team

**CampusFind** — Built for the college lost & found problem.  
Department Project · 2025–2026
