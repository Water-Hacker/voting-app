import React, { useState } from "react";
import { login } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nin, setNin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.cgov$/i.test(email) || !/^\d{3}$/.test(nin)) {
      setError("Invalid email or NIN");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password, nin);
      console.log("LOGIN RESPONSE:", res);

      if (res.success) {
        localStorage.setItem("votingAppUser", JSON.stringify(res.user));
        onLogin(res.user); // contains isAdmin
      } else {
        setError(res.message);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl text-center text-white mb-4">Login</h2>
      {error && <p className="text-red-500 text-center mb-3">{error}</p>}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Your .cgov email" className="w-full mb-3 p-2 rounded" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="Password" className="w-full mb-3 p-2 rounded" required />
      <input type="text" value={nin} onChange={(e) => setNin(e.target.value)}
        placeholder="3-digit NIN" maxLength="3" className="w-full mb-3 p-2 rounded" required />
      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
