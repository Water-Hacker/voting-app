import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  // Manage user login state here or later with context
  const [user, setUser] = React.useState(null);

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-main)]">
      <Router>
        <Navbar user={user} onLogout={() => setUser(null)} />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/register"
              element={!user ? <Register onRegister={setUser} /> : <Navigate to="/" replace />}
            />
            <Route path="*" element={<p className="text-center mt-20">Page Not Found</p>} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
