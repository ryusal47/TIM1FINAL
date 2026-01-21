import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // edit mode
  const [editId, setEditId] = useState(null);

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

    const payload = {
      name,
      stock,
      price,
      description,
    };

    if (editId) {
      // UPDATE
      await api.put(`/products/${editId}`, payload);
    } else {
      // CREATE
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
    const confirm = window.confirm("Yakin ingin menghapus produk?");
    if (!confirm) return;

    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          gap: 20,
          padding: 15,
          borderBottom: "1px solid #ccc",
        }}
      >
        <h2>RACINGMU</h2>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Input Stok</Link>
      </nav>

      <div style={{ padding: 20 }}>
        <h3>{editId ? "Edit Produk" : "Input Stok Produk"}</h3>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />

          <input
            type="number"
            placeholder="Stok"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <br />

          <input
            type="number"
            placeholder="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <br />

          <button type="submit">{editId ? "Update" : "Simpan"}</button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: 10 }}
            >
              Batal
            </button>
          )}
        </form>

        <br />

        {/* TABLE */}
        <h3>Daftar Produk</h3>
        <table border="1" cellPadding="8">
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
                <td>Rp {p.price}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ marginLeft: 8 }}
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
  );
}
