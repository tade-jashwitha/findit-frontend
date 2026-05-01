// components/ItemCard.jsx
import { useState } from "react";
import { Badge, Card } from "./UI";
import { CATEGORY_EMOJI } from "../utils/constants";
import { toast } from "../utils/toast";

export function ItemCard({ item, onViewDetails, onToggleSave }) {
  const [heartAnim, setHeartAnim] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    onToggleSave(item.id);
    toast.info(item.saved ? "Removed from saved" : "Item saved! 🔖");
  };

  return (
    <Card hover onClick={() => onViewDetails(item)} style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 20, flex: 1 }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{
            width: 50, height: 50, borderRadius: "var(--radius-md)",
            background: "var(--c-surface2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          }}>
            {CATEGORY_EMOJI[item.category] || "📦"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <Badge variant={item.type}>{item.type}</Badge>
            {item.status === "claimed" && <Badge variant="claimed">Claimed</Badge>}
          </div>
        </div>

        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
          color: "var(--c-text)", marginBottom: 6, lineHeight: 1.3, letterSpacing: "-0.2px",
        }}>
          {item.title}
        </h3>

        <p style={{
          fontSize: 13, color: "var(--c-text2)", lineHeight: 1.55, marginBottom: 14,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {item.description}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12 }}>📍</span>
            <span style={{ fontSize: 12, color: "var(--c-text2)" }}>{item.location}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12 }}>📅</span>
            <span style={{ fontSize: 12, color: "var(--c-text2)" }}>{item.date}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 20px", borderTop: "1px solid var(--c-border)",
        background: "var(--c-surface2)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: "var(--c-accent)", fontWeight: 600, fontFamily: "var(--font-display)" }}>
          View Details →
        </span>
        <button
          onClick={handleSave}
          style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 18,
            animation: heartAnim ? "heartbeat 0.4s ease" : "none",
            color: item.saved ? "var(--c-red)" : "var(--c-text3)",
            transition: "color var(--transition)",
          }}
        >
          {item.saved ? "❤️" : "🤍"}
        </button>
      </div>
    </Card>
  );
}