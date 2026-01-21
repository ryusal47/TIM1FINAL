import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../pages/Transactions.css";

export default function Transactions() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data);
  };

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/transactions", { items });

    setItems([]);
    fetchProducts();
    fetchTransactions();
  };

  return (
    <div className="transactions-container">
      {/* NAVBAR */}
      <nav className="transactions-navbar">
        <h2 className="brand">RACINGMU</h2>

        {/* BURGER MENU */}
        <button
          className={`burger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* NAV LINKS */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Input Stok
          </Link>
          <Link to="/transactions" onClick={() => setMenuOpen(false)}>
            Transaksi
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="transactions-content">
        {/* FORM TRANSAKSI */}
        <div className="transactions-card">
          <h3>🧾 Transaksi Penjualan</h3>

          <form className="transaction-form" onSubmit={handleSubmit}>
            {items.map((item, index) => (
              <div className="transaction-item" key={index}>
                <select
                  value={item.product_id}
                  onChange={(e) =>
                    updateItem(index, "product_id", e.target.value)
                  }
                  required
                >
                  <option value="">Pilih Produk</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (stok: {p.stock})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="btn btn-remove"
                  onClick={() => removeItem(index)}
                >
                  Hapus
                </button>
              </div>
            ))}

            <button type="button" className="btn btn-add" onClick={addItem}>
              + Tambah Produk
            </button>

            <button type="submit" className="btn btn-submit">
              Simpan Transaksi
            </button>
          </form>
        </div>

        {/* HISTORI */}
        <div className="transactions-card">
          <h3>📜 Histori Transaksi</h3>

          <div className="transaction-history">
            {transactions.map((t) => (
              <div className="history-card" key={t.id}>
                <div className="history-header">
                  <span>Transaksi #{t.id}</span>
                  <span className="history-total">
                    Rp {t.total_price.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="history-meta">
                  {new Date(t.created_at).toLocaleString("id-ID")}
                </div>

                <ul className="history-list">
                  {t.items.map((i, idx) => (
                    <li key={idx}>
                      {i.product.name} — {i.quantity} × Rp{" "}
                      {i.price.toLocaleString("id-ID")}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
