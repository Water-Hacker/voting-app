import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("votingAppUser");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("votingAppUser", JSON.stringify(userData));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("votingAppUser");
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {showRegister ? (
          <>
            <Register onRegister={handleLogin} />
            <p className="text-center mt-4">
              Already have an account?{" "}
              <button onClick={() => setShowRegister(false)} className="text-blue-400 underline">Login</button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <button onClick={() => setShowRegister(true)} className="text-blue-400 underline">Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="p-4 flex justify-between bg-gray-800">
        <h1 className="text-xl font-bold">Voting App</h1>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded">Logout</button>
      </nav>

      {user.isAdmin ? <Admin /> : <Dashboard user={user} />}
    </div>
  );
}
