// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import api from "../utils/api";

const isNativeApp = () =>
  window?.Capacitor?.isNativePlatform?.() ||
  /wv|WebView/.test(navigator.userAgent) ||
  typeof window.Android !== "undefined";

function Spinner() {
  return <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}
function SpinnerDark() {
  return <div style={{ width: 16, height: 16, border: "2px solid rgba(8,145,178,0.2)", borderTop: "2px solid #0891B2", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.702 14.254 17.64 11.946 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

// ── Floating icon decoration ─────────────────────────────────────────────
function AuthBg() {
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(135deg, #0C4A6E 0%, #0E7490 50%, #06B6D4 100%)", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 400, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(103,232,249,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
    </>
  );
}

const inputBase = (focused, error) => ({
  width: "100%",
  padding: "13px 14px 13px 44px",
  borderRadius: 12,
  border: `1.5px solid ${error ? "#FECACA" : focused ? "#06B6D4" : "#DBEAFE"}`,
  background: focused ? "#FFFFFF" : "#F8FAFC",
  fontSize: 14,
  color: "#0F172A",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  boxShadow: focused ? "0 0 0 3px rgba(6,182,212,0.12)" : "none",
  transition: "all 0.2s",
});

export default function Login({ setPage, setUser }) {
  const isNative = isNativeApp();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error,    setError]    = useState("");
  const [focused,  setFocused]  = useState(null); // "email" | "password"

  useEffect(() => {
    if (isNative) {
      try { GoogleAuth.initialize({ clientId: "852596135869-jbjrjf9d0jc4g5ddb2bea442mg2kv6f4.apps.googleusercontent.com", scopes: ["profile", "email"], grantOfflineAccess: true }); }
      catch (e) { console.warn("GoogleAuth init error", e); }
    }
  }, [isNative]);

  const handleNativeGoogle = async () => {
    setGLoading(true); setError("");
    try {
      const g = await GoogleAuth.signIn();
      const res = await api.post("/auth/google", { name: g.name, email: g.email, picture: g.imageUrl });
      if (res.data.success) { localStorage.setItem("findit_token", res.data.token); localStorage.setItem("findit_user", JSON.stringify(res.data.data)); setUser(res.data.data); }
      else setError(res.data.message || "Google login failed");
    } catch (err) { setError(err?.message || "Google login cancelled."); }
    finally { setGLoading(false); }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit", ux_mode: "popup",
    onSuccess: async (tok) => {
      setGLoading(true); setError("");
      try {
        const info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${tok.access_token}` } }).then(r => r.json());
        const res = await api.post("/auth/google", info);
        if (res.data.success) { localStorage.setItem("findit_token", res.data.token); localStorage.setItem("findit_user", JSON.stringify(res.data.data)); setUser(res.data.data); }
        else setError(res.data.message || "Google login failed");
      } catch (err) { setError(err.response?.data?.message || "Connection error."); }
      finally { setGLoading(false); }
    },
    onError: () => { if (!isNative) setError("Google login cancelled."); },
    onNonOAuthError: () => { if (!isNative) setError("Popup closed. Please try again."); },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) { localStorage.setItem("findit_token", res.data.token); localStorage.setItem("findit_user", JSON.stringify(res.data.data)); setUser(res.data.data); }
      else setError(res.data.message || "Invalid credentials");
    } catch (err) { setError(err.response?.data?.message || "Invalid email or password"); }
    finally { setLoading(false); }
  };

  const iconStyle = { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94A3B8" };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", position: "relative", overflow: "hidden", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <AuthBg />

      {/* Back */}
      <button id="login-back-btn" onClick={() => setPage("welcome")} style={{ position: "absolute", top: 20, left: 20, zIndex: 10, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 24, padding: "7px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>

      {/* Logo chip */}
      <div style={{ textAlign: "center", marginBottom: 24, position: "relative", zIndex: 1, animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#A5F3FC", textTransform: "uppercase", marginBottom: 12, backdropFilter: "blur(8px)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          CampusFind
        </div>
        <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 400, background: "white", borderRadius: 24, padding: "28px 24px", boxShadow: "0 20px 60px rgba(14,116,144,0.15), 0 4px 16px rgba(14,116,144,0.08)", position: "relative", zIndex: 1, animation: "fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", marginBottom: 4, letterSpacing: "-0.5px" }}>Welcome Back</h2>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 22, lineHeight: 1.6 }}>
          Sign in to continue to <strong style={{ color: "#0891B2" }}>CampusFind</strong>
        </p>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Email */}
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <input id="login-email" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              style={inputBase(focused === "email", false)}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input id="login-password" type={showPass ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ ...inputBase(focused === "password", false), paddingRight: 46 }}
              onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
            />
            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 2 }}>
              {showPass
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>

          {/* Remember + Forgot */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 500 }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: "#06B6D4", width: 14, height: 14, cursor: "pointer" }} />
              Remember me
            </label>
            <button type="button" onClick={() => setPage("forgot-password")} style={{ background: "none", border: "none", color: "#0891B2", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Forgot password?
            </button>
          </div>

          {/* Login btn */}
          <button id="login-submit-btn" type="submit" disabled={loading} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)", border: "none", color: "white", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(8,145,178,0.4)", transition: "all 0.2s", marginTop: 4 }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(8,145,178,0.5)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(8,145,178,0.4)"; }}
          >
            {loading ? <Spinner /> : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#DBEAFE" }} />
          <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: 1, background: "#DBEAFE" }} />
        </div>

        {/* Google btn */}
        <button id="login-google-btn"
          onClick={() => isNative ? handleNativeGoogle() : googleLogin()}
          disabled={gLoading || loading}
          style={{ width: "100%", padding: "13px", borderRadius: 12, background: "white", border: "1.5px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s", fontFamily: "inherit", fontSize: 14, fontWeight: 600, color: "#475569" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F0F9FF"; e.currentTarget.style.borderColor = "#BAE6FD"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#DBEAFE"; }}
        >
          {gLoading ? <SpinnerDark /> : <GoogleIcon />}
          Continue with Google
        </button>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#94A3B8" }}>
          Don't have an account?{" "}
          <button id="login-to-register-btn" onClick={() => setPage("register")} style={{ background: "none", border: "none", color: "#0891B2", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}