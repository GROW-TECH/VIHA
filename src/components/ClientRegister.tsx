import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext"; // use global context

export interface Client {
  id: string;
  sr_no: number;
  client_name?: string;
  mobile?: string;
  account_name?: string;
  account_number?: string;
  isNew?: boolean;
}

const TEXT = {
  en: {
    title: "Client Register",
    searchPlaceholder: "Search by name or mobile...",
    newClient: "New Client",
    sr: "Sr",
    clientName: "Client Name",
    mobile: "Mobile",
    accountName: "Account Name",
    accountNumber: "Account Number",
    actions: "Actions",
    loading: "Loading...",
    deleteConfirm: "Are you sure you want to delete this client?",
    save: "Save",
  },
  ta: {
    title: "வாடிக்கையாளர் பதிவு",
    searchPlaceholder: "பெயர் அல்லது மொபைல் மூலம் தேடவும்...",
    newClient: "புதிய வாடிக்கையாளர்",
    sr: "எண்",
    clientName: "வாடிக்கையாளர் பெயர்",
    mobile: "மொபைல்",
    accountName: "கணக்கு பெயர்",
    accountNumber: "கணக்கு எண்",
    actions: "செயல்கள்",
    loading: "ஏற்றுகிறது...",
    deleteConfirm: "இந்த வாடிக்கையாளரை நீக்க வேண்டுமா?",
    save: "சேர்",
  },
};

export function ClientRegister() {
  const { lang, toggleLang } = useLanguage(); // 🔹 use global language
  const t = TEXT[lang];

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("http://localhost:5000/api/clients");
        const data = await res.json();

        setClients(
          data.map((c: any, i: number) => ({
            ...c,
            id: String(c.id),
            sr_no: i + 1,
            isNew: false,
          }))
        );
      } catch (err) {
        console.error(err);
        alert("Failed to fetch clients");
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const addNewClient = () => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      sr_no: clients.length + 1,
      client_name: "",
      mobile: "",
      account_name: "",
      account_number: "",
      isNew: true,
    };

    setClients([newClient, ...clients]);
  };

  const updateClientField = (
    id: string,
    field: keyof Client,
    value: string
  ) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const saveClient = async (client: Client) => {
    try {
      if (!client.client_name || !client.mobile) {
        return alert("Client name and mobile are required");
      }

      if (client.isNew) {
        const res = await fetch("http://localhost:5000/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(client),
        });

        const data = await res.json();

        if (!res.ok) return alert("Error: " + data.error);

        setClients((prev) =>
          prev.map((c) =>
            c.id === client.id
              ? { ...c, id: String(data.id), isNew: false }
              : c
          )
        );
      } else {
        await fetch(`http://localhost:5000/api/clients/${client.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(client),
        });
      }

      alert("Client saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save client");
    }
  };

  const deleteClient = async (client: Client) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      if (!client.isNew) {
        await fetch(`http://localhost:5000/api/clients/${client.id}`, {
          method: "DELETE",
        });
      }

      setClients((prev) =>
        prev
          .filter((c) => c.id !== client.id)
          .map((c, idx) => ({ ...c, sr_no: idx + 1 }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete client");
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile?.includes(searchTerm)
  );

  if (loading) return <div className="p-8 text-center">{t.loading}</div>;

  return (
    <div className="h-full flex flex-col bg-[#fefefe]">
      <div className="border-b-2 border-red-700 bg-amber-50 p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-800">{t.title}</h1>

        <button
          onClick={toggleLang} // 🔹 global toggle
          className="flex items-center gap-2 px-3 py-1 border rounded bg-white hover:bg-gray-100"
        >
          <Languages className="h-4 w-4" />
          {lang === "en" ? "தமிழ்" : "English"}
        </button>
      </div>

      <div className="p-4 bg-white border-b border-gray-300 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={addNewClient}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          {t.newClient}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse table-fixed">
          <thead className="sticky top-0 bg-amber-100 border-b-2 border-red-700">
            <tr>
              <th className="border px-2 py-2 w-16">{t.sr}</th>
              <th className="border px-2 py-2 w-40">{t.clientName}</th>
              <th className="border px-2 py-2 w-32">{t.mobile}</th>
              <th className="border px-2 py-2 w-32">{t.accountName}</th>
              <th className="border px-2 py-2 w-32">{t.accountNumber}</th>
              <th className="border px-2 py-2 w-40">{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-yellow-50">
                <td className="border px-2 py-1 text-center">{client.sr_no}</td>

                <td className="border px-2 py-1">
                  <input
                    className="w-full bg-transparent"
                    value={client.client_name || ""}
                    onChange={(e) =>
                      updateClientField(client.id, "client_name", e.target.value)
                    }
                  />
                </td>

                <td className="border px-2 py-1">
                  <input
                    className="w-full bg-transparent"
                    value={client.mobile || ""}
                    onChange={(e) =>
                      updateClientField(client.id, "mobile", e.target.value)
                    }
                  />
                </td>

                <td className="border px-2 py-1">
                  <input
                    className="w-full bg-transparent"
                    value={client.account_name || ""}
                    onChange={(e) =>
                      updateClientField(client.id, "account_name", e.target.value)
                    }
                  />
                </td>

                <td className="border px-2 py-1">
                  <input
                    className="w-full bg-transparent"
                    value={client.account_number || ""}
                    onChange={(e) =>
                      updateClientField(
                        client.id,
                        "account_number",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="border px-2 py-1 flex gap-1 justify-center">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => saveClient(client)}
                  >
                    {t.save}
                  </button>

                  <button
                    onClick={() => deleteClient(client)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
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
