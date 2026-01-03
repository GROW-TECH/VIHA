import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useLanguage } from "../context/LanguageContext";
import { safeFetch } from "../utils/fetchUtils";

/* =========================
   TYPES
========================= */
type EntryItem = {
  id: number;
  serial: number;
  date: string;
  customerId: string;
  customerName: string;
  material: string;
  pattru: number;
  varavu: number;
  kattai: number;
  sareeCount: number;
  cooliePerSaree: number;
  totalCoolie: number;
  salaryPaid: number;
  paySalary: boolean;
  bakkiAmount: number;
  accountNumber?: string;
  photoUrl?: string | null;
};

type Client = {
  id: string;
  client_name: string;
  account_number?: string;
};

type OwnerAccount = {
  id: string | number;
  holderName: string;
  accountNumber: string;
  bankName: string;
};

/* =========================
   TRANSLATIONS
========================= */
const TEXT = {
  en: {
    title: "Production Entry",
    date: "Date",
    customer: "Customer",
    material: "Material",
    pattru: "Pattru",
    varavu: "Varavu",
    kattai: "Kattai",
    sarees: "Sarees",
    coolie: "Coolie",
    total: "Total",
    salary: "Salary",
    bakki: "Bakki",
    account: "Account",
    action: "Action",
    pay: "Pay",
    add: "Add",
    update: "Update",
    select: "Select",
    deleteConfirm: "Are you sure you want to delete this row?",
    fillFields: "Fill required fields",
    uploadPhoto: "Upload Photo",
  },
  ta: {
    title: "உற்பத்தி பதிவு",
    date: "தேதி",
    customer: "வாடிக்கையாளர்",
    material: "பொருள்",
    pattru: "பற்று",
    varavu: "வரவு",
    kattai: "கட்டை",
    sarees: "சாரி எண்ணிக்கை",
    coolie: "கூலி",
    total: "மொத்தம்",
    salary: "சம்பளம்",
    bakki: "பாக்கி",
    account: "கணக்கு எண்",
    action: "செயல்",
    pay: "செலுத்து",
    add: "சேர்",
    update: "புதுப்பி",
    select: "தேர்வு",
    deleteConfirm: "இந்த வரிசையை நீக்க வேண்டுமா?",
    fillFields: "தேவைமான புலங்களை நிரப்பவும்",
    uploadPhoto: "புகைப்படம் பதிவேற்று",
  },
};

