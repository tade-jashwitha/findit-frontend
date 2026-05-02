// src/components/Navbar.jsx — Top navigation bar
import { useState } from "react";
import AILogo from "./AILogo";
import T from "../utils/tokens";

const LINKS = [
  { id: "home",      label: "Home"     },
  { id: "browse",    label: "Browse"   },
  { id: "report",    label: "Report"   },
  { id: "ai",        label: "AI Match" },
  { id: "dashboard", label: "Profile"  },
];

export function Navbar({ page, setPage, user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id) => {
    if ((id === "report" || id === "dashboard") && !user) { setPage("login"); }
    else setPage(id);
    setMenuOpen(false);
  };

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 200,
      background: "rgba(10,10,15,0.85)",
      backdropFilter: "blur(24px)",
      borderBottom: `1px solid ${T.border}`,
      height: 60,
      display: "flex", alignItems: "center",
      padding: "0 24px",
    }}>
      {/* Logo */}
      <button onClick={() => go("home")} style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "none", border: "none", cursor: "pointer", padding: 0,
      }}>
        <AILogo size={32} />
        <span style={{
          fontWeight: 800, fontSize: 17, letterSpacing: "-0.5px",
          background: T.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>CampusFind</span>
      </button>

      {/* Desktop nav */}
      <nav style={{ display: "flex", gap: 2, marginLeft: 32, flex: 1 }} className="desktop-only">
        {LINKS.map(l => (
          <button key={l.id} onClick={() => go(l.id)} style={{
            padding: "6px 14px", borderRadius: T.r, border: "none",
            background: page === l.id ? "rgba(124,58,237,0.12)" : "transparent",
            color: page === l.id ? "#A78BFA" : T.text2,
            fontWeight: page === l.id ? 600 : 500, fontSize: 14, cursor: "pointer",
            transition: "all 0.15s",
          }}>
            {l.label}
          </button>
        ))}
      </nav>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        {user ? (
          <>
            <button onClick={() => go("dashboard")} style={{
              width: 34, height: 34, borderRadius: "50%",
              background: T.grad, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
              boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
            }}>
              {user.picture
                ? <img src={user.picture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                : <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{user.name?.[0]?.toUpperCase()}</span>
              }
            </button>
            <button onClick={() => setUser(null)} style={{
              padding: "6px 14px", borderRadius: T.r,
              background: "transparent", border: `1px solid ${T.border}`,
              color: T.text2, fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "all 0.15s",
            }}>Sign out</button>
          </>
        ) : (
          <>
            <button onClick={() => go("login")} style={{
              padding: "6px 16px", borderRadius: T.r,
              background: "transparent", border: `1px solid ${T.border}`,
              color: T.text, fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>Sign in</button>
            <button onClick={() => go("register")} style={{
              padding: "6px 16px", borderRadius: T.r, border: "none",
              background: T.grad, color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
            }}>Get started</button>
          </>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) { .desktop-only { display: flex !important; } }
        @media (max-width: 767px) { .desktop-only { display: none !important; } }
      `}</style>
    </header>
  );
}