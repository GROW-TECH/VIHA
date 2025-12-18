import { useEffect, useState, FormEvent } from "react";
import { Plus, Trash2, Edit, X } from "lucide-react";

interface Material {
  id: string;
  materialCode: string;
  materialName: string;
  description: string;
  colorCode: string;
  availableQty: string;
}

const API_MATERIALS = "http://localhost:5000/materials";

export default function MaterialRegister() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    materialCode: "",
    materialName: "",
    description: "",
    colorCode: "",
    availableQty: "",
  });

  // ================= FETCH =================
  const loadMaterials = async () => {
    const res = await fetch(API_MATERIALS);
    const data = await res.json();
    console.log(data);
    setMaterials(data);
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  // ================= RESET =================
  const resetForm = () => {
    setForm({
      materialCode: "",
      materialName: "",
      description: "",
      colorCode: "",
      availableQty: "",
    });
    setEditId(null);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(data);

    try {
      if (editId) {
        // UPDATE
        await fetch(`${API_MATERIALS}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // ADD
        await fetch(API_MATERIALS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      setShowForm(false);
      resetForm();
      loadMaterials();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (m: Material) => {
    setForm({
      materialCode: m.materialCode,
      materialName: m.materialName,
      description: m.description,
      colorCode: m.colorCode,
      availableQty: m.availableQty,
    });
    setEditId(m.id);
    setShowForm(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this material?")) return;
    await fetch(`${API_MATERIALS}/${id}`, { method: "DELETE" });
    loadMaterials();
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-red-800">Material Register</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> New Material
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-amber-100">
          <tr>
            {["Sr No", "Code", "Name", "Desc", "Color", "Qty", "Action"].map(
              (h) => (
                <th key={h} className="border px-2 py-2">
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {materials.map((m, i) => (
            <tr key={m.id}>
              <td className="border px-2 text-center">{i + 1}</td>
              <td className="border px-2">{m.material_code}</td>
              <td className="border px-2">{m.material_name}</td>
              <td className="border px-2">{m.description}</td>
              <td className="border px-2">{m.color_code}</td>
              <td className="border px-2">{m.available_qty}</td>
              <td className="border px-2 flex gap-2 justify-center">
                <Edit
                  size={16}
                  className="text-blue-600 cursor-pointer"
                  onClick={() => handleEdit(m)}
                />
                <Trash2
                  size={16}
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(m.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-96 flex flex-col gap-2 relative"
          >
            <h2 className="font-bold text-lg">
              {editId ? "Edit Material" : "Add Material"}
            </h2>

            {Object.entries(form).map(([key, val]) => (
              <input
                key={key}
                placeholder={key}
                className="border px-2 py-1"
                value={val}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ))}

            <button className="bg-amber-600 text-white py-2 rounded">
              Save
            </button>

            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setShowForm(false)}
            />
          </form>
        </div>
      )}
    </div>
  );
}
