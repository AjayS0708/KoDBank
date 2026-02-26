import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { DashboardLayout } from "./layouts/DashboardLayout.tsx";

// Pages
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Transfers from "./pages/Transfers.tsx";
import History from "./pages/History.tsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transfers" element={<Transfers />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<div className="p-10 text-white/40">Settings module coming soon...</div>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: "#0a0a0a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            fontSize: "14px",
            fontWeight: "500",
          },
        }}
      />
    </AuthProvider>
  );
}
