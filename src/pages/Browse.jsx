// src/pages/Browse.jsx
import { useState, useEffect, useMemo } from "react";
import T from "../utils/tokens";
import { Card, Badge, Skeleton, BottomNav } from "../components/shared";
import api from "../utils/api";

const EMOJI = { "Bags & Wallets":"🎒", Electronics:"📱", Keys:"🔑", "ID & Cards":"🪪", Clothing:"👕", "Books & Notes":"📚", Accessories:"💍", Other:"📦" };
const CATS  = ["All", "Bags & Wallets", "Electronics", "Keys", "ID & Cards", "Clothing", "Books & Notes", "Accessories", "Other"];

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Detail Sheet ──────────────────────────────────────────────────────
function DetailSheet({ item, onClose, user }) {
  if (!item) return null;
  const emoji = EMOJI[item.category] || "📦";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480, margin: "0 auto",
          background: "#13131A", borderRadius: "24px 24px 0 0",
          border: `1px solid ${T.border}`, borderBottom: "none",
          padding: "24px 20px 40px",
          animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.border, margin: "0 auto 24px" }} />

        {/* Header */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: T.rMd, flexShrink: 0,
            background: item.type === "lost" ? T.redBg : T.greenBg,
            border: `1px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
          }}>{emoji}</div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{item.title}</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge type={item.type} />
              <span style={{ fontSize: 11, color: T.text3 }}>{item.category}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7, marginBottom: 20 }}>{item.description}</p>
        )}

        {/* Details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            ["📍 Location", item.building || (typeof item.location === "object" && item.location !== null ? item.location.building || item.location.specificArea || "—" : item.location) || "—"],
            ["📅 Date", new Date(item.date || item.createdAt).toLocaleDateString()],
            ["🏷️ Category", item.category],
            ["📞 Contact", item.contactEmail || "—"],
          ].map(([label, value]) => (
            <div key={label} style={{ background: T.surfaceMd, padding: "12px", borderRadius: T.r, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 11, color: T.text3, fontWeight: 600, marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Action */}
        {item.contactEmail && (
          <a href={`mailto:${item.contactEmail}?subject=Re: ${item.title} (CampusFind)`} style={{ textDecoration: "none" }}>
            <button style={{
              width: "100%", padding: "15px", borderRadius: T.rMd, border: "none",
              background: T.grad, color: "#fff",
              fontFamily: T.font, fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
              marginBottom: 10,
            }}>
              ✉️ Contact {item.type === "lost" ? "Reporter" : "Finder"}
            </button>
          </a>
        )}
        <button onClick={onClose} style={{
          width: "100%", padding: "13px", borderRadius: T.rMd,
          background: "transparent", border: `1px solid ${T.border}`,
          color: T.text2, fontFamily: T.font, fontSize: 14, cursor: "pointer",
        }}>Close</button>
      </div>
    </div>
  );
}

// ── Main Browse ───────────────────────────────────────────────────────
export default function Browse({ setPage, user }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [type,    setType]    = useState("all");
  const [cat,     setCat]     = useState("All");
  const [sel,     setSel]     = useState(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    api.get("/items")
      .then(r => {
        const d = r.data;
        let arr = [];
        if (Array.isArray(d?.data))  arr = d.data;
        else if (Array.isArray(d))   arr = d;
        setItems(arr);
        setLoading(false);
      })
      .catch(() => { setError("Could not connect to server."); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter(item => {
      const matchSearch = !q || item.title?.toLowerCase().includes(q) || item.building?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
      const matchType   = type === "all" || item.type === type;
      const matchCat    = cat === "All" || item.category === cat;
      return matchSearch && matchType && matchCat;
    });
  }, [items, search, type, cat]);

  return (
    <>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, paddingBottom: 100 }}>
        
        {/* Header */}
        <div style={{ padding: "32px 20px 16px", maxWidth: 680, margin: "0 auto" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Browse Items</h1>
          <p style={{ fontSize: 13, color: T.text2 }}>
            {loading ? "Loading…" : `${items.length} item${items.length !== 1 ? "s" : ""} reported across campus`}
          </p>
        </div>

        <div style={{ padding: "0 20px", maxWidth: 680, margin: "0 auto" }}>

          {/* Warning */}
          {error && (
            <div style={{
              background: T.amberBg, border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: T.r, padding: "10px 14px", marginBottom: 16,
              fontSize: 13, color: T.amber,
            }}>⚠️ {error}</div>
          )}

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: T.surface, border: `1px solid ${focused ? "rgba(124,58,237,0.5)" : T.border}`,
            borderRadius: T.rMd, padding: "12px 16px", marginBottom: 16,
            boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
            transition: "all 0.2s",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" width="18" height="18" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder="Search items, location…"
              style={{ background: "transparent", border: "none", outline: "none", color: T.text, width: "100%", fontSize: 14 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.text3, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* Type filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {["all", "lost", "found"].map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer",
                fontFamily: T.font, fontSize: 13, fontWeight: type === t ? 700 : 500,
                background: type === t ? T.grad : T.surface,
                color: type === t ? "#fff" : T.text2,
                boxShadow: type === t ? "0 4px 14px rgba(124,58,237,0.3)" : "none",
                border: type === t ? "none" : `1px solid ${T.border}`,
                transition: "all 0.2s", textTransform: "capitalize",
              }}>{t === "all" ? "All" : t === "lost" ? "🔍 Lost" : "📦 Found"}</button>
            ))}
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, scrollbarWidth: "none" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: "7px 14px", borderRadius: 999, border: "none",
                whiteSpace: "nowrap", cursor: "pointer", fontFamily: T.font, fontSize: 12, fontWeight: cat === c ? 700 : 500,
                background: cat === c ? "rgba(124,58,237,0.15)" : T.surface,
                color: cat === c ? "#A78BFA" : T.text2,
                border: `1px solid ${cat === c ? "rgba(124,58,237,0.4)" : T.border}`,
                transition: "all 0.15s",
              }}>{c}</button>
            ))}
          </div>

          {/* Results count */}
          {!loading && <p style={{ fontSize: 12, color: T.text3, marginBottom: 12 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>}

          {/* Items */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3,4,5].map(i => <Skeleton key={i} height={90} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🔍</div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No items found</p>
              <p style={{ color: T.text2, fontSize: 13 }}>Try different keywords or filters</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(item => {
                const emoji = EMOJI[item.category] || "📦";
                return (
                  <Card key={item._id} hover onClick={() => setSel(item)} padding="16px">
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: T.rMd, flexShrink: 0,
                        background: item.type === "lost" ? T.redBg : T.greenBg,
                        border: `1px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                      }}>{emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <Badge type={item.type} />
                          <span style={{ fontSize: 11, color: T.text3 }}>{timeAgo(item.createdAt || item.date)}</span>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: T.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          📍 {item.building || (typeof item.location === "object" && item.location !== null ? item.location.building || item.location.specificArea || "Campus" : item.location) || "Campus"}
                        </p>
                      </div>
                      <span style={{ color: T.text3, fontSize: 20, flexShrink: 0 }}>›</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {sel && <DetailSheet item={sel} onClose={() => setSel(null)} user={user} />}
      <BottomNav active="browse" setPage={setPage} />
    </>
  );
}