import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

/* =========================
   TYPES
========================= */
type Client = {
  id: string;
  client_name?: string;
};

type DinearEntry = {
  id: number;
  date: string;
  customerId: string;
  customerName?: string;
  value1: number;
  value2: number;
  value3: number;
  dinear: number;
  varavu: number;
};

/* =========================
   TRANSLATIONS
========================= */
const labels = {
  en: {
    title: "Dinear Register",
    sno: "S.No",
    date: "Date",
    customer: "Customer",
    value1: "Value 1",
    value2: "Value 2",
    value3: "Value 3",
    dinear: "Dinear",
    varavu: "Varavu",
    action: "Action",
    selectCustomer: "Select Customer",
    add: "Add",
    update: "Update",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Delete row?",
    requiredAlert: "Date, Customer & Dinear are required",
  },
  ta: {
    title: "தினையர் பதிவு",
    sno: "எண்",
    date: "தேதி",
    customer: "வாடிக்கையாளர்",
    value1: "மதிப்பு 1",
    value2: "மதிப்பு 2",
    value3: "மதிப்பு 3",
    dinear: "தினையர்",
    varavu: "வரவு",
    action: "செயல்",
    selectCustomer: "வாடிக்கையாளர் தேர்வு",
    add: "சேர்",
    update: "புதுப்பி",
    edit: "திருத்து",
    delete: "அழி",
    deleteConfirm: "இந்த பதிவை நீக்கவா?",
    requiredAlert: "தேதி, வாடிக்கையாளர் மற்றும் தினையர் அவசியம்",
  },
};

/* =========================
   COMPONENT
========================= */
export default function Dinear() {
  const { lang, toggleLang } = useLanguage(); // 🔹 global language
  const t = labels[lang];

  const [clients, setClients] = useState<Client[]>([]);
  const [rows, setRows] = useState<DinearEntry[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [row, setRow] = useState({
    date: "",
    customerId: "",
    value1: "",
    value2: "",
    value3: "",
    dinear: "",
    varavu: "",
  });

  /* =========================
     FETCH CLIENTS
  ========================== */
  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("http://localhost:5000/api/clients");
      const data = await res.json();
      setClients(
        data.map((c: any) => ({
          id: String(c.id),
          client_name: c.client_name,
        }))
      );
    }
    fetchClients();
  }, []);

  /* =========================
     FETCH DINEAR
  ========================== */
  useEffect(() => {
    async function fetchDinear() {
      const res = await fetch("http://localhost:5000/api/dinear");
      const data = await res.json();
      setRows(data);
    }
    fetchDinear();
  }, []);

  /* =========================
     AUTO VARAVU
  ========================== */
  useEffect(() => {
    const v1 = Number(row.value1 || 0);
    const v2 = Number(row.value2 || 0);
    const v3 = Number(row.value3 || 0);
    const dinear = Number(row.dinear || 0);

    const calculatedVaravu = Math.floor(((v1 + v2) * v3 * dinear) / 1000);
    setRow((prev) => ({ ...prev, varavu: calculatedVaravu.toString() }));
  }, [row.value1, row.value2, row.value3, row.dinear]);

  /* =========================
     SAVE / UPDATE
  ========================== */
  const saveRow = async () => {
    if (!row.date || !row.customerId || !row.dinear) {
      return alert(t.requiredAlert);
    }

    const customer = clients.find((c) => c.id === row.customerId);
    const dataToSend = {
      date: row.date,
      customerId: row.customerId,
      value1: Number(row.value1),
      value2: Number(row.value2),
      value3: Number(row.value3),
      dinear: Number(row.dinear),
      varavu: Number(row.varavu),
    };

    if (editIndex !== null) {
      const id = rows[editIndex].id;
      await fetch(`http://localhost:5000/api/dinear/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const updatedRows = [...rows];
      updatedRows[editIndex] = { id, customerName: customer?.client_name, ...dataToSend };
      setRows(updatedRows);
      setEditIndex(null);
    } else {
      const res = await fetch("http://localhost:5000/api/dinear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const newRow = await res.json();
      setRows((prev) => [...prev, { id: newRow.id, customerName: customer?.client_name, ...dataToSend }]);
    }

    setRow({ date: "", customerId: "", value1: "", value2: "", value3: "", dinear: "", varavu: "" });
  };

  /* =========================
     DELETE
  ========================== */
  const deleteRow = async (index: number) => {
    if (!confirm(t.deleteConfirm)) return;
    const id = rows[index].id;
    await fetch(`http://localhost:5000/api/dinear/${id}`, { method: "DELETE" });
    setRows(rows.filter((_, i) => i !== index));
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-700">{t.title}</h1>
        <button
          onClick={toggleLang}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          {lang === "en" ? "தமிழ்" : "English"}
        </button>
      </div>

      <div className="overflow-x-auto border border-red-600">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-amber-100">
            <tr>
              <th className="border p-2">{t.sno}</th>
              <th className="border p-2">{t.date}</th>
              <th className="border p-2">{t.customer}</th>
              <th className="border p-2">{t.value1}</th>
              <th className="border p-2">{t.value2}</th>
              <th className="border p-2">{t.value3}</th>
              <th className="border p-2">{t.dinear}</th>
              <th className="border p-2">{t.varavu}</th>
              <th className="border p-2">{t.action}</th>
            </tr>

            {/* ENTRY ROW */}
            <tr className="bg-yellow-50">
              <td className="border p-2 text-center">
                {editIndex !== null ? editIndex + 1 : rows.length + 1}
              </td>

              <td className="border">
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => setRow({ ...row, date: e.target.value })}
                  className="w-full p-1"
                />
              </td>

              <td className="border">
                <select
                  value={row.customerId}
                  onChange={(e) => setRow({ ...row, customerId: e.target.value })}
                  className="w-full p-1"
                >
                  <option value="">{t.selectCustomer}</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.client_name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="border">
                <input
                  type="number"
                  value={row.value1}
                  onChange={(e) => setRow({ ...row, value1: e.target.value })}
                  className="w-full p-1"
                />
              </td>

              <td className="border">
                <input
                  type="number"
                  value={row.value2}
                  onChange={(e) => setRow({ ...row, value2: e.target.value })}
                  className="w-full p-1"
                />
              </td>

              <td className="border">
                <input
                  type="number"
                  value={row.value3}
                  onChange={(e) => setRow({ ...row, value3: e.target.value })}
                  className="w-full p-1"
                />
              </td>

              <td className="border">
                <input
                  type="number"
                  value={row.dinear}
                  onChange={(e) => setRow({ ...row, dinear: e.target.value })}
                  className="w-full p-1"
                />
              </td>

              <td className="border">
                <input
                  type="number"
                  value={row.varavu}
                  readOnly
                  className="w-full p-1 bg-gray-100"
                />
              </td>

              <td className="border text-center">
                <button
                  onClick={saveRow}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {editIndex !== null ? t.update : t.add}
                </button>
              </td>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{r.date}</td>
                <td className="border p-2">{r.customerName}</td>
                <td className="border p-2">{r.value1}</td>
                <td className="border p-2">{r.value2}</td>
                <td className="border p-2">{r.value3}</td>
                <td className="border p-2">{r.dinear}</td>
                <td className="border p-2">{r.varavu}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded">{t.edit}</button>
                  <button onClick={() => deleteRow(i)} className="bg-red-600 text-white px-2 py-1 rounded">
                    {t.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
