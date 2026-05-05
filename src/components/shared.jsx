// src/components/shared.jsx — CampusFind Design System v4
import { useState } from "react";
import T from "../utils/tokens";

// ── Category Icons (SVG, no emojis) ──────────────────────────────────
export function CategoryIcon({ category, size = 22, color = T.teal }) {
  const icons = {
    "Bags & Wallets": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    "Electronics": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    "Keys": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
      </svg>
    ),
    "ID & Cards": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    "Clothing": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    ),
    "Books & Notes": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    "Accessories": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
      </svg>
    ),
    "Other": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  };
  return icons[category] || icons["Other"];
}

// ── Skeleton loader ───────────────────────────────────────────────────
export function Skeleton({ height = 60, radius = T.r, style = {} }) {
  return (
    <div style={{
      height, borderRadius: radius,
      background: "linear-gradient(90deg, #E0F2FE 25%, #F0F9FF 50%, #E0F2FE 75%)",
      backgroundSize: "800px 100%",
      animation: "shimmer 1.6s ease infinite",
      ...style
    }} />
  );
}

// ── Card ─────────────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick, hover = false, padding = "20px" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: T.rMd,
        padding,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        transform: hov && hover ? "translateY(-3px)" : "none",
        boxShadow: hov && hover ? T.shadowLg : T.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────
export function Input({ label, type = "text", placeholder, value, onChange, icon, rows, hint, error, required }) {
  const [focused, setFoc] = useState(false);
  const inputStyle = {
    width: "100%",
    background: focused ? "#FFFFFF" : T.surfaceMd,
    border: `1.5px solid ${error ? T.redBord : focused ? "#06B6D4" : T.border}`,
    borderRadius: T.r,
    color: T.text,
    fontSize: 14,
    outline: "none",
    boxShadow: focused ? "0 0 0 3px rgba(6,182,212,0.12)" : "none",
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
          color: T.text2, marginBottom: 6, letterSpacing: "0.03em",
        }}>
          {label}{required && <span style={{ color: T.teal, marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none",
            color: focused ? T.teal : T.text3, transition: "color 0.2s",
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
      {hint && <p style={{ fontSize: 11, color: T.text3, marginTop: 5 }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: T.red, marginTop: 5, fontWeight: 500 }}>{error}</p>}
    </div>
  );
}

export const NeonInput = Input;
export const GlassCard = Card;

// ── Button ───────────────────────────────────────────────────────────
export function Button({ children, onClick, type = "button", fullWidth, size = "md", loading, disabled, variant = "primary", style = {} }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sizes = {
    sm: { padding: "7px 14px",  fontSize: 12, borderRadius: T.r   },
    md: { padding: "10px 20px", fontSize: 14, borderRadius: T.r   },
    lg: { padding: "13px 24px", fontSize: 15, borderRadius: T.rMd },
    xl: { padding: "15px 28px", fontSize: 16, borderRadius: T.rMd },
  };
  const sz = sizes[size];

  const variants = {
    primary: {
      background: T.grad,
      color: "#fff",
      border: "none",
      boxShadow: hov ? "0 8px 24px rgba(8,145,178,0.40)" : "0 3px 10px rgba(8,145,178,0.25)",
    },
    secondary: {
      background: hov ? "#EFF6FF" : T.surface,
      color: T.teal,
      border: `1.5px solid ${hov ? T.borderHov : T.border}`,
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      color: T.text2,
      border: "none",
      boxShadow: "none",
    },
    danger: {
      background: hov ? "#FEE2E2" : T.redBg,
      color: T.red,
      border: `1.5px solid ${T.redBord}`,
      boxShadow: "none",
    },
  };
  const v = variants[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontFamily: T.font, fontWeight: 600, letterSpacing: "0.01em",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
        transform: pressed ? "scale(0.97)" : hov ? "translateY(-1px)" : "none",
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

export function GradBtn({ children, onClick, fullWidth, size = "md", loading, type = "button", style = {} }) {
  return <Button onClick={onClick} fullWidth={fullWidth} size={size} loading={loading} type={type} style={style} variant="primary">{children}</Button>;
}

// ── Badge ────────────────────────────────────────────────────────────
export function Badge({ type }) {
  const isLost = type === "lost";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
      background: isLost ? T.redBg : T.greenBg,
      color: isLost ? T.red : T.green,
      border: `1px solid ${isLost ? T.redBord : T.greenBord}`,
      letterSpacing: "0.03em",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: isLost ? T.red : T.green, display: "inline-block" }} />
      {isLost ? "Lost" : "Found"}
    </span>
  );
}

