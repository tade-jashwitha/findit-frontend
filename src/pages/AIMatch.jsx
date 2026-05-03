// src/pages/AIMatch.jsx
import { useState, useEffect } from "react";
import T from "../utils/tokens";
import { Card, Input, Button, Badge, Skeleton, BottomNav } from "../components/shared";
import { aiAPI } from "../utils/api";
import api from "../utils/api";

const CAT_EMOJI = { "Bags & Wallets":"🎒", Electronics:"📱", Keys:"🔑", "ID & Cards":"🪪", Clothing:"👕", "Books & Notes":"📚", Accessories:"💍", Other:"📦", Jewelry:"💎", Bags:"🎒" };

const scoreColor = s => s >= 80 ? T.green : s >= 60 ? T.cyan : s >= 40 ? T.amber : T.text3;

// Helper: safely get a location string from string or object
function getLocation(loc, building) {
  if (building) return building;
  if (!loc) return "Campus";
  if (typeof loc === "object") return loc.building || loc.specificArea || "Campus";
  return loc;
}

export default function AIMatch({ setPage }) {
  const [query,        setQuery]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [results,      setResults]      = useState(null);
  const [error,        setError]        = useState(null);
  const [items,        setItems]        = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  // ── Fetch real items from the database on mount ──────────────────────
  useEffect(() => {
    api.get("/items")
      .then(r => {
        const d = r.data;
        const arr = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
        setItems(arr);
      })
      .catch(() => setItems([]))
      .finally(() => setItemsLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setResults(null); setError(null);
    try {
      // Step 1: Ask backend (Gemini) to generate tags from the query
      const res  = await aiAPI.generateTags({ title: query, description: query, category: "Other" });
      const tags = res.data?.tags || [];
      const lq   = query.toLowerCase().trim();
      const queryWords = lq.split(/\s+/).filter(w => w.length > 2);

      // Step 2: Score every real item against the tags + keywords
      const scored = items
        .map(item => {
          const loc  = getLocation(item.location, item.building);
          const text = `${item.title} ${item.description || ""} ${item.category} ${loc}`.toLowerCase();
          const titleText = (item.title || "").toLowerCase();

          // ── Signal 1: AI tag match ratio (0–1) ───────────────────────
          const totalTags   = Math.max(tags.length, 1);
          const matchedTags = tags.filter(t => text.includes(t.toLowerCase())).length;
          const tagScore    = matchedTags / totalTags;

          // ── Signal 2: Query word match ratio (0–1) ───────────────────
          const totalWords   = Math.max(queryWords.length, 1);
          const matchedWords = queryWords.filter(w => text.includes(w)).length;
          const wordScore    = matchedWords / totalWords;

          // ── Signal 3: Title direct match bonus (0 or 0.25) ───────────
          const titleBonus = queryWords.some(w => titleText.includes(w)) ? 0.25 : 0;

          // ── Signal 4: Category match bonus (0 or 0.15) ───────────────
          const catText     = (item.category || "").toLowerCase();
          const catBonus    = queryWords.some(w => catText.includes(w)) ? 0.15 : 0;

          // ── Weighted final score ──────────────────────────────────────
          // tagScore: 45%, wordScore: 30%, titleBonus: 25% bonus, catBonus: 15% bonus
          const rawScore = (tagScore * 0.45) + (wordScore * 0.30) + titleBonus + catBonus;
          const score    = Math.min(Math.round(rawScore * 100), 99);

          // ── Reason string ─────────────────────────────────────────────
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

  return (
    <>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, paddingBottom: 100 }}>

        {/* Ambient glow */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px" }}>

          {/* Header */}
          <div style={{ padding: "32px 0 28px", textAlign: "center", animation: "fadeUp 0.4s ease both" }}>
            <div style={{
              display: "inline-flex", width: 64, height: 64, borderRadius: 18,
              background: T.grad, alignItems: "center", justifyContent: "center",
              fontSize: 30, marginBottom: 16,
              boxShadow: "0 8px 28px rgba(124,58,237,0.4)",
              animation: "float 3s ease infinite",
            }}>✨</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>AI Item Matcher</h1>
            <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>
              Describe your lost item in detail. AI will scan all campus listings and rank the best matches.
            </p>
          </div>

          {/* Search card */}
          <Card padding="20px" style={{ marginBottom: 16, animation: "fadeUp 0.4s ease 0.1s both" }}>
            <Input
              label="Describe your lost item"
              placeholder={`"Black wireless earbuds, Sony, scratched left earbud, lost in library on Monday…"`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              rows={4}
              hint={`${query.length} chars — the more detail, the better the match`}
            />
            <Button fullWidth size="lg" loading={loading} onClick={handleSearch}>
              {loading ? "AI is analyzing…" : "✨ Find Matches with AI"}
            </Button>
          </Card>

          {/* How it works */}
          {!results && !loading && (
            <Card padding="20px" style={{ animation: "fadeUp 0.4s ease 0.15s both" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>How it works</p>
              {[
                ["✍️", "Describe your item",  "Include color, brand, features, where you last had it"],
                ["🤖", "AI scans listings",   itemsLoading ? "Loading campus reports…" : `Checks all ${items.length} campus reports intelligently`],
                ["📊", "Get ranked results",  "Matches sorted by similarity score with AI reasoning"],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: T.surfaceMd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>{icon}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{title}</p>
                    <p style={{ fontSize: 12, color: T.text3, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}

              {/* Live item count badge */}
              {!itemsLoading && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: T.r,
                  background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
                }}>
                  <span style={{ fontSize: 14 }}>🗂️</span>
                  <span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 600 }}>
                    {items.length} real listings loaded from database
                  </span>
                </div>
              )}
            </Card>
          )}

          {/* Loading state */}
          {loading && (
            <Card padding="40px" style={{ textAlign: "center", animation: "fadeUp 0.3s ease both" }}>
              <div style={{ width: 56, height: 56, border: `3px solid ${T.border}`, borderTop: `3px solid #7C3AED`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Scanning {items.length} listings…</p>
              <p style={{ fontSize: 12, color: T.text2 }}>Analyzing descriptions, categories, and locations</p>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card padding="16px" style={{ background: T.redBg, border: `1px solid ${T.redBord}`, animation: "fadeUp 0.3s ease both", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <p style={{ fontWeight: 700, color: T.red, marginBottom: 4 }}>Matching Failed</p>
                  <p style={{ fontSize: 13, color: T.text2 }}>{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Results */}
          {results && !loading && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700 }}>Match Results</h2>
                  <p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>
                    {results.length} item{results.length !== 1 ? "s" : ""} matched from {items.length} listings
                  </p>
                </div>
                <span style={{
                  background: "rgba(124,58,237,0.12)", color: "#A78BFA",
                  padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                  border: "1px solid rgba(124,58,237,0.25)",
                }}>✨ AI Powered</span>
              </div>

              {results.length === 0 ? (
                <Card padding="48px" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.5 }}>🤷</div>
                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>No matches found</p>
                  <p style={{ fontSize: 13, color: T.text2 }}>Try rephrasing with more specific details — brand, color, distinguishing features.</p>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {results.map((item, idx) => (
                    <Card key={item._id || item.id} style={{ overflow: "hidden", animation: `fadeUp 0.3s ease ${idx * 60}ms both` }} padding="0">
                      <div style={{ padding: "16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <div style={{ flexShrink: 0 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: item.type === "lost" ? T.redBg : T.greenBg,
                            border: `1px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                          }}>
                            {CAT_EMOJI[item.category] || "📦"}
                          </div>
                          {idx === 0 && (
                            <div style={{ textAlign: "center", marginTop: 4, fontSize: 9, fontWeight: 800, color: T.amber, letterSpacing: "0.05em" }}>BEST</div>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</h3>
                            <div style={{
                              flexShrink: 0, color: scoreColor(item.score),
                              padding: "3px 10px", borderRadius: 999,
                              fontSize: 12, fontWeight: 800,
                              background: `${scoreColor(item.score)}18`,
                              border: `1px solid ${scoreColor(item.score)}33`,
                            }}>
                              {item.score}%
                            </div>
                          </div>

                          <p style={{ fontSize: 12, color: T.text2, lineHeight: 1.55, marginBottom: 8 }}>
                            {(item.description || "").slice(0, 110)}{item.description?.length > 110 ? "…" : ""}
                          </p>

                          {item.reason && (
                            <div style={{
                              background: "rgba(124,58,237,0.08)",
                              borderRadius: 8, padding: "5px 10px", marginBottom: 8,
                              border: "1px solid rgba(124,58,237,0.2)",
                            }}>
                              <p style={{ fontSize: 11, color: "#A78BFA", fontStyle: "italic" }}>🤖 {item.reason}</p>
                            </div>
                          )}

                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <Badge type={item.type} />
                            <span style={{ fontSize: 11, color: T.text3 }}>📍 {item._locationStr}</span>
                            <span style={{ fontSize: 11, color: T.text3 }}>
                              📅 {item.date ? new Date(item.date).toLocaleDateString() : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div style={{ height: 3, background: T.border }}>
                        <div style={{ height: "100%", width: `${item.score}%`, background: scoreColor(item.score), transition: "width 0.9s ease" }} />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setResults(null); setQuery(""); }}
                style={{
                  width: "100%", marginTop: 16, padding: "12px",
                  background: "transparent", border: `1px solid ${T.border}`,
                  borderRadius: T.rMd, color: T.text2,
                  fontFamily: T.font, fontSize: 14, cursor: "pointer",
                }}
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