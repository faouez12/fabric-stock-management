import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Stockage from "./pages/Stockage";
import Destockage from "./pages/Destockage";
import RechercheEmplacement from "./pages/RechercheEmplacement";
import BonSortie from "./pages/BonSortie";
import AjouterArticle from "./pages/AjouterArticle";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";

import "./App.css";

function App() {
  return (
    <div className="dark">
      <Routes>
        {/* ✅ Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* ✅ Protected Routes inside Layout */}
        <Route
          path="register"
          element={
            <ProtectedRoute requiredRole="admin">
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="stockage" element={<Stockage />} />
          <Route path="destockage" element={<Destockage />} />
          <Route path="recherche" element={<RechercheEmplacement />} />
          <Route path="bon-sortie" element={<BonSortie />} />

          {/* ✅ Admin-only route */}
          <Route
            path="ajouter-article"
            element={
              <ProtectedRoute requiredRole="admin">
                <AjouterArticle />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
