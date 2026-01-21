import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../pages/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const resetForm = () => {
    setName("");
    setStock("");
    setPrice("");
    setDescription("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, stock, price, description };

    if (editId) {
      await api.put(`/products/${editId}`, payload);
    } else {
      await api.post("/products", payload);
    }

    resetForm();
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setStock(product.stock);
    setPrice(product.price);
    setDescription(product.description || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="products-container">
      {/* NAVBAR */}
      <nav className="products-navbar">
        <h2 className="brand">RACINGMU</h2>

        {/* BURGER */}
        <button
          className={`burger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* MENU */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Input Stok
          </Link>
          <Link to="/transactions" onClick={() => setMenuOpen(false)}>
            Transaksi Penjualan
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="products-content">
        {/* FORM CARD */}
        <div className="products-card">
          <h3>{editId ? "✏️ Edit Produk" : "➕ Input Stok Produk"}</h3>

          <form onSubmit={handleSubmit} className="products-form">
            <input
              type="text"
              placeholder="Nama Produk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Stok"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Harga"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <button type="submit">
              {editId ? "Update Produk" : "Simpan Produk"}
            </button>

            {editId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Batal
              </button>
            )}
          </form>
        </div>

        {/* TABLE CARD */}
        <div className="products-card">
          <h3>📦 Daftar Produk</h3>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Stok</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.stock}</td>
                    <td>Rp {p.price.toLocaleString("id-ID")}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(p.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
