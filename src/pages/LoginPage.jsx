import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useAuth(); // 👈 set global user
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user); // 👈 store in global context
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Server error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background text-white">
      <div className="bg-card border border-border p-8 rounded-2xl w-[360px] shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-muted text-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-muted text-white focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
