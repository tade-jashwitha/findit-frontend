// src/pages/Login.jsx
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import T from "../utils/tokens";
import AILogo from "../components/AILogo";
import { Input, Button, Divider } from "../components/shared";
import api from "../utils/api";

export default function Login({ setPage, setUser }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error,    setError]    = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (tok) => {
      setGLoading(true); setError("");
      try {
        const info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tok.access_token}` } }).then(r => r.json());
        // Backend /auth/google returns { success, data: userObj } — no token for Google
        const res = await api.post("/auth/google", info);
        if (res.data.success) {
          const user = res.data.data;
          localStorage.setItem("findit_user", JSON.stringify(user));
          setUser(user);
        } else setError(res.data.message || "Google login failed");
      } catch (err) { setError(err.response?.data?.message || "Connection error. Try again."); }
      finally   { setGLoading(false); }
    },
    onError: () => setError("Google login cancelled."),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      // Backend /auth/login returns { success, token, data: user }
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("findit_token", res.data.token);
        const user = res.data.data; // user object is inside .data
        localStorage.setItem("findit_user", JSON.stringify(user));
        setUser(user);
      } else setError(res.data.message || "Invalid credentials");
    } catch (err) { setError(err.response?.data?.message || "Invalid email or password"); }
    finally  { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, display: "flex",
      alignItems: "center", justifyContent: "center",
      padding: "24px 20px", position: "relative", overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 0%, black, transparent)",
      }} />
      <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1, animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", animation: "float 4s ease infinite" }}>
            <AILogo size={52} />
          </div>
          <h1 style={{
            marginTop: 14, fontSize: 28, fontWeight: 900, letterSpacing: "-1px",
            background: T.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>CampusFind</h1>
          <p style={{ color: T.text2, fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: T.rXl, padding: "28px 28px",
        }}>
          {/* Error */}
          {error && (
            <div style={{
              background: T.redBg, border: `1px solid ${T.redBord}`,
              borderRadius: T.r, padding: "10px 14px", marginBottom: 20,
              fontSize: 13, color: T.red, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Google button */}
          <button
            onClick={() => googleLogin()}
            disabled={gLoading || loading}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: T.r,
              background: T.surfaceMd, border: `1px solid ${T.border}`,
              color: T.text, fontFamily: T.font, fontWeight: 600, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              cursor: "pointer", transition: "all 0.2s", marginBottom: 20,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.surfaceLg; e.currentTarget.style.borderColor = T.borderHov; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.surfaceMd; e.currentTarget.style.borderColor = T.border; }}
          >
            {gLoading
              ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              : <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/><path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            }
            Continue with Google
          </button>

          <Divider label="OR" />

          {/* Email form */}
          <form onSubmit={handleLogin}>
            <Input
              label="Email address" type="email"
              placeholder="you@campus.edu"
              value={email} onChange={e => setEmail(e.target.value)}
              icon="✉️" required
            />
            <Input
              label="Password" type="password"
              placeholder="Enter your password"
              value={password} onChange={e => setPassword(e.target.value)}
              icon="🔒" required
            />
            <Button type="submit" fullWidth size="lg" loading={loading} style={{ marginTop: 4 }}>
              Sign in
            </Button>
          </form>
        </div>

        {/* Register link */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: T.text2 }}>
          Don't have an account?{" "}
          <button onClick={() => setPage("register")} style={{
            background: "none", border: "none", color: "#A78BFA",
            fontWeight: 600, cursor: "pointer", fontSize: 14, fontFamily: T.font,
          }}>Create account →</button>
        </p>
      </div>
    </div>
  );
}