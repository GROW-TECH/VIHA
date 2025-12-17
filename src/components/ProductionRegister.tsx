// src/components/ProductionRegister.tsx
import type { ChangeEvent } from "react";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Search, Plus, Eye, Trash2, QrCode } from "lucide-react";

export interface Client {
  id: string;
  sr_no?: number;
  client_name: string;
  mobile?: string;
  city_area?: string;
  client_type?: string;
}
export interface Design {
  id: string;
  design_code: string;
  design_name: string;
  opening_stock?: number;
  description?: string;
}

type OrderStatus = "Pending" | "In Production" | "Completed" | "Cancelled";

interface MaterialRow {
  id?: string;
  name: string;
  qty: number;
  enabled?: boolean;
}

interface Order {
  id: string;
  order_no: string;
  order_date: string; // YYYY-MM-DD
  qty_ordered: number;
  rate_per_piece: number;
  status: OrderStatus;
  progress?: "Not Started" | "In Progress" | "Completed";
  client_id?: string;
  design_id?: string;
  batch_lot_no?: string;
  expected_delivery_date?: string;
  grey_material_issued?: string;
  remarks?: string;
  clients?: Client | null; // kept for backward compatibility
  designs?: Design | null; // kept for backward compatibility
  material_rows?: MaterialRow[];
  description?: string;
}

const STORAGE_KEY = "production_orders_v1";

const STATIC_CLIENTS: Client[] = [
  {
    id: "1",
    sr_no: 1,
    client_name: "ABC Textiles",
    mobile: "9999999999",
    city_area: "Chennai",
    client_type: "Retail",
  },
  {
    id: "2",
    sr_no: 2,
    client_name: "Kumar Handlooms",
    mobile: "9888888888",
    city_area: "Coimbatore",
    client_type: "Wholesale",
  },
  {
    id: "3",
    sr_no: 3,
    client_name: "Sundar Exports",
    mobile: "9777777777",
    city_area: "Tirupur",
    client_type: "Export",
  },
  {
    id: "4",
    sr_no: 4,
    client_name: "Meena Fabrics",
    mobile: "9666666666",
    city_area: "Madurai",
    client_type: "Retail",
  },
  {
    id: "5",
    sr_no: 5,
    client_name: "Ramesh Stores",
    mobile: "9555555555",
    city_area: "Salem",
    client_type: "Wholesale",
  },
];

const STATIC_DESIGNS: Design[] = [
  {
    id: "1",
    design_code: "D-1001",
    design_name: "Floral Print",
    opening_stock: 1500,
    description: "Red floral on silk",
  },
  {
    id: "2",
    design_code: "D-2002",
    design_name: "Geometric Pattern",
    opening_stock: 500,
    description: "Blue geometric motif",
  },
];

const STATIC_MATERIALS: MaterialRow[] = [
  { id: "m1", name: "Kanchipuram Pattu (Kanjivaram)", qty: 0, enabled: true },
  { id: "m2", name: "Moli", qty: 0, enabled: true },
  { id: "m3", name: "Padi", qty: 0, enabled: true },
  { id: "m4", name: "Ady", qty: 0, enabled: true },
  { id: "m5", name: "Dnout", qty: 0, enabled: true },
];

const STATIC_ORDERS: Order[] = [
  {
    id: "101",
    order_no: "PO-101",
    order_date: "2025-01-15",
    qty_ordered: 100,
    rate_per_piece: 12,
    status: "Pending",
    client_id: "1",
    design_id: "1",
    batch_lot_no: "L-001",
    expected_delivery_date: "2025-02-01",
    grey_material_issued: "",
    remarks: "Rush",
    clients: STATIC_CLIENTS[0],
    designs: STATIC_DESIGNS[0],
    material_rows: [
      {
        id: "m1",
        name: "Kanchipuram Pattu (Kanjivaram)",
        qty: 50,
        enabled: true,
      },
      { id: "m2", name: "Moli", qty: 10, enabled: true },
      { id: "m3", name: "Padi", qty: 20, enabled: true },
      { id: "m4", name: "Ady", qty: 10, enabled: true },
      { id: "m5", name: "Dnout", qty: 10, enabled: true },
    ],
    description: "Customer wants bright reds",
  },
  {
    id: "102",
    order_no: "PO-102",
    order_date: "2025-01-20",
    qty_ordered: 200,
    rate_per_piece: 15,
    status: "In Production",
    client_id: "2",
    design_id: "2",
    batch_lot_no: "L-002",
    expected_delivery_date: "2025-02-10",
    grey_material_issued: "100 pcs on 2025-01-22",
    remarks: "",
    clients: STATIC_CLIENTS[1],
    designs: STATIC_DESIGNS[1],
    material_rows: [
      {
        id: "m1",
        name: "Kanchipuram Pattu (Kanjivaram)",
        qty: 120,
        enabled: true,
      },
      { id: "m2", name: "Moli", qty: 20, enabled: true },
      { id: "m3", name: "Padi", qty: 30, enabled: true },
      { id: "m4", name: "Ady", qty: 20, enabled: true },
      { id: "m5", name: "Dnout", qty: 10, enabled: true },
    ],
    description: "Geometric batch",
  },
];

