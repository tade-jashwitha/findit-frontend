// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from "react";
import T from "../utils/tokens";
import { Card, Badge, Skeleton, Button, BottomNav, CategoryIcon } from "../components/shared";
import api, { authAPI, authHelpers } from "../utils/api";

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getLocationStr(item) {
  if (item.building) return item.building;
  if (typeof item.location === "object" && item.location)
    return item.location.building || item.location.specificArea || "Campus";
  return item.location || "Campus";
}

// ── Status pill ──────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    active:   { label: "Active",   color: T.teal,   bg: "#E0F2FE",  border: T.borderHov },
    claimed:  { label: "Claimed",  color: T.amber,  bg: T.amberBg,  border: T.amberBord },
    reunited: { label: "Reunited", color: T.green,  bg: T.greenBg,  border: T.greenBord },
    closed:   { label: "Closed",   color: T.text3,  bg: T.surfaceMd, border: T.border   },
  };
  const s = map[status] || map.active;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 999,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      letterSpacing: "0.04em",
    }}>
      {s.label}
    </span>
  );
}

// ── Claim card ───────────────────────────────────────────────────────────
function ClaimCard({ claim, itemId, onAction }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const act = async (action) => {
    setLoading(true);
    try {
      if (action === "approve") {
        await api.patch(`/items/${itemId}/claim/${claim._id}`, { status: "approved" });
        setDone("approved"); onAction();
      } else if (action === "reject") {
        await api.patch(`/items/${itemId}/claim/${claim._id}`, { status: "rejected" });
        setDone("rejected"); onAction();
      } else if (action === "confirm") {
        await api.patch(`/items/${itemId}/claim/${claim._id}/confirm`);
        setDone("reunited"); onAction();
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (done === "approved") return (
    <div style={{ padding: "10px 14px", background: T.greenBg, border: `1px solid ${T.greenBord}`, borderRadius: T.r, fontSize: 13, color: T.green, display: "flex", alignItems: "center", gap: 6 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
      Claim approved — waiting for claimant to confirm receipt
    </div>
  );
  if (done === "rejected") return (
    <div style={{ padding: "10px 14px", background: T.redBg, border: `1px solid ${T.redBord}`, borderRadius: T.r, fontSize: 13, color: T.red, display: "flex", alignItems: "center", gap: 6 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      Claim rejected
    </div>
  );
  if (done === "reunited") return (
    <div style={{ padding: "10px 14px", background: T.greenBg, border: `1px solid ${T.greenBord}`, borderRadius: T.r, fontSize: 13, color: T.green, display: "flex", alignItems: "center", gap: 6 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Item reunited! Case closed.
    </div>
  );

  return (
    <div style={{ padding: "12px 14px", borderRadius: T.r, background: T.amberBg, border: `1px solid ${T.amberBord}`, marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.amber }}>Claim Request</span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 999, background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", marginLeft: 2 }}>
          {claim.status === "approved" ? "Awaiting confirmation" : "Pending your approval"}
        </span>
      </div>
      {claim.message && (
        <p style={{ fontSize: 12, color: T.text2, marginBottom: 10, fontStyle: "italic", lineHeight: 1.5 }}>
          "{claim.message}"
        </p>
      )}
      {claim.status === "pending" && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => act("approve")} disabled={loading} style={{
            flex: 1, padding: "8px", borderRadius: T.r, border: `1px solid ${T.greenBord}`,
            background: T.greenBg, color: T.green, fontWeight: 700, fontSize: 12,
            fontFamily: T.font, cursor: "pointer", transition: "all 0.15s",
          }}>
            {loading ? "…" : "Confirm Match"}
          </button>
          <button onClick={() => act("reject")} disabled={loading} style={{
            flex: 1, padding: "8px", borderRadius: T.r, border: `1px solid ${T.redBord}`,
            background: T.redBg, color: T.red, fontWeight: 700, fontSize: 12,
            fontFamily: T.font, cursor: "pointer", transition: "all 0.15s",
          }}>
            {loading ? "…" : "Reject"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── My approved claims (Step 2) ──────────────────────────────────────────
function MyClaimsSection({ userId, onRefresh }) {
  const [claims,  setClaims]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await api.get("/items?limit=100");
      const allItems = Array.isArray(r.data?.data) ? r.data.data : [];
      const mine = [];
      for (const item of allItems) {
        for (const c of (item.claimRequests || [])) {
          if (c.requesterId === userId && c.status === "approved") mine.push({ item, claim: c });
        }
      }
      setClaims(mine);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const confirm = async (itemId, claimId) => {
    setConfirming(claimId);
    try { await api.patch(`/items/${itemId}/claim/${claimId}/confirm`); onRefresh(); load(); }
    catch (e) { console.error(e); }
    finally { setConfirming(null); }
  };

  if (loading || !claims.length) return null;

  return (
    <section style={{ marginBottom: 28, animation: "fadeUp 0.4s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber, animation: "pulse 2s ease infinite" }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Action Required</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {claims.map(({ item, claim }) => (
          <div key={claim._id} style={{
            background: T.amberBg, border: `1.5px solid ${T.amberBord}`,
            borderRadius: T.rMd, padding: "16px",
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: T.text }}>
              Your claim for "{item.title}" was approved!
            </p>
            <p style={{ fontSize: 12, color: T.text2, marginBottom: 12, lineHeight: 1.5 }}>
              The finder confirmed this might be yours. Did you receive your item back?
            </p>
            <button onClick={() => confirm(item._id, claim._id)} disabled={confirming === claim._id} style={{
              width: "100%", padding: "10px", borderRadius: T.r, border: "none",
              background: "linear-gradient(135deg, #10B981, #059669)",
              color: "#fff", fontWeight: 800, fontSize: 14, fontFamily: T.font, cursor: "pointer",
              transition: "all 0.2s",
            }}>
              {confirming === claim._id ? "Confirming…" : "Yes! I Got It Back!"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard({ user, setUser, setPage }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("all");
  const [refresh, setRefresh] = useState(0);
  const [isEditingPhone,  setIsEditingPhone]  = useState(false);
  const [phoneInput,      setPhoneInput]      = useState(user?.phone || "");
  const [updatingPhone,   setUpdatingPhone]   = useState(false);

  const handleUpdatePhone = async () => {
    setUpdatingPhone(true);
    try {
      const res = await authAPI.updateProfile({ phone: phoneInput });
      if (res.data.success) {
        setUser(res.data.data);
        authHelpers.setUser(res.data.data);
        setIsEditingPhone(false);
      }
    } catch (err) { console.error(err); }
    finally { setUpdatingPhone(false); }
  };

  const reload = useCallback(() => {
    setLoading(true);
    api.get("/items/my")
      .then(r => {
        const d = r.data;
        setItems(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload, refresh]);

  const filtered = tab === "all" ? items : items.filter(i => i.type === tab);
  const lostCount  = items.filter(i => i.type === "lost").length;
  const foundCount = items.filter(i => i.type === "found").length;
  const firstName  = user?.name?.split(" ")[0] || "User";
  const pendingClaimsCount = items.reduce((n, item) =>
    n + (item.claimRequests || []).filter(c => c.status === "pending").length, 0
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, paddingBottom: 100 }}>

      {/* Profile header */}
      <div style={{
        background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
        borderBottom: "1px solid #BAE6FD",
        padding: "36px 20px 28px",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Avatar */}
            <div style={{
              width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
              background: T.grad, overflow: "hidden",
              border: "3px solid rgba(8,145,178,0.25)",
              boxShadow: "0 4px 16px rgba(8,145,178,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {user?.picture
                ? <img src={user.picture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                : <span style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>{firstName[0]}</span>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 2, color: T.text }}>
                {user?.name || "User"}
              </h2>
              <p style={{ fontSize: 12, color: T.text2, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "#E0F2FE", color: T.teal, border: "1px solid #BAE6FD" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {user?.loginMethod === "google" ? "Google" : "Email"} · Verified
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: user?.phone ? T.greenBg : T.amberBg, color: user?.phone ? T.green : T.amber, border: `1px solid ${user?.phone ? T.greenBord : T.amberBord}` }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.94-.94a2 2 0 0 1 2.11-.45 12.4 12.4 0 0 0 2.81.7A2 2 0 0 1 22 17z"/></svg>
                  {user?.phone || "No Phone"}
                </span>
                {!isEditingPhone && (
                  <button onClick={() => { setIsEditingPhone(true); setPhoneInput(user?.phone || ""); }} style={{ background: "none", border: "none", color: T.teal, fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                    {user?.phone ? "Edit" : "Add Phone"}
                  </button>
                )}
              </div>
              {isEditingPhone && (
                <div style={{ marginTop: 10, display: "flex", gap: 6, animation: "fadeUp 0.2s ease" }}>
                  <input
                    type="tel" value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="+1234567890"
                    style={{ flex: 1, padding: "7px 10px", borderRadius: T.r, border: `1.5px solid ${T.border}`, background: T.surface, fontSize: 12, outline: "none", fontFamily: T.font, color: T.text }}
                  />
                  <button onClick={handleUpdatePhone} disabled={updatingPhone} style={{ padding: "7px 12px", borderRadius: T.r, background: T.grad, color: "white", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {updatingPhone ? "…" : "Save"}
                  </button>
                  <button onClick={() => setIsEditingPhone(false)} style={{ padding: "7px 12px", borderRadius: T.r, background: T.redBg, color: T.red, border: `1px solid ${T.redBord}`, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 0" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20, animation: "fadeUp 0.4s ease 0.1s both" }}>
          {[
            { label: "Total",  value: items.length, color: T.teal  },
            { label: "Lost",   value: lostCount,    color: T.red   },
            { label: "Found",  value: foundCount,   color: T.green },
          ].map(s => (
            <div key={s.label} style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: T.rMd, padding: "14px 10px", textAlign: "center",
              boxShadow: T.shadow,
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{loading ? "—" : s.value}</div>
              <div style={{ fontSize: 10, color: T.text3, fontWeight: 700, marginTop: 3, letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, animation: "fadeUp 0.4s ease 0.15s both" }}>
          <Button onClick={() => setPage("report")} fullWidth>+ Report Item</Button>
          <Button onClick={() => setPage("browse")} fullWidth variant="secondary">Browse All</Button>
        </div>

        {/* Action required */}
        {user?._id && <MyClaimsSection userId={user._id} onRefresh={() => setRefresh(r => r + 1)} />}

        {/* My Reports section */}
        <section style={{ animation: "fadeUp 0.4s ease 0.2s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text }}>
              My Reports
              {pendingClaimsCount > 0 && (
                <span style={{
                  marginLeft: 8, fontSize: 10, fontWeight: 700,
                  background: T.amberBg, color: T.amber,
                  border: `1px solid ${T.amberBord}`,
                  padding: "2px 8px", borderRadius: 999, letterSpacing: "0.04em",
                }}>
                  {pendingClaimsCount} CLAIM{pendingClaimsCount > 1 ? "S" : ""} PENDING
                </span>
              )}
            </h3>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, background: T.surfaceMd, border: `1px solid ${T.border}`, borderRadius: T.rMd, padding: 4, marginBottom: 20 }}>
            {["all", "lost", "found"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "8px", borderRadius: T.r, border: "none",
                background: tab === t ? T.surface : "transparent",
                color: tab === t ? T.text : T.text2,
                fontFamily: T.font, fontWeight: tab === t ? 700 : 500,
                fontSize: 13, cursor: "pointer",
                transition: "all 0.2s", textTransform: "capitalize",
                boxShadow: tab === t ? T.shadow : "none",
              }}>{t}</button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map(i => <Skeleton key={i} height={80} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.rLg }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.surfaceLg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <p style={{ fontWeight: 600, marginBottom: 4, color: T.text }}>No reports yet</p>
              <p style={{ color: T.text2, fontSize: 13, marginBottom: 20 }}>
                {tab === "all" ? "You haven't reported any items." : `No ${tab} items reported.`}
              </p>
              <Button onClick={() => setPage("report")} size="sm">Report an Item</Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((item, idx) => {
                const pendingClaims  = (item.claimRequests || []).filter(c => c.status === "pending");
                const approvedClaims = (item.claimRequests || []).filter(c => c.status === "approved");
                return (
                  <div key={item._id} style={{ animation: `fadeUp 0.35s ease ${idx * 0.06}s both` }}>
                    <Card padding="16px">
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: T.rMd, flexShrink: 0,
                          background: item.type === "lost" ? T.redBg : T.greenBg,
                          border: `1.5px solid ${item.type === "lost" ? T.redBord : T.greenBord}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <CategoryIcon category={item.category} color={item.type === "lost" ? T.red : T.green} size={22} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                            <Badge type={item.type} />
                            <StatusPill status={item.status} />
                            <span style={{ fontSize: 11, color: T.text3 }}>{timeAgo(item.createdAt || item.date)}</span>
                          </div>
                          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.text }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: T.text2, display: "flex", alignItems: "center", gap: 3 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            {getLocationStr(item)}
                          </p>
                        </div>
                      </div>

                      {/* Claim requests */}
                      {[...pendingClaims, ...approvedClaims].map(claim => (
                        <ClaimCard
                          key={claim._id} claim={claim} itemId={item._id}
                          itemTitle={item.title}
                          onAction={() => setRefresh(r => r + 1)}
                        />
                      ))}
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sign out */}
        <div style={{ marginTop: 32, paddingBottom: 20, animation: "fadeUp 0.4s ease 0.3s both" }}>
          <button
            onClick={() => { authHelpers.removeToken(); authHelpers.removeUser(); window.location.href = "/"; }}
            style={{
              width: "100%", padding: "12px", border: `1.5px solid ${T.redBord}`,
              borderRadius: T.rMd, background: T.redBg, color: T.red,
              fontFamily: T.font, fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.redBg; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </div>

      <BottomNav active="dashboard" setPage={setPage} />
    </div>
  );
}