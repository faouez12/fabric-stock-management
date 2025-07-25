import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  PackageOpen,
  LogOut,
  Warehouse,
  ClipboardList,
  Search,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="h-full bg-[#18181b] text-white w-64 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-lg font-bold mb-6">🧵 Fabric Stock</h1>
        <nav className="flex flex-col gap-3">
          <Link
            to="/"
            className="hover:text-purple-400 flex items-center gap-2"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/stockage"
            className="hover:text-purple-400 flex items-center gap-2"
          >
            <Warehouse size={18} />
            Stockage
          </Link>

          <Link
            to="/destockage"
            className="hover:text-purple-400 flex items-center gap-2"
          >
            <PackageOpen size={18} />
            Déstockage
          </Link>

          <Link
            to="/recherche"
            className="hover:text-purple-400 flex items-center gap-2"
          >
            <Search size={18} />
            Recherche Emplacement
          </Link>

          <Link
            to="/bon-sortie"
            className="hover:text-purple-400 flex items-center gap-2"
          >
            <ClipboardList size={18} />
            Bon de Sortie
          </Link>

          {isAdmin && (
            <Link
              to="/ajouter-article"
              className="hover:text-purple-400 flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Ajouter Article
            </Link>
          )}
        </nav>
      </div>

      <div className="text-sm border-t border-muted pt-4">
        {user && (
          <div className="mb-2 text-muted-foreground">
            <span>
              👤 {user.username} ({user.role})
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
