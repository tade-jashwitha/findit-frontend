// src/App.jsx — CampusFind app shell
import { useState, useCallback, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Report from "./pages/Report";
import AIMatch from "./pages/AIMatch";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import T from "./utils/tokens";

// ── Detect native APK (Capacitor WebView) ─────────────────────────────
const isNativeApp = () =>
  window?.Capacitor?.isNativePlatform?.() ||
  /wv|WebView/.test(navigator.userAgent) ||
  typeof window.Android !== "undefined";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("findit_user");
      if (s) return JSON.parse(s);
      return null;
    } catch { return null; }
  });

  const [page, setPage]       = useState("splash");
  const [savedIds, setSavedIds] = useState([]);

  const handleSplashFinish = useCallback(() => {
    try {
      const s = localStorage.getItem("findit_user");
      setPage(s ? "home" : "login");
    } catch { setPage("login"); }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("findit_user", JSON.stringify(user));
    else localStorage.removeItem("findit_user");
  }, [user]);

  const handleSetUser = useCallback((newUser) => {
    setUser(newUser);
    setPage(newUser ? "home" : "login");
  }, []);

  const navigate = useCallback((target) => {
    if (["report", "dashboard"].includes(target) && !user) setPage("login");
    else setPage(target);
  }, [user]);

  const toggleSave = useCallback((id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  // ── Splash ──
  if (page === "splash") return <SplashScreen onFinish={handleSplashFinish} />;

  // ── Auth pages ──
  if (page === "login")    return <><Login setPage={setPage} setUser={handleSetUser} /><ToastContainer /></>;
  if (page === "register") return <><Register setPage={setPage} setUser={handleSetUser} /><ToastContainer /></>;

  // ── Main app ──
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font }}>
      <Navbar page={page} setPage={navigate} user={user} setUser={handleSetUser} />
      <main>
        {page === "home"      && <Home setPage={navigate} onToggleSave={toggleSave} />}
        {page === "browse"    && <Browse setPage={navigate} user={user} onToggleSave={toggleSave} />}
        {page === "report"    && user && <Report user={user} setPage={navigate} />}
        {page === "ai"        && <AIMatch setPage={navigate} />}
        {page === "dashboard" && user && <Dashboard user={user} setPage={navigate} />}
      </main>
      <ToastContainer />
    </div>
  );
}