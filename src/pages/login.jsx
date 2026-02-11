import { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("login/", { username, password });
      onLogin(res.data.user);
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">
            Cafe POS
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure billing login
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 text-white
                     font-semibold py-2.5 rounded-lg transition
                     flex items-center justify-center"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Accent line */}
        <div className="h-1 w-16 bg-red-600 rounded-full mx-auto mt-6" />

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-4">
          © {new Date().getFullYear()} Cafe POS
        </p>
      </div>
    </div>
  );
}