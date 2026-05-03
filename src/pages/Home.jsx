// src/pages/Home.jsx
import { useState, useEffect, useCallback } from "react";
import T from "../utils/tokens";
import { Card, Badge, Skeleton, BottomNav } from "../components/shared";
import api from "../utils/api";

const EMOJI = { "Bags & Wallets": "🎒", Electronics: "📱", Keys: "🔑", "ID & Cards": "🪪", Clothing: "👕", "Books & Notes": "📚", Accessories: "💍", Other: "📦" };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Home({ setPage }) {
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ lost: 0, found: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/items?limit=5").catch(() => ({ data: {} })),
      api.get("/items/stats").catch(() => ({ data: {} })),
    ]).then(([itemsRes, statsRes]) => {
      // Backend returns { success, data: [...] }
      const itemsData = itemsRes.data;
      let arr = [];
      if (Array.isArray(itemsData?.data)) arr = itemsData.data;
      else if (Array.isArray(itemsData)) arr = itemsData;
      setRecent(arr);
      // Backend returns { success, data: { total, lost, found, reunited } }
      const s = statsRes.data?.data || {};
      setStats({ lost: s.lost || 0, found: s.found || 0, resolved: s.reunited || 0 });
      setLoading(false);
    });
  }, []);

  const STATS = [
    { label: "Lost Items", value: stats.lost, color: T.red, bg: T.redBg },
    { label: "Found Items", value: stats.found, color: T.green, bg: T.greenBg },
    { label: "Reunited", value: stats.resolved, color: "#A78BFA", bg: "rgba(124,58,237,0.1)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, paddingBottom: 90 }}>

      {/* Hero */}
      <section style={{
        padding: "56px 20px 48px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
        maxWidth: 680, margin: "0 auto",
      }}>
        {/* Bg glow */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 999,
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)",
            fontSize: 12, fontWeight: 600, color: "#A78BFA",
            marginBottom: 20, animation: "fadeUp 0.5s ease both",
          }}>
            <span style={{ fontSize: 8 }}>●</span> AI-Powered Campus Lost & Found
          </span>

          <h1 style={{
            fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 900,
            lineHeight: 1.1, letterSpacing: "-2px",
            marginBottom: 16, animation: "fadeUp 0.5s ease 0.05s both",
          }}>
            Find what was{" "}
            <span style={{
              background: T.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>lost</span>
            <br />Return what was found
          </h1>

          <p style={{
            color: T.text2, fontSize: 16, lineHeight: 1.6,
            maxWidth: 440, margin: "0 auto 32px",
            animation: "fadeUp 0.5s ease 0.1s both",
          }}>
            CampusFind uses AI to instantly match lost items with found reports across your entire campus.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.5s ease 0.15s both" }}>
            <button onClick={() => setPage("report")} style={{
              padding: "13px 28px", borderRadius: T.rMd, border: "none",
              background: T.grad, color: "#fff",
              fontFamily: T.font, fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              Report an Item
            </button>
            <button onClick={() => setPage("browse")} style={{
              padding: "13px 28px", borderRadius: T.rMd,
              background: T.surface, border: `1px solid ${T.border}`,
              color: T.text, fontFamily: T.font, fontWeight: 600, fontSize: 15, cursor: "pointer",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = T.surfaceMd; e.currentTarget.style.borderColor = T.borderHov; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; }}
            >
              Browse Items
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32, animation: "fadeUp 0.5s ease 0.2s both" }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: T.rMd, padding: "16px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, letterSpacing: "-1px" }}>
                {loading ? "—" : s.value}
              </div>
              <div style={{ fontSize: 11, color: T.text3, fontWeight: 600, marginTop: 2, letterSpacing: "0.04em" }}>
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* AI Banner */}
        <div onClick={() => setPage("ai")} style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: T.rLg, padding: "20px",
          display: "flex", alignItems: "center", gap: 16,
          cursor: "pointer", marginBottom: 32,
          transition: "all 0.2s",
          animation: "fadeUp 0.5s ease 0.25s both",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)"}
        >
          <div style={{
            width: 48, height: 48, borderRadius: T.rMd, flexShrink: 0,
            background: T.grad, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22,
            boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
          }}>✨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>AI Instant Match</div>
            <div style={{ fontSize: 13, color: T.text2 }}>Describe your item — our AI finds matches in seconds</div>
          </div>
          <span style={{ color: T.text3, fontSize: 20 }}>›</span>
        </div>

        {/* Recent Activity */}
        <section style={{ animation: "fadeUp 0.5s ease 0.3s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>Recent Activity</h2>
            <button onClick={() => setPage("browse")} style={{
              background: "none", border: "none", color: "#A78BFA",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.font,
            }}>View all →</button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3, 4].map(i => <Skeleton key={i} height={80} />)}
            </div>
          ) : recent.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 20px",
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: T.rLg,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No items yet</p>
              <p style={{ color: T.text2, fontSize: 13 }}>Be the first to report a lost or found item</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recent.map(item => {
                const emoji = EMOJI[item.category] || "📦";
                return (
                  <Card key={item._id} hover onClick={() => setPage("browse")} padding="16px">
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: T.rMd, flexShrink: 0,
                        background: item.type === "lost" ? T.redBg : T.greenBg,
                        border: `1px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                      }}>{emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <Badge type={item.type} />
                          <span style={{ fontSize: 11, color: T.text3 }}>{timeAgo(item.createdAt || item.date)}</span>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: T.text2 }}>📍 {
                          item.building ||
                          (typeof item.location === "object" && item.location !== null
                            ? item.location.building || item.location.specificArea || "Campus"
                            : item.location) ||
                          "Campus"
                        }</p>
                      </div>
                      <span style={{ color: T.text3, fontSize: 18, flexShrink: 0 }}>›</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BottomNav active="home" setPage={setPage} />
    </div>
  );
}