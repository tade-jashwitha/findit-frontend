// components/UI.jsx — Button, Input, Select, Textarea, Card, Badge, Spinner, Skeleton, EmptyState
import { useState } from "react";

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, color = "var(--c-accent)" }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid ${color}30`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      flexShrink: 0,
    }} />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ w = "100%", h = 16, r = "var(--radius-sm)", style: s }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg, var(--c-surface2) 25%, var(--c-surface3) 50%, var(--c-surface2) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.6s ease infinite",
      ...s,
    }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--radius-lg)", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <Skeleton w={52} h={52} r="var(--radius-md)" />
        <Skeleton w={60} h={22} r={999} />
      </div>
      <Skeleton h={18} style={{ marginBottom: 8 }} />
      <Skeleton h={13} style={{ marginBottom: 6 }} />
      <Skeleton h={13} w="75%" style={{ marginBottom: 16 }} />
      <Skeleton h={11} w="50%" style={{ marginBottom: 6 }} />
      <Skeleton h={11} w="40%" />
      <div style={{ borderTop: "1px solid var(--c-border)", marginTop: 14, paddingTop: 12 }}>
        <Skeleton h={13} w="30%" />
      </div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "default" }) {
  const V = {
    lost:    { bg: "var(--c-red-bg)",    color: "var(--c-red)",   border: "rgba(185,28,28,0.2)" },
    found:   { bg: "var(--c-green-bg)",  color: "var(--c-green)", border: "rgba(21,128,61,0.2)" },
    claimed: { bg: "var(--c-amber-bg)",  color: "var(--c-amber)", border: "rgba(180,83,9,0.2)" },
    ai:      { bg: "var(--c-blue-bg)",   color: "var(--c-blue)",  border: "rgba(29,78,216,0.2)" },
    default: { bg: "var(--c-surface2)", color: "var(--c-text2)", border: "var(--c-border)" },
  };
  const v = V[variant] || V.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
      background: v.bg, color: v.color, border: `1px solid ${v.border}`,
      fontFamily: "var(--font-display)",
    }}>
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", loading, onClick, disabled, type = "button", fullWidth, icon, style: ex }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "var(--font-display)", fontWeight: 600, cursor: "pointer",
    border: "none", borderRadius: "var(--radius-md)", transition: "all var(--transition)",
    outline: "none", userSelect: "none",
    ...(fullWidth && { width: "100%" }),
    ...(size === "sm" && { padding: "8px 16px", fontSize: 13 }),
    ...(size === "md" && { padding: "12px 24px", fontSize: 14 }),
    ...(size === "lg" && { padding: "15px 32px", fontSize: 15 }),
    ...((disabled || loading) && { opacity: 0.65, cursor: "not-allowed" }),
  };
  const V = {
    primary:   { background: "var(--c-accent)", color: "#fff" },
    secondary: { background: "var(--c-surface2)", color: "var(--c-text)", border: "1.5px solid var(--c-border2)" },
    ghost:     { background: "transparent", color: "var(--c-text2)", border: "1.5px solid var(--c-border)" },
    danger:    { background: "var(--c-red-bg)", color: "var(--c-red)", border: "1.5px solid rgba(185,28,28,0.2)" },
    accent:    { background: "linear-gradient(135deg,var(--c-accent),var(--c-accent2))", color: "#fff" },
  };
  const isElevated = (variant === "primary" || variant === "accent") && hov && !disabled && !loading;
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...base, ...V[variant],
        transform: hov && !disabled && !loading ? "translateY(-2px)" : "none",
        boxShadow: isElevated ? "var(--shadow-accent)" : "var(--shadow-sm)",
        ...ex,
      }}>
      {loading ? <Spinner size={16} color={variant === "primary" || variant === "accent" ? "#fff" : "var(--c-accent)"} /> : icon}
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, icon, hint, ...props }) {
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text2)", fontFamily: "var(--font-display)" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: foc ? "var(--c-accent)" : "var(--c-text3)",
            fontSize: 16, pointerEvents: "none", transition: "color var(--transition)",
          }}>{icon}</span>
        )}
        <input {...props}
          onFocus={e => { setFoc(true); props.onFocus && props.onFocus(e); }}
          onBlur={e => { setFoc(false); props.onBlur && props.onBlur(e); }}
          style={{
            width: "100%", padding: icon ? "10px 14px 10px 40px" : "10px 14px",
            background: "var(--c-surface)",
            border: `1.5px solid ${error ? "var(--c-red)" : foc ? "var(--c-accent)" : "var(--c-border2)"}`,
            borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--c-text)",
            fontFamily: "var(--font-body)", outline: "none",
            boxShadow: foc ? "0 0 0 3px rgba(212,83,26,0.10)" : "none",
            transition: "all var(--transition)",
            ...props.style,
          }}
        />
      </div>
      {hint && !error && <span style={{ fontSize: 12, color: "var(--c-text3)" }}>{hint}</span>}
      {error && <span style={{ fontSize: 12, color: "var(--c-red)", display: "flex", alignItems: "center", gap: 4 }}>⚠ {error}</span>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, options, error, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text2)", fontFamily: "var(--font-display)" }}>{label}</label>}
      <select {...props} style={{
        padding: "10px 14px", background: "var(--c-surface)",
        border: `1.5px solid ${error ? "var(--c-red)" : "var(--c-border2)"}`,
        borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--c-text)",
        fontFamily: "var(--font-body)", outline: "none", cursor: "pointer",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <span style={{ fontSize: 12, color: "var(--c-red)" }}>⚠ {error}</span>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, error, hint, ...props }) {
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text2)", fontFamily: "var(--font-display)" }}>{label}</label>}
      <textarea {...props}
        onFocus={() => setFoc(true)}
        onBlur={() => setFoc(false)}
        style={{
          width: "100%", padding: "10px 14px",
          background: "var(--c-surface)",
          border: `1.5px solid ${error ? "var(--c-red)" : foc ? "var(--c-accent)" : "var(--c-border2)"}`,
          borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--c-text)",
          fontFamily: "var(--font-body)", outline: "none", resize: "vertical", minHeight: 100,
          boxShadow: foc ? "0 0 0 3px rgba(212,83,26,0.10)" : "none",
          transition: "all var(--transition)",
          ...props.style,
        }}
      />
      {hint && !error && <span style={{ fontSize: 12, color: "var(--c-text3)" }}>{hint}</span>}
      {error && <span style={{ fontSize: 12, color: "var(--c-red)" }}>⚠ {error}</span>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick, hover = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: "var(--c-surface)",
        border: `1px solid ${hov ? "var(--c-border2)" : "var(--c-border)"}`,
        borderRadius: "var(--radius-lg)", overflow: "hidden",
        transition: "all var(--transition)",
        cursor: onClick ? "pointer" : "default",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "var(--shadow-md)" : "var(--shadow-sm)",
        ...style,
      }}>
      {children}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 24px" }} className="fade-up">
      <div style={{ fontSize: 64, marginBottom: 16, animation: "float 3s ease infinite" }}>{icon}</div>
      <h3 style={{ fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--c-text)", marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--c-text2)", marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>{subtitle}</p>
      {action}
    </div>
  );
}