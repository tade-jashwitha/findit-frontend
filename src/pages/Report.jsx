// pages/Report.jsx
import { useState, useRef } from "react";
import { Button, Card, Input, Select, Textarea } from "../components/UI";
import { ImageUpload } from "../components/ImageUpload";
import { CATEGORIES, CATEGORY_EMOJI } from "../utils/constants";
import { toast } from "../utils/toast";

export default function Report({ user, setPage, onAddItem }) {
  const [form, setForm] = useState({
    type: "lost", title: "", category: "", location: "",
    date: new Date().toISOString().split("T")[0],
    description: "", contact: user?.email || "",
  });
  const [errors, setErrors]   = useState({});
  const [img, setImg]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.date) e.date = "Date is required";
    if (form.description.trim().length < 20) e.description = "Please write at least 20 characters";
    if (!form.contact.trim()) e.contact = "Contact info is required";
    return e;
  };

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); toast.error("Please fix the errors below."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    onAddItem({ ...form, id: Date.now(), image: img, status: "open", saved: false });
    setSuccess(true);
    toast.success("Item reported successfully! 🎉");
  };

  // ── Success screen ──
  if (success) return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 24, animation: "float 2s ease infinite" }}>🎉</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, marginBottom: 12, letterSpacing: "-0.5px" }}>Item Reported!</h2>
      <p style={{ color: "var(--c-text2)", lineHeight: 1.7, marginBottom: 36, maxWidth: 380, margin: "0 auto 36px" }}>
        Your listing is now live. You'll be notified when someone claims or matches it.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Button onClick={() => {
          setSuccess(false);
          setForm({ type: "lost", title: "", category: "", location: "", date: new Date().toISOString().split("T")[0], description: "", contact: user?.email || "" });
          setImg(null);
        }}>
          Report Another
        </Button>
        <Button variant="secondary" onClick={() => setPage("browse")}>Browse Items</Button>
      </div>
    </div>
  );

  // ── Auth gate ──
  if (!user) return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, marginBottom: 10 }}>Login Required</h2>
      <p style={{ color: "var(--c-text2)", marginBottom: 28, lineHeight: 1.6 }}>
        You need to sign in before reporting an item so we can contact you if it's found.
      </p>
      <Button onClick={() => setPage("login")}>Sign In to Continue</Button>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, letterSpacing: "-0.5px", marginBottom: 6 }}>
          Report an Item
        </h1>
        <p style={{ fontSize: 15, color: "var(--c-text2)" }}>Fill in the details to create a lost or found listing</p>
      </div>

      <Card style={{ padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Type toggle */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text2)", fontFamily: "var(--font-display)", display: "block", marginBottom: 8 }}>
              I am reporting a…
            </label>
            <div style={{ display: "flex", background: "var(--c-surface2)", border: "1px solid var(--c-border)", borderRadius: "var(--radius-sm)", padding: 3, width: "fit-content" }}>
              {["lost", "found"].map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))} style={{
                  padding: "10px 28px", borderRadius: 6, border: "none", cursor: "pointer",
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, textTransform: "capitalize",
                  background: form.type === t ? (t === "lost" ? "var(--c-red)" : "var(--c-green)") : "transparent",
                  color: form.type === t ? "#fff" : "var(--c-text2)",
                  transition: "all var(--transition)",
                }}>
                  {t === "lost" ? "😟" : "🙋"} {t} Item
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Input label="Item Title *" placeholder='e.g. Black iPhone 15 with blue silicone case'
                value={form.title} onChange={set("title")} error={errors.title} icon="📦" />
            </div>
            <Select
              label="Category *" value={form.category} onChange={set("category")} error={errors.category}
              options={[{ value: "", label: "Select category…" }, ...CATEGORIES.slice(1).map(c => ({ value: c, label: `${CATEGORY_EMOJI[c] || ""} ${c}` }))]}
            />
            <Input label="Date *" type="date" value={form.date} onChange={set("date")} error={errors.date} />
            <div style={{ gridColumn: "1/-1" }}>
              <Input label="Location *" placeholder="e.g. Library Block B, near entrance"
                value={form.location} onChange={set("location")} error={errors.location} icon="📍" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <Textarea
                label="Description *"
                placeholder="Describe the item in detail — color, brand, markings, condition, distinctive features…"
                value={form.description} onChange={set("description")} error={errors.description}
                rows={4} hint="More detail = better AI matching."
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <Input label="Your Contact (email / phone) *"
                placeholder="so the finder can reach you"
                value={form.contact} onChange={set("contact")} error={errors.contact} icon="📧" />
            </div>
          </div>

          <ImageUpload preview={img} onFile={setImg} onRemove={() => setImg(null)} hint="PNG, JPG up to 5MB — helps with AI matching!" />

          {/* Info banner */}
          <div style={{
            background: "var(--c-blue-bg)", border: "1px solid rgba(29,78,216,0.15)",
            borderRadius: "var(--radius-md)", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <span>💡</span>
            <p style={{ fontSize: 13, color: "var(--c-blue)", lineHeight: 1.55 }}>
              Adding a photo and detailed description significantly improves AI matching accuracy.
            </p>
          </div>

          <Button fullWidth loading={loading} onClick={handleSubmit} size="lg" variant="accent">
            {loading ? "Submitting…" : form.type === "lost" ? "📤 Report Lost Item" : "📥 Report Found Item"}
          </Button>
        </div>
      </Card>
    </div>
  );
}