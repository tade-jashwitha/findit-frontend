// src/pages/Welcome.jsx

/* ─── Grid Pattern ─── */
function GridPattern() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* ─── Highly Creative Floating Icon Scene ─── */
function FloatingIcons() {
  const icons = [
    { path: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0", angle: 0, color: "#67E8F9", size: 36, delay: "0s" },
    { path: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4", angle: 72, color: "#67E8F9", size: 32, delay: "0.2s" },
    { path: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", angle: 144, color: "#67E8F9", size: 30, delay: "0.4s" },
    { path: "M9 21h6 M12 17v4 M12 3a8 8 0 1 0 5 14.36", angle: 216, color: "#67E8F9", size: 30, delay: "0.6s" },
    { path: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", angle: 288, color: "#67E8F9", size: 28, delay: "0.8s" },
  ];

  return (
    <div style={{ position: "relative", width: 280, height: 260, margin: "0 auto" }}>
      <style>{`
        @keyframes orbitSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverseOrbit {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sonarRipple {
          0% { transform: scale(0.8); opacity: 0.8; border-width: 4px; }
          100% { transform: scale(2.8); opacity: 0; border-width: 0px; }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(34,211,238,0.6)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 30px rgba(34,211,238,1)); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      
      {/* Central Search Container */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 90, height: 90 }}>
        
        {/* Radar Sweep Effect */}
        <div style={{
          position: "absolute", inset: -70, borderRadius: "50%",
          background: "conic-gradient(from 0deg, transparent 70%, rgba(34,211,238,0.2) 90%, rgba(34,211,238,0.6) 100%)",
          animation: "radarSweep 4s linear infinite",
          maskImage: "radial-gradient(circle, transparent 30%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 30%, black 100%)",
        }} />

        {/* Sonar Ripples */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "solid rgba(34,211,238,0.8)", animation: "sonarRipple 3s cubic-bezier(0.1, 0.5, 0.9, 0.2) infinite" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "solid rgba(34,211,238,0.8)", animation: "sonarRipple 3s cubic-bezier(0.1, 0.5, 0.9, 0.2) 1.5s infinite" }} />

        {/* Orbiting dashed tech rings */}
        <div style={{ position: "absolute", inset: -40, borderRadius: "50%", border: "2px dashed rgba(103,232,249,0.2)", animation: "orbitSlow 25s linear infinite" }} />
        <div style={{ position: "absolute", inset: -70, borderRadius: "50%", border: "1px dashed rgba(103,232,249,0.15)", animation: "reverseOrbit 35s linear infinite" }} />

        {/* The glowing central core (Search Icon) */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.2), rgba(6,182,212,0.05))",
          border: "2px solid rgba(103,232,249,0.8)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "corePulse 2s ease-in-out infinite",
          boxShadow: "inset 0 0 20px rgba(6,182,212,0.5)",
          zIndex: 10,
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A5F3FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>

        {/* Orbiting Icons & Laser Tethers */}
        <div style={{ position: "absolute", inset: 0, animation: "orbitSlow 30s linear infinite" }}>
          {icons.map(({ path, angle, color, size, delay }, i) => {
            const radius = 100; // Orbit radius
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <div key={i}>
                {/* Laser Tether Line */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: radius - 10, height: 1.5,
                  background: "linear-gradient(90deg, rgba(34,211,238,0.1), rgba(34,211,238,0.6))",
                  transformOrigin: "0% 50%",
                  transform: `translateY(-50%) rotate(${angle}deg)`,
                }} />

                {/* The Floating SVG Icon */}
                <div style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}>
                  <div style={{
                    // Reverse orbit to keep icon upright, plus a bounce float
                    animation: `reverseOrbit 30s linear infinite, float 2.5s ease-in-out ${delay} infinite`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(103,232,249,0.4)",
                    borderRadius: "50%", width: 52, height: 52,
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 0 15px rgba(6,182,212,0.3)",
                  }}>
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={path} />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Twinkling background stars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`star-${i}`} style={{
          position: "absolute",
          top: `${10 + Math.random() * 80}%`,
          left: `${10 + Math.random() * 80}%`,
          width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
          background: "#A5F3FC", borderRadius: "50%",
          boxShadow: "0 0 8px #A5F3FC",
          animation: `starTwinkle ${1.5 + Math.random() * 2}s infinite ${Math.random()}s`,
        }} />
      ))}
    </div>
  );
}

export default function Welcome({ setPage }) {
  return (
    /* ── Full-screen gradient background ── */
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #1E293B 0%, #173855 40%, #0E7490 80%, #06B6D4 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 0 52px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <GridPattern />

      {/* Glow blobs */}
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 500, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "8%", right: "-8%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,116,144,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── Top section ── */}
      <div style={{ textAlign: "center", paddingTop: 64, position: "relative", zIndex: 1, animation: "fadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(15,23,42,0.4)", border: "1px solid rgba(103,232,249,0.4)",
          borderRadius: 8, padding: "6px 14px",
          fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
          color: "#A5F3FC", textTransform: "uppercase", marginBottom: 24,
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22D3EE", boxShadow: "0 0 8px #22D3EE", animation: "pulse 2s infinite" }} />
          Campus Lost & Found
        </div>

        <h1 style={{
          fontSize: "clamp(38px, 9vw, 52px)",
          fontWeight: 900, color: "white",
          letterSpacing: "-1px", lineHeight: 1.05, marginBottom: 12,
          textShadow: "0 10px 30px rgba(0,0,0,0.5)",
          fontFamily: "'Inter', sans-serif",
        }}>
          Welcome to<br />
          <span style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #A5F3FC 40%, #06B6D4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 16px rgba(6,182,212,0.4))",
            display: "inline-block", marginTop: 4,
          }}>
            CampusFind
          </span>
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.6, maxWidth: 300, margin: "0 auto", fontWeight: 400, letterSpacing: "0.2px"
        }}>
          Lost something on campus?<br />
          We'll help you <strong style={{ color: "#67E8F9", fontWeight: 700, textShadow: "0 0 12px rgba(103,232,249,0.5)" }}>find it fast</strong>.
        </p>
      </div>

      {/* ── Graphic scene ── */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "center", padding: "12px 0 20px" }}>
        <FloatingIcons />
      </div>

      {/* ── Buttons (Side by Side Modern Layout) ── */}
      <div style={{ width: "100%", maxWidth: 380, padding: "0 24px", position: "relative", zIndex: 1, display: "flex", gap: 14, animation: "fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s both" }}>
        
        <button
          onClick={() => setPage("login")}
          style={{
            flex: 1, padding: "16px 0", borderRadius: 16,
            background: "rgba(15,23,42,0.5)", border: "1px solid rgba(103,232,249,0.25)",
            color: "#A5F3FC", fontSize: 14, fontWeight: 700,
            cursor: "pointer", backdropFilter: "blur(12px)",
            transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,23,42,0.8)"; e.currentTarget.style.borderColor = "rgba(103,232,249,0.6)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,23,42,0.5)"; e.currentTarget.style.borderColor = "rgba(103,232,249,0.25)"; e.currentTarget.style.transform = "none"; }}
        >
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(103,232,249,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          Log In
        </button>

        <button
          onClick={() => setPage("register")}
          style={{
            flex: 1, padding: "16px 0", borderRadius: 16,
            background: "linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(6,182,212,0.5) 100%)",
            border: "1px solid rgba(103,232,249,0.6)",
            color: "#FFFFFF", fontSize: 14, fontWeight: 700,
            cursor: "pointer", backdropFilter: "blur(12px)",
            transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
            boxShadow: "0 8px 32px rgba(6,182,212,0.3)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(6,182,212,0.5)"; e.currentTarget.style.borderColor = "#FFFFFF"; e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(6,182,212,0.3)"; e.currentTarget.style.borderColor = "rgba(103,232,249,0.6)"; e.currentTarget.style.transform = "none"; }}
        >
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          Create Account
        </button>
        
      </div>
    </div>
  );
}
