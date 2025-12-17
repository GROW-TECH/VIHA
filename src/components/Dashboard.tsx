import { useState, useEffect } from "react";
import { Users, Package, Layers, AlertCircle } from "lucide-react";

export function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalDesigns: 0,
    pendingOrders: 0,
    inProduction: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading with placeholder/fake data
    const timer = setTimeout(() => {
      setStats({
        totalClients: 12,
        totalDesigns: 35,
        pendingOrders: 4,
        inProduction: 7,
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="h-full bg-[#fefefe] p-8">
      <div className="border-b-2 border-red-700 bg-amber-50 p-4 -m-8 mb-8">
        <h1 className="text-3xl font-bold text-red-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalClients}
              </div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalDesigns}
              </div>
              <div className="text-sm text-gray-600">Total Designs</div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {stats.pendingOrders}
              </div>
              <div className="text-sm text-gray-600">Pending Orders</div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Layers className="h-6 w-6 text-amber-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {stats.inProduction}
              </div>
              <div className="text-sm text-gray-600">In Production</div>
            </div>
          </div>
        </div>
      </div>

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
