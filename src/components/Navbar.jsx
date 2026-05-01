// components/Navbar.jsx
import { useState } from "react";
import { Button } from "./UI";
import { toast } from "../utils/toast";

export function Navbar({ page, setPage, darkMode, toggleDark, user, setUser, savedCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { id: "home",      label: "Home",       icon: "🏠" },
    { id: "browse",    label: "Browse",     icon: "🔍" },
    { id: "report",    label: "Report",     icon: "📝" },
    { id: "ai",        label: "AI Match ✨", icon: "🤖" },
    ...(user ? [{ id: "dashboard", label: "My Items", icon: "👤" }] : []),
  ];

  const navigate = (id) => { setPage(id); setMobileOpen(false); };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--c-surface)", borderBottom: "1px solid var(--c-border)",
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{
          maxWidth: 1140, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", height: 64, gap: 16,
        }}>
          {/* Hamburger (mobile only) */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: "var(--radius-sm)",
              border: "1px solid var(--c-border)", background: "var(--c-surface2)",
              cursor: "pointer", fontSize: 18, display: "none",
              alignItems: "center", justifyContent: "center",
            }}
          >☰</button>

          {/* Logo */}
          <button onClick={() => navigate("home")} style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22,
            background: "none", border: "none", cursor: "pointer",
            color: "var(--c-accent)", letterSpacing: "-0.5px",
            display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
          }}>
            Find<span style={{ color: "var(--c-text)" }}>It</span>
            <span style={{
              fontSize: 9, background: "var(--c-accent)", color: "#fff",
              padding: "2px 6px", borderRadius: 999, fontWeight: 600, marginLeft: 2,
            }}>BETA</span>
          </button>

          {/* Desktop nav links */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 24, flex: 1 }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => navigate(l.id)} style={{
                padding: "6px 14px",
                background: page === l.id ? "var(--c-accent-light)" : "transparent",
                border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
                fontFamily: "var(--font-display)", fontWeight: page === l.id ? 600 : 500,
                fontSize: 14, color: page === l.id ? "var(--c-accent)" : "var(--c-text2)",
                transition: "all var(--transition)", whiteSpace: "nowrap",
              }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            {/* Saved pill */}
            {savedCount > 0 && (
              <button onClick={() => navigate("browse")} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", background: "var(--c-amber-bg)",
                border: "1px solid rgba(180,83,9,0.2)", borderRadius: 999,
                cursor: "pointer", fontSize: 13, color: "var(--c-amber)",
                fontWeight: 600, fontFamily: "var(--font-display)",
              }}>
                🔖 {savedCount}
              </button>
            )}

            {/* Dark mode toggle */}
            <button onClick={toggleDark} style={{
              width: 36, height: 36, borderRadius: "var(--radius-sm)",
              border: "1px solid var(--c-border)", background: "var(--c-surface2)",
              cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {darkMode ? "☀️" : "🌙"}
            </button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg,var(--c-accent),var(--c-accent2))",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                  boxShadow: "0 2px 8px rgba(212,83,26,0.3)",
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span className="hide-mobile" style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text)" }}>
                  {user.name}
                </span>
                <button onClick={() => { setUser(null); toast.info("Signed out."); }} style={{
                  fontSize: 12, color: "var(--c-text3)", background: "none", border: "none", cursor: "pointer",
                }}>
                  Sign out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="ghost" size="sm" onClick={() => navigate("login")}>Login</Button>
                <Button variant="primary" size="sm" onClick={() => navigate("register")}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-drawer">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--c-accent)" }}>FindIt</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--c-text2)" }}>×</button>
            </div>

            {navLinks.map(l => (
              <button key={l.id} onClick={() => navigate(l.id)} style={{
                width: "100%", padding: "12px 14px", marginBottom: 4,
                background: page === l.id ? "var(--c-accent-light)" : "transparent",
                border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15,
                color: page === l.id ? "var(--c-accent)" : "var(--c-text2)",
                textAlign: "left", display: "flex", alignItems: "center", gap: 12,
              }}>
                <span>{l.icon}</span>{l.label}
              </button>
            ))}

            <div style={{ borderTop: "1px solid var(--c-border)", marginTop: 24, paddingTop: 24 }}>
              {user ? (
                <button onClick={() => { setUser(null); setMobileOpen(false); toast.info("Signed out."); }} style={{
                  width: "100%", padding: 12, background: "var(--c-red-bg)",
                  border: "none", borderRadius: "var(--radius-md)",
                  color: "var(--c-red)", cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-display)",
                }}>
                  Sign Out
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Button fullWidth onClick={() => navigate("login")}>Sign In</Button>
                  <Button fullWidth variant="secondary" onClick={() => navigate("register")}>Create Account</Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}