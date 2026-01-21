import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../pages/Dashboard.css";

export default function Dashboard() {
  const { logout } = useAuth();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ NOTIF LOGIN BERHASIL
  const [successMessage, setSuccessMessage] = useState("");

  // Ambil pesan sukses dari Login.jsx
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      // hapus state agar tidak muncul lagi saat refresh
      window.history.replaceState({}, document.title);

      // auto hide notif (opsional tapi recommended)
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, transactionsRes] = await Promise.all([
        api.get("/products"),
        api.get("/transactions"),
      ]);

      setProducts(productsRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="dashboard-navbar">
        <h2 className="brand">RACINGMU</h2>

        {/* BURGER (MOBILE) */}
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

          <button className="logout-button mobile" onClick={logout}>
            Logout
          </button>
        </div>

        {/* LOGOUT DESKTOP */}
        <button className="logout-button desktop" onClick={logout}>
          Logout
        </button>
      </nav>

      {/* CONTENT */}
      <main className="dashboard-content">
        {/* ✅ NOTIF LOGIN BERHASIL */}
        {successMessage && (
          <div className="dashboard-success">{successMessage}</div>
        )}

        {loading && <p className="loading-text">Memuat data...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <>
            {/* PRODUK */}
            <section className="card">
              <h3 className="card-title">📦 Stok Produk</h3>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Stok</th>
                      <th>Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.stock}</td>
                        <td>Rp {p.price.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* TRANSAKSI */}
            <section className="card">
              <h3 className="card-title">🧾 Histori Transaksi</h3>

              {transactions.map((t) => (
                <div key={t.id} className="transaction-card">
                  <div className="transaction-header">
                    <strong>Transaksi #{t.id}</strong>
                    <span>
                      {new Date(t.created_at).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Produk</th>
                          <th>Jumlah</th>
                          <th>Harga</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.product.name}</td>
                            <td>{item.quantity}</td>
                            <td>Rp {item.price.toLocaleString("id-ID")}</td>
                            <td>
                              Rp{" "}
                              {(item.quantity * item.price).toLocaleString(
                                "id-ID"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="transaction-total">
                    Total: Rp {t.total_price.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
