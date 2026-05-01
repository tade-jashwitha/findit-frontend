// pages/Home.jsx
import { useState } from "react";
import { Card, Button } from "../components/UI";
import { ItemCard } from "../components/ItemCard";
import { ItemModal } from "../components/ItemModal";
import { STATS } from "../utils/constants";

export default function Home({ items, onToggleSave, setPage }) {
  const [modal, setModal] = useState(null);
  const recent = items.slice(0, 3);

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg,var(--c-text) 0%,#3D2810 60%,#1A1714 100%)",
        padding: "90px 24px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* dot grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle,#D4531A 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        {/* glow */}
        <div style={{
          position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600,
          background: "radial-gradient(circle,rgba(212,83,26,0.15),transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="fade-up" style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(212,83,26,0.15)", border: "1px solid rgba(212,83,26,0.3)",
            borderRadius: 999, padding: "6px 16px", marginBottom: 28,
          }}>
            <span style={{ fontSize: 12, color: "#F0733A", fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
              🎓 CAMPUS LOST &amp; FOUND
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(34px,6vw,62px)", color: "#F6F4EF",
            lineHeight: 1.08, marginBottom: 22, letterSpacing: "-1.5px",
          }}>
            Lost something?<br />
            <span style={{ color: "var(--c-accent2)" }}>We'll help you find it.</span>
          </h1>

          <p style={{
            fontSize: 17, color: "rgba(246,244,239,0.7)", lineHeight: 1.65,
            marginBottom: 44, maxWidth: 500, margin: "0 auto 44px",
          }}>
            The smarter way to reunite lost items with their owners across campus.
            Report, browse, and match — powered by real AI.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="accent" size="lg" onClick={() => setPage("browse")}>Browse Items</Button>
            <Button variant="ghost" size="lg" onClick={() => setPage("report")}
              style={{ color: "#F6F4EF", borderColor: "rgba(246,244,239,0.25)" }}>
              Report Item
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 24px 0" }}>
        <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
          {STATS.map((s, i) => (
            <Card key={s.label} style={{ padding: "20px 22px", animation: "fadeUp 0.4s ease both", animationDelay: `${i * 60}ms` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "var(--radius-md)",
                  background: s.color + "15",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>{s.icon}</div>
                <div>
                  <p style={{ fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)", color: s.color, letterSpacing: "-0.5px" }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: "var(--c-text2)" }}>{s.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, letterSpacing: "-0.5px" }}>How It Works</h2>
          <p style={{ fontSize: 15, color: "var(--c-text2)", marginTop: 8 }}>Three simple steps to recover your belongings</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
          {[
            { step: "01", icon: "📝", title: "Report", desc: "Submit details about your lost or found item with photos and precise location." },
            { step: "02", icon: "🤖", title: "AI Match", desc: "Describe your item or upload a photo — Claude AI scans all listings to find best matches." },
            { step: "03", icon: "🤝", title: "Connect", desc: "Get in touch directly with the finder or owner and safely reclaim your item." },
          ].map((s, i) => (
            <Card key={s.step} style={{ padding: "28px 24px", textAlign: "center", position: "relative", animation: "fadeUp 0.4s ease both", animationDelay: `${i * 80}ms` }}>
              <div style={{ position: "absolute", top: 16, right: 16, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--c-border)", letterSpacing: "-1px" }}>{s.step}</div>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "var(--c-text2)", lineHeight: 1.65 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Recent listings ── */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.5px" }}>Recent Listings</h2>
            <p style={{ fontSize: 14, color: "var(--c-text2)", marginTop: 4 }}>Latest reported items on campus</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setPage("browse")}>View All →</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {recent.map(item => (
            <ItemCard key={item.id} item={item} onViewDetails={setModal} onToggleSave={onToggleSave} />
          ))}
        </div>
      </section>

      <ItemModal item={modal} onClose={() => setModal(null)} onToggleSave={onToggleSave} />
    </div>
  );
}