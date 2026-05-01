import { useEffect, useState } from "react";
import { itemsAPI } from "../utils/api";
import { ItemCard } from "../components/ItemCard";

export default function Browse({ onToggleSave }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await itemsAPI.getAll();
      console.log("API RESPONSE:", res.data);
      setItems(res.data?.data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Browse Items</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
        gap: 20
      }}>
        {Array.isArray(items) && items.map(item => (
          <ItemCard key={item._id} item={item} onToggleSave={onToggleSave} />
        ))}
      </div>
    </div>
  );
}