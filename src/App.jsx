// App.jsx — root component: routing + shared state
import { useState, useCallback } from "react";
import { Navbar }          from "./components/Navbar";
import ToastContainer from './components/ToastContainer';
import Home       from "./pages/Home";
import Browse     from "./pages/Browse";
import Report     from "./pages/Report";
import AIMatch    from "./pages/AIMatch";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Dashboard  from "./pages/Dashboard";
import { MOCK_ITEMS } from "./utils/constants";



export default function App() {
  const [page,     setPage]     = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [user,     setUser]     = useState(null);
  const [items,    setItems]    = useState(MOCK_ITEMS);

  // Toggle save/bookmark on any item
  const toggleSave = useCallback((id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, saved: !item.saved } : item));
  }, []);

  // Add a newly reported item to the top of the list
  const addItem = useCallback((newItem) => {
    setItems(prev => [newItem, ...prev]);
  }, []);

  const savedCount = items.filter(i => i.saved).length;

  return (
    <div
      data-theme={darkMode ? "dark" : "light"}
      style={{ minHeight: "100vh", background: "var(--c-bg)", color: "var(--c-text)", display: "flex", flexDirection: "column" }}
    >
      <Navbar
        page={page}
        setPage={setPage}
        darkMode={darkMode}
        toggleDark={() => setDarkMode(d => !d)}
        user={user}
        setUser={setUser}
        savedCount={savedCount}
      />

      <main style={{ flex: 1 }}>
        {page === "home" && <Home setPage={setPage} items={items} onToggleSave={toggleSave} />}
        {page === "browse" && <Browse onToggleSave={toggleSave} />}
        {page === "report"    && <Report    user={user} setPage={setPage} onAddItem={addItem} />}
        {page === "ai"        && <AIMatch   items={items} />}
        {page === "login"     && <Login     setPage={setPage} setUser={setUser} />}
        {page === "register"  && <Register  setPage={setPage} setUser={setUser} />}
        {page === "dashboard" && user && <Dashboard user={user} items={items} onToggleSave={toggleSave} setPage={setPage} />}
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--c-surface)", borderTop: "1px solid var(--c-border)", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--c-accent)", marginBottom: 2 }}>
              Find<span style={{ color: "var(--c-text)" }}>It</span>
            </p>
            <p style={{ fontSize: 12, color: "var(--c-text3)" }}>Campus Lost &amp; Found · Built with ❤️ for students</p>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[["home","Home"],["browse","Browse"],["report","Report"],["ai","AI Match"]].map(([id, label]) => (
              <button key={id} onClick={() => setPage(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "var(--c-text2)",
                fontFamily: "var(--font-display)", fontWeight: 500,
              }}>{label}</button>
            ))}
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}