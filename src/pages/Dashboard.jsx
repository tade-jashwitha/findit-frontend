// pages/Dashboard.jsx
import { useState } from "react";
import { Button, Card, EmptyState } from "../components/UI";
import { ItemCard } from "../components/ItemCard";
import { ItemModal } from "../components/ItemModal";

export default function Dashboard({ user, items, onToggleSave, setPage }) {
  const [tab, setTab]   = useState("saved");
  const [modal, setModal] = useState(null);

  const saved   = items.filter(i => i.saved);
  const myItems = items.filter(i => i.contact === user?.email);

  const quickStats = [
    { label: "Saved Items", val: saved.length,                               icon: "🔖", color: "var(--c-amber)" },
    { label: "My Reports",  val: myItems.length,                             icon: "📤", color: "var(--c-accent)" },
    { label: "Open Items",  val: items.filter(i => i.status==="open").length,icon: "🔍", color: "var(--c-blue)"  },
    { label: "Claimed",     val: items.filter(i => i.status==="claimed").length,icon:"✅",color:"var(--c-green)" },
  ];

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 24px" }}>

      {/* User header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg,var(--c-accent),var(--c-accent2))",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22,
          boxShadow: "var(--shadow-accent)", flexShrink: 0,
        }}>
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.5px", marginBottom: 2 }}>
            {user.name}'s Dashboard
          </h1>
          <p style={{ fontSize: 14, color: "var(--c-text2)" }}>
            {user.email} · {saved.length} saved · {myItems.length} reported
          </p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button variant="accent" size="sm" onClick={() => setPage("report")}>+ Report Item</Button>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 36 }}>
        {quickStats.map(s => (
          <Card key={s.label} style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: s.color }}>{s.val}</p>
            <p style={{ fontSize: 12, color: "var(--c-text2)", marginTop: 2 }}>{s.icon} {s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, background: "var(--c-surface2)",
        border: "1px solid var(--c-border)", borderRadius: "var(--radius-sm)",
        padding: 4, marginBottom: 24, width: "fit-content",
      }}>
        {[{ id: "saved", label: "🔖 Saved Items" }, { id: "reported", label: "📤 My Reports" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer",
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14,
            background: tab === t.id ? "var(--c-surface)" : "transparent",
            color: tab === t.id ? "var(--c-text)" : "var(--c-text2)",
            boxShadow: tab === t.id ? "var(--shadow-sm)" : "none",
            transition: "all var(--transition)",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "saved" && (
        saved.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="No saved items"
            subtitle="Browse items and tap the 🤍 heart to save them for later."
            action={<Button onClick={() => setPage("browse")}>Browse Items</Button>}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {saved.map(item => <ItemCard key={item.id} item={item} onViewDetails={setModal} onToggleSave={onToggleSave} />)}
          </div>
        )
      )}

      {tab === "reported" && (
        myItems.length === 0 ? (
          <EmptyState
            icon="📤"
            title="No reports yet"
            subtitle="You haven't reported any items yet."
            action={<Button onClick={() => setPage("report")}>Report an Item</Button>}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {myItems.map(item => <ItemCard key={item.id} item={item} onViewDetails={setModal} onToggleSave={onToggleSave} />)}
          </div>
        )
      )}

      <ItemModal item={modal} onClose={() => setModal(null)} onToggleSave={onToggleSave} />
    </div>
  );
}