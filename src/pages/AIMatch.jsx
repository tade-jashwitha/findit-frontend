// pages/AIMatch.jsx
import { useState } from "react";
import { Button, Card, Textarea, Badge, EmptyState } from "../components/UI";
import { ImageUpload } from "../components/ImageUpload";
import { ItemModal } from "../components/ItemModal";
import { CATEGORY_EMOJI } from "../utils/constants";
import { toast } from "../utils/toast";

export default function AIMatch({ items }) {
  const [mode, setMode]       = useState("description");
  const [query, setQuery]     = useState("");
  const [img, setImg]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError]     = useState(null);
  const [modal, setModal]     = useState(null);

  // ── Call Claude API ──
  const callClaude = async (prompt) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are a lost and found matching assistant for a college campus. Given a user's description of a lost item and a list of campus listings, return a JSON array of match scores.

Rules:
- Return ONLY valid JSON — no markdown, no preamble.
- Format: [{"id": number, "score": number (0-100), "reason": "one concise sentence explaining the match"}]
- Only include items with score >= 40. Sort by score descending.
- Score based on: category match (high weight), description keywords, location hints, distinctive features.`,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    const text = data.content.map(c => c.text || "").join("");
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  };

  const handleSearch = async () => {
    if (!query.trim() && !img) { toast.warn("Please enter a description or upload an image."); return; }
    setLoading(true); setResults(null); setError(null);
    try {
      const summary = items.map(i =>
        `ID ${i.id}: [${i.type.toUpperCase()}] ${i.category} — "${i.title}" — "${i.description.slice(0, 120)}" — Location: ${i.location}`
      ).join("\n");
      const userInput = query.trim() || "User uploaded an image of their lost item (no text description provided).";
      const prompt = `User is looking for their lost item.\nDescription: "${userInput}"\n\nCampus listings:\n${summary}\n\nReturn matching scores as JSON.`;

      const matches = await callClaude(prompt);
      const enriched = matches
        .map(m => ({ ...items.find(i => i.id === m.id), score: m.score, reason: m.reason }))
        .filter(Boolean);

      setResults(enriched);
      if (!enriched.length) toast.info("No strong matches. Try a more specific description.");
      else toast.success(`Found ${enriched.length} match${enriched.length !== 1 ? "es" : ""}! 🎯`);
    } catch (e) {
      console.error(e);
      setError("AI matching failed. Ensure the Anthropic API key is configured.");
      toast.error("AI matching error.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = s => s >= 85 ? "var(--c-green)" : s >= 70 ? "var(--c-blue)" : s >= 50 ? "var(--c-amber)" : "var(--c-text3)";
  const scoreBg    = s => s >= 85 ? "var(--c-green-bg)" : s >= 70 ? "var(--c-blue-bg)" : s >= 50 ? "var(--c-amber-bg)" : "var(--c-surface2)";

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <div style={{
          display: "inline-flex", width: 72, height: 72, borderRadius: "var(--radius-xl)",
          background: "linear-gradient(135deg,#1D4ED8,#7C3AED)",
          alignItems: "center", justifyContent: "center", fontSize: 36,
          marginBottom: 16, boxShadow: "0 8px 24px rgba(29,78,216,0.3)",
          animation: "float 3s ease infinite",
        }}>🤖</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, letterSpacing: "-0.5px", marginBottom: 8 }}>AI Item Matcher</h1>
        <p style={{ fontSize: 15, color: "var(--c-text2)", maxWidth: 460, margin: "0 auto", lineHeight: 1.65 }}>
          Describe your lost item or upload a photo. Claude AI will analyze all campus listings and surface the best matches.
        </p>
      </div>

      {/* Input card */}
      <Card style={{ padding: 28, marginBottom: 24 }}>
        {/* Mode toggle */}
        <div style={{ display: "flex", background: "var(--c-surface2)", border: "1px solid var(--c-border)", borderRadius: "var(--radius-sm)", padding: 3, marginBottom: 20, width: "fit-content" }}>
          {[
            { id: "description", label: "📝 Describe Item" },
            { id: "image",       label: "🖼 Upload Photo" },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding: "9px 22px", borderRadius: 6, border: "none", cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
              background: mode === m.id ? "var(--c-surface)" : "transparent",
              color: mode === m.id ? "var(--c-accent)" : "var(--c-text2)",
              boxShadow: mode === m.id ? "var(--shadow-sm)" : "none",
              transition: "all var(--transition)",
            }}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === "description" ? (
          <Textarea
            label="Describe your lost item"
            placeholder='Be specific! e.g. "Black wireless earbuds, Sony WH-1000XM5, with silver trim and scratched left earbud, lost in library on Monday afternoon…"'
            value={query}
            onChange={e => setQuery(e.target.value)}
            rows={5}
            hint={`${query.length} chars — the more detail, the better the matches`}
          />
        ) : (
          <div>
            <ImageUpload
              preview={img} onFile={setImg} onRemove={() => setImg(null)}
              label="Upload item photo"
              hint="Our AI will analyze it and find visually similar items"
            />
            {img && (
              <div style={{ marginTop: 12 }}>
                <Textarea
                  label="Add a description (optional but recommended)"
                  placeholder="Any additional details about the item…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <Button fullWidth size="lg" loading={loading} onClick={handleSearch} variant="accent">
            {loading ? "Claude is analyzing…" : "✨ Find Matches with AI"}
          </Button>
        </div>
      </Card>

      {/* Loading state */}
      {loading && (
        <Card style={{ padding: 48, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg,#1D4ED8,#7C3AED)",
            alignItems: "center", justifyContent: "center", marginBottom: 20,
            animation: "float 1.5s ease infinite",
          }}>
            <div style={{ width: 28, height: 28, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
          <p style={{ fontSize: 16, color: "var(--c-text)", fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 6 }}>
            Claude is scanning {items.length} campus listings…
          </p>
          <p style={{ fontSize: 13, color: "var(--c-text2)" }}>Analyzing descriptions, categories, and locations</p>
        </Card>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          background: "var(--c-red-bg)", border: "1px solid rgba(185,28,28,0.2)",
          borderRadius: "var(--radius-md)", padding: 16,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <p style={{ fontWeight: 600, color: "var(--c-red)", fontFamily: "var(--font-display)", marginBottom: 4 }}>Matching Failed</p>
            <p style={{ fontSize: 13, color: "var(--c-text2)" }}>{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22 }}>AI Match Results</h2>
              <p style={{ fontSize: 13, color: "var(--c-text2)", marginTop: 2 }}>
                {results.length} item{results.length !== 1 ? "s" : ""} matched by Claude
              </p>
            </div>
            <Badge variant="ai">✨ Claude Powered</Badge>
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon="🤷"
              title="No matches found"
              subtitle="Claude couldn't find strong matches. Try rephrasing with more specific details."
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {results.map((item, idx) => (
                <Card key={item.id} hover onClick={() => setModal(item)}
                  style={{ padding: 0, animation: `fadeUp 0.35s ease ${idx * 60}ms both` }}>
                  <div style={{ padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    {/* Emoji icon */}
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ width: 54, height: 54, borderRadius: "var(--radius-md)", background: "var(--c-surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                        {CATEGORY_EMOJI[item.category] || "📦"}
                      </div>
                      {idx === 0 && (
                        <div style={{ textAlign: "center", marginTop: 4, fontSize: 10, fontWeight: 700, color: "var(--c-amber)", fontFamily: "var(--font-display)" }}>BEST</div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
                        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>{item.title}</h3>
                        <div style={{
                          flexShrink: 0, background: scoreBg(item.score), color: scoreColor(item.score),
                          padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 800, fontFamily: "var(--font-display)",
                        }}>
                          {item.score}%
                        </div>
                      </div>

                      <p style={{ fontSize: 13, color: "var(--c-text2)", lineHeight: 1.55, marginBottom: 10 }}>
                        {item.description?.slice(0, 120)}…
                      </p>

                      {item.reason && (
                        <div style={{ background: "var(--c-blue-bg)", borderRadius: "var(--radius-sm)", padding: "6px 10px", marginBottom: 10 }}>
                          <p style={{ fontSize: 12, color: "var(--c-blue)", fontStyle: "italic" }}>🤖 {item.reason}</p>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <Badge variant={item.type}>{item.type}</Badge>
                        <span style={{ fontSize: 12, color: "var(--c-text3)" }}>📍 {item.location}</span>
                        <span style={{ fontSize: 12, color: "var(--c-text3)" }}>📅 {item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div style={{ height: 4, background: "var(--c-surface2)" }}>
                    <div style={{
                      height: "100%", width: `${item.score}%`,
                      background: scoreColor(item.score),
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <ItemModal item={modal} onClose={() => setModal(null)} onToggleSave={() => {}} />
    </div>
  );
}