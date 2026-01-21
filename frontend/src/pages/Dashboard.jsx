import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div>
      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 15,
          borderBottom: "1px solid #ccc",
        }}
      >
        <h2>RACINGMU</h2>
        <button onClick={logout}>Logout</button>
      </nav>

      {/* KONTEN */}
      <div
        style={{
          padding: 40,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link to="/products">
          <button
            style={{
              padding: "15px 30px",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ➕ Input Stok Produk
          </button>
        </Link>
      </div>
    </div>
  );
}
