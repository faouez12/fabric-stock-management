import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "worker", // default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Utilisateur créé avec succès");
        setFormData({ username: "", password: "", role: "worker" });
      } else {
        setError(data.error || "❌ Échec de la création");
      }
    } catch (err) {
      console.error("Erreur serveur:", err);
      setError("❌ Erreur serveur");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background text-white">
      <div className="bg-card border border-border p-8 rounded-2xl w-[360px] shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-6">
          Créer un nouvel utilisateur
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-muted text-white focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-muted text-white focus:outline-none"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-muted text-white focus:outline-none"
          >
            <option value="worker">👷‍♂️ Ouvrier</option>
            <option value="admin">👑 Admin</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-medium"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
