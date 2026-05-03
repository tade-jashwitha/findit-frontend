// src/pages/AIMatch.jsx
import { useState } from "react";
import T from "../utils/tokens";
import { Card, Input, Button, Badge, Skeleton, BottomNav } from "../components/shared";
import { aiAPI } from "../utils/api";

const CAT_EMOJI = { "Bags & Wallets":"🎒", Electronics:"📱", Keys:"🔑", "ID & Cards":"🪪", Clothing:"👕", "Books & Notes":"📚", Accessories:"💍", Other:"📦", Jewelry:"💎", Bags:"🎒" };

const DEMO_ITEMS = [
  { id:1, title:"Blue Fastrack Watch",  type:"found", category:"Accessories", location:"Sports complex", description:"Blue dial round face brown leather strap found near basketball court entrance", date:"May 2" },
  { id:2, title:"Black Nike Backpack",  type:"lost",  category:"Bags & Wallets", location:"Main Canteen", description:"Black backpack with red Nike logo laptop compartment charger and books inside",  date:"May 1" },
  { id:3, title:"Sony WH-1000XM5",      type:"lost",  category:"Electronics", location:"Library 2F",   description:"Black Sony headphones left earbud has a scratch stored in original case",          date:"Apr 30" },
  { id:4, title:"Student ID — Riya S.", type:"found", category:"ID & Cards",   location:"Admin Block",  description:"Student ID card for Riya Sharma CSE 3rd year photo ID",                          date:"May 2" },
  { id:5, title:"Honda Key Chain",      type:"found", category:"Keys",         location:"Parking Lot B",description:"Honda bike keys with red keychain small flashlight attached",                     date:"May 2" },
];

const scoreColor = s => s >= 80 ? T.green : s >= 60 ? T.cyan : s >= 40 ? T.amber : T.text3;

export default function AIMatch({ setPage, items = [] }) {
  const [query,   setQuery]   = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error,   setError]   = useState(null);

  const allItems = items.length ? items : DEMO_ITEMS;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setResults(null); setError(null);
    try {
      const res  = await aiAPI.generateTags({ title: query, description: query, category: "Other" });
      const tags = res.data?.tags || [];
      const lq   = query.toLowerCase();

      const scored = allItems
        .map(item => {
          const text  = `${item.title} ${item.description} ${item.category}`.toLowerCase();
          const tagM  = tags.filter(t => text.includes(t.toLowerCase())).length;
          const wordM = lq.split(/\s+/).filter(w => w.length > 2 && text.includes(w)).length;
          const score = Math.min(Math.round(((tagM * 20) + (wordM * 25)) / Math.max(tags.length, 1) * 8), 99);
          const reason = tagM > 0
            ? `${tagM} AI tag${tagM > 1 ? "s" : ""} matched from your description`
            : wordM > 0
            ? `${wordM} keyword${wordM > 1 ? "s" : ""} overlap with your query`
            : "Low similarity";
          return { ...item, score, reason };
        })
        .filter(i => i.score >= 20)
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
                ["🤖", "AI scans listings",   `Checks all ${allItems.length} campus reports intelligently`],
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
            </Card>
          )}

          {/* Loading state */}
          {loading && (
            <Card padding="40px" style={{ textAlign: "center", animation: "fadeUp 0.3s ease both" }}>
              <div style={{ width: 56, height: 56, border: `3px solid ${T.border}`, borderTop: `3px solid #7C3AED`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Scanning {allItems.length} listings…</p>
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
                    {results.length} item{results.length !== 1 ? "s" : ""} matched
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
                    <Card key={item.id} style={{ overflow: "hidden", animation: `fadeUp 0.3s ease ${idx * 60}ms both` }} padding="0">
                      <div style={{ padding: "16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <div style={{ flexShrink: 0 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: T.surfaceMd, display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: 24,
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
                            {item.description?.slice(0, 110)}…
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
                            <span style={{ fontSize: 11, color: T.text3 }}>📍 {typeof item.location === "object" && item.location !== null ? item.location.building || item.location.specificArea || "Campus" : item.location || item.building || "Campus"}</span>
                            <span style={{ fontSize: 11, color: T.text3 }}>📅 {item.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Score progress bar */}
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