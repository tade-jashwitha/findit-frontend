// src/pages/AIMatch.jsx
import { useState, useEffect } from "react";
import T from "../utils/tokens";
import { Card, Input, Button, Badge, Skeleton, BottomNav, CategoryIcon, ScorePill } from "../components/shared";
import { aiAPI } from "../utils/api";
import api from "../utils/api";

const scoreColor = s => s >= 80 ? T.green : s >= 60 ? T.teal : s >= 40 ? T.amber : T.text3;

function getLocation(loc, building) {
  if (building) return building;
  if (!loc) return "Campus";
  if (typeof loc === "object") return loc.building || loc.specificArea || "Campus";
  return loc;
}

// ── How It Works step icon ────────────────────────────────────────────
function StepIcon({ n }) {
  const icons = [
    // 1 — Write
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>,
    // 2 — AI
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z"/>
    </svg>,
    // 3 — Results
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>,
  ];
  return icons[n] || null;
}

export default function AIMatch({ setPage }) {
  const [query,        setQuery]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [results,      setResults]      = useState(null);
  const [error,        setError]        = useState(null);
  const [items,        setItems]        = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  useEffect(() => {
    api.get("/items")
      .then(r => {
        const d = r.data;
        setItems(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      })
      .catch(() => setItems([]))
      .finally(() => setItemsLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setResults(null); setError(null);
    try {
      const res  = await aiAPI.generateTags({ title: query, description: query, category: "Other" });
      const tags = res.data?.tags || [];
      const lq   = query.toLowerCase().trim();
      const queryWords = lq.split(/\s+/).filter(w => w.length > 2);

      const scored = items
        .map(item => {
          const loc  = getLocation(item.location, item.building);
          const text = `${item.title} ${item.description || ""} ${item.category} ${loc}`.toLowerCase();
          const titleText = (item.title || "").toLowerCase();

          const totalTags   = Math.max(tags.length, 1);
          const matchedTags = tags.filter(t => text.includes(t.toLowerCase())).length;
          const tagScore    = matchedTags / totalTags;

          const totalWords   = Math.max(queryWords.length, 1);
          const matchedWords = queryWords.filter(w => text.includes(w)).length;
          const wordScore    = matchedWords / totalWords;

          const titleBonus = queryWords.some(w => titleText.includes(w)) ? 0.25 : 0;
          const catBonus   = queryWords.some(w => (item.category || "").toLowerCase().includes(w)) ? 0.15 : 0;
          const rawScore   = (tagScore * 0.45) + (wordScore * 0.30) + titleBonus + catBonus;
          const score      = Math.min(Math.round(rawScore * 100), 99);

          const reason = matchedTags > 0 && matchedWords > 0
            ? `${matchedTags} AI tag${matchedTags > 1 ? "s" : ""} + ${matchedWords} keyword${matchedWords > 1 ? "s" : ""} matched`
            : matchedTags > 0
            ? `${matchedTags} of ${totalTags} AI tags matched`
            : matchedWords > 0
            ? `${matchedWords} of ${totalWords} keyword${matchedWords > 1 ? "s" : ""} matched`
            : "Low similarity";

          return { ...item, score, reason, _locationStr: loc };
        })
        .filter(i => i.score >= 15)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setResults(scored);
    } catch {
      setError("AI matching failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    ["Describe your item",  "Include color, brand, features, where you last had it"],
    ["AI scans listings",   itemsLoading ? "Loading campus reports…" : `Checks all ${items.length} campus reports intelligently`],
    ["Get ranked results",  "Matches sorted by similarity score with AI reasoning"],
  ];

  return (
    <>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, paddingBottom: 100 }}>

        {/* Header strip */}
        <div style={{
          background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
          borderBottom: "1px solid #BAE6FD",
          padding: "44px 20px 32px",
          textAlign: "center",
          animation: "fadeUp 0.4s ease both",
        }}>
          <div style={{
            display: "inline-flex", width: 56, height: 56, borderRadius: 18,
            background: T.grad, alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(8,145,178,0.35)",
            marginBottom: 14, animation: "float 3s ease infinite",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6, color: T.text }}>AI Item Matcher</h1>
          <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
            Describe your lost item and AI will scan all campus listings to find the best matches.
          </p>
        </div>

        <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 0" }}>

          {/* Search card */}
          <Card padding="20px" style={{ marginBottom: 16, animation: "fadeUp 0.4s ease 0.1s both" }}>
            <Input
              label="Describe your lost item"
              placeholder={`"Black wireless earbuds, Sony, scratched left earbud, lost in library on Monday…"`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              rows={4}
              hint={query.length > 0 ? `${query.length} chars — the more detail, the better the match` : "Be specific: color, brand, unique features, location"}
            />
            <Button fullWidth size="lg" loading={loading} onClick={handleSearch}>
              {loading ? "Analyzing…" : "Find Matches with AI"}
            </Button>
          </Card>

          {/* How it works */}
          {!results && !loading && (
            <Card padding="20px" style={{ animation: "fadeUp 0.4s ease 0.15s both" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 18 }}>
                How it works
              </p>
              {steps.map(([title, desc], i) => (
                <div key={title} style={{ display: "flex", gap: 14, marginBottom: i < 2 ? 18 : 0, alignItems: "flex-start" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "#EFF6FF", border: "1px solid #DBEAFE",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.teal,
                    animation: `fadeUp 0.4s ease ${0.05 * i}s both`,
                  }}>
                    <StepIcon n={i} />
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 3, color: T.text }}>{title}</p>
                    <p style={{ fontSize: 12, color: T.text2, lineHeight: 1.55 }}>{desc}</p>
                  </div>
                </div>
              ))}

              {!itemsLoading && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", borderRadius: T.r, marginTop: 20,
                  background: "#EFF6FF", border: "1px solid #DBEAFE",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontSize: 12, color: T.teal, fontWeight: 600 }}>
                    {items.length} real listings loaded from campus database
                  </span>
                </div>
              )}
            </Card>
          )}

          {/* Loading skeleton */}
          {loading && (
            <Card padding="40px" style={{ textAlign: "center", animation: "scaleIn 0.3s ease both" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: T.teal,
                    animation: `dotBounce 1.2s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: T.text }}>Scanning {items.length} listings…</p>
              <p style={{ fontSize: 12, color: T.text2 }}>Analyzing descriptions, categories, and locations</p>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card padding="16px" style={{ background: T.redBg, border: `1px solid ${T.redBord}`, animation: "fadeUp 0.3s ease both", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <div>
                  <p style={{ fontWeight: 700, color: T.red, marginBottom: 2, fontSize: 13 }}>Matching Failed</p>
                  <p style={{ fontSize: 12, color: T.text2 }}>{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Results */}
          {results && !loading && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: T.text }}>Match Results</h2>
                  <p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>
                    {results.length} item{results.length !== 1 ? "s" : ""} matched from {items.length} listings
                  </p>
                </div>
                <span style={{
                  background: "#EFF6FF", color: T.teal,
                  padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                  border: "1px solid #DBEAFE",
                }}>
                  AI Powered
                </span>
              </div>

              {results.length === 0 ? (
                <Card padding="48px" style={{ textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: T.text }}>No matches found</p>
                  <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.6 }}>Try rephrasing with more specific details — brand, color, distinguishing features.</p>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {results.map((item, idx) => (
                    <div key={item._id || item.id} style={{ animation: `fadeUp 0.35s ease ${idx * 0.06}s both` }}>
                      <Card padding="0" style={{ overflow: "hidden" }}>
                        {/* Best match banner */}
                        {idx === 0 && (
                          <div style={{
                            background: "linear-gradient(90deg, #FEF9C3, #FFF7ED)",
                            borderBottom: "1px solid #FDE68A",
                            padding: "5px 16px",
                            fontSize: 11, fontWeight: 700, color: "#92400E",
                            letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6,
                          }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            BEST MATCH
                          </div>
                        )}

                        <div style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                          <div style={{ flexShrink: 0 }}>
                            <div style={{
                              width: 46, height: 46, borderRadius: 12,
                              background: item.type === "lost" ? T.redBg : T.greenBg,
                              border: `1.5px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <CategoryIcon category={item.category} color={item.type === "lost" ? T.red : T.green} size={22} />
                            </div>
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 5 }}>
                              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{item.title}</h3>
                              <ScorePill score={item.score} />
                            </div>

                            <p style={{ fontSize: 12, color: T.text2, lineHeight: 1.55, marginBottom: 8 }}>
                              {(item.description || "").slice(0, 110)}{item.description?.length > 110 ? "…" : ""}
                            </p>

                            {item.reason && (
                              <div style={{
                                background: "#EFF6FF", borderRadius: 8,
                                padding: "5px 10px", marginBottom: 8,
                                border: "1px solid #DBEAFE", display: "flex", alignItems: "center", gap: 6,
                              }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z"/></svg>
                                <p style={{ fontSize: 11, color: T.teal, fontStyle: "italic" }}>{item.reason}</p>
                              </div>
                            )}

                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                              <Badge type={item.type} />
                              <span style={{ fontSize: 11, color: T.text3, display: "flex", alignItems: "center", gap: 3 }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                {item._locationStr}
                              </span>
                              <span style={{ fontSize: 11, color: T.text3 }}>
                                {item.date ? new Date(item.date).toLocaleDateString() : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Score progress bar */}
                        <div style={{ height: 3, background: "#F1F5F9" }}>
                          <div style={{
                            height: "100%",
                            width: `${item.score}%`,
                            background: scoreColor(item.score) === T.green ? "linear-gradient(90deg, #6EE7B7, #10B981)"
                              : scoreColor(item.score) === T.teal ? "linear-gradient(90deg, #7DD3FC, #0891B2)"
                              : "linear-gradient(90deg, #FDE68A, #F59E0B)",
                            transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
                            borderRadius: "0 0 4px 0",
                          }} />
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setResults(null); setQuery(""); }}
                style={{
                  width: "100%", marginTop: 16, padding: "12px",
                  background: T.surface, border: `1.5px solid ${T.border}`,
                  borderRadius: T.rMd, color: T.text2, fontFamily: T.font,
                  fontSize: 14, cursor: "pointer", fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = T.borderHov; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; }}
              >
                ← Search Again
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="ai" setPage={setPage} />
    </>
  );
}