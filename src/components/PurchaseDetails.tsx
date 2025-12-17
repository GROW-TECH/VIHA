// src/components/PurchaseDetails.tsx
import React, { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import type { Product, Purchase } from "../types";

export default function PurchaseDetails() {
  /* ---------------- PRODUCTS (STOCK) ---------------- */
  const loadProducts = (): Product[] => {
    try {
      const raw = localStorage.getItem("products_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const [products, setProducts] = useState<Product[]>(loadProducts);

  function saveProducts(items: Product[]) {
    setProducts(items);
    localStorage.setItem("products_v1", JSON.stringify(items));
  }

  /* ---------------- PURCHASES ---------------- */
  const loadPurchases = (): Purchase[] => {
    try {
      const raw = localStorage.getItem("purchases_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const [purchases, setPurchases] = useState<Purchase[]>(loadPurchases);

  useEffect(() => {
    localStorage.setItem("purchases_v1", JSON.stringify(purchases));
  }, [purchases]);

  /* ---------------- SEARCH ---------------- */
  const [searchCode, setSearchCode] = useState("");

  const filteredPurchases = purchases.filter((p) =>
    p.productCode.toLowerCase().includes(searchCode.toLowerCase())
  );

  /* ---------------- EDIT QTY ---------------- */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");

  /* ---------------- MODAL ---------------- */
  const [showModal, setShowModal] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);

  /* ---------------- FORM ---------------- */
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");

  function clearForm() {
    setDate(today);
    setProductCode("");
    setProductName("");
    setQuantity("");
  }

  /* ---------------- STOCK UPDATE ---------------- */
  function updateStock(productCode: string, diff: number) {
    if (diff === 0) return;

    const updated = products.map((p) => {
      if (p.productCode !== productCode) return p;

      const prev = Number(p.quantity) || 0;
      let next = prev + diff;
      if (next < 0) next = 0;

      return { ...p, quantity: String(next) };
    });

    saveProducts(updated);
  }

  /* ---------------- SAVE PURCHASE ---------------- */
  function handleSave(e?: React.FormEvent) {
    e?.preventDefault();

    const qtyNum = Number(quantity);
    if (!productCode || !productName || qtyNum <= 0) {
      alert("Invalid data");
      return;
    }

    const newPurchase: Purchase = {
      id: crypto.randomUUID?.() ?? `pu-${Date.now()}`,
      date,
      productCode,
      productName,
      quantity,
    };

    setPurchases((prev) => [...prev, newPurchase]);

    // increase stock
    updateStock(productCode, qtyNum);

    clearForm();
    closeModal();
  }

  /* ---------------- EDIT QTY SAVE ---------------- */
  function saveQty(id: string) {
    const newQty = Number(editQty);
    if (newQty <= 0) {
      alert("Invalid quantity");
      return;
    }

    const purchase = purchases.find((p) => p.id === id);
    if (!purchase) return;

    const oldQty = Number(purchase.quantity) || 0;
    const diff = newQty - oldQty;

    // 🔄 update stock
    updateStock(purchase.productCode, diff);

    // update purchase
    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: String(newQty) } : p))
    );

    setEditingId(null);
    setEditQty("");
  }

  /* ---------------- DELETE PURCHASE ---------------- */
  function handleDelete(id: string) {
    const purchase = purchases.find((p) => p.id === id);
    if (!purchase) return;

    if (!confirm("Delete purchase? Stock will be reverted.")) return;

    const qty = Number(purchase.quantity) || 0;

    // revert stock
    updateStock(purchase.productCode, -qty);

    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }

  /* ---------------- MODAL HELPERS ---------------- */
  function openModal() {
    previouslyFocusedElement.current = document.activeElement;
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setTimeout(() => {
      (previouslyFocusedElement.current as HTMLElement | null)?.focus?.();
      openButtonRef.current?.focus();
    });
  }

  useEffect(() => {
    if (showModal) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [showModal]);

  function onOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) closeModal();
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Purchase Entry</h2>
        <button
          ref={openButtonRef}
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Purchase
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by Product Code"
        value={searchCode}
        onChange={(e) => setSearchCode(e.target.value)}
        className="w-64 p-2 border rounded"
      />

      {/* TABLE */}
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-amber-200">
            <th className="border p-2">Sr</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Product Code</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPurchases.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-3 text-center text-gray-500">
                No data
              </td>
            </tr>
          ) : (
            filteredPurchases.map((p, i) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{p.date}</td>
                <td className="border p-2">{p.productCode}</td>
                <td className="border p-2">{p.productName}</td>

                <td className="border p-2 text-center">
                  {editingId === p.id ? (
                    <input
                      type="number"
                      value={editQty}
                      onChange={(e) => setEditQty(e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  ) : (
                    p.quantity
                  )}
                </td>

                <td className="border p-2 text-center space-x-2">
                  {editingId === p.id ? (
                    <button
                      onClick={() => saveQty(p.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(p.id);
                        setEditQty(p.quantity);
                      }}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onMouseDown={onOverlayClick}
        >
          <div
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded w-full max-w-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Add Purchase</h3>

            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                ref={firstInputRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                placeholder="Product Code"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="p-2 border rounded"
                required
              />

              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
