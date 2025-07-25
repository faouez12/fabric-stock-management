import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackageMinus, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // ✅ role check

const API_URL = import.meta.env.VITE_API_URL;

export function Destockage() {
  const [formData, setFormData] = useState({
    codeArticle: "",
    emplacementStock: "",
    emplacementDestock: "",
  });

  const [recentDestocked, setRecentDestocked] = useState([]);
  const { user } = useAuth(); // ✅ get current user info

  useEffect(() => {
    fetch(`${API_URL}/articles`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter((a) => Number(a.emplacement) >= 1100)
          .sort((a, b) => new Date(b.dateEntree) - new Date(a.dateEntree))
          .slice(0, 6);
        setRecentDestocked(filtered);
      })
      .catch((err) => console.error("Erreur fetch déstockage:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/articles/destock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        setRecentDestocked((prev) => [result, ...prev.slice(0, 5)]);
        setFormData({
          codeArticle: "",
          emplacementStock: "",
          emplacementDestock: "",
        });
      } else {
        const error = await res.json();
        alert("Erreur: " + (error.error || "Vérifiez les données"));
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
      alert("Erreur de connexion serveur");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Déstockage</h1>
        <p className="text-muted-foreground">
          Déplacer ou sortir des articles du stock
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulaire Déstockage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageMinus className="h-5 w-5" />
              Nouveau Déstockage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codeArticle">Code Article</Label>
                <Input
                  id="codeArticle"
                  value={formData.codeArticle}
                  onChange={(e) => handleChange("codeArticle", e.target.value)}
                  placeholder="Ex: TF_1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emplacementStock">Emplacement Actuel</Label>
                <Input
                  id="emplacementStock"
                  value={formData.emplacementStock}
                  onChange={(e) =>
                    handleChange("emplacementStock", e.target.value)
                  }
                  placeholder="Ex: 0101"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emplacementDestock">Nouvel Emplacement</Label>
                <Input
                  id="emplacementDestock"
                  value={formData.emplacementDestock}
                  onChange={(e) =>
                    handleChange("emplacementDestock", e.target.value)
                  }
                  placeholder="Ex: 1101"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Déstocker l'Article
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Derniers articles déstockés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Derniers Articles Déstockés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDestocked.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{item.codeArticle}</p>
                    <p className="text-sm text-muted-foreground">
                      Emplacement: {item.emplacement}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantité: {item.quantiteEntree}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.dateEntree).toLocaleTimeString("fr-FR")}{" "}
                      {new Date(item.dateEntree).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* QR Code */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${item.codeArticle}&size=60x60`}
                      alt="QR"
                      className="rounded-md border"
                    />

                    {/* Delete (admin only) */}
                    {user?.role === "admin" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          const confirmed = confirm("Supprimer cet article ?");
                          if (confirmed) {
                            try {
                              const res = await fetch(
                                `${API_URL}/articles/${item._id}`,
                                {
                                  method: "DELETE",
                                }
                              );
                              if (res.ok) {
                                setRecentDestocked((prev) =>
                                  prev.filter((a) => a._id !== item._id)
                                );
                              }
                            } catch (err) {
                              console.error("Erreur suppression:", err);
                              alert("Erreur lors de la suppression");
                            }
                          }
                        }}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Destockage;
