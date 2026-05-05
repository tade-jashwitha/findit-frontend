// src/components/SplashScreen.jsx
import { useEffect } from "react";
import { wakeUpBackend } from "../utils/api";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    wakeUpBackend(); // Wake Render backend during splash to prevent cold-start timeout
    const t = setTimeout(onFinish, 2400);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(160deg, #0C4A6E 0%, #0E7490 45%, #06B6D4 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Dot grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="splash-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#splash-dots)" />
      </svg>

      {/* Glow rings */}
      <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", border: "1px solid rgba(103,232,249,0.12)", animation: "pulse 2.5s ease infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(103,232,249,0.18)", animation: "pulse 2s ease 0.4s infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 500, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo icon */}
      <div style={{ animation: "scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both", position: "relative", zIndex: 1 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 26,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 16px 48px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
          animation: "float 3s ease-in-out infinite",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <h1 style={{
        marginTop: 22, fontSize: 34, fontWeight: 900,
        letterSpacing: "-1.5px", color: "white",
        animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both",
        position: "relative", zIndex: 1,
      }}>
        Campus<span style={{ background: "linear-gradient(135deg, #A5F3FC, #67E8F9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Find</span>
      </h1>

      <p style={{
        marginTop: 8, fontSize: 12, fontWeight: 600,
        color: "rgba(255,255,255,0.55)", letterSpacing: "0.18em", textTransform: "uppercase",
        animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both",
        position: "relative", zIndex: 1,
      }}>
        AI-Powered Lost & Found
      </p>

      {/* Loading dots */}
      <div style={{
        marginTop: 52, display: "flex", gap: 8,
        animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both",
        position: "relative", zIndex: 1,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#67E8F9",
            animation: `dotBounce 1.2s ease ${i * 0.2}s infinite`,
            boxShadow: "0 0 8px rgba(103,232,249,0.5)",
          }} />
        ))}
      </div>

      {/* Version */}
      <p style={{ position: "absolute", bottom: 28, fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500, letterSpacing: "0.06em" }}>
        v2.0 · Campus Edition
      </p>
    </div>
  );
}