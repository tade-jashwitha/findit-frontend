// src/pages/Register.jsx
import { useState } from "react";
import T from "../utils/tokens";
import { Input, Button } from "../components/shared";
import { authAPI, authHelpers, getErrorMessage } from "../utils/api";
import AILogo from "../components/AILogo";

export default function Register({ setPage, setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", studentId: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6)  return { label: "Too short", color: T.red,   w: "25%" };
    if (p.length < 8)  return { label: "Weak",      color: T.amber, w: "50%" };
    if (p.length < 12) return { label: "Good",      color: T.blue,  w: "75%" };
    return               { label: "Strong",    color: T.green, w: "100%" };
  })();

  const handleRegister = async () => {
    if (!form.name.trim())  { setError("Name is required"); return; }
    if (!form.email.trim()) { setError("Email is required"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }

    setLoading(true); setError("");
    try {
      const payload = { name: form.name, email: form.email, password: form.password };
      if (form.studentId) payload.studentId = form.studentId;
      if (form.phone)     payload.phone     = form.phone;

      // Backend returns { success, token, data: user }
      const res = await authAPI.register(payload);
      const token = res.data.token;
      const user  = res.data.data;
      authHelpers.setToken(token);
      authHelpers.setUser(user);
      setUser(user);
      setPage("home");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "40px 20px",
      position: "relative", overflow: "hidden",
      fontFamily: T.font, color: T.text,
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 0%, black, transparent)",
      }} />
      <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 420, width: "100%", margin: "0 auto", animation: "fadeUp 0.5s ease both", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-block", animation: "float 4s ease infinite" }}>
            <AILogo size={48} />
          </div>
          <h1 style={{
            marginTop: 14, fontSize: 26, fontWeight: 900, letterSpacing: "-1px",
            background: T.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Join CampusFind</h1>
          <p style={{ color: T.text2, fontSize: 13, marginTop: 4 }}>Create your campus account</p>
        </div>

        {/* Card */}
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: T.rXl, padding: "28px 24px",
        }}>
          {error && (
            <div style={{
              background: T.redBg, border: `1px solid ${T.redBord}`,
              borderRadius: T.r, padding: "10px 14px", marginBottom: 20,
              fontSize: 13, color: T.red, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <Input label="Full Name"  type="text"     placeholder="Riya Sharma"      icon="👤" value={form.name}      onChange={set("name")} required />
          <Input label="Email"      type="email"    placeholder="you@campus.edu"    icon="✉️" value={form.email}     onChange={set("email")} required />
          <Input label="Student ID" type="text"     placeholder="Optional"          icon="🪪" value={form.studentId} onChange={set("studentId")} />
          <Input label="Phone"      type="tel"      placeholder="Optional"          icon="📱" value={form.phone}     onChange={set("phone")} />
          <Input label="Password"   type="password" placeholder="Min. 6 characters" icon="🔒" value={form.password}  onChange={set("password")} required />

          {strength && (
            <div style={{ marginTop: -10, marginBottom: 16 }}>
              <div style={{ height: 3, background: T.border, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: strength.w, background: strength.color, transition: "all 0.4s ease", borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 11, color: strength.color, fontWeight: 600, marginTop: 4, display: "block" }}>{strength.label}</span>
            </div>
          )}

          <Input label="Confirm Password" type="password" placeholder="Re-enter password" icon="🔒" value={form.confirm} onChange={set("confirm")} required />

          <p style={{ fontSize: 11, color: T.text3, textAlign: "center", marginBottom: 20 }}>
            By signing up you agree to our{" "}
            <span style={{ color: "#A78BFA", cursor: "pointer" }}>Terms of Service</span>
            {" "}and{" "}
            <span style={{ color: "#A78BFA", cursor: "pointer" }}>Privacy Policy</span>.
          </p>

          <Button fullWidth size="lg" loading={loading} onClick={handleRegister}>
            {loading ? "Creating account…" : "Create Account 🎉"}
          </Button>

          <p style={{ textAlign: "center", fontSize: 13, color: T.text2, marginTop: 20 }}>
            Already have an account?{" "}
            <button onClick={() => setPage("login")} style={{
              background: "none", border: "none", color: "#A78BFA",
              fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: T.font,
            }}>Sign in →</button>
          </p>
        </div>
      </div>
    </div>
  );
}