import React, { useState } from "react";
import { register } from "../services/api";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nin, setNin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isNinValid = (value) => /^\d{3}$/.test(value);
  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.cgov$/i.test(value);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isEmailValid(email)) {
      setError("Email must end with .cgov");
      return;
    }

    if (!isNinValid(nin)) {
      setError("NIN must be exactly 3 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await register(email.trim(), password, nin.trim());
      if (res.success) {
        onRegister(); // callback to redirect or notify success
      } else {
        setError(res.message || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-[var(--color-bg-alt)] rounded-lg shadow-lg border border-[var(--color-border)]">
      <h2 className="text-3xl font-orbitron mb-6 text-[var(--color-primary)] text-center">
        Create Account
      </h2>

      {error && (
        <div className="mb-4 bg-red-800 text-red-200 px-4 py-2 rounded font-mono text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="email"
          placeholder="Your .cgov Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-md p-3 text-[var(--color-text-main)] font-mono focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-1 outline-none transition"
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-md p-3 text-[var(--color-text-main)] font-mono focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-1 outline-none transition"
          required
          autoComplete="new-password"
        />

        <input
          type="text"
          placeholder="3-digit NIN"
          value={nin}
          onChange={(e) => setNin(e.target.value)}
          maxLength={3}
          pattern="\d{3}"
          inputMode="numeric"
          title="Exactly 3 digits"
          className="bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-md p-3 text-[var(--color-text-main)] font-mono text-center tracking-widest focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-1 outline-none transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-semibold py-3 rounded-lg shadow-md transition hover:bg-[var(--color-primary-hover)] ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
