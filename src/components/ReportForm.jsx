// src/components/ReportForm.jsx — Report lost or found item
import { useState } from "react";
import { itemsAPI, aiAPI } from "../utils/api";

const CATEGORIES = [
  "Electronics", "Clothing", "Accessories", "Books & Notes",
  "ID & Cards", "Keys", "Bags & Wallets", "Sports Equipment",
  "Stationery", "Musical Instruments", "Glasses & Eyewear", "Other",
];

export default function ReportForm({ onSuccess }) {
  const [type, setType] = useState("lost");
  const [form, setForm] = useState({
    title: "", description: "", category: "",
    building: "", specificArea: "", date: "",
    contactEmail: "", contactPhone: "",
    rewardOffered: false, rewardAmount: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type: t, checked } = e.target;
    setForm((f) => ({ ...f, [name]: t === "checkbox" ? checked : value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Build FormData (required for file upload)
      const fd = new FormData();
      fd.append("type", type);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("location", JSON.stringify({
        building: form.building,
        specificArea: form.specificArea,
      }));
      fd.append("date", form.date);
      fd.append("contactEmail", form.contactEmail);
      if (form.contactPhone) fd.append("contactPhone", form.contactPhone);
      fd.append("reward", JSON.stringify({
        offered: form.rewardOffered,
        amount: form.rewardOffered ? Number(form.rewardAmount) : 0,
      }));
      if (image) fd.append("image", image);

      // Submit to backend
      const res = await itemsAPI.create(fd);

      // Optionally generate AI tags in background
      aiAPI.generateTags({
        title: form.title,
        description: form.description,
        category: form.category,
      }).catch(() => {}); // Non-blocking

      setSuccess(true);
      onSuccess?.(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem" }}>✅</div>
        <h2>Report Submitted!</h2>
        <p>Your {type} item has been posted. We'll notify you if a match is found.</p>
        <button onClick={() => { setSuccess(false); setForm({ title:"",description:"",category:"",building:"",specificArea:"",date:"",contactEmail:"",contactPhone:"",rewardOffered:false,rewardAmount:"" }); setImage(null); setPreview(null); }}>
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Lost / Found Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["lost", "found"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "2px solid",
              borderColor: type === t ? (t === "lost" ? "#ef4444" : "#22c55e") : "#e5e7eb",
              background: type === t ? (t === "lost" ? "#fef2f2" : "#f0fdf4") : "#fff",
              fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
            }}
          >
            {t === "lost" ? "🔍 I Lost Something" : "📦 I Found Something"}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Image Upload */}
      <label style={{ display: "block", marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>Photo (optional)</span>
        <div
          style={{
            border: "2px dashed #d1d5db", borderRadius: 8, padding: 20,
            textAlign: "center", cursor: "pointer", marginTop: 6,
            background: preview ? "#f9fafb" : "#fff",
          }}
          onClick={() => document.getElementById("imgInput").click()}
        >
          {preview ? (
            <img src={preview} alt="preview" style={{ maxHeight: 160, borderRadius: 6 }} />
          ) : (
            <span style={{ color: "#9ca3af" }}>Click to upload image</span>
          )}
        </div>
        <input id="imgInput" type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
      </label>

      {/* Title */}
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Item Title *</span>
        <input
          name="title" value={form.title} onChange={handleChange} required
          placeholder="e.g. Black iPhone 14 Pro"
          style={{ display: "block", width: "100%", padding: "8px 12px", marginTop: 4, borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }}
        />
      </label>

      {/* Category */}
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Category *</span>
        <select
          name="category" value={form.category} onChange={handleChange} required
          style={{ display: "block", width: "100%", padding: "8px 12px", marginTop: 4, borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      {/* Description */}
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Description *</span>
        <textarea
          name="description" value={form.description} onChange={handleChange} required rows={3}
          placeholder="Color, brand, distinguishing features..."
          style={{ display: "block", width: "100%", padding: "8px 12px", marginTop: 4, borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box", resize: "vertical" }}
        />
      </label>

      {/* Location */}
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Building / Location *</span>
        <input
          name="building" value={form.building} onChange={handleChange} required
          placeholder="e.g. Library, Canteen, Block A"
          style={{ display: "block", width: "100%", padding: "8px 12px", marginTop: 4, borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Specific Area (optional)</span>
        <input
          name="specificArea" value={form.specificArea} onChange={handleChange}
          placeholder="e.g. Near vending machine, 3rd floor"
          style={{ display: "block", width: "100%", padding: "8px 12px", marginTop: 4, borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }}
        />
      </label>

      {/* Date */}
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Date {type === "lost" ? "Lost" : "Found"} *</span>
        <input
          type="date" name="date" value={form.date} onChange={handleChange} required
          style={{ display: "block", width: "100%", padding: "8px 12px", marginTop: 4, borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }}
        />
      </label>

      {/* Contact */}
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Contact Email *</span>
        <input
          type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} required
          placeholder="your@email.com"
          style={{ display: "block", width: "100%", padding: "8px 12px", marginTop: 4, borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }}
        />
      </label>

      {/* Reward (only for Lost items) */}
      {type === "lost" && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" name="rewardOffered" checked={form.rewardOffered} onChange={handleChange} />
            <span style={{ fontWeight: 600 }}>Offering a reward</span>
          </label>
          {form.rewardOffered && (
            <input
              type="number" name="rewardAmount" value={form.rewardAmount} onChange={handleChange}
              placeholder="Amount (₹)"
              style={{ display: "block", width: "100%", padding: "8px 12px", marginTop: 8, borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }}
            />
          )}
        </div>
      )}

      <button
        type="submit" disabled={loading}
        style={{
          width: "100%", padding: "12px", borderRadius: 10, border: "none",
          background: loading ? "#9ca3af" : type === "lost" ? "#ef4444" : "#22c55e",
          color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Submitting..." : `Submit ${type === "lost" ? "Lost" : "Found"} Item Report`}
      </button>
    </form>
  );
}