/** Complete Order Modal - opens when user clicks Complete/Progress */
function CompleteOrderModal({
  open,
  onClose,
  order,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmit: (data: {
    picture?: File | null;
    qty1: number;
    qty2: number;
    wastage: number;
    salary: number;
    note?: string;
  }) => void;
}) {
  const [picture, setPicture] = useState<File | null>(null);
  const [qty1, setQty1] = useState<number>(0);
  const [qty2, setQty2] = useState<number>(0);
  const [wastage, setWastage] = useState<number>(0);
  const [salary, setSalary] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setPicture(null);
      setQty1(0);
      setQty2(0);
      setWastage(0);
      setSalary(0);
      setNote("");
    }
  }, [open]);

  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 bg-white p-6 rounded shadow w-[420px] max-w-[95%]">
        <h2 className="text-lg font-bold mb-4">
          Complete Order — {order.order_no}
        </h2>

        <label className="block text-sm font-semibold mb-1">Take Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPicture(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Returned Qty 1
            </label>
            <input
              type="number"
              value={qty1}
              onChange={(e) => setQty1(Number(e.target.value || 0))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Returned Qty 2
            </label>
            <input
              type="number"
              value={qty2}
              onChange={(e) => setQty2(Number(e.target.value || 0))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Wastage</label>
            <input
              type="number"
              value={wastage}
              onChange={(e) => setWastage(Number(e.target.value || 0))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        <label className="block text-sm font-semibold mb-1">
          Order closed message
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Order closed"
          className="w-full mb-3 border px-2 py-1 rounded"
        />

        <label className="block text-sm font-semibold mb-1">Salary given</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value || 0))}
          className="w-full mb-4 border px-2 py-1 rounded"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({ picture, qty1, qty2, wastage, salary, note })
            }
            className="px-3 py-1 rounded bg-green-600 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

