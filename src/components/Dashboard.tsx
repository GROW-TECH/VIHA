import { useState, useEffect } from 'react';
import { Users, Package, Layers, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalClients: number;
  totalDesigns: number;
  pendingOrders: number;
  inProduction: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalDesigns: 0,
    pendingOrders: 0,
    inProduction: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  /* =========================
     FETCH STATS (LOCAL)
     Replace later with API
  ========================= */
  async function fetchStats() {
    try {
      // Simulated data (replace with API calls later)
      await new Promise((res) => setTimeout(res, 500));

      setStats({
        totalClients: 124,
        totalDesigns: 58,
        pendingOrders: 12,
        inProduction: 7,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="h-full bg-[#fefefe] p-8">
      <div className="border-b-2 border-red-700 bg-amber-50 p-4 -m-8 mb-8">
        <h1 className="text-3xl font-bold text-red-800">Dashboard</h1>
      </div>

      {/* =========================
          STATS CARDS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          bg="bg-blue-100"
        />
        <StatCard
          title="Total Designs"
          value={stats.totalDesigns}
          icon={<Package className="h-6 w-6 text-green-600" />}
          bg="bg-green-100"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          bg="bg-red-100"
        />
        <StatCard
          title="In Production"
          value={stats.inProduction}
          icon={<Layers className="h-6 w-6 text-amber-600" />}
          bg="bg-amber-100"
        />
      </div>

      {/* =========================
          INFO PANEL
      ========================= */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Welcome to Viha Sarees Management
        </h2>

        <p className="text-gray-600 mb-4">
          This is your central hub for managing all aspects of your saree
          manufacturing business.
        </p>

        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>
              <strong>Client Register:</strong> Manage all your client details
              and track balances
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>
              <strong>Product & Stock:</strong> Maintain your design catalog and
              stock levels
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>
              <strong>Production:</strong> Track production orders from issue to
              completion with waste calculation
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD COMPONENT
========================= */
function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`${bg} p-3 rounded-lg`}>{icon}</div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
    </div>
  );
}