/* =========================
   COMPONENT
========================= */
export default function MaterialEntry() {
  const { lang, toggleLang } = useLanguage();
  const t = TEXT[lang];

  const [clients, setClients] = useState<Client[]>([]);
  
  const [ownerAccounts, setOwnerAccounts] = useState<OwnerAccount[]>([]);
  const [rows, setRows] = useState<EntryItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [qrToPrint, setQrToPrint] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

 const [row, setRow] = useState({
  date: "",
  customerId: "",
  material: "",
  pattru: "",
  varavu: "",
  kattai: "",
  sareeCount: "",
  cooliePerSaree: "",
  salaryPaid: "",
  paySalary: false,
  bakkiAmount: "",
  ownerAccountId: "",   // <-- ADD THIS
  photo: null as File | null,
});


  /* ========================= FETCH CLIENTS ========================== */
  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("http://localhost:5000/api/clients");
      const data = await res.json();

      setClients(
        data.map((c: any) => ({
          id: String(c.id),
          client_name: c.client_name,
          account_number: c.account_number,
        }))
      );
    }

    fetchClients();
  }, []);

  useEffect(() => {
  async function fetchOwnerAccounts() {
    const res = await fetch("http://localhost:5000/api/owner");
    const data = await res.json();
    setOwnerAccounts(data);
  }

  fetchOwnerAccounts();
}, []);


  /* ========================= FETCH ENTRIES ========================== */
  async function loadEntries() {
    const res = await fetch("http://localhost:5000/api/productions-entries");
    const data = await res.json();

    setRows(
      data.map((r: any, idx: number) => ({
        id: r.id,
        serial: idx + 1,
        date: r.entry_date,
        customerId: String(r.customer_id),
        customerName: r.customer_name,
        material: r.material,
        pattru: r.pattru,
        varavu: r.varavu,
        kattai: r.kattai,
        sareeCount: r.saree_count,
        cooliePerSaree: r.coolie_per_saree,
        totalCoolie: r.total_coolie,
        salaryPaid: r.salary_paid,
        paySalary: !!r.pay_salary,
        bakkiAmount: r.bakki_amount,
        
        accountNumber: r.account_number,
        photoUrl: r.photo_url ? `http://localhost:5000${r.photo_url}` : null,
      }))
    );
  }

  useEffect(() => {
    loadEntries();
  }, []);

  /* ========================= CALCULATIONS ========================== */
  const totalCoolie =
    Number(row.sareeCount || 0) * Number(row.cooliePerSaree || 0);

  const bakkiAmount = row.paySalary
    ? Math.max(
        0,
        Number(row.bakkiAmount || 0) - Number(row.salaryPaid || 0)
      )
    : Number(row.bakkiAmount || 0);

  const filteredRows = rows.filter((r) =>
    r.customerName?.toLowerCase().includes(searchText.toLowerCase())
  );

  /* ========================= SAVE ROW ========================== */
 const saveRow = async () => {
  if (!row.date || !row.customerId) {
    return alert(t.fillFields);
  }

  const customer = clients.find((c) => c.id === row.customerId)!;

  // Convert numeric fields
  const pattru = Number(row.pattru || 0);
  const varavu = Number(row.varavu || 0);
  const kattai = Number(row.kattai || 0);
  const sareeCount = Number(row.sareeCount || 0);
  const cooliePerSaree = Number(row.cooliePerSaree || 0);
  const salaryPaid = Number(row.salaryPaid || 0);

  const totalCoolie = sareeCount * cooliePerSaree;
  const bakkiAmountCalc = row.paySalary
    ? Math.max(0, Number(row.bakkiAmount || 0) - salaryPaid)
    : Number(row.bakkiAmount || 0);

  const formData = new FormData();
  formData.append("date", row.date);
  formData.append("customerId", customer.id);
  formData.append("customerName", customer.client_name);
  formData.append("material", row.material);
  formData.append("pattru", String(pattru));
  formData.append("varavu", String(varavu));
  formData.append("kattai", String(kattai));
  formData.append("sareeCount", String(sareeCount));
  formData.append("cooliePerSaree", String(cooliePerSaree));
  formData.append("totalCoolie", String(totalCoolie));
  formData.append("paySalary", row.paySalary ? "1" : "0");
  formData.append("salaryPaid", String(row.paySalary ? salaryPaid : 0));
  formData.append("bakkiAmount", String(bakkiAmountCalc));
  formData.append(
    "accountNumber",
    row.paySalary ? customer.account_number || "" : ""
  );

  if (row.photo) formData.append("photo", row.photo);

  try {
    const backendUrl = "http://localhost:5000/api/productions-entries";

    if (editIndex === null) {
      await safeFetch(backendUrl, { method: "POST", body: formData });
    } else {
      const id = rows[editIndex].id;
      await safeFetch(`${backendUrl}/${id}`, { method: "PUT", body: formData });
      setEditIndex(null);
    }

    await loadEntries();

    // Reset row
    setRow({
      date: "",
      customerId: "",
      material: "",
      pattru: "",
      varavu: "",
      kattai: "",
      sareeCount: "",
      cooliePerSaree: "",
      salaryPaid: "",
      paySalary: false,
      bakkiAmount: "",
      ownerAccountId: "",

      photo: null,
    });
  } catch (err) {
    console.error(err);
    alert("Error saving row");
  }
};


  /* ========================= EDIT ROW ========================== */
  const editRow = (i: number) => {
  const r = rows[i];
  if (!r) return;

  // Format date as YYYY-MM-DD for the date input
  const formattedDate = r.date.slice(0, 10); // or use new Date(r.date).toISOString().slice(0,10)

  setRow({
    date: formattedDate,
    customerId: r.customerId,
    material: r.material,
    pattru: String(r.pattru),
    varavu: String(r.varavu),
    kattai: String(r.kattai),
    sareeCount: String(r.sareeCount),
    cooliePerSaree: String(r.cooliePerSaree),
    salaryPaid: String(r.salaryPaid),
    paySalary: r.paySalary,
    bakkiAmount: String(r.bakkiAmount),
    ownerAccountId: "",

    photo: null,
  });

  setEditIndex(i);
};


  /* ========================= DELETE ROW ========================== */
  const deleteRow = async (i: number) => {
    if (!confirm(t.deleteConfirm)) return;

    const id = rows[i].id;

    await fetch(`http://localhost:5000/api/productions-entries/${id}`, {
      method: "DELETE",
    });

    await loadEntries();
  };

  /* ========================= PRINT QR ========================== */
  const PrintQR = () =>
    qrToPrint ? (
      <div
        id="qr-print-area"
        style={{
          position: "fixed",
          inset: 0,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <QRCode value={qrToPrint} size={260} />
      </div>
    ) : null;

  const printStyle = `
@media print {
  body * { visibility: hidden; }
  #qr-print-area, #qr-print-area * { visibility: visible; }
  #qr-print-area { position: fixed; inset: 0; }
}
`;

  /* ========================= UI ========================== */
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <style>{printStyle}</style>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-red-800">{t.title}</h1>

        <button
          onClick={toggleLang}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          {lang === "en" ? "தமிழ்" : "English"}
        </button>
      </div>

      <div className="mb-3 flex justify-end">
        <input
          type="text"
          placeholder="Search customer..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded px-3 py-1 w-64"
        />
      </div>

      {/* ========================= TABLE ========================== */}
      <div className="overflow-x-auto border border-red-700"
      style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <table className="w-full border-collapse text-sm">
          <thead className="bg-amber-100">
            <tr>
              <th className="border p-2">Sr</th>
              <th className="border p-2">{t.date}</th>
              <th className="border p-2">{t.customer}</th>
              <th className="border p-2">{t.material}</th>
              <th className="border p-2">{t.pattru}</th>
              <th className="border p-2">{t.varavu}</th>
              <th className="border p-2">{t.kattai}</th>
              <th className="border p-2">{t.sarees}</th>
              <th className="border p-2">{t.coolie}</th>
              <th className="border p-2">{t.total}</th>
              <th className="border p-2">{t.salary}</th>
              <th className="border p-2">{t.bakki}</th>
              <th className="border p-2">{t.account}</th>
              <th className="border p-2">Photo</th>
              <th className="border p-2">QR Code</th>
              <th className="border p-2">{t.action}</th>
            </tr>

            {/* ========================= INPUT ROW ========================== */}
            <tr className="bg-yellow-50">
              <td className="border p-2 text-center">
                {editIndex !== null
                  ? rows[editIndex].serial
                  : rows.length + 1}
              </td>

              <td className="border p-2">
                <input
                  type="date"
                  className="w-full"
                  value={row.date}
                  onChange={(e) =>
                    setRow({ ...row, date: e.target.value })
                  }
                />
              </td>

              <td className="border p-2">
                <select
                  className="w-full"
                  value={row.customerId}
                  onChange={(e) =>
                    setRow({ ...row, customerId: e.target.value })
                  }
                >
                  <option value="">{t.select}</option>

                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.client_name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="border p-2">
                <textarea
                  className="w-full"
                  value={row.material}
                  onChange={(e) =>
                    setRow({ ...row, material: e.target.value })
                  }
                />
              </td>

              <td className="border p-2">
                <input
                  type="number"
                  className="w-full"
                  value={row.pattru}
                  onChange={(e) =>
                    setRow({ ...row, pattru: e.target.value })
                  }
                />
              </td>

              <td className="border p-2">
                <input
                  type="number"
                  className="w-full"
                  value={row.varavu}
                  onChange={(e) =>
                    setRow({ ...row, varavu: e.target.value })
                  }
                />
              </td>

              <td className="border p-2">
                <input
                  type="number"
                  className="w-full"
                  value={row.kattai}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setRow({
                      ...row,
                      kattai: e.target.value,
                      sareeCount: Math.floor(v / 5).toString(),
                    });
                  }}
                />
              </td>

              <td className="border p-2">{row.sareeCount}</td>

              <td className="border p-2">
                <input
                  type="number"
                  className="w-full"
                  value={row.cooliePerSaree}
                  onChange={(e) =>
                    setRow({
                      ...row,
                      cooliePerSaree: e.target.value,
                    })
                  }
                />
              </td>

              <td className="border p-2 font-bold">{totalCoolie}</td>

              <td className="border p-2">
                <div className="flex flex-col">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={row.paySalary}
                      onChange={(e) =>
                        setRow({
                          ...row,
                          paySalary: e.target.checked,
                        })
                      }
                    />
                    {t.pay}
                  </label>

                  <input
                    type="number"
                    className="w-full mt-1"
                    disabled={!row.paySalary}
                    value={row.salaryPaid}
                    onChange={(e) =>
                      setRow({
                        ...row,
                        salaryPaid: e.target.value,
                      })
                    }
                  />
                </div>
              </td>

              <td className="border p-2 font-bold">{bakkiAmount}</td>

              <td className="border p-2">
                {row.paySalary
                  ? clients.find((c) => c.id === row.customerId)
                      ?.account_number
                  : "-"}
              </td>

              <td className="border p-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setRow({
                      ...row,
                      photo: e.target.files?.[0] || null,
                    })
                  }
                />
              </td>

              <td className="border p-2 text-center">-</td>

              <td className="border p-2">
                <button
                  onClick={saveRow}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {editIndex !== null ? t.update : t.add}
                </button>
              </td>
            </tr>
          </thead>

          {/* ========================= DATA ROWS ========================== */}
          <tbody>
            {filteredRows.map((r, i) => (
              <tr key={r.id} className="hover:bg-yellow-50">
                <td className="border p-2">{r.serial}</td>
                <td className="border p-2">{r.date.slice(0, 10)}</td>
                <td className="border p-2">{r.customerName}</td>
                <td className="border p-2">{r.material}</td>
                <td className="border p-2">{r.pattru}</td>
                <td className="border p-2">{r.varavu}</td>
                <td className="border p-2">{r.kattai}</td>
                <td className="border p-2">{r.sareeCount}</td>
                <td className="border p-2">{r.cooliePerSaree}</td>
                <td className="border p-2">{r.totalCoolie}</td>
                <td className="border p-2">{r.salaryPaid}</td>
                <td className="border p-2">{r.bakkiAmount}</td>
                <td className="border p-2">
                  {r.accountNumber || "-"}
                </td>

                <td className="border p-2 text-center">
                  {r.photoUrl ? (
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => setPhotoPreview(r.photoUrl!)}
                    >
                      View Photo
                    </button>
                  ) : (
                    "-"
                  )}
                </td>

                

                <td className="border p-2 text-center">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setQrToPrint(
                        `Customer:${r.customerId}|Date:${r.date}|Material:${r.material}`
                      );
                      setTimeout(() => window.print(), 200);
                    }}
                  >
                    Print QR
                  </button>
                </td>

                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => editRow(i)}
                    className="bg-yellow-500 px-2 py-1 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteRow(i)}
                    className="bg-red-600 px-2 py-1 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================= PHOTO PREVIEW ========================== */}
      {photoPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPhotoPreview(null)}
        >
          <div className="bg-white p-3 rounded shadow-lg">
            <img
              src={photoPreview}
              alt="Preview"
              className="max-h-[80vh] max-w-[80vw] object-contain"
            />

            <button className="mt-3 bg-red-600 text-white px-4 py-1 rounded w-full">
              Close
            </button>
          </div>
        </div>
      )}

      <PrintQR />
    </div>
  );
}
