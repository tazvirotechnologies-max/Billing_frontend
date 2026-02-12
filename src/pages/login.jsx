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
    <div className="min-h-screen flex items-center justify-center px-4
                    bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">

      {/* Floating Glass Card */}
      <div className="relative w-full max-w-md p-10 rounded-3xl
                      bg-white/70 backdrop-blur-2xl
                      shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                      border border-white/40">

        {/* Glow Effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 
                        bg-purple-300 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 
                        bg-blue-300 rounded-full blur-3xl opacity-30" />

        {/* Content */}
        <div className="relative z-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r 
                           from-indigo-600 to-purple-600 
                           bg-clip-text text-transparent">
              Cafe Billing System
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Secure POS Access Portal
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 
                            border border-red-200 rounded-xl px-4 py-2 text-center">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 rounded-xl border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div className="mb-7">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 transition-all duration-300"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       hover:scale-[1.02] hover:shadow-lg
                       transition-all duration-300"
          >
            {loading ? "Authenticating..." : "Login to POS"}
          </button>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-8">
            © {new Date().getFullYear()} Cafe POS Billing Software
          </p>

        </div>
      </div>
    </div>
  );
}