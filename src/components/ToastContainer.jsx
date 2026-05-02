// src/components/ToastContainer.jsx
import { useState, useEffect } from "react";
import { onToast } from "../utils/toast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return onToast((t) => {
      const id = Date.now();
      setToasts(prev => [...prev, { ...t, id }]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3500);
    });
  }, []);

  const cfg = {
    success: { bg:"rgba(34,197,94,0.15)",  border:"rgba(34,197,94,0.3)",  color:"#4ADE80", icon:"✅" },
    error:   { bg:"rgba(239,68,68,0.15)",   border:"rgba(239,68,68,0.3)",   color:"#F87171", icon:"❌" },
    info:    { bg:"rgba(59,130,246,0.15)",  border:"rgba(59,130,246,0.3)",  color:"#60A5FA", icon:"ℹ️" },
  };

  return (
    <div style={{ position:"fixed", bottom:90, right:16, zIndex:999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => {
        const c = cfg[t.type] || cfg.info;
        return (
          <div key={t.id} style={{
            background: c.bg, border:`1px solid ${c.border}`,
            borderRadius:12, padding:"12px 16px",
            display:"flex", alignItems:"center", gap:10,
            backdropFilter:"blur(12px)",
            fontFamily:"'DM Sans',system-ui", fontSize:14, color:"#F1F5F9",
            boxShadow:"0 8px 24px rgba(0,0,0,0.3)",
            animation:"slideIn 0.3s ease both",
            maxWidth:280,
          }}>
            <span>{c.icon}</span>
            <span>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}