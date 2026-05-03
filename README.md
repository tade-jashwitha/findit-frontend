# 🎒 CampusFind — Frontend

> **CampusFind** is an AI-powered Lost & Found web app for college campuses.  
> Students can report lost/found items, search listings, and use AI to find matches instantly.

---

## 📌 What is this project?

When a student loses something on campus (phone, keys, bag, ID), they often have no way to check if someone found it. CampusFind solves this by:

- Letting **finders** post what they found
- Letting **losers** search and describe their item
- Using **AI (Google Gemini)** to automatically match lost items with found ones

---

## 🌐 Live App

| | URL |
|--|--|
| **Frontend** | https://your-app.netlify.app |
| **Backend API** | https://findit-backend-0v6p.onrender.com/api |

---

## 🏗️ System Architecture

This diagram shows how all parts of CampusFind connect to each other:

```
┌─────────────────────────────────────────────────┐
│                FRONTEND (Netlify)                │
│                                                 │
│   React App                                     │
│   ├── Pages (Home, Browse, Report, AI, ...)     │
│   ├── Components (Card, Button, Badge...)       │
│   └── Axios API Client (api.js)                 │
│         │                                       │
│         │ HTTPS requests                        │
└─────────┼───────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│                BACKEND (Render)                  │
│                                                 │
│   Express Server (server.js)                    │
│   ├── CORS → allows only trusted origins        │
│   ├── JWT Middleware → verifies login tokens    │
│   ├── /api/auth  → login, register, Google      │
│   ├── /api/items → report, browse, delete       │
│   └── /api/ai    → tag generation, matching     │
│         │                │           │          │
└─────────┼────────────────┼───────────┼──────────┘
          │                │           │
          ▼                ▼           ▼
   ┌────────────┐  ┌──────────────┐  ┌───────────────┐
   │ MongoDB    │  │  Cloudinary  │  │ Google Gemini │
   │ Atlas      │  │  (Images)    │  │ AI (Tags)     │
   │ (Database) │  └──────────────┘  └───────────────┘
   └────────────┘

External Auth:
   ┌──────────────┐
   │ Google OAuth │ ← User clicks "Continue with Google"
   │ (Login only) │   Frontend gets token → sends to backend
   └──────────────┘
```

### What happens when a user opens the app:
```
1. Browser loads React app from Netlify
2. App shows Splash Screen → then Login page
3. User logs in → backend returns JWT token
4. Token saved in browser (localStorage)
5. Every API request includes the token in the header
6. Backend verifies token → returns user-specific data
```

---

## 🖥️ Pages & What They Do

| Page | What it does |
|------|-------------|
| **Home** | Shows campus stats (lost/found/reunited count) and recent activity |
| **Browse** | Lists all reported items — search by keyword, filter by type/category |
| **Report** | Form to report a lost OR found item (with optional photo upload) |
| **AI Match** | Type a description of your lost item — AI ranks the best matches |
| **Dashboard** | Shows your own reports — their status, dates, locations |
| **Login** | Sign in with Email/Password or Google account |
| **Register** | Create a new campus account |

---

## 🧰 Tech Stack (What tools are used and why)

| Tool | Why it's used |
|------|--------------|
| **React 18** | Builds the UI with reusable components |
| **Axios** | Sends HTTP requests to the backend API |
| **@react-oauth/google** | Handles "Continue with Google" login |
| **Google Gemini AI** | (via backend) Generates smart search tags |
| **CSS-in-JS (inline styles)** | All styling done in JavaScript — no separate CSS files |
| **Google Fonts (Inter)** | Clean, modern typography |
| **Netlify** | Hosts and auto-deploys the frontend |

---

## 📁 Folder Structure Explained

```
frontend/
│
├── public/
│   ├── index.html          ← The single HTML page (React mounts here)
│   └── favicon.png         ← Browser tab icon
│
├── src/
│   ├── App.jsx             ← Main app: controls which page is shown
│   ├── index.js            ← Entry point (renders App into index.html)
│   ├── index.css           ← Global animations (@keyframes) and font import
│   │
│   ├── pages/              ← One file per page/screen
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── Report.jsx
│   │   ├── AIMatch.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── components/         ← Reusable building blocks used across pages
│   │   ├── shared.jsx      ← Card, Button, Badge, Input, Skeleton, BottomNav
│   │   ├── Navbar.jsx      ← Top header with navigation
│   │   ├── SplashScreen.jsx ← Loading screen shown when app first opens
│   │   ├── AILogo.jsx      ← Animated SVG logo
│   │   └── ToastContainer.jsx ← Notification pop-ups
│   │
│   └── utils/              ← Helper files (not UI)
│       ├── api.js          ← All API calls defined here (login, items, AI...)
│       └── tokens.js       ← Design system: colors, spacing, fonts as variables
│
├── .env                    ← Secret keys (NOT committed to git)
├── netlify.toml            ← Netlify build + routing config
└── package.json            ← Project info + dependencies list
```

---

## 🔐 How Authentication Works (Simple Explanation)

```
Email Login:
  User types email + password
    → Frontend sends to backend
    → Backend checks password (bcrypt)
    → Backend sends back a TOKEN (like a digital badge)
    → Frontend saves token in browser localStorage
    → Token is attached to every future API request

Google Login:
  User clicks "Continue with Google"
    → Google gives a temporary code
    → Frontend sends user info to backend
    → Backend creates/finds the account
    → User is logged in (no password needed)
```

---

## 🤖 How AI Matching Works

```
1. User types: "black Sony earphones, scratched left earbud, lost in library"
2. Frontend sends this to backend → backend asks Gemini AI
3. Gemini returns tags: ["sony", "earphones", "black", "wireless", "library"]
4. Frontend scores every item in the database using 4 signals:
     - How many AI tags match the item? (45% weight)
     - How many words from the description match? (30% weight)
     - Does the title contain a query word? (+25 bonus)
     - Does the category match? (+15 bonus)
5. Items sorted by score → top 5 shown with % accuracy
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+ installed
- Backend server running (see backend README)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/tade-jashwitha/findit-frontend.git
cd findit-frontend

# 2. Install packages
npm install --legacy-peer-deps

# 3. Create environment file
# Create a file called .env in this folder and paste:
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_API_URL=https://findit-backend-0v6p.onrender.com/api

# 4. Start the app
npm start
# Opens at http://localhost:3000
```

---

## 🌍 How to Deploy on Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → New site → Import from GitHub
3. Set these settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
4. Add Environment Variables in Netlify dashboard:
   ```
   REACT_APP_GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
   REACT_APP_API_URL = https://your-backend.onrender.com/api
   ```
5. Click Deploy — Netlify auto-deploys on every future push to `main`

> ⚠️ The `netlify.toml` file already handles SPA routing — no extra config needed.

---

## 🔑 Environment Variables Explained

| Variable | What it is | Where to get it |
|----------|-----------|----------------|
| `REACT_APP_GOOGLE_CLIENT_ID` | Your Google OAuth app ID | [console.cloud.google.com](https://console.cloud.google.com) → Credentials |
| `REACT_APP_API_URL` | Your backend API base URL | Your Render backend URL + `/api` |

---

## 🔗 Related
- **Backend Repo:** [findit-backend](https://github.com/tade-jashwitha/findit-backend)

---

## 👩‍💻 Author
Made by **Jashwitha Tade**
