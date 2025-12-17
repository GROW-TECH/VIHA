// src/App.tsx
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { ClientRegister } from "./components/ClientRegister";
import ProductRegister from "./components/ProductRegister";
import { ProductionRegister } from "./components/ProductionRegister";
import PurchaseDetails from "./components/PurchaseDetails";

import type { Product } from "./types";

type Page = "dashboard" | "clients" | "products" | "production" | "purchases";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const menuItems = [
    { id: "dashboard" as Page, icon: LayoutDashboard, label: "Dashboard" },
    { id: "clients" as Page, icon: Users, label: "Client Register" },
    { id: "products" as Page, icon: Package, label: "Material" },
    { id: "purchases" as Page, icon: ShoppingCart, label: "Purchases" },
    { id: "production" as Page, icon: Layers, label: "Production" },
  ];

  function renderPage() {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <ClientRegister />;
      case "products":
        return (
          <ProductRegister
            onSelectProduct={(p: Product) => {
              setSelectedProduct(p);
              setCurrentPage("purchases");
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
          />
        );
      case "production":
        return <ProductionRegister />;
      case "purchases":
        return <PurchaseDetails prefillProduct={selectedProduct} />;
      default:
        return <Dashboard />;
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const smallScreen = window.innerWidth < 1024;
    if (sidebarOpen && smallScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-yellow-50">
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/20 rounded"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <h1 className="text-2xl font-bold">Viha Sarees Management</h1>
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
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static inset-y-0 left-0 w-64 bg-yellow-50 border-r-2 border-gray-300 z-20 
          transition-transform duration-300 flex flex-col mt-16 lg:mt-0`}
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
                          : "text-gray-700 hover:bg-amber-100 hover:text-amber-700"
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
            <p className="text-xs text-gray-600 text-center">
              © 2025 Viha Sarees
            </p>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed left-0 right-0 bottom-0 top-16 bg-black/50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-hidden bg-yellow-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
