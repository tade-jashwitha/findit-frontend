// src/components/shared.jsx — CampusFind Design System Components
import { useState } from "react";
import T from "../utils/tokens";
import AILogo from "./AILogo";

// ── Skeleton loader ────────────────────────────────────────────────────
export function Skeleton({ height = 60, radius = T.r, style = {} }) {
  return (
    <div style={{
      height, borderRadius: radius,
      background: "linear-gradient(90deg, #18181F 25%, #1E1E28 50%, #18181F 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s ease infinite",
      ...style
    }} />
  );
}

// ── Card ──────────────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick, hover = false, padding = "20px" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: hov ? T.surfaceMd : T.surface,
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: T.rMd,
        padding,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        transform: hov && hover ? "translateY(-2px)" : "none",
        boxShadow: hov && hover ? "0 12px 40px rgba(0,0,0,0.4)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────
export function Input({ label, type = "text", placeholder, value, onChange, icon, rows, hint, error, required }) {
  const [focused, setFoc] = useState(false);
  const inputStyle = {
    width: "100%",
    background: T.surfaceMd,
    border: `1px solid ${error ? T.redBord : focused ? "rgba(124,58,237,0.6)" : T.border}`,
    borderRadius: T.r,
    color: T.text,
    fontSize: 14,
    outline: "none",
    boxShadow: focused ? `0 0 0 3px rgba(124,58,237,0.12)` : "none",
    transition: "all 0.2s ease",
    fontFamily: T.font,
    boxSizing: "border-box",
    padding: rows ? "12px 14px" : `13px 14px 13px ${icon ? "42px" : "14px"}`,
    resize: rows ? "vertical" : undefined,
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: "block", fontSize: 12, fontWeight: 600,
          color: T.text2, marginBottom: 6, letterSpacing: "0.02em",
        }}>
          {label}{required && <span style={{ color: T.violet, marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none", zIndex: 1,
          }}>{icon}</span>
        )}
        {rows ? (
          <textarea
            placeholder={placeholder} value={value} onChange={onChange} rows={rows}
            onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
            style={inputStyle}
          />
        ) : (
          <input
            type={type} placeholder={placeholder} value={value} onChange={onChange}
            onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
            style={inputStyle}
          />
        )}
      </div>
      {hint && <p style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: T.red, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// Legacy alias
export const NeonInput = Input;
export const GlassCard = Card;

// ── Button ────────────────────────────────────────────────────────────
export function Button({
  children, onClick, type = "button", fullWidth, size = "md",
  loading, disabled, variant = "primary", style = {}
}) {
  const [hov, setHov] = useState(false);
  const sizes = {
    sm:  { padding: "8px 16px",  fontSize: 13, borderRadius: T.r  },
    md:  { padding: "11px 20px", fontSize: 14, borderRadius: T.r  },
    lg:  { padding: "14px 24px", fontSize: 15, borderRadius: T.rMd },
    xl:  { padding: "16px 28px", fontSize: 16, borderRadius: T.rMd },
  };
  const sz = sizes[size];
  const variants = {
    primary:   { background: hov ? "linear-gradient(135deg, #8B5CF6, #3B82F6)" : T.grad, color: "#fff", border: "none", boxShadow: hov ? "0 8px 24px rgba(124,58,237,0.45)" : "0 4px 14px rgba(124,58,237,0.3)" },
    secondary: { background: hov ? T.surfaceLg : T.surfaceMd, color: T.text, border: `1px solid ${hov ? T.borderHov : T.border}`, boxShadow: "none" },
    ghost:     { background: "transparent", color: T.text2, border: "none", boxShadow: "none" },
    danger:    { background: hov ? "rgba(239,68,68,0.2)" : T.redBg, color: T.red, border: `1px solid ${T.redBord}`, boxShadow: "none" },
  };
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontFamily: T.font, fontWeight: 600, letterSpacing: "0.01em",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        ...sz, ...v, ...style,
      }}
    >
      {loading && (
        <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      )}
      {children}
    </button>
  );
}

// Legacy alias
export function GradBtn({ children, onClick, fullWidth, size = "md", loading, type = "button", style = {} }) {
  return <Button onClick={onClick} fullWidth={fullWidth} size={size} loading={loading} type={type} style={style} variant="primary">{children}</Button>;
}

// ── Badge ─────────────────────────────────────────────────────────────
export function Badge({ type }) {
  const isLost = type === "lost";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600,
      background: isLost ? T.redBg : T.greenBg,
      color: isLost ? T.red : T.green,
      border: `1px solid ${isLost ? T.redBord : T.greenBord}`,
    }}>
      <span style={{ fontSize: 8 }}>●</span>
      {isLost ? "Lost" : "Found"}
    </span>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────
const NAV = [
  { id: "home",      label: "Home",    icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { id: "browse",    label: "Browse",  icon: (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  )},
  { id: "report",    label: "Report",  icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  )},
  { id: "ai",        label: "AI",      icon: (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4"/><path d="M20 14a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4 4"/><path d="M8 18a4 4 0 0 1-4-4 4 4 0 0 1 4-4"/>
    </svg>
  )},
  { id: "dashboard", label: "Profile", icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
];

export function BottomNav({ active, setPage }) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,15,0.92)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex", justifyContent: "space-around",
      padding: "10px 0 calc(10px + env(safe-area-inset-bottom))",
    }}>
      {NAV.map(n => {
        const isActive = active === n.id;
        return (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              color: isActive ? "#A78BFA" : "#4A4A5E",
              transition: "color 0.2s",
              padding: "4px 0",
            }}
          >
            {n.icon(isActive)}
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: "0.02em" }}>
              {n.label}
            </span>
            {isActive && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#A78BFA" }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ── Divider ───────────────────────────────────────────────────────────
export function Divider({ label, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0", ...style }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      {label && <span style={{ fontSize: 11, fontWeight: 600, color: T.text3, letterSpacing: "0.05em" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}