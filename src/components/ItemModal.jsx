// components/ItemModal.jsx
import { useEffect } from "react";
import { Badge, Button } from "./UI";
import { CATEGORY_EMOJI } from "../utils/constants";
import { toast } from "../utils/toast";

export function ItemModal({ item, onClose, onToggleSave }) {
  useEffect(() => {
    if (!item) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        animation: "fadeIn 0.2s ease",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="scale-in"
        style={{
          background: "var(--c-surface)", borderRadius: "var(--radius-xl)",
          maxWidth: 540, width: "100%", boxShadow: "var(--shadow-lg)",
          overflow: "hidden", maxHeight: "90vh", overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid var(--c-border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, background: "var(--c-surface)", zIndex: 1,
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Item Details</h2>
          <button onClick={onClose} style={{
            background: "var(--c-surface2)", border: "none", cursor: "pointer",
            fontSize: 18, color: "var(--c-text2)", width: 32, height: 32,
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {/* Title row */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "var(--radius-lg)",
              background: "var(--c-surface2)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0,
            }}>
              {CATEGORY_EMOJI[item.category] || "📦"}
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10, lineHeight: 1.2 }}>
                {item.title}
              </h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge variant={item.type}>{item.type}</Badge>
                <Badge>{item.category}</Badge>
                {item.status === "claimed" && <Badge variant="claimed">Claimed</Badge>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ background: "var(--c-surface2)", borderRadius: "var(--radius-md)", padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: "var(--c-text2)", lineHeight: 1.7 }}>{item.description}</p>
          </div>

          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              ["📍 Location", item.location],
              ["📅 Date", item.date],
              ["📧 Contact", item.contact],
              ["🏷 Status", item.status],
            ].map(([l, v]) => (
              <div key={l} style={{ background: "var(--c-surface2)", padding: "10px 14px", borderRadius: "var(--radius-md)" }}>
                <p style={{ fontSize: 11, color: "var(--c-text3)", fontWeight: 600, marginBottom: 2, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>{l}</p>
                <p style={{ fontSize: 13, color: "var(--c-text)", fontWeight: 500, textTransform: "capitalize" }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <Button fullWidth onClick={() => { toast.success("Contact info copied! ✓"); onClose(); }}>
              ✉️ Contact {item.type === "found" ? "Finder" : "Owner"}
            </Button>
            <Button variant="secondary" onClick={() => { onToggleSave(item.id); toast.info(item.saved ? "Removed from saved" : "Saved! 🔖"); }}>
              {item.saved ? "❤️ Saved" : "🤍 Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}