// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import T from "../utils/tokens";
import { Card, Badge, Skeleton, Button, BottomNav } from "../components/shared";
import api from "../utils/api";

const EMOJI = { "Bags & Wallets":"🎒", Electronics:"📱", Keys:"🔑", "ID & Cards":"🪪", Clothing:"👕", "Books & Notes":"📚", Accessories:"💍", Other:"📦" };

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const GRAD = T.grad;

export default function Dashboard({ user, setPage }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("all");

  useEffect(() => {
    api.get("/items/my")
      .then(r => {
        const d = r.data;
        setItems(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = tab === "all" ? items : items.filter(i => i.type === tab);
  const lostCount  = items.filter(i => i.type === "lost").length;
  const foundCount = items.filter(i => i.type === "found").length;

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, paddingBottom: 100 }}>
      
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px" }}>

        {/* Profile header */}
        <div style={{ padding: "32px 0 24px", animation: "fadeUp 0.4s ease both" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 24,
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: T.rXl, padding: "20px",
          }}>
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: GRAD, overflow: "hidden",
              border: "3px solid rgba(124,58,237,0.3)",
              boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {user?.picture
                ? <img src={user.picture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                : <span style={{ color: "#fff", fontWeight: 800, fontSize: 28 }}>{firstName[0]}</span>
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 2 }}>
                {user?.name || "User"}
              </h2>
              <p style={{ fontSize: 13, color: T.text2, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </p>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                background: "rgba(124,58,237,0.12)", color: "#A78BFA",
                border: "1px solid rgba(124,58,237,0.25)",
              }}>
                {user?.loginMethod === "google" ? "🔵 Google" : "📧 Email"} · Verified
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[
              { label: "Total",   value: items.length, color: "#A78BFA", bg: "rgba(124,58,237,0.1)" },
              { label: "Lost",    value: lostCount,    color: T.red,    bg: T.redBg },
              { label: "Found",   value: foundCount,   color: T.green,  bg: T.greenBg },
            ].map(s => (
              <div key={s.label} style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: T.rMd, padding: "14px 10px", textAlign: "center",
              }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{loading ? "—" : s.value}</div>
                <div style={{ fontSize: 11, color: T.text3, fontWeight: 600, marginTop: 2, letterSpacing: "0.04em" }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <Button onClick={() => setPage("report")} fullWidth>
              + Report Item
            </Button>
            <Button onClick={() => setPage("browse")} fullWidth variant="secondary">
              Browse All
            </Button>
          </div>
        </div>

        {/* My Reports */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>My Reports</h3>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.rMd, padding: 4, marginBottom: 20 }}>
            {["all", "lost", "found"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "8px", borderRadius: T.r, border: "none",
                background: tab === t ? T.surfaceLg : "transparent",
                color: tab === t ? T.text : T.text2,
                fontFamily: T.font, fontWeight: tab === t ? 700 : 500, fontSize: 13, cursor: "pointer",
                transition: "all 0.15s", textTransform: "capitalize",
                boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
              }}>{t}</button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3].map(i => <Skeleton key={i} height={80} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 20px",
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: T.rLg,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No reports yet</p>
              <p style={{ color: T.text2, fontSize: 13, marginBottom: 20 }}>
                {tab === "all" ? "You haven't reported any items." : `No ${tab} items reported.`}
              </p>
              <Button onClick={() => setPage("report")} size="sm">Report an Item</Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(item => {
                const emoji = EMOJI[item.category] || "📦";
                return (
                  <Card key={item._id} padding="16px">
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: T.rMd, flexShrink: 0,
                        background: item.type === "lost" ? T.redBg : T.greenBg,
                        border: `1px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                      }}>{emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <Badge type={item.type} />
                          <span style={{ fontSize: 11, color: T.text3 }}>{timeAgo(item.createdAt || item.date)}</span>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: T.text2 }}>📍 {
                          item.building
                          || (typeof item.location === "object" && item.location !== null
                              ? item.location.building || item.location.specificArea || "Campus"
                              : item.location)
                          || "Campus"
                        }</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BottomNav active="dashboard" setPage={setPage} />
    </div>
  );
}