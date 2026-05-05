// src/pages/Home.jsx
import { useState, useEffect } from "react";
import T from "../utils/tokens";
import { Card, Badge, Skeleton, BottomNav, SectionHeader, EmptyState, StatCard, CategoryIcon } from "../components/shared";
import api from "../utils/api";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getLocationStr(item) {
  if (item.building) return item.building;
  if (typeof item.location === "object" && item.location)
    return item.location.building || item.location.specificArea || "Campus";
  return item.location || "Campus";
}

export default function Home({ setPage }) {
  const [recent, setRecent]   = useState([]);
  const [stats, setStats]     = useState({ lost: 0, found: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/items?limit=5").catch(() => ({ data: {} })),
      api.get("/items/stats").catch(() => ({ data: {} })),
    ]).then(([itemsRes, statsRes]) => {
      const d = itemsRes.data;
      setRecent(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      const s = statsRes.data?.data || {};
      setStats({ lost: s.lost || 0, found: s.found || 0, resolved: s.reunited || 0 });
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, paddingBottom: 90 }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        padding: "52px 24px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 100%)",
        borderBottom: "1px solid #DBEAFE",
      }}>
        {/* Subtle wave decoration */}
        <div style={{
          position: "absolute", bottom: -1, left: 0, right: 0, height: 4,
          background: "linear-gradient(90deg, #BAE6FD, #7DD3FC, #BAE6FD)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s ease infinite",
        }} />

        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          {/* Live badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 999,
            background: "#FFFFFF", border: "1px solid #BAE6FD",
            fontSize: 12, fontWeight: 600, color: T.teal,
            marginBottom: 22, animation: "fadeUp 0.4s ease both",
            boxShadow: "0 2px 8px rgba(14,116,144,0.08)",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block", animation: "pulse 2s ease infinite" }} />
            AI-Powered Campus Lost & Found
          </span>

          <h1 style={{
            fontSize: "clamp(30px, 7vw, 48px)", fontWeight: 900,
            lineHeight: 1.12, letterSpacing: "-1.5px",
            marginBottom: 16, color: T.text,
            animation: "fadeUp 0.45s ease 0.05s both",
          }}>
            Find what was{" "}
            <span style={{ background: T.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              lost
            </span>
            <br />Return what was found
          </h1>

          <p style={{
            color: T.text2, fontSize: 15, lineHeight: 1.65,
            maxWidth: 420, margin: "0 auto 30px",
            animation: "fadeUp 0.45s ease 0.1s both",
          }}>
            CampusFind uses AI to instantly match lost items with found reports across your entire campus.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.45s ease 0.15s both" }}>
            <button
              onClick={() => setPage("report")}
              style={{
                padding: "13px 28px", borderRadius: T.rMd, border: "none",
                background: T.grad, color: "#fff",
                fontFamily: T.font, fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 4px 18px rgba(8,145,178,0.35)",
                transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(8,145,178,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(8,145,178,0.35)"; }}
            >
              Report an Item
            </button>
            <button
              onClick={() => setPage("browse")}
              style={{
                padding: "13px 28px", borderRadius: T.rMd,
                background: T.surface, border: `1.5px solid ${T.border}`,
                color: T.text, fontFamily: T.font, fontWeight: 600, fontSize: 15, cursor: "pointer",
                boxShadow: T.shadow, transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = T.borderHov; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}
            >
              Browse Items
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, margin: "28px 0", animation: "fadeUp 0.45s ease 0.2s both" }}>
          <StatCard label="Lost Items"  value={loading ? "—" : stats.lost}     color={T.red}   />
          <StatCard label="Found Items" value={loading ? "—" : stats.found}    color={T.green} />
          <StatCard label="Reunited"    value={loading ? "—" : stats.resolved} color={T.teal}  />
        </div>

        {/* ── AI Banner ──────────────────────────────────────────────── */}
        <div
          onClick={() => setPage("ai")}
          style={{
            background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
            border: "1.5px solid #7DD3FC",
            borderRadius: T.rLg, padding: "20px 22px",
            display: "flex", alignItems: "center", gap: 16,
            cursor: "pointer", marginBottom: 32,
            transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
            animation: "fadeUp 0.45s ease 0.25s both",
            boxShadow: "0 4px 16px rgba(14,116,144,0.08)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(14,116,144,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,116,144,0.08)"; }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: T.rMd, flexShrink: 0,
            background: T.grad, display: "flex", alignItems: "center",
            justifyContent: "center", boxShadow: "0 4px 14px rgba(8,145,178,0.35)",
            animation: "float 3s ease infinite",
          }}>
            {/* Brain/AI Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3, color: T.text }}>AI Instant Match</div>
            <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.5 }}>Describe your item — AI finds matches in seconds</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        {/* ── Recent Activity ─────────────────────────────────────────── */}
        <section style={{ animation: "fadeUp 0.45s ease 0.3s both" }}>
          <SectionHeader title="Recent Activity" action={() => setPage("browse")} actionLabel="View all" />

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3, 4].map(i => <Skeleton key={i} height={80} />)}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState
              title="No items yet"
              subtitle="Be the first to report a lost or found item on campus."
              action={() => setPage("report")}
              actionLabel="Report an Item"
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recent.map((item, i) => (
                <div
                  key={item._id}
                  className="anim-card"
                >
                  <Card hover onClick={() => setPage("browse")} padding="16px">
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      {/* Category icon box */}
                      <div style={{
                        width: 48, height: 48, borderRadius: T.rMd, flexShrink: 0,
                        background: item.type === "lost" ? T.redBg : T.greenBg,
                        border: `1.5px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <CategoryIcon
                          category={item.category}
                          color={item.type === "lost" ? T.red : T.green}
                          size={22}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                          <Badge type={item.type} />
                          <span style={{ fontSize: 11, color: T.text3 }}>{timeAgo(item.createdAt || item.date)}</span>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: T.text }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: T.text2, display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          {getLocationStr(item)}
                        </p>
                      </div>

                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav active="home" setPage={setPage} />
    </div>
  );
}