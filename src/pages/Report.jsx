// src/pages/Report.jsx — with auto-match results display
import { useState } from "react";
import T from "../utils/tokens";
import { Input, Button, Card, Badge, BottomNav } from "../components/shared";
import { itemsAPI, getErrorMessage } from "../utils/api";

const CATEGORIES = ["Bags & Wallets", "Electronics", "Keys", "ID & Cards", "Clothing", "Books & Notes", "Accessories", "Other"];
const CAT_EMOJI  = { "Bags & Wallets":"🎒", Electronics:"📱", Keys:"🔑", "ID & Cards":"🪪", Clothing:"👕", "Books & Notes":"📚", Accessories:"💍", Other:"📦" };

const scoreColor = s => s >= 70 ? "#22C55E" : s >= 50 ? "#06B6D4" : "#F59E0B";

function getLocation(item) {
  if (!item) return "Campus";
  if (item.location?.building) return item.location.building;
  if (typeof item.location === "string") return item.location;
  return item.building || "Campus";
}

export default function Report({ setPage, user }) {
  const [type,     setType]     = useState("lost");
  const [category, setCategory] = useState("Bags & Wallets");
  const [form,     setForm]     = useState({ title: "", location: "", date: "", description: "", contact: user?.email || "" });
  const [photo,    setPhoto]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [matches,  setMatches]  = useState([]);
  const [error,    setError]    = useState("");

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim())    { setError("Item name is required"); return; }
    if (!form.location.trim()) { setError("Location is required"); return; }
    if (!form.contact.trim())  { setError("Contact email is required"); return; }
    if (!form.date)            { setError("Date is required"); return; }

    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("type",         type);
      fd.append("title",        form.title.trim());
      fd.append("description",  form.description.trim() || form.title.trim());
      fd.append("category",     category);
      fd.append("building",     form.location.trim());
      fd.append("date",         new Date(form.date).toISOString());
      fd.append("contactEmail", form.contact.trim());
      if (photo) fd.append("image", photo);

      const res = await itemsAPI.create(fd);
      setMatches(res.data?.matches || []);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen with match results ─────────────────────────────────
  if (success) return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      color: T.text, fontFamily: T.font, paddingBottom: 100,
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>

        {/* Success header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 64, animation: "float 2s ease infinite", marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 8 }}>Report Submitted!</h2>
          <p style={{ color: T.text2, fontSize: 14, lineHeight: 1.6 }}>
            Your {type} item has been posted to the campus network.
          </p>
        </div>

        {/* ⚡ Possible Matches */}
        {matches.length > 0 && (
          <Card padding="20px" style={{ marginBottom: 20, border: "1px solid rgba(245,158,11,0.35)", background: "rgba(245,158,11,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#FCD34D" }}>Possible Matches Found!</p>
                <p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>
                  {matches.length} potential {type === "lost" ? "found" : "lost"} item{matches.length > 1 ? "s" : ""} may match yours
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {matches.map((m, i) => (
                <div key={m.item?._id || i} style={{
                  background: T.surfaceMd, borderRadius: T.r,
                  padding: "12px 14px", border: `1px solid ${T.border}`,
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{CAT_EMOJI[m.item?.category] || "📦"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: 13 }}>{m.item?.title}</p>
                      <span style={{
                        background: `${scoreColor(m.score)}22`,
                        color: scoreColor(m.score),
                        border: `1px solid ${scoreColor(m.score)}44`,
                        padding: "2px 8px", borderRadius: 999,
                        fontSize: 11, fontWeight: 800,
                      }}>{m.score}%</span>
                    </div>
                    <p style={{ fontSize: 11, color: T.text3, marginBottom: 4 }}>
                      📍 {getLocation(m.item)} · <Badge type={m.item?.type} />
                    </p>
                    {m.reasons?.length > 0 && (
                      <p style={{ fontSize: 11, color: "#A78BFA", fontStyle: "italic" }}>
                        🤖 {m.reasons.slice(0, 2).join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPage("browse")}
              style={{
                width: "100%", marginTop: 14, padding: "11px",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.35)",
                borderRadius: T.rMd, color: "#FCD34D",
                fontFamily: T.font, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              View All Matches in Browse →
            </button>
          </Card>
        )}

        {/* No matches */}
        {matches.length === 0 && (
          <Card padding="16px" style={{ marginBottom: 20, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: T.text2 }}>
              🔍 No exact matches yet — you'll be notified when one is found!
            </p>
          </Card>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Button fullWidth size="lg" onClick={() => {
            setSuccess(false);
            setMatches([]);
            setForm({ title: "", location: "", date: "", description: "", contact: user?.email || "" });
          }}>
            Submit Another Report
          </Button>
          <button onClick={() => setPage("home")} style={{
            background: "none", border: "none", color: T.text2,
            cursor: "pointer", fontSize: 14, fontFamily: T.font, padding: 8,
          }}>← Back to Home</button>
        </div>
      </div>
      <BottomNav active="report" setPage={setPage} />
    </div>
  );

  return (
    <>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, paddingBottom: 100 }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px" }}>

          {/* Header */}
          <div style={{ padding: "32px 0 24px" }}>
            <button onClick={() => setPage("home")} style={{
              background: "none", border: "none", color: T.text2,
              cursor: "pointer", fontSize: 13, fontFamily: T.font, marginBottom: 12, padding: 0, display: "flex", alignItems: "center", gap: 4,
            }}>← Back</button>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Report Item</h1>
            <p style={{ fontSize: 13, color: T.text2 }}>AI will automatically match your report with existing listings</p>
          </div>

          {/* Lost / Found toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {["lost", "found"].map(t => (
              <button
                key={t} type="button" onClick={() => setType(t)}
                style={{
                  padding: "18px 16px", borderRadius: T.rMd,
                  background: type === t
                    ? (t === "lost" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.1)")
                    : T.surface,
                  border: `1.5px solid ${type === t
                    ? (t === "lost" ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)")
                    : T.border}`,
                  color: type === t ? (t === "lost" ? T.red : T.green) : T.text2,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 28 }}>{t === "lost" ? "🔍" : "📦"}</span>
                <span>I {t === "lost" ? "Lost" : "Found"} an Item</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <Card padding="24px" style={{ marginBottom: 16 }}>
            <Input label="Item Name" placeholder="e.g. Black Nike backpack" value={form.title} onChange={set("title")} icon="🏷️" required />

            {/* Category */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8, letterSpacing: "0.02em" }}>
                CATEGORY <span style={{ color: T.violet }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setCategory(c)} style={{
                    padding: "6px 13px", borderRadius: 999,
                    background: category === c ? "rgba(124,58,237,0.15)" : T.surfaceMd,
                    border: `1px solid ${category === c ? "rgba(124,58,237,0.5)" : T.border}`,
                    color: category === c ? "#A78BFA" : T.text2,
                    fontSize: 12, fontWeight: category === c ? 700 : 500,
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    {CAT_EMOJI[c]} {c}
                  </button>
                ))}
              </div>
            </div>

            <Input label="Last Seen Location" placeholder="Main library, 2nd floor" value={form.location} onChange={set("location")} icon="📍" required />
            <Input label="Date & Time" type="datetime-local" value={form.date} onChange={set("date")} icon="📅" required />

            {/* Photo */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8, letterSpacing: "0.02em" }}>PHOTO (OPTIONAL)</label>
              <label style={{
                display: "block", padding: "24px 20px",
                borderRadius: T.rMd, border: "1.5px dashed rgba(255,255,255,0.1)",
                textAlign: "center", cursor: "pointer",
                background: photo ? "rgba(124,58,237,0.08)" : T.surfaceMd,
                transition: "all 0.2s",
              }}>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => setPhoto(e.target.files[0])} />
                {photo ? (
                  <p style={{ fontSize: 13, color: T.green, fontWeight: 600 }}>✅ {photo.name}</p>
                ) : (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
                    <p style={{ fontSize: 13, color: T.text2, fontWeight: 600 }}>Tap to add photo</p>
                    <p style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>Makes it easier to identify</p>
                  </>
                )}
              </label>
            </div>

            <Input label="Description" placeholder="Brown straps, red Nike logo, laptop inside..." value={form.description} onChange={set("description")} rows={3} />
            <Input label="Contact Email" type="email" placeholder="you@campus.edu" value={form.contact} onChange={set("contact")} icon="📧" required />

            {error && (
              <div style={{
                background: T.redBg, border: `1px solid ${T.redBord}`,
                borderRadius: T.r, padding: "10px 14px", marginBottom: 16,
                fontSize: 13, color: T.red, display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>
              {loading ? "Submitting & Matching…" : "Submit Report ↗"}
            </Button>
            {!loading && (
              <p style={{ fontSize: 11, color: T.text3, textAlign: "center", marginTop: 10 }}>
                🤖 AI will automatically scan for matches on submission
              </p>
            )}
          </Card>
        </div>
      </div>

      <BottomNav active="report" setPage={setPage} />
    </>
  );
}