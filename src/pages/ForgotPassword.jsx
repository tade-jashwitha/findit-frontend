// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { authAPI, getErrorMessage } from "../utils/api";

function Spinner() {
  return <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}

function AuthBg() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(135deg, #0C4A6E 0%, #0E7490 50%, #06B6D4 100%)", zIndex: 0 }} />
  );
}

export default function ForgotPassword({ setPage }) {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address"); return; }
    setLoading(true); setError("");
    try {
      await authAPI.forgotPassword(email.trim());
      setSent(true);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", position: "relative", overflow: "hidden", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <AuthBg />

      {/* Back */}
      <button onClick={() => setPage("login")} style={{ position: "absolute", top: 20, left: 20, zIndex: 10, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 24, padding: "7px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>

      {/* Icon */}
      <div style={{ textAlign: "center", marginBottom: 20, position: "relative", zIndex: 1, animation: "fadeUp 0.4s ease both" }}>
        <div style={{ width: 54, height: 54, borderRadius: 17, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 380, background: "white", borderRadius: 24, padding: "28px 24px", boxShadow: "0 20px 60px rgba(14,116,144,0.15), 0 4px 16px rgba(14,116,144,0.08)", position: "relative", zIndex: 1, animation: "fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}>

        {sent ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ECFDF5", border: "2px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", animation: "scaleIn 0.3s ease both" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", marginBottom: 8, letterSpacing: "-0.3px" }}>Check Your Email</h2>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 24 }}>
              We've sent a password reset link to<br />
              <strong style={{ color: "#0891B2" }}>{email}</strong>
            </p>
            <div style={{ background: "#F0F9FF", borderRadius: 12, padding: "12px 16px", border: "1px solid #DBEAFE", marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                Didn't receive it? Check your spam folder or try again in a few minutes.
              </p>
            </div>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              style={{ width: "100%", padding: "13px 0", borderRadius: 12, background: "#F0F9FF", border: "1.5px solid #DBEAFE", color: "#0891B2", fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#E0F2FE"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F0F9FF"; }}
            >
              Try Another Email
            </button>
            <button onClick={() => setPage("login")} style={{ width: "100%", marginTop: 10, padding: "13px 0", borderRadius: 12, background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)", border: "none", color: "white", fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 16px rgba(8,145,178,0.35)", transition: "all 0.2s" }}>
              Back to Login
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", marginBottom: 4, letterSpacing: "-0.5px" }}>Reset Password</h2>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 22, lineHeight: 1.65 }}>
              Enter your email and we'll send you a link to reset your password.
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%", padding: "13px 14px 13px 44px",
                    borderRadius: 12,
                    border: `1.5px solid ${focused ? "#06B6D4" : "#DBEAFE"}`,
                    background: focused ? "#FFFFFF" : "#F8FAFC",
                    fontSize: 14, color: "#0F172A", outline: "none",
                    fontFamily: "inherit", boxSizing: "border-box",
                    boxShadow: focused ? "0 0 0 3px rgba(6,182,212,0.12)" : "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)", border: "none", color: "white", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(8,145,178,0.4)", transition: "all 0.2s" }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(8,145,178,0.5)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(8,145,178,0.4)"; }}
              >
                {loading ? <Spinner /> : "Send Reset Link"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#94A3B8" }}>
              Remember your password?{" "}
              <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: "#0891B2", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                Log In
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
