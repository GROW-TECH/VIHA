import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export interface OwnerAccount {
  id: number | string;
  holderName: string;
  accountNumber: string;
  bankName: string;
  isNew?: boolean;
}

export default function OwnerAccounts() {
  const [accounts, setAccounts] = useState<OwnerAccount[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/owner");
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        setAccounts([]);
        return;
      }

      setAccounts(
        data.map((acc: any) => ({
          ...acc,
          id: acc.id,
          isNew: false,
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to fetch accounts");
    }
  };

  const addNewAccount = () => {
    const newAcc: OwnerAccount = {
      id: crypto.randomUUID(),
      holderName: "",
      accountNumber: "",
      bankName: "",
      isNew: true,
    };
    setAccounts([newAcc, ...accounts]);
  };

  const updateField = (id: string | number, field: keyof OwnerAccount, value: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, [field]: value } : acc))
    );
  };

  const saveAccount = async (acc: OwnerAccount) => {
    try {
      if (!acc.holderName || !acc.accountNumber || !acc.bankName) {
        return alert("All fields are required");
      }

      if (acc.isNew) {
        const res = await fetch("http://localhost:5000/api/owner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(acc),
        });
        const data = await res.json();
        if (!res.ok) return alert("Error: " + data.error);

        setAccounts((prev) =>
          prev.map((a) =>
            a.id === acc.id ? { ...a, id: data.id, isNew: false } : a
          )
        );
      } else {
        await fetch(`http://localhost:5000/api/owner/${acc.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(acc),
        });
      }

      alert("Account saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save account");
    }
  };

  const deleteAccount = async (acc: OwnerAccount) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      if (!acc.isNew) {
        await fetch(`http://localhost:5000/api/owner/${acc.id}`, { method: "DELETE" });
      }
      setAccounts((prev) => prev.filter((a) => a.id !== acc.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#fefefe] p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Owner Bank Accounts</h2>
        <button
          onClick={addNewAccount}
          className="bg-green-700 text-white px-4 py-1 rounded"
        >
          + Add Account
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 w-10">#</th>
              <th className="border p-2">Holder Name</th>
              <th className="border p-2">Account Number</th>
              <th className="border p-2">Bank Name</th>
              <th className="border p-2 w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((acc, idx) => (
              <tr key={acc.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{idx + 1}</td>
                <td className="border p-2">
                  <input
                    value={acc.holderName}
                    onChange={(e) => updateField(acc.id, "holderName", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    value={acc.accountNumber}
                    onChange={(e) => updateField(acc.id, "accountNumber", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    value={acc.bankName}
                    onChange={(e) => updateField(acc.id, "bankName", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => saveAccount(acc)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => deleteAccount(acc)}
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
