# 🎒 CampusFind — Campus Lost & Found Platform

<div align="center">

![CampusFind](https://img.shields.io/badge/CampusFind-Lost%20%26%20Found-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik05LjUgMkE2LjUgNi41IDAgMCAxIDE2IDguNWMwIDEuNjEtLjU5IDMuMDktMS41NiA0LjIzTDIwIDIwbC0xLjQxIDEuNDFMMTIuNzMgMTVBNi41IDYuNSAwIDEgMSA5LjUgMm0wIDJBNC41IDQuNSAwIDAgMCA1IDguNSA0LjUgNC41IDAgMCAwIDkuNSAxMyA0LjUgNC41IDAgMCAwIDE0IDguNSA0LjUgNC41IDAgMCAwIDkuNSA0eiIvPjwvc3ZnPg==)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00C7B7?style=flat-square&logo=github)](https://tade-jashwitha.github.io/findit-frontend)

**A smart campus lost & found system with AI-powered matching, native Android support, and 2-step claim verification.**

[🌐 Live Website](https://tade-jashwitha.github.io/findit-frontend) · [📱 Download APK](#-android-apk) · [🔧 Backend Repo](https://github.com/tade-jashwitha/findit-backend)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Smart Browse** | Filter by type, category, date, and location with real-time search |
| 🤖 **AI Matching** | Auto-matches lost & found items using keyword and similarity scoring |
| 📸 **Image Upload** | Upload photos of items via Cloudinary |
| 🔐 **Dual Auth** | Google OAuth (web & native Android) + Email/Password login |
| 📋 **2-Step Claim Verification** | Finder confirms claim → Owner confirms receipt → Item marked "Reunited" |
| 📱 **Android APK** | Full native Android app via Capacitor with native Google Sign-In |
| 🔔 **Notifications** | Real-time in-app alerts for matches, claims, and reunions |
| 🎨 **Dark UI** | Premium dark-mode design with animations and glassmorphism |

---

## 🖥️ Tech Stack

```
Frontend:    React 18 + React Router + Axios
Auth:        @react-oauth/google (web) + @codetrix-studio/capacitor-google-auth (native)
Mobile:      Capacitor 8 (Android APK)
Styling:     Vanilla CSS with custom design tokens
Hosting:     GitHub Pages (web) + APK for Android
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/tade-jashwitha/findit-frontend.git
cd findit-frontend

# Install dependencies (legacy-peer-deps needed for Capacitor plugin)
npm install --legacy-peer-deps

# Start development server
npm start
```

### Environment Variables

Create a `.env` file in the root:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
REACT_APP_API_URL=https://findit-backend-0v6p.onrender.com/api
```

---

## 📱 Android APK

The app is packaged as a native Android APK using **Capacitor 8**.

### Download
The latest APK is available as a build artifact.

### Build from Source

```bash
# 1. Build React app with relative paths (required for Capacitor)
$env:PUBLIC_URL="." ; npm run build       # Windows
PUBLIC_URL="." npm run build              # macOS/Linux

# 2. Sync web assets into Android project
npx cap sync android

# 3. Build the APK
cd android
./gradlew assembleDebug

# APK output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Google Sign-In in APK
The APK uses the `@codetrix-studio/capacitor-google-auth` plugin for native Google Sign-In.
Required: Register your app's SHA-1 fingerprint as an Android OAuth client in Google Cloud Console.

```bash
# Get your debug SHA-1 fingerprint
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android
```

---

## 🌐 Deployment (GitHub Pages)

```bash
# Deploy to GitHub Pages
npm run deploy
```

This runs `gh-pages -d build` and publishes the `build/` folder to the `gh-pages` branch.

Live URL: **https://tade-jashwitha.github.io/findit-frontend**

---

## 🔄 2-Step Claim Verification Flow

```
Step 1 — Finder confirms:
  Lost person → Browse → "Claim This Item" → Send message
  Found person → Dashboard → "✅ Confirm Match" or "❌ Reject"

Step 2 — Owner confirms receipt:
  Lost person → Dashboard → "Action Required" → "🎉 Yes! I Got It Back!"

Result → Item marked as "✅ Reunited" + both parties notified
```

---

## 📁 Project Structure

```
frontend/
├── public/               # Static assets, index.html
├── src/
│   ├── components/       # Navbar, SplashScreen, shared UI, ToastContainer
│   ├── pages/            # Home, Browse, Report, AIMatch, Login, Register, Dashboard
│   ├── utils/
│   │   ├── api.js        # Axios instance + API helpers
│   │   └── tokens.js     # Design system tokens (colors, spacing, fonts)
│   ├── App.jsx           # Root component with routing logic
│   └── index.js          # Entry point with GoogleOAuthProvider
├── android/              # Capacitor Android project
├── capacitor.config.json # Capacitor + GoogleAuth plugin config
├── netlify.toml          # CORS headers for Google OAuth popup
└── .npmrc                # legacy-peer-deps for Capacitor plugin
```

---

## 🎨 Design System

The app uses a centralized token system (`src/utils/tokens.js`):

- **Background:** `#0A0A0F` (deep dark)
- **Surface:** `#12121A`
- **Accent:** `#7C3AED` (violet)
- **Font:** `Inter, system-ui`
- **Animations:** fadeUp, float, spin (CSS keyframes)

---

## 🔗 Related

- **Backend API:** [findit-backend](https://github.com/tade-jashwitha/findit-backend)
- **Live API:** `https://findit-backend-0v6p.onrender.com/api`

---

## 📄 License

MIT License — feel free to fork and adapt for your campus!
