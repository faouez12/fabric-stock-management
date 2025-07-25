import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AjouterArticle() {
  const [codeArticle, setCodeArticle] = useState("");
  const [libelle, setLibelle] = useState("");
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${API_URL}/articles-list`);
      setArticles(res.data);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAdd = async () => {
    if (!codeArticle || !libelle) return;
    try {
      await axios.post(`${API_URL}/articles-list`, {
        codeArticle,
        libelle,
      });
      setCodeArticle("");
      setLibelle("");
      fetchArticles();
    } catch (err) {
      console.error("Erreur d'ajout:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/articles-list/${id}`);
      fetchArticles();
    } catch (err) {
      console.error("Erreur de suppression:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Ajouter Article
        </h1>

        <div className="bg-gray-900 p-6 rounded-lg shadow-lg space-y-4">
          <Input
            placeholder="Code Article"
            value={codeArticle}
            onChange={(e) => setCodeArticle(e.target.value)}
            className="bg-gray-800 text-white placeholder:text-gray-400"
          />
          <Input
            placeholder="Libellé"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="bg-gray-800 text-white placeholder:text-gray-400"
          />
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            onClick={handleAdd}
          >
            + Ajouter l'Article
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2 text-white">
            🪵 Articles Existants ({articles.length})
          </h2>
          <div className="bg-gray-800 rounded-lg p-4 text-white space-y-2">
            {articles.map((a, i) => (
              <div
                key={a._id}
                className="flex justify-between items-center border-b border-gray-700 py-1"
              >
                <div>
                  <span className="font-medium">{a.codeArticle}</span>{" "}
                  <span className="text-sm text-gray-400">{a.libelle}</span>
                </div>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
