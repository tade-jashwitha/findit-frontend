// src/pages/Report.jsx
import { useState } from "react";
import T from "../utils/tokens";
import { Input, Button, Card, BottomNav } from "../components/shared";
import { itemsAPI, getErrorMessage } from "../utils/api";

const CATEGORIES = ["Bags & Wallets", "Electronics", "Keys", "ID & Cards", "Clothing", "Books & Notes", "Accessories", "Other"];
const CAT_EMOJI  = { "Bags & Wallets":"🎒", Electronics:"📱", Keys:"🔑", "ID & Cards":"🪪", Clothing:"👕", "Books & Notes":"📚", Accessories:"💍", Other:"📦" };

export default function Report({ setPage, user }) {
  const [type,     setType]     = useState("lost");
  const [category, setCategory] = useState("Bags & Wallets");
  const [form,     setForm]     = useState({ title: "", location: "", date: "", description: "", contact: user?.email || "" });
  const [photo,    setPhoto]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
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
      await itemsAPI.create(fd);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{
      minHeight: "100vh", background: T.bg, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: T.font, color: T.text, textAlign: "center",
    }}>
      <div style={{ fontSize: 72, animation: "float 2s ease infinite", marginBottom: 24 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1px", marginBottom: 8 }}>Report Submitted!</h2>
      <p style={{ color: T.text2, fontSize: 15, marginBottom: 32, maxWidth: 300, lineHeight: 1.6 }}>
        Your {type} item has been posted. You'll be notified when a match is found.
      </p>
      <Button size="lg" onClick={() => { setSuccess(false); setForm({ title:"", location:"", date:"", description:"", contact:user?.email||"" }); }}>
        Submit Another
      </Button>
      <button onClick={() => setPage("home")} style={{
        marginTop: 14, background: "none", border: "none",
        color: T.text2, cursor: "pointer", fontSize: 14, fontFamily: T.font,
      }}>← Back to Home</button>
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
            <p style={{ fontSize: 13, color: T.text2 }}>Help others identify your item</p>
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
              Submit Report ↗
            </Button>
          </Card>
        </div>
      </div>

      <BottomNav active="report" setPage={setPage} />
    </>
  );
}