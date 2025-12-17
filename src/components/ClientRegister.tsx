import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import api from "../api/axios";
import { Client } from "../types";

export function ClientRegister() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formClient, setFormClient] = useState<Partial<Client> | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  /* ---------------- LOAD CLIENTS ---------------- */
  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const res = await api.get<Client[]>("/clients");
    setClients(res.data);
  }

  /* ---------------- ADD ---------------- */
  function openNewClientForm() {
    setFormClient({
      client_name: "",
      mobile: "",
      city_area: "",
      client_type: "Retail",
    });
    setEditingClientId(null);
    setIsFormOpen(true);
  }

  /* ---------------- EDIT ---------------- */
  function openEditClientForm(client: Client) {
    setFormClient({ ...client });
    setEditingClientId(client.id);
    setIsFormOpen(true);
  }

  /* ---------------- SAVE ---------------- */
  async function saveClientFromForm() {
    if (!formClient) return;

    if (!formClient.client_name && !formClient.mobile) {
      alert("Enter Client Name or Mobile");
      return;
    }

    const now = new Date().toISOString();

    // EDIT
    if (editingClientId) {
      await api.put(`/clients/${editingClientId}`, {
        ...formClient,
        updated_at: now,
      });

      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClientId
            ? { ...c, ...formClient, updated_at: now }
            : c
        )
      );
    }
    // ADD
    else {
      const newClient: Client = {
        id: crypto.randomUUID(),
        sr_no: clients.length + 1,
        client_name: formClient.client_name ?? "",
        mobile: formClient.mobile ?? "",
        alternate_mobile: "",
        city_area: formClient.city_area ?? "",
        client_type: formClient.client_type ?? "Retail",
        gst_no: "",
        opening_balance: 0,
        notes: "",
        created_at: now,
        updated_at: now,
      };

      await api.post("/clients", newClient);

      setClients((prev) => [newClient, ...prev]);
    }

    setIsFormOpen(false);
    setFormClient(null);
    setEditingClientId(null);
  }

  function cancelForm() {
    setIsFormOpen(false);
    setFormClient(null);
    setEditingClientId(null);
  }

  /* ---------------- DELETE ---------------- */
  async function deleteClient(id: string) {
    if (!confirm("Delete this client?")) return;

    await api.delete(`/clients/${id}`);

    setClients((prev) =>
      prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, sr_no: i + 1 }))
    );
  }

  /* ---------------- FILTER ---------------- */
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm);

    const matchesType = !filterType || c.client_type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-amber-50">
        <h1 className="text-3xl font-bold text-red-800">Client Register</h1>
      </div>

      {/* Search */}
      <div className="p-4 flex gap-4 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-9 border px-2 py-1 rounded"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="border px-2 py-1 rounded"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All</option>
          <option value="Retail">Retail</option>
          <option value="Wholesale">Wholesale</option>
        </select>

        <button
          onClick={openNewClientForm}
          className="bg-amber-600 text-white px-4 py-1 rounded flex items-center gap-2"
        >
          <Plus size={16} /> New Client
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-amber-100">
            <tr>
              <th className="border p-2">Sr</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((c) => (
              <tr key={c.id} className="hover:bg-yellow-50">
                <td className="border p-1 text-center">{c.sr_no}</td>
                <td className="border p-1">{c.client_name}</td>
                <td className="border p-1">{c.mobile}</td>
                <td className="border p-1">{c.city_area}</td>
                <td className="border p-1 text-center">
                  <button
                    onClick={() => openEditClientForm(c)}
                    className="p-1 mr-2 hover:bg-blue-100 rounded"
                  >
                    <Pencil size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => deleteClient(c.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isFormOpen && formClient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[95%] max-w-md">
            <h2 className="text-xl font-semibold mb-3">
              {editingClientId ? "Edit Client" : "New Client"}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Client Name"
                value={formClient.client_name ?? ""}
                onChange={(e) =>
                  setFormClient({ ...formClient, client_name: e.target.value })
                }
              />
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Mobile"
                value={formClient.mobile ?? ""}
                onChange={(e) =>
                  setFormClient({ ...formClient, mobile: e.target.value })
                }
              />
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="City / Area"
                value={formClient.city_area ?? ""}
                onChange={(e) =>
                  setFormClient({ ...formClient, city_area: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={cancelForm} className="border px-4 py-1 rounded">
                Cancel
              </button>
              <button
                onClick={saveClientFromForm}
                className="bg-amber-600 text-white px-4 py-1 rounded"
              >
                {editingClientId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
