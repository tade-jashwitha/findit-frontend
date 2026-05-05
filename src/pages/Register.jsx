// src/pages/Register.jsx
import { useState } from "react";
import { authAPI, authHelpers, getErrorMessage } from "../utils/api";

function Spinner() {
  return <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}

function getStrength(p) {
  if (!p) return null;
  if (p.length < 6) return { label: "Too short", color: "#EF4444", w: "25%" };
  if (p.length < 8) return { label: "Weak",      color: "#F59E0B", w: "50%" };
  if (p.length < 12) return { label: "Good",     color: "#0891B2", w: "75%" };
  return { label: "Strong", color: "#10B981", w: "100%" };
}

function AuthBg() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(135deg, #0C4A6E 0%, #0E7490 50%, #06B6D4 100%)", zIndex: 0 }} />
  );
}

const inputBase = (focused) => ({
  width: "100%",
  padding: "13px 14px 13px 44px",
  borderRadius: 12,
  border: `1.5px solid ${focused ? "#06B6D4" : "#DBEAFE"}`,
  background: focused ? "#FFFFFF" : "#F8FAFC",
  fontSize: 14, color: "#0F172A", outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
  boxShadow: focused ? "0 0 0 3px rgba(6,182,212,0.12)" : "none",
  transition: "all 0.2s",
});

export default function Register({ setPage, setUser }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const str = getStrength(form.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name.trim())  { setError("Name is required"); return; }
    if (!form.email.trim()) { setError("Email is required"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }

    setLoading(true); setError("");
    try {
      const res = await authAPI.register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      if (res.data.success) {
        authHelpers.setToken(res.data.token);
        authHelpers.setUser(res.data.data);
        setUser(res.data.data);
      } else setError(res.data.message || "Registration failed");
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  const iconStyle = { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94A3B8" };

  const fields = [
    { key: "name",    type: "text",     placeholder: "Full name",        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { key: "email",   type: "email",    placeholder: "Email address",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
    { key: "phone",   type: "tel",      placeholder: "Phone (optional, for SMS alerts)", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17z"/></svg> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", position: "relative", overflow: "hidden", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <AuthBg />

      {/* Back */}
      <button onClick={() => setPage("welcome")} style={{ position: "absolute", top: 20, left: 20, zIndex: 10, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 24, padding: "7px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>

      {/* Icon */}
      <div style={{ textAlign: "center", marginBottom: 20, position: "relative", zIndex: 1, animation: "fadeUp 0.4s ease both" }}>
        <div style={{ width: 54, height: 54, borderRadius: 17, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 400, background: "white", borderRadius: 24, padding: "28px 24px", boxShadow: "0 20px 60px rgba(14,116,144,0.15), 0 4px 16px rgba(14,116,144,0.08)", position: "relative", zIndex: 1, animation: "fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", marginBottom: 4, letterSpacing: "-0.5px" }}>Create Account</h2>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 22, lineHeight: 1.6 }}>
          Join <strong style={{ color: "#0891B2" }}>CampusFind</strong> and never lose anything again
        </p>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {/* Text fields */}
          {fields.map(({ key, type, placeholder, icon }) => (
            <div key={key} style={{ position: "relative" }}>
              <span style={iconStyle}>{icon}</span>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={set(key)}
                required={key !== "phone"}
                style={inputBase(focused === key)}
                onFocus={() => setFocused(key)}
                onBlur={() => setFocused(null)}
              />
            </div>
          ))}

          {/* Password */}
          <div>
            <div style={{ position: "relative" }}>
              <span style={iconStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password (min. 6 characters)"
                value={form.password}
                onChange={set("password")}
                required
                style={{ ...inputBase(focused === "password"), paddingRight: 46 }}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 2 }}>
                {showPass
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>

            {/* Strength bar */}
            {str && (
              <div style={{ marginTop: 6 }}>
                <div style={{ height: 3, borderRadius: 99, background: "#E2E8F0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: str.w, background: str.color, transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 11, color: str.color, marginTop: 4, fontWeight: 600 }}>{str.label}</p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Confirm password"
              value={form.confirm}
              onChange={set("confirm")}
              required
              style={{
                ...inputBase(focused === "confirm"),
                border: `1.5px solid ${form.confirm && form.confirm !== form.password ? "#FECACA" : focused === "confirm" ? "#06B6D4" : "#DBEAFE"}`,
              }}
              onFocus={() => setFocused("confirm")}
              onBlur={() => setFocused(null)}
            />
            {form.confirm && form.confirm !== form.password && (
              <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4, fontWeight: 500 }}>Passwords do not match</p>
            )}
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)", border: "none", color: "white", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(8,145,178,0.4)", transition: "all 0.2s", marginTop: 4 }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(8,145,178,0.5)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(8,145,178,0.4)"; }}
          >
            {loading ? <Spinner /> : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#94A3B8" }}>
          Already have an account?{" "}
          <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: "#0891B2", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}