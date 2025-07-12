import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login");
  }

  return (
    <nav className="bg-[var(--color-bg-alt)] border-b border-[var(--color-border)] px-6 py-4 flex justify-between items-center shadow-lg">
      <Link
        to="/"
        className="text-[var(--color-primary)] font-orbitron text-2xl font-bold hover:text-[var(--color-primary-hover)] transition"
      >
        VOTE-X
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-[var(--color-text-muted)] font-mono">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-[var(--color-accent)] hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="ml-4 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition font-semibold"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
