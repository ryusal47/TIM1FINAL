import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import { useAuth } from "../context/AuthContext";
import Products from "../pages/Products";
import Transactions from "../pages/Transactions";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Register />}
      />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/products"
        element={user ? <Products /> : <Navigate to="/login" />}
      />
      <Route
        path="/transactions"
        element={user ? <Transactions /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