// ── Score Pill ───────────────────────────────────────────────────────
export function ScorePill({ score }) {
  const color = score >= 80 ? T.green : score >= 60 ? T.teal : score >= 40 ? T.amber : T.text3;
  const bg    = score >= 80 ? T.greenBg : score >= 60 ? "#E0F2FE" : score >= 40 ? T.amberBg : T.surfaceMd;
  const bord  = score >= 80 ? T.greenBord : score >= 60 ? T.borderHov : score >= 40 ? T.amberBord : T.border;
  return (
    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: bg, color, border: `1px solid ${bord}` }}>
      {score}%
    </span>
  );
}

// ── Bottom Nav ───────────────────────────────────────────────────────
const NAV = [
  { id: "home", label: "Home", icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { id: "browse", label: "Browse", icon: (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  )},
  { id: "report", label: "Report", icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  )},
  { id: "ai", label: "AI Match", icon: (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z"/>
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
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderTop: "1px solid #DBEAFE",
      display: "flex", justifyContent: "space-around",
      padding: "8px 0 calc(8px + env(safe-area-inset-bottom))",
      boxShadow: "0 -4px 24px rgba(14,116,144,0.08)",
    }}>
      {NAV.map(n => {
        const isActive = active === n.id;
        return (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3,
              background: "none", border: "none", cursor: "pointer",
              color: isActive ? "#0891B2" : "#94A3B8",
              transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
              padding: "4px 0",
              transform: isActive ? "scale(1.05)" : "scale(1)",
            }}
          >
            {n.icon(isActive)}
            <span style={{
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              letterSpacing: "0.03em",
              transition: "color 0.2s",
            }}>
              {n.label}
            </span>
            <div style={{
              width: isActive ? 18 : 0, height: 3, borderRadius: 99,
              background: "#0891B2", transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
            }} />
          </button>
        );
      })}
    </nav>
  );
}

// ── Divider ──────────────────────────────────────────────────────────
export function Divider({ label, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0", ...style }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      {label && <span style={{ fontSize: 11, fontWeight: 600, color: T.text3, letterSpacing: "0.06em" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────────
export function SectionHeader({ title, action, actionLabel }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px", color: T.text }}>{title}</h2>
      {action && (
        <button onClick={action} style={{ background: "none", border: "none", color: T.teal, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.font }}>
          {actionLabel || "View all"} →
        </button>
      )}
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────
export function EmptyState({ title, subtitle, icon, action, actionLabel }) {
  return (
    <div style={{ textAlign: "center", padding: "52px 24px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.rLg, animation: "scaleIn 0.3s ease both" }}>
      {icon && <div style={{ fontSize: 42, marginBottom: 14, opacity: 0.6 }}>{icon}</div>}
      <p style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 6 }}>{title}</p>
      {subtitle && <p style={{ color: T.text2, fontSize: 13, lineHeight: 1.6 }}>{subtitle}</p>}
      {action && (
        <Button onClick={action} size="sm" style={{ marginTop: 18 }}>{actionLabel || "Get Started"}</Button>
      )}
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────
export function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: T.rMd, padding: "18px 14px",
      textAlign: "center", boxShadow: T.shadow,
      transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = T.shadowMd; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = T.shadow; }}
    >
      {icon && <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>}
      <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div style={{ fontSize: 11, color: T.text3, fontWeight: 600, marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}