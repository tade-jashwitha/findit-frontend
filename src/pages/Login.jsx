// pages/Login.jsx
import { useState } from "react";
import { Button, Card, Input } from "../components/UI";
import { toast } from "../utils/toast";

export default function Login({ setPage, setUser }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    // Replace with actual API call: await api.login(form)
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setUser({ name: form.email.split("@")[0], email: form.email });
    toast.success("Welcome back! 👋");
    setPage("home");
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="fade-up">

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>👋</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.5px", marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--c-text2)" }}>Sign in to your campus account</p>
        </div>

        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Email Address" type="email" placeholder="riya@campus.edu"
              value={form.email} onChange={set("email")} error={errors.email} icon="📧"
            />
            <Input
              label="Password" type="password" placeholder="Minimum 6 characters"
              value={form.password} onChange={set("password")} error={errors.password} icon="🔒"
            />
            <Button fullWidth size="lg" loading={loading} onClick={handleSubmit} variant="accent">
              {loading ? "Signing in…" : "Sign In →"}
            </Button>
          </div>
        </Card>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--c-text2)", marginTop: 20 }}>
          Don't have an account?{" "}
          <button onClick={() => setPage("register")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--c-accent)", fontWeight: 700, fontSize: 14,
          }}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}