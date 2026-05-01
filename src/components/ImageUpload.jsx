// components/ImageUpload.jsx
import { useState, useRef } from "react";

export function ImageUpload({ preview, onFile, onRemove, label = "Photo (optional)", hint = "PNG, JPG up to 5MB" }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => onFile(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    readFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text2)", fontFamily: "var(--font-display)" }}>
        {label}
      </label>

      <div
        className={drag ? "drop-active" : ""}
        onClick={() => !preview && ref.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${drag ? "var(--c-accent)" : "var(--c-border2)"}`,
          borderRadius: "var(--radius-md)",
          padding: preview ? 12 : 28,
          textAlign: "center",
          cursor: preview ? "default" : "pointer",
          background: drag ? "var(--c-accent-light)" : "var(--c-surface2)",
          transition: "all var(--transition)",
        }}
      >
        {preview ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={preview} alt="preview"
              style={{ maxHeight: 200, maxWidth: "100%", borderRadius: "var(--radius-sm)", objectFit: "cover" }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              style={{
                position: "absolute", top: -8, right: -8,
                width: 24, height: 24, borderRadius: "50%",
                background: "var(--c-red)", color: "#fff",
                border: "none", cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >×</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📷</div>
            <p style={{ fontSize: 14, color: "var(--c-text2)", fontWeight: 500 }}>Click or drag to upload</p>
            <p style={{ fontSize: 12, color: "var(--c-text3)", marginTop: 4 }}>{hint}</p>
          </>
        )}
      </div>

      <input
        ref={ref} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => readFile(e.target.files[0])}
      />
    </div>
  );
}