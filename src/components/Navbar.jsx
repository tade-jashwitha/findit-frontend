// src/components/Navbar.jsx — with notification bell
import { useState, useEffect } from "react";
import AILogo from "./AILogo";
import T from "../utils/tokens";
import { notificationsAPI } from "../utils/api";

const LINKS = [
  { id: "home",      label: "Home"     },
  { id: "browse",    label: "Browse"   },
  { id: "report",    label: "Report"   },
  { id: "ai",        label: "AI Match" },
  { id: "dashboard", label: "Profile"  },
];

export function Navbar({ page, setPage, user, setUser }) {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [notifs,       setNotifs]       = useState([]);

  // Fetch unread count when user is logged in
  useEffect(() => {
    if (!user) { setUnreadCount(0); setNotifs([]); return; }
    const fetchNotifs = async () => {
      try {
        const res = await notificationsAPI.getAll();
        setNotifs(res.data?.data || []);
        setUnreadCount(res.data?.unreadCount || 0);
      } catch { /* silent */ }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  const openNotifs = async () => {
    setNotifOpen(n => !n);
    if (!notifOpen && unreadCount > 0) {
      try {
        await notificationsAPI.readAll();
        setUnreadCount(0);
        setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      } catch { /* silent */ }
    }
  };

  const go = (id) => {
    if ((id === "report" || id === "dashboard") && !user) { setPage("login"); }
    else setPage(id);
    setMenuOpen(false);
    setNotifOpen(false);
  };

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 200,
      background: "rgba(255,255,255,0.85)",
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
            background: page === l.id ? "rgba(6,182,212,0.12)" : "transparent",
            color: page === l.id ? "#0891B2" : T.text2,
            fontWeight: page === l.id ? 600 : 500, fontSize: 14, cursor: "pointer",
            transition: "all 0.15s",
          }}>
            {l.label}
          </button>
        ))}
      </nav>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, position: "relative" }}>

        {/* 🔔 Notification Bell — only for logged-in users */}
        {user && (
          <div style={{ position: "relative" }}>
            <button onClick={openNotifs} style={{
              width: 36, height: 36, borderRadius: T.r, border: `1px solid ${T.border}`,
              background: notifOpen ? "rgba(6,182,212,0.12)" : "transparent",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, position: "relative", transition: "all 0.15s",
            }}>
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  background: T.red, color: "#fff",
                  fontSize: 10, fontWeight: 800,
                  width: 16, height: 16, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `2px solid ${T.bg}`,
                }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div style={{
                position: "absolute", top: 44, right: 0,
                width: 300, background: T.surface,
                border: `1px solid ${T.border}`, borderRadius: T.rMd,
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                zIndex: 300, overflow: "hidden",
              }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>Notifications</p>
                  {notifs.length > 0 && (
                    <button onClick={() => { setNotifs([]); setNotifOpen(false); }} style={{
                      background: "none", border: "none", color: T.text3, fontSize: 11, cursor: "pointer",
                    }}>Clear all</button>
                  )}
                </div>

                <div style={{ maxHeight: 320, overflowY: "auto" }}>
                  {notifs.length === 0 ? (
                    <div style={{ padding: "32px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                      <p style={{ fontSize: 13, color: T.text3 }}>No notifications yet</p>
                    </div>
                  ) : (
                    notifs.map(n => (
                      <div key={n._id} style={{
                        padding: "12px 16px",
                        background: n.read ? "transparent" : "rgba(6,182,212,0.06)",
                        borderBottom: `1px solid ${T.border}`,
                        cursor: "pointer",
                      }}
                        onClick={() => { setNotifOpen(false); setPage("browse"); }}
                      >
                        <p style={{ fontSize: 13, lineHeight: 1.5, color: n.read ? T.text2 : T.text }}>
                          {n.message}
                        </p>
                        <p style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                        {!n.read && (
                          <span style={{
                            display: "inline-block", width: 6, height: 6,
                            borderRadius: "50%", background: "#0891B2",
                            marginTop: 4,
                          }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {user ? (
          <>
            <button onClick={() => go("dashboard")} style={{
              width: 34, height: 34, borderRadius: "50%",
              background: T.grad, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
              boxShadow: "0 2px 8px rgba(6,182,212,0.4)",
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
              boxShadow: "0 4px 14px rgba(6,182,212,0.35)",
            }}>Get started</button>
          </>
        )}
      </div>

      {/* Click-outside to close notification dropdown */}
      {notifOpen && (
        <div
          onClick={() => setNotifOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 299 }}
        />
      )}

      <style>{`
        @media (min-width: 768px) { .desktop-only { display: flex !important; } }
        @media (max-width: 767px) { .desktop-only { display: none !important; } }
      `}</style>
    </header>
  );
}