import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // ✅ role access

const API_URL = import.meta.env.VITE_API_URL;

export function Stockage() {
  const [formData, setFormData] = useState({
    codeArticle: "",
    emplacement: "",
  });

  const [recentStocked, setRecentStocked] = useState([]);
  const { user } = useAuth(); // ✅ get current user

  useEffect(() => {
    fetch(`${API_URL}/articles`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (a) => Number(a.emplacement) >= 101 && Number(a.emplacement) <= 1099
        );

        const uniqueMap = new Map();
        for (const item of filtered) {
          const key = `${item.codeArticle}-${item.emplacement}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        }

        const uniqueArticles = Array.from(uniqueMap.values())
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 6);

        setRecentStocked(uniqueArticles);
      })
      .catch((err) => console.error("Erreur fetch stockage:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeArticle: formData.codeArticle,
          emplacement: formData.emplacement,
        }),
      });

      if (res.ok) {
        setFormData({ codeArticle: "", emplacement: "" });

        const updatedRes = await fetch(`${API_URL}/articles`);
        const updatedData = await updatedRes.json();
        const filtered = updatedData.filter(
          (a) => Number(a.emplacement) >= 101 && Number(a.emplacement) <= 1099
        );

        const uniqueMap = new Map();
        for (const item of filtered) {
          const key = `${item.codeArticle}-${item.emplacement}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        }

        const uniqueArticles = Array.from(uniqueMap.values())
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 6);

        setRecentStocked(uniqueArticles);
      } else {
        console.error("Erreur ajout stockage:", await res.text());
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stockage</h1>
        <p className="text-muted-foreground">
          Ajouter des articles au stock avec leur emplacement
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulaire de stockage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Nouveau Stockage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codeArticle">Code Article</Label>
                <Input
                  id="codeArticle"
                  value={formData.codeArticle}
                  onChange={(e) =>
                    handleInputChange("codeArticle", e.target.value)
                  }
                  placeholder="Ex: FAB001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emplacement">Emplacement (0101-1099)</Label>
                <Input
                  id="emplacement"
                  value={formData.emplacement}
                  onChange={(e) =>
                    handleInputChange("emplacement", e.target.value)
                  }
                  placeholder="Ex: 0101"
                  pattern="[0-1][0-9][0-9][0-9]"
                  minLength="4"
                  maxLength="4"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Stocker l'Article
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Derniers articles stockés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Derniers Articles Stockés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentStocked.map((item) => (
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
                      Quantité: {item.quantiteRestante}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        item.updatedAt || item.createdAt
                      ).toLocaleTimeString("fr-FR")}{" "}
                      {new Date(
                        item.updatedAt || item.createdAt
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* QR Code */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${item.codeArticle}&size=60x60`}
                      alt="QR"
                      className="rounded-md border"
                    />

                    {/* Delete (Only Admin) */}
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
                                setRecentStocked((prev) =>
                                  prev.filter((a) => a._id !== item._id)
                                );
                              }
                            } catch (err) {
                              console.error("Erreur suppression:", err);
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

export default Stockage;
