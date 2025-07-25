import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"; // ✅ for role check

const API_URL = import.meta.env.VITE_API_URL;

export default function BonSortie() {
  const [destockageArticles, setDestockageArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [bons, setBons] = useState([]);
  const [client, setClient] = useState("");

  const { user } = useAuth(); // ✅ current logged user

  useEffect(() => {
    fetchDestockageArticles();
    fetchBons();
  }, []);

  const fetchDestockageArticles = async () => {
    try {
      const res = await axios.get(`${API_URL}/articles`);
      const data = res.data.filter((a) => parseInt(a.emplacement) >= 1101);
      setDestockageArticles(data);
    } catch (err) {
      console.error("Error fetching destockage articles:", err);
    }
  };

  const fetchBons = async () => {
    try {
      const res = await axios.get(`${API_URL}/bons-de-sortie`);
      setBons(res.data);
    } catch (err) {
      console.error("Error fetching bons:", err);
    }
  };

  const handleSelectArticle = (article) => {
    const exists = selectedArticles.find(
      (a) =>
        a.codeArticle === article.codeArticle &&
        a.emplacement === article.emplacement
    );
    if (!exists) {
      setSelectedArticles([...selectedArticles, { ...article, quantite: 1 }]);
    }
  };

  const handleRemoveSelected = (index) => {
    const updated = [...selectedArticles];
    updated.splice(index, 1);
    setSelectedArticles(updated);
  };

  const handleCreateBon = async () => {
    if (!client || selectedArticles.length === 0) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await axios.post(`${API_URL}/bons-de-sortie`, {
        client,
        articles: selectedArticles,
      });

      setClient("");
      setSelectedArticles([]);
      fetchDestockageArticles();
      fetchBons();
    } catch (err) {
      alert("Erreur lors de la création du bon.");
      console.error("Bon error:", err);
    }
  };

  const handleDownloadPDF = async (bonId) => {
    try {
      const res = await axios.get(`${API_URL}/bons-de-sortie/${bonId}/pdf`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  const handleDeleteBon = async (bonId) => {
    if (!confirm("Supprimer ce Bon ?")) return;
    try {
      await axios.delete(`${API_URL}/bons-de-sortie/${bonId}`);
      fetchBons();
    } catch (err) {
      console.error("Error deleting bon:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Bon de Sortie</h1>

      {/* ✅ Articles disponibles */}
      <div className="flex gap-4 flex-wrap mb-6">
        {destockageArticles.map((article, i) => (
          <div
            key={i}
            className="bg-white text-black p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectArticle(article)}
          >
            <p>
              <strong>Code:</strong> {article.codeArticle}
            </p>
            <p>
              <strong>Emplacement:</strong> {article.emplacement}
            </p>
            <p>
              <strong>Quantité:</strong> {article.quantiteEntree}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Client Name */}
      <div className="mb-4">
        <Input
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Nom du client"
          className="bg-gray-800 text-white border border-gray-600 placeholder:text-gray-400"
        />
      </div>

      {/* ✅ Selected Articles */}
      <div className="mb-6">
        {selectedArticles.map((article, i) => (
          <div
            key={i}
            className="bg-white text-black p-4 rounded-lg shadow mb-2"
          >
            <div className="flex items-center gap-4">
              <QRCode value={article.codeArticle} size={48} />
              <div>
                <p>
                  <strong>Code:</strong> {article.codeArticle}
                </p>
                <p>
                  <strong>Emplacement:</strong> {article.emplacement}
                </p>
                <p>
                  <strong>Quantité:</strong> {article.quantite}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => handleRemoveSelected(i)}
                className="text-red-600 ml-auto"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Create Bon */}
      <Button
        onClick={handleCreateBon}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
      >
        ✅ Créer Bon de Sortie
      </Button>

      {/* ✅ Bon History */}
      <h2 className="mt-10 text-xl font-semibold">Historique des Bons</h2>
      <div className="mt-4 space-y-2">
        {bons.map((bon, i) => (
          <div
            key={i}
            className="bg-gray-800 text-white p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Client:</strong> {bon.client}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(bon.date).toLocaleDateString("fr-FR")}
              </p>
              <p>
                <strong>Num Bon:</strong> {bon.numBon}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleDownloadPDF(bon._id)}>📄 PDF</Button>
              {user?.role === "admin" && (
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteBon(bon._id)}
                >
                  🗑️ Supprimer
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
