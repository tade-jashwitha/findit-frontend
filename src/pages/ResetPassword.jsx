// src/pages/ResetPassword.jsx
import { useState } from "react";
import { authAPI, authHelpers, getErrorMessage } from "../utils/api";

function Spinner() {
  return <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}

function AuthBg() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(135deg, #0C4A6E 0%, #0E7490 50%, #06B6D4 100%)", zIndex: 0 }} />
  );
}

export default function ResetPassword({ token, setPage, setUser }) {
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [focused,  setFocused]  = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }

    setLoading(true); setError("");
    try {
      const res = await authAPI.resetPassword(token, password);
      if (res.data.success) {
        authHelpers.setToken(res.data.token);
        authHelpers.setUser(res.data.data);
        setUser(res.data.data);
      } else setError(res.data.message || "Failed to reset password");
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", position: "relative", overflow: "hidden", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <AuthBg />

      <div style={{ textAlign: "center", marginBottom: 20, position: "relative", zIndex: 1, animation: "fadeUp 0.4s ease both" }}>
        <div style={{ width: 54, height: 54, borderRadius: 17, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 380, background: "white", borderRadius: 24, padding: "28px 24px", boxShadow: "0 20px 60px rgba(14,116,144,0.15), 0 4px 16px rgba(14,116,144,0.08)", position: "relative", zIndex: 1, animation: "fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", marginBottom: 4, letterSpacing: "-0.5px" }}>Create New Password</h2>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 22, lineHeight: 1.65 }}>
          Your new password must be different from previous used passwords.
        </p>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94A3B8" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "13px 14px 13px 44px",
                borderRadius: 12,
                border: `1.5px solid ${focused === "pwd" ? "#06B6D4" : "#DBEAFE"}`,
                background: focused === "pwd" ? "#FFFFFF" : "#F8FAFC",
                fontSize: 14, color: "#0F172A", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
                boxShadow: focused === "pwd" ? "0 0 0 3px rgba(6,182,212,0.12)" : "none",
                transition: "all 0.2s",
              }}
              onFocus={() => setFocused("pwd")}
              onBlur={() => setFocused(null)}
            />
          </div>

          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94A3B8" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={{
                width: "100%", padding: "13px 14px 13px 44px",
                borderRadius: 12,
                border: `1.5px solid ${focused === "conf" ? "#06B6D4" : "#DBEAFE"}`,
                background: focused === "conf" ? "#FFFFFF" : "#F8FAFC",
                fontSize: 14, color: "#0F172A", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
                boxShadow: focused === "conf" ? "0 0 0 3px rgba(6,182,212,0.12)" : "none",
                transition: "all 0.2s",
              }}
              onFocus={() => setFocused("conf")}
              onBlur={() => setFocused(null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)", border: "none", color: "white", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(8,145,178,0.4)", transition: "all 0.2s", marginTop: 4 }}
          >
            {loading ? <Spinner /> : "Reset Password"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#94A3B8" }}>
          Remember your password?{" "}
          <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: "#0891B2", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
