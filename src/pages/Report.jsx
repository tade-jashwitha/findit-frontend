// src/pages/Report.jsx
import { useState } from "react";
import T from "../utils/tokens";
import { Input, Button, Card, Badge, BottomNav, CategoryIcon, ScorePill } from "../components/shared";
import { itemsAPI, getErrorMessage } from "../utils/api";

const CATEGORIES = ["Bags & Wallets", "Electronics", "Keys", "ID & Cards", "Clothing", "Books & Notes", "Accessories", "Other"];

const scoreColor = s => s >= 70 ? T.green : s >= 50 ? T.teal : T.amber;

function getLocation(item) {
  if (!item) return "Campus";
  if (item.location?.building) return item.location.building;
  if (typeof item.location === "string") return item.location;
  return item.building || "Campus";
}

// SVG icons for lost/found toggle
const LostIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? T.red : T.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const FoundIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? T.green : T.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

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

  // ── Success screen ─────────────────────────────────────────────────────
  if (success) return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, paddingBottom: 100 }}>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 20px" }}>

        {/* Success header */}
        <div style={{ textAlign: "center", marginBottom: 32, animation: "scaleIn 0.4s ease both" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: T.greenBg, border: `2px solid ${T.greenBord}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", animation: "float 3s ease infinite",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 8, color: T.text }}>
            Report Submitted!
          </h2>
          <p style={{ color: T.text2, fontSize: 14, lineHeight: 1.65 }}>
            Your {type} item has been posted to the campus network.{" "}
            {matches.length > 0 ? "We found possible matches!" : "You'll be notified when a match is found."}
          </p>
        </div>

        {/* Matches found */}
        {matches.length > 0 && (
          <Card padding="20px" style={{ marginBottom: 20, border: `1.5px solid ${T.amberBord}`, background: T.amberBg, animation: "fadeUp 0.4s ease 0.1s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF3C7", border: `1px solid ${T.amberBord}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#92400E" }}>Possible Matches Found!</p>
                <p style={{ fontSize: 12, color: "#A16207", marginTop: 1 }}>
                  {matches.length} potential {type === "lost" ? "found" : "lost"} item{matches.length > 1 ? "s" : ""} may match yours
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {matches.map((m, i) => (
                <div key={m.item?._id || i} style={{
                  background: T.surface, borderRadius: T.r,
                  padding: "12px 14px", border: `1px solid ${T.border}`,
                  display: "flex", gap: 12, alignItems: "flex-start",
                  animation: `fadeUp 0.3s ease ${i * 0.07}s both`,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: T.surfaceLg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CategoryIcon category={m.item?.category} color={T.teal} size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{m.item?.title}</p>
                      <ScorePill score={m.score} />
                    </div>
                    <p style={{ fontSize: 11, color: T.text3, marginBottom: 4, display: "flex", alignItems: "center", gap: 3 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      {getLocation(m.item)}
                    </p>
                    {m.reasons?.length > 0 && (
                      <p style={{ fontSize: 11, color: T.teal, fontStyle: "italic" }}>
                        {m.reasons.slice(0, 2).join(" · ")}
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
                background: T.amberBg, border: `1.5px solid ${T.amberBord}`,
                borderRadius: T.rMd, color: "#92400E",
                fontFamily: T.font, fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              View All Matches in Browse →
            </button>
          </Card>
        )}

        {/* No matches */}
        {matches.length === 0 && (
          <Card padding="18px" style={{ marginBottom: 20, textAlign: "center", animation: "fadeUp 0.4s ease 0.1s both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <p style={{ fontSize: 13, color: T.text2 }}>No exact matches yet — you'll be notified when one is found!</p>
            </div>
          </Card>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp 0.4s ease 0.2s both" }}>
          <Button fullWidth size="lg" onClick={() => {
            setSuccess(false); setMatches([]);
            setForm({ title: "", location: "", date: "", description: "", contact: user?.email || "" });
          }}>
            Submit Another Report
          </Button>
          <button onClick={() => setPage("home")} style={{
            background: "none", border: "none", color: T.text2,
            cursor: "pointer", fontSize: 14, fontFamily: T.font, padding: 8,
          }}>
            ← Back to Home
          </button>
        </div>
      </div>
      <BottomNav active="report" setPage={setPage} />
    </div>
  );

  return (
    <>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, paddingBottom: 100 }}>

        {/* Header strip */}
        <div style={{
          background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
          borderBottom: "1px solid #BAE6FD",
          padding: "36px 20px 28px",
        }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <button onClick={() => setPage("home")} style={{
              background: "none", border: "none", color: T.text2,
              cursor: "pointer", fontSize: 13, fontFamily: T.font,
              marginBottom: 14, padding: 0, display: "flex", alignItems: "center", gap: 5,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4, color: T.text }}>Report Item</h1>
            <p style={{ fontSize: 13, color: T.text2 }}>AI will automatically match your report with existing listings</p>
          </div>
        </div>

        <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 20px 0" }}>

          {/* Lost / Found toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {["lost", "found"].map(t => (
              <button
                key={t} type="button" onClick={() => setType(t)}
                style={{
                  padding: "18px 16px", borderRadius: T.rMd,
                  background: type === t
                    ? (t === "lost" ? T.redBg : T.greenBg)
                    : T.surface,
                  border: `1.5px solid ${type === t
                    ? (t === "lost" ? T.redBord : T.greenBord)
                    : T.border}`,
                  color: type === t ? (t === "lost" ? T.red : T.green) : T.text2,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
                  transform: type === t ? "scale(1.02)" : "scale(1)",
                  boxShadow: type === t ? T.shadowMd : T.shadow,
                  fontFamily: T.font,
                }}
              >
                {t === "lost" ? <LostIcon active={type === t} /> : <FoundIcon active={type === t} />}
                <span>I {t === "lost" ? "Lost" : "Found"} an Item</span>
              </button>
            ))}
          </div>

          {/* Form card */}
          <Card padding="24px" style={{ marginBottom: 16 }}>
            <Input
              label="Item Name" placeholder="e.g. Black Nike backpack"
              value={form.title} onChange={set("title")}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              }
              required
            />

            {/* Category */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8, letterSpacing: "0.03em" }}>
                CATEGORY <span style={{ color: T.teal }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setCategory(c)} style={{
                    padding: "6px 12px", borderRadius: 999,
                    background: category === c ? "#EFF6FF" : T.surface,
                    border: `1.5px solid ${category === c ? T.borderHov : T.border}`,
                    color: category === c ? T.teal : T.text2,
                    fontSize: 12, fontWeight: category === c ? 700 : 500,
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 6, fontFamily: T.font,
                  }}>
                    <CategoryIcon category={c} color={category === c ? T.teal : T.text3} size={13} />
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Last Seen Location" placeholder="Main library, 2nd floor"
              value={form.location} onChange={set("location")}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
              required
            />
            <Input
              label="Date & Time" type="datetime-local"
              value={form.date} onChange={set("date")}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              required
            />

            {/* Photo upload */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8, letterSpacing: "0.03em" }}>
                PHOTO <span style={{ color: T.text3, fontWeight: 400 }}>(optional — helps AI detect features)</span>
              </label>
              <label style={{
                display: "block", padding: "22px 20px",
                borderRadius: T.rMd, border: `1.5px dashed ${photo ? T.greenBord : T.border}`,
                textAlign: "center", cursor: "pointer",
                background: photo ? T.greenBg : T.surfaceMd,
                transition: "all 0.22s",
              }}
                onMouseEnter={e => { if (!photo) e.currentTarget.style.borderColor = T.borderHov; }}
                onMouseLeave={e => { if (!photo) e.currentTarget.style.borderColor = T.border; }}
              >
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => setPhoto(e.target.files[0])} />
                {photo ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <p style={{ fontSize: 13, color: T.green, fontWeight: 600 }}>{photo.name}</p>
                  </div>
                ) : (
                  <>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: T.surfaceLg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <p style={{ fontSize: 13, color: T.text2, fontWeight: 600 }}>Tap to add photo</p>
                    <p style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>AI will extract visual features automatically</p>
                  </>
                )}
              </label>
            </div>

            <Input
              label="Description" placeholder="Brown straps, red Nike logo, laptop inside..."
              value={form.description} onChange={set("description")} rows={3}
            />
            <Input
              label="Contact Email" type="email" placeholder="you@campus.edu"
              value={form.contact} onChange={set("contact")}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
              required
            />

            {error && (
              <div style={{
                background: T.redBg, border: `1px solid ${T.redBord}`,
                borderRadius: T.r, padding: "10px 14px", marginBottom: 16,
                fontSize: 13, color: T.red, display: "flex", alignItems: "center", gap: 8,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            )}

            <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>
              {loading ? "Submitting & Matching…" : "Submit Report"}
            </Button>
            {!loading && (
              <p style={{ fontSize: 11, color: T.text3, textAlign: "center", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z"/></svg>
                AI will automatically scan for matches on submission
              </p>
            )}
          </Card>
        </div>
      </div>

      <BottomNav active="report" setPage={setPage} />
    </>
  );
}