import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function RechercheEmplacement() {
  const [emplacement, setEmplacement] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!emplacement) return;

    try {
      const res = await fetch(`${API_URL}/articles/search/${emplacement}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        setError("");
      } else {
        setResult(null);
        setError(data.error || "Erreur lors de la recherche.");
      }
    } catch (err) {
      setResult(null);
      setError("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          🔍 Recherche par Emplacement
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entrer un numéro d’emplacement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Input
              placeholder="0101"
              value={emplacement}
              onChange={(e) => setEmplacement(e.target.value)}
            />
            <Button onClick={handleSearch} variant="default">
              Rechercher
            </Button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {result && result.length > 0 && (
            <div className="mt-6 space-y-2">
              {result.map((item) => (
                <Card key={item._id} className="bg-muted/50 p-4">
                  <p className="font-semibold">{item.codeArticle}</p>
                  <p>Emplacement: {item.emplacement}</p>
                  <p>Quantité: {item.quantiteEntree}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.dateEntree).toLocaleDateString("fr-FR")} –{" "}
                    {new Date(item.dateEntree).toLocaleTimeString("fr-FR")}
                  </p>
                </Card>
              ))}
            </div>
          )}

          {result && result.length === 0 && (
            <p className="text-yellow-400 mt-4">Aucun article trouvé.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RechercheEmplacement;
