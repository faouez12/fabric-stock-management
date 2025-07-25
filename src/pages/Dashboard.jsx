import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { API_URL } from "../services/api";
import { BookOpenCheck, Truck, FileText } from "lucide-react";

const COLORS = [
  "#60A5FA",
  "#F472B6",
  "#FACC15",
  "#34D399",
  "#A78BFA",
  "#38BDF8",
];

const Dashboard = () => {
  const [stockageCount, setStockageCount] = useState(0);
  const [destockageCount, setDestockageCount] = useState(0);
  const [bonsCount, setBonsCount] = useState(0);
  const [lastActions, setLastActions] = useState([]);
  const [stockInData, setStockInData] = useState([]);
  const [stockOutData, setStockOutData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/articles`);
      const articles = res.data;

      // Count articles
      const stockage = articles.filter(
        (a) => parseInt(a.emplacement) >= 101 && parseInt(a.emplacement) <= 1099
      );
      const destockage = articles.filter(
        (a) => parseInt(a.emplacement) >= 1101
      );

      setStockageCount(stockage.length);
      setDestockageCount(destockage.length);

      // Get latest actions
      const sorted = [...articles].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLastActions(sorted.slice(0, 5));

      // Group stock in and out
      const groupByCode = (items) => {
        const counts = {};
        items.forEach((item) => {
          counts[item.codeArticle] = (counts[item.codeArticle] || 0) + 1;
        });
        return Object.entries(counts).map(([codeArticle, quantity]) => ({
          codeArticle,
          quantity,
        }));
      };

      setStockInData(groupByCode(stockage));
      setStockOutData(groupByCode(destockage));

      // Pie data = all
      const pie = groupByCode(articles);
      setPieData(pie);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }

    try {
      const res = await axios.get(`${API_URL}/bons`);
      setBonsCount(res.data.length);
    } catch (err) {
      console.error("Error fetching bons:", err);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        📊 Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 dark:bg-blue-200 p-6 rounded shadow text-center">
          <BookOpenCheck className="mx-auto mb-2 text-blue-800" />
          <h2 className="text-lg font-medium text-blue-900">
            Articles en Stockage
          </h2>
          <p className="text-3xl font-bold">{stockageCount}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-200 p-6 rounded shadow text-center">
          <Truck className="mx-auto mb-2 text-yellow-800" />
          <h2 className="text-lg font-medium text-yellow-900">
            Articles Déstockés
          </h2>
          <p className="text-3xl font-bold">{destockageCount}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-200 p-6 rounded shadow text-center">
          <FileText className="mx-auto mb-2 text-green-800" />
          <h2 className="text-lg font-medium text-green-900">Bons de Sortie</h2>
          <p className="text-3xl font-bold">{bonsCount}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">🕒 Dernières Actions</h3>
        <div className="space-y-2">
          {lastActions.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-800 text-white p-3 rounded flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>{item.codeArticle}</strong> – Emplacement{" "}
                  {item.emplacement}
                </p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                +1 ajout
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            📦 Quantités In par Article
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockInData}>
              <XAxis dataKey="codeArticle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            🚚 Quantités Out par Article
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockOutData}>
              <XAxis dataKey="codeArticle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#F472B6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          🥧 Répartition Totale (Pie)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="quantity"
              nameKey="codeArticle"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