/** New Order modal (unchanged) */
function NewOrderModal({
  open,
  onClose,
  onCreate,
  clients,
  designs,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (order: Order) => void;
  clients: Client[];
  designs: Design[];
}) {
  const defaultMaterials = useMemo(
    () => STATIC_MATERIALS.map((m) => ({ ...m })),
    []
  );
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [clientId, setClientId] = useState<string>("");
  const [designId, setDesignId] = useState<string>("");
  const [qtyOrdered, setQtyOrdered] = useState<number>(0);
  const [ratePerPiece, setRatePerPiece] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [materials, setMaterials] = useState<MaterialRow[]>(
    defaultMaterials.map((m) => ({ ...m }))
  );

  useEffect(() => {
    if (open) {
      setDate(new Date().toISOString().split("T")[0]);
      // default to first client and first design when modal opens
      setClientId(clients?.[0]?.id ?? "");
      setDesignId(designs?.[0]?.id ?? "");
      setQtyOrdered(0);
      setRatePerPiece(0);
      setDescription("");
      setRemarks("");
      setMaterials(defaultMaterials.map((m) => ({ ...m })));
    }
  }, [open, defaultMaterials, clients, designs]);

  const toggleMaterialEnabled = useCallback((index: number) => {
    setMaterials((prev) =>
      prev.map((m, i) => (i === index ? { ...m, enabled: !m.enabled } : m))
    );
  }, []);
  const updateMaterialQty = useCallback((index: number, qty: number) => {
    setMaterials((prev) =>
      prev.map((m, i) => (i === index ? { ...m, qty } : m))
    );
  }, []);
  const totalMaterialQty = useMemo(
    () => materials.reduce((s, m) => s + ((m.enabled ? m.qty : 0) || 0), 0),
    [materials]
  );
  const selectedDesign = designs.find((d) => d.id === designId);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!clientId) return alert("Select a client");
    if (!designId) return alert("Select a product/design");
    if (qtyOrdered <= 0) return alert("Enter ordered quantity");
    const invalid = materials.some((m) => m.enabled && m.qty < 0);
    if (invalid) return alert("Material quantities must be zero or positive");
    const includedMaterials = materials
      .filter((m) => m.enabled)
      .map((m) => ({ id: m.id, name: m.name, qty: m.qty, enabled: true }));
    const now = Date.now();
    const newOrder: Order = {
      id: String(now),
      order_no: `PO-${now}`,
      order_date: date,
      qty_ordered: qtyOrdered,
      rate_per_piece: ratePerPiece,
      status: "Pending",
      client_id: clientId,
      design_id: designId,
      batch_lot_no: "",
      expected_delivery_date: "",
      grey_material_issued: "",
      remarks,
      clients: clients.find((c) => c.id === clientId) || null,
      designs: designs.find((d) => d.id === designId) || null,
      material_rows: includedMaterials,
      description,
    };
    onCreate(newOrder);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[min(980px,95%)] max-h-[90vh] overflow-auto bg-white rounded shadow p-6"
      >
        <h3 className="text-xl font-semibold mb-4">
          New Order (Static) — choose optional materials
        </h3>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-3">
            <label className="block text-xs font-semibold mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div className="col-span-5">
            <label className="block text-xs font-semibold mb-1">Client</label>
            <select
              value={clientId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setClientId(e.target.value)
              }
              className="w-full px-2 py-1 border rounded"
            >
              <option value="">Select client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.client_name} {c.city_area ? `— ${c.city_area}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-4">
            <label className="block text-xs font-semibold mb-1">
              Product / Design
            </label>
            <select
              value={designId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setDesignId(e.target.value)
              }
              className="w-full px-2 py-1 border rounded"
            >
              <option value="">Select product/design</option>
              {designs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.design_code} — {d.design_name}
                </option>
              ))}
            </select>
            <div className="mt-2 text-sm text-gray-600">
              Available:{" "}
              <span className="font-medium">
                {selectedDesign?.opening_stock ?? "-"}
              </span>
            </div>
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-semibold mb-1">
              Qty Ordered
            </label>
            <input
              type="number"
              min={0}
              value={qtyOrdered}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQtyOrdered(Number(e.target.value || 0))
              }
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-semibold mb-1">
              Rate / Pc
            </label>
            <input
              type="number"
              min={0}
              value={ratePerPiece}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRatePerPiece(Number(e.target.value || 0))
              }
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div className="col-span-6">
            <label className="block text-xs font-semibold mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              className="w-full px-2 py-1 border rounded"
              placeholder={selectedDesign?.description ?? "Product description"}
            />
          </div>
          <div className="col-span-6">
            <label className="block text-xs font-semibold mb-1">Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRemarks(e.target.value)
              }
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              Materials — click a material to toggle optional
            </h4>
            <div className="text-sm text-gray-600">
              Total material qty (included): {totalMaterialQty}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {materials.map((m, idx) => (
              <div
                key={m.id ?? m.name}
                className={`p-2 border rounded cursor-pointer select-none ${
                  m.enabled
                    ? "bg-white border-gray-300"
                    : "bg-gray-50 border-dashed border-gray-200 opacity-60"
                }`}
                onClick={() => toggleMaterialEnabled(idx)}
                role="button"
                title={m.enabled ? "Click to exclude" : "Click to include"}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-xs text-gray-500">
                    {m.enabled ? "Included" : "Excluded"}
                  </div>
                </div>
                {m.enabled ? (
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <input
                      type="number"
                      min={0}
                      value={m.qty}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateMaterialQty(idx, Number(e.target.value || 0))
                      }
                      className="w-20 px-2 py-1 border rounded text-right"
                    />
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-gray-400 italic">
                    Not included
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-amber-600 text-white"
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
}

/** ProductionRegister component */
export function ProductionRegister() {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Order[];
    } catch (e) {}
    return STATIC_ORDERS;
  });
  const [clients] = useState<Client[]>(() => STATIC_CLIENTS);
  const [designs] = useState<Design[]>(() => STATIC_DESIGNS);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const [searchTerm, setSearchTerm] = useState("");
  // default filter set to Pending as requested
  const [filterStatus, setFilterStatus] = useState<string>("Pending");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  // new state for complete modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [orderBeingCompleted, setOrderBeingCompleted] = useState<Order | null>(
    null
  );

  const formatCurrency = useCallback((value: number) => value.toFixed(2), []);
  const toggleExpand = useCallback((orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  }, []);
  const getStatusBadgeClass = useCallback((status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-800";
      case "In Production":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const filteredOrders = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !s ||
        order.order_no.toLowerCase().includes(s) ||
        (order.clients?.client_name ?? "").toLowerCase().includes(s) ||
        (order.designs?.design_code ?? "").toLowerCase().includes(s);
      const matchesStatus = !filterStatus || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  const handleCreateOrder = useCallback((order: Order) => {
    setOrders((prev) => [{ ...order }, ...prev]);
  }, []);
  const handleDeleteOrder = useCallback((orderId: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);
  const handleIssueMaterials = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const total = (o.material_rows ?? []).reduce(
          (s, r) => s + ((r.enabled ? r.qty : 0) || 0),
          0
        );
        const today = new Date().toISOString().split("T")[0];
        return {
          ...o,
          status: o.status === "Pending" ? "In Production" : o.status,
          grey_material_issued: `${total} pcs on ${today}`,
        };
      })
    );
  }, []);

  // open complete modal
  const openCompleteModal = useCallback((order: Order) => {
    setOrderBeingCompleted(order);
    setCompleteModalOpen(true);
  }, []);

  // handle complete submit
  const handleCompleteSubmit = useCallback(
    (data: {
      picture?: File | null;
      qty1: number;
      qty2: number;
      wastage: number;
      salary: number;
      note?: string;
    }) => {
      if (!orderBeingCompleted) return;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderBeingCompleted.id
            ? {
                ...o,
                status: "Completed",
                progress: "Completed",
                remarks: `Completed. Returned: ${data.qty1}, ${
                  data.qty2
                } | Wastage: ${data.wastage} | Salary: ${data.salary} | ${
                  data.note ?? ""
                }`,
              }
            : o
        )
      );
      setCompleteModalOpen(false);
      setOrderBeingCompleted(null);
    },
    [orderBeingCompleted]
  );

  return (
    <div className="h-full flex flex-col bg-[#fefefe]">
      <div className="border-b-2 border-red-700 bg-amber-50 p-4">
        <h1 className="text-3xl font-bold text-red-800">
          Production Issue Register
        </h1>
      </div>
      <div className="p-4 bg-white border-b border-gray-300 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            aria-label="Search orders"
            placeholder="Search by order no., client, or design..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded"
          value={filterStatus}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFilterStatus(e.target.value)
          }
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Production">In Production</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => setNewOrderOpen(true)}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          New Order
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Replaced table with card-style list matching sketch — each order as a responsive card */}
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded p-3 bg-white shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500 w-28">Order No.</div>
                    <div className="font-medium truncate">{order.order_no}</div>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="font-medium">{order.order_date}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Client</div>
                      <div className="font-medium">
                        {order.clients?.client_name ?? "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Design</div>
                      <div className="font-medium">
                        {order.designs?.design_code ?? order.design_id ?? "-"} —{" "}
                        {order.designs?.design_name ?? "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Qty / Rate</div>
                      <div className="font-medium">
                        {order.qty_ordered} pcs @ {order.rate_per_piece}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-gray-500">Materials</div>
                    <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {(order.material_rows && order.material_rows.length > 0
                        ? order.material_rows
                        : STATIC_MATERIALS
                      ).map((r) => (
                        <div
                          key={r.id ?? r.name}
                          className="text-sm border rounded px-2 py-1 bg-gray-50 flex justify-between"
                        >
                          <div className="truncate pr-2">{r.name}</div>
                          <div className="font-medium">{r.qty}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-56 flex-shrink-0 flex flex-col items-start md:items-end gap-2">
                  <div
                    className={`inline-block px-2 py-1 text-xs rounded ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.grey_material_issued ?? ""}
                  </div>

                  <div className="flex gap-2 mt-2">
                    $1
                    <button
                      className="px-3 py-1 border rounded text-sm bg-green-100"
                      onClick={() => {
                        setOrderBeingCompleted(order);
                        setCompleteModalOpen(true);
                      }}
                    >
                      Complete
                    </button>
                    <button
                      className={`px-3 py-1 border rounded text-sm bg-yellow-100 ${
                        order.status !== "Pending"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleIssueMaterials(order.id)}
                      disabled={order.status !== "Pending"}
                    >
                      Issue
                    </button>
                    <button
                      className="px-3 py-1 border rounded text-sm bg-red-100"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {expandedOrders[order.id] && (
                <div className="mt-3 bg-gray-50 border rounded p-3">
                  <div className="text-sm font-medium mb-2">
                    Materials detail
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {(order.material_rows && order.material_rows.length > 0
                      ? order.material_rows
                      : STATIC_MATERIALS
                    ).map((r) => (
                      <div
                        key={r.id ?? r.name}
                        className="flex justify-between border rounded px-3 py-2 bg-white"
                      >
                        <div className="truncate">{r.name}</div>
                        <div className="font-medium">{r.qty}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No orders found
            </div>
          )}
        </div>
      </div>

      <NewOrderModal
        open={newOrderOpen}
        onClose={() => setNewOrderOpen(false)}
        onCreate={handleCreateOrder}
        clients={clients}
        designs={designs}
      />

      <CompleteOrderModal
        open={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        order={orderBeingCompleted}
        onSubmit={handleCompleteSubmit}
      />
    </div>
  );
}
