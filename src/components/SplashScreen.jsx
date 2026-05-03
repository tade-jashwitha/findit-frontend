// src/components/SplashScreen.jsx
import AILogo from "./AILogo";
import T from "../utils/tokens";
import { useEffect } from "react";
import { wakeUpBackend } from "../utils/api";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    wakeUpBackend(); // 🔥 Wake Render backend during splash (prevents cold-start timeout)
    const t = setTimeout(onFinish, 2200);
    return () => clearTimeout(t);
  }, [onFinish]);


  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: T.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)",
      }} />

      {/* Purple glow */}
      <div style={{
        position: "absolute",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
        animation: "pulse 2s ease infinite",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{ animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
        <AILogo size={72} />
      </div>

      {/* Brand */}
      <h1 style={{
        marginTop: 20,
        fontSize: 32, fontWeight: 900, letterSpacing: "-1.5px",
        background: T.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both",
      }}>CampusFind</h1>

      <p style={{
        marginTop: 8, fontSize: 13, fontWeight: 500,
        color: T.text3, letterSpacing: "0.15em", textTransform: "uppercase",
        animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both",
      }}>AI-Powered Lost & Found</p>

      {/* Loader dots */}
      <div style={{
        marginTop: 48, display: "flex", gap: 8,
        animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#7C3AED",
            animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}