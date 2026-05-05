// src/pages/Browse.jsx — with claim system, match scores, smart sort
import { useState, useEffect, useMemo } from "react";
import T from "../utils/tokens";
import { Card, Badge, Skeleton, BottomNav, CategoryIcon, ScorePill } from "../components/shared";
import api, { claimsAPI, getErrorMessage } from "../utils/api";

const CATS = ["All", "Bags & Wallets", "Electronics", "Keys", "ID & Cards", "Clothing", "Books & Notes", "Accessories", "Other"];

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getLocation(item) {
  if (!item) return "Campus";
  if (item.location?.building) return item.location.building;
  if (typeof item.location === "string") return item.location;
  return item.building || "Campus";
}

const scoreColor = s => s >= 70 ? "#22C55E" : s >= 50 ? "#06B6D4" : "#F59E0B";
const bestScore  = item => item.matches?.[0]?.score || 0;

// ── Claim Modal ────────────────────────────────────────────────────────
function ClaimModal({ item, user, onClose, onSuccess }) {
  const [msg,     setMsg]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  const submit = async () => {
    if (!user) { onClose(); return; }
    setLoading(true); setError("");
    try {
      await claimsAPI.sendClaim(item._id, msg);
      setDone(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 400, background: T.surface,
          borderRadius: 20, border: `1px solid ${T.border}`,
          padding: "28px 24px", boxShadow: T.shadowLg,
          animation: "slideUp 0.25s ease both",
        }}
      >
        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.greenBg, border: `1px solid ${T.greenBord}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>Claim Sent!</p>
            <p style={{ fontSize: 13, color: T.text2 }}>The owner will review your request and respond shortly.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Send Claim Request</p>
                <p style={{ fontSize: 12, color: T.text2 }}>For: <span style={{ color: T.text }}>{item.title}</span></p>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: T.text3, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            {/* How it works */}
            <div style={{ background: T.surfaceMd, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: T.teal, fontWeight: 700, marginBottom: 6 }}>HOW IT WORKS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {["You send a claim with a message", "Owner reviews and approves/rejects", "You get notified instantly"].map((s, i) => (
                  <p key={i} style={{ fontSize: 12, color: T.text2 }}>
                    <span style={{ color: "#0891B2", fontWeight: 700 }}>{i + 1}.</span> {s}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, display: "block", marginBottom: 8 }}>
                YOUR MESSAGE <span style={{ color: T.text3, fontWeight: 400 }}>(helps owner verify it's yours)</span>
              </label>
              <textarea
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder="Describe the item, where you found/lost it, any identifying details..."
                style={{
                  width: "100%", minHeight: 90,
                  background: T.surfaceMd, border: `1px solid ${T.border}`,
                  borderRadius: T.r, color: T.text,
                  fontFamily: T.font, fontSize: 13, padding: "12px",
                  resize: "vertical", boxSizing: "border-box",
                }}
              />
            </div>

            {error && <p style={{ fontSize: 12, color: T.red, marginBottom: 12 }}>⚠ {error}</p>}

            <button
              onClick={submit}
              disabled={loading}
              style={{
                width: "100%", padding: "14px", border: "none",
                borderRadius: T.rMd, background: T.grad, color: "#fff",
                fontFamily: T.font, fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(6,182,212,0.4)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending…" : "📩 Send Claim Request"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Detail Sheet ──────────────────────────────────────────────────────
function DetailSheet({ item, onClose, user, onClaim }) {
  if (!item) return null;
  const score = bestScore(item);
  const isOwn = user && item.reportedBy?._id === user._id;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480, margin: "0 auto",
          background: T.surface, borderRadius: "24px 24px 0 0",
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
            border: `1.5px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CategoryIcon category={item.category} color={item.type === "lost" ? T.red : T.green} size={30} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{item.title}</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Badge type={item.type} />
              <span style={{ fontSize: 11, color: T.text3 }}>{item.category}</span>
              {score > 0 && (
                <span style={{
                  background: `${scoreColor(score)}20`, color: scoreColor(score),
                  border: `1px solid ${scoreColor(score)}40`,
                  padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                }}>⚡ {score}% match</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7, marginBottom: 20 }}>{item.description}</p>
        )}

        {/* AI Match Reasons */}
        {item.matches?.[0]?.reasons?.length > 0 && (
          <div style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: T.r, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: "#0891B2", fontWeight: 700, marginBottom: 6 }}>🤖 WHY THIS MATCHES</p>
            {item.matches[0].reasons.map((r, i) => (
              <p key={i} style={{ fontSize: 12, color: T.text2 }}>· {r}</p>
            ))}
          </div>
        )}

        {/* Details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            ["Location", getLocation(item)],
            ["Date",     new Date(item.date || item.createdAt).toLocaleDateString()],
            ["Category", item.category],
            ["Status",   item.status?.charAt(0).toUpperCase() + item.status?.slice(1)],
          ].map(([label, value]) => (
            <div key={label} style={{ background: T.surfaceMd, padding: "12px", borderRadius: T.r, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 11, color: T.text3, fontWeight: 600, marginBottom: 4, letterSpacing: "0.04em" }}>{label.toUpperCase()}</p>
              <p style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.text }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {!isOwn && (
          <button
            onClick={() => onClaim(item)}
            style={{
              width: "100%", padding: "15px", borderRadius: T.rMd, border: "none",
              background: T.grad, color: "#fff",
              fontFamily: T.font, fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(8,145,178,0.35)", marginBottom: 10,
              transition: "all 0.2s",
            }}
          >
            Send Claim Request
          </button>
        )}

        {/* Fallback email contact */}
        {item.contactEmail && (
          <a href={`mailto:${item.contactEmail}?subject=Re: ${item.title} (CampusFind)`} style={{ textDecoration: "none", display: "block", marginBottom: 10 }}>
            <button style={{
              width: "100%", padding: "12px", borderRadius: T.rMd,
              background: T.surfaceMd, border: `1.5px solid ${T.border}`,
              color: T.text2, fontFamily: T.font, fontSize: 13, cursor: "pointer",
            }}>
              Contact via Email
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

// ── Main Browse ────────────────────────────────────────────────────────
export default function Browse({ setPage, user }) {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [search,    setSearch]    = useState("");
  const [type,      setType]      = useState("all");
  const [cat,       setCat]       = useState("All");
  const [sortBy,    setSortBy]    = useState("recent");
  const [sel,       setSel]       = useState(null);
  const [claimItem, setClaimItem] = useState(null);
  const [focused,   setFocused]   = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let autoRetryTimer = null;
    let countdownTimer = null;

    const fetchItems = () => {
      setLoading(true); setError(""); setCountdown(0);
      api.get("/items", { params: { sort: sortBy } })
        .then(r => {
          const d = r.data;
          let arr = [];
          if (Array.isArray(d?.data)) arr = d.data;
          else if (Array.isArray(d))  arr = d;
          setItems(arr);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setError("Server is waking up… connecting automatically.");
          // Auto-retry countdown: 15s
          let secs = 15;
          setCountdown(secs);
          countdownTimer = setInterval(() => {
            secs -= 1;
            setCountdown(secs);
            if (secs <= 0) clearInterval(countdownTimer);
          }, 1000);
          // Auto-retry after 15s
          autoRetryTimer = setTimeout(fetchItems, 15000);
        });
    };

    fetchItems();
    return () => { clearTimeout(autoRetryTimer); clearInterval(countdownTimer); };
  }, [sortBy, retryCount]);


  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter(item => {
      const matchSearch = !q
        || item.title?.toLowerCase().includes(q)
        || getLocation(item).toLowerCase().includes(q)
        || item.description?.toLowerCase().includes(q);
      const matchType = type === "all" || item.type === type;
      const matchCat  = cat === "All" || item.category === cat;
      return matchSearch && matchType && matchCat;
    });
  }, [items, search, type, cat]);

  const handleClaim = (item) => {
    if (!user) { setPage("login"); return; }
    setClaimItem(item);
    setSel(null);
  };

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

          {error && (
            <div style={{
              background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: T.r, padding: "14px 16px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 16, height: 16, border: "2px solid rgba(245,158,11,0.3)", borderTop: "2px solid #F59E0B", borderRadius: "50%", animation: "spin 1s linear infinite", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#F59E0B", fontWeight: 600 }}>🌐 Server is waking up…</p>
              </div>
              <p style={{ fontSize: 12, color: "#FCD34D", marginBottom: 10 }}>
                {countdown > 0 ? `Auto-retrying in ${countdown}s…` : "Retrying now…"}
              </p>
              <button
                onClick={() => { setRetryCount(c => c + 1); }}
                style={{
                  padding: "7px 16px", borderRadius: 999, border: "none",
                  background: "#F59E0B", color: "#000",
                  fontFamily: T.font, fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}
              >🔄 Retry Now</button>
            </div>
          )}




          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: T.surface, border: `1px solid ${focused ? "rgba(6,182,212,0.5)" : T.border}`,
            borderRadius: T.rMd, padding: "12px 16px", marginBottom: 16,
            boxShadow: focused ? "0 0 0 3px rgba(6,182,212,0.1)" : "none",
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

          {/* Filters row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {/* Type */}
            {["all", "lost", "found"].map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: "8px 16px", borderRadius: 999, cursor: "pointer",
                fontFamily: T.font, fontSize: 13, fontWeight: type === t ? 700 : 500,
                background: type === t ? T.grad : T.surface,
                color: type === t ? "#fff" : T.text2,
                boxShadow: type === t ? "0 4px 14px rgba(8,145,178,0.3)" : "none",
                border: type === t ? "none" : `1px solid ${T.border}`,
                transition: "all 0.2s", textTransform: "capitalize",
              }}>{t === "all" ? "All" : t === "lost" ? "Lost" : "Found"}</button>
            ))}

            {/* Smart sort toggle */}
            <button
              onClick={() => setSortBy(s => s === "recent" ? "matches" : "recent")}
              style={{
                marginLeft: "auto", padding: "8px 14px", borderRadius: 999,
                cursor: "pointer", fontFamily: T.font, fontSize: 12, fontWeight: 600,
                background: sortBy === "matches" ? T.amberBg : T.surface,
                color: sortBy === "matches" ? T.amber : T.text2,
                border: `1.5px solid ${sortBy === "matches" ? T.amberBord : T.border}`,
                transition: "all 0.2s",
              }}
            >
              {sortBy === "matches" ? "By Match Score" : "By Recent"}
            </button>
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, scrollbarWidth: "none" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: "7px 14px", borderRadius: 999, border: "none",
                whiteSpace: "nowrap", cursor: "pointer", fontFamily: T.font, fontSize: 12, fontWeight: cat === c ? 700 : 500,
                background: cat === c ? "rgba(6,182,212,0.15)" : T.surface,
                color: cat === c ? "#0891B2" : T.text2,
                border: `1px solid ${cat === c ? "rgba(6,182,212,0.4)" : T.border}`,
                transition: "all 0.15s",
              }}>{c}</button>
            ))}
          </div>

          {/* Results count */}
          {!loading && (
            <p style={{ fontSize: 12, color: T.text3, marginBottom: 12 }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {sortBy === "matches" && " · sorted by match score ⚡"}
            </p>
          )}

          {/* Items list */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3,4,5].map(i => <Skeleton key={i} height={90} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: T.surfaceMd, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: T.text }}>No items found</p>
              <p style={{ color: T.text2, fontSize: 13 }}>Try different keywords or filters</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(item => {
                const score = bestScore(item);
                return (
                  <Card key={item._id} hover onClick={() => setSel(item)} padding="16px">
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: T.rMd, flexShrink: 0,
                        background: item.type === "lost" ? T.redBg : T.greenBg,
                        border: `1.5px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <CategoryIcon category={item.category} color={item.type === "lost" ? T.red : T.green} size={24} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <Badge type={item.type} />
                          <span style={{ fontSize: 11, color: T.text3 }}>{timeAgo(item.createdAt || item.date)}</span>
                          {score >= 25 && (
                            <ScorePill score={score} />
                          )}
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.text }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: T.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 3 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          {getLocation(item)}
                        </p>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail sheet */}
      {sel && <DetailSheet item={sel} onClose={() => setSel(null)} user={user} onClaim={handleClaim} />}

      {/* Claim modal */}
      {claimItem && (
        <ClaimModal
          item={claimItem}
          user={user}
          onClose={() => setClaimItem(null)}
          onSuccess={() => setClaimItem(null)}
        />
      )}

      <BottomNav active="browse" setPage={setPage} />
    </>
  );
}