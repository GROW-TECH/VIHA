import { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react";

/* ================= TYPES ================= */
interface MaterialEntry {
  id: string;
  material_name: string;
  color_code: string;
}

interface PurchaseEntry {
  id: string;
  date: string;
  materialId: string;
  materialName: string;
  colorName: string;
  quantity: number;
}

/* ================= API ================= */
const API_MATERIALS = "http://localhost:5000/materials";
const API_PURCHASES = "http://localhost:5000/purchases";

export default function PurchaseRegister() {
  const [materials, setMaterials] = useState<MaterialEntry[]>([]);
  const [purchases, setPurchases] = useState<PurchaseEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialEntry | null>(null);
  const [quantity, setQuantity] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadMaterials();
    loadPurchases();
  }, []);

  const loadMaterials = async () => {
    const res = await fetch(API_MATERIALS);
    const data = await res.json();
    setMaterials(data);
  };

  const loadPurchases = async () => {
    const res = await fetch(API_PURCHASES);
    const data = await res.json();
    setPurchases(data);
  };

  function resetForm() {
    setDate("");
    setSelectedMaterial(null);
    setQuantity("");
    setEditingId(null);
  }

  /* ================= ADD NEW ================= */
  function addNewPurchase() {
    resetForm();
    setShowForm(true);
  }

  /* ================= SAVE / UPDATE ================= */
  async function savePurchase() {
    if (!date || !selectedMaterial || !quantity) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      date,
      materialId: selectedMaterial.id,
      materialName: selectedMaterial.material_name,
      colorCode: selectedMaterial.color_code,
      quantity: Number(quantity),
    };

    if (editingId) {
      await fetch(`${API_PURCHASES}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API_PURCHASES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setShowForm(false);
    resetForm();
    loadPurchases();
  }

  /* ================= EDIT ================= */
  function editPurchase(p: PurchaseEntry) {
    setEditingId(p.id);
    setDate(p.date);
    setQuantity(String(p.quantity));

    const mat =
      materials.find((m) => m.id === p.materialId) || null;
    setSelectedMaterial(mat);

    setShowForm(true);
  }

  /* ================= DELETE ================= */
  async function deletePurchase(id: string) {
    if (!confirm("Delete this purchase?")) return;
    await fetch(`${API_PURCHASES}/${id}`, { method: "DELETE" });
    loadPurchases();
  }

  return (
    <div className="h-full flex flex-col bg-[#fefefe] p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-800">
          Purchase Register
        </h1>
        <button
          onClick={addNewPurchase}
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          New Purchase
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full border-collapse bg-white">
        <thead className="bg-amber-100 border-b-2 border-red-700">
          <tr>
            <th className="border px-2 py-2">Sr No.</th>
            <th className="border px-2 py-2">Date</th>
            <th className="border px-2 py-2">Material</th>
            <th className="border px-2 py-2">Color</th>
            <th className="border px-2 py-2">Quantity</th>
            <th className="border px-2 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length ? (
            purchases.map((p, i) => (
              <tr key={p.id}>
                <td className="border px-2 py-1 text-center">{i + 1}</td>
                <td className="border px-2 py-1">{p.date}</td>
                <td className="border px-2 py-1">{p.materialName}</td>
                <td className="border px-2 py-1">{p.colorName}</td>
                <td className="border px-2 py-1">{p.quantity}</td>
                <td className="border px-2 py-1 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => editPurchase(p)}
                      className="text-blue-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deletePurchase(p.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No purchases added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Purchase" : "New Purchase"}
            </h2>

            <label>Date</label>
            <input
              type="date"
              className="border w-full mb-2 px-2 py-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label>Material</label>
            <select
              className="border w-full mb-2 px-2 py-1"
              value={selectedMaterial?.id || ""}
              onChange={(e) => {
                const mat =
                  materials.find((m) => m.id === e.target.value) || null;
                setSelectedMaterial(mat);
              }}
            >
              <option value="">Select Material</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.material_name} ({m.color_code})
                </option>
              ))}
            </select>

            <label>Quantity</label>
            <input
              type="number"
              className="border w-full mb-4 px-2 py-1"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={savePurchase}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {editingId ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
