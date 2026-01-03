import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  Menu,
  X,
  UtensilsCrossed
} from "lucide-react";

import { Dashboard } from "./components/Dashboard";
import { ClientRegister } from "./components/ClientRegister";
import OwnerAccount  from "./components/OwnerAccount";
import ProductionRegister from "./components/ProductionRegister";
import Dinear from "./components/Dinear";
import { LanguageProvider } from "./context/LanguageContext";

/* =========================
   PAGE TYPE
========================= */
type Page = "dashboard" | "clients" | "Owner" | "production" | "dinear";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "clients", icon: Users, label: "Client Register" },
    { id: "Owner", icon: Users, label: "Owner Account" },
    { id: "production", icon: Layers, label: "Production" },
    { id: "dinear", icon: UtensilsCrossed, label: "Dinear" },
  ];

  function renderPage() {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <ClientRegister />;
      case "Owner":
        return <OwnerAccount />;
      case "production":
        return <ProductionRegister />;
      case "dinear":
        return <Dinear />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/20 rounded"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-2xl font-bold">VIVA Sarees Management</h1>
          </div>
          <span className="text-sm">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static inset-y-0 left-0 w-64 bg-white border-r-2 border-gray-300 z-20 transition-transform duration-300 flex flex-col mt-16 lg:mt-0`}
        >
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-amber-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t-2 border-gray-200 bg-amber-50">
            <p className="text-xs text-gray-600 text-center">© 2024 Viha Sarees</p>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10 lg:hidden mt-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-hidden">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
