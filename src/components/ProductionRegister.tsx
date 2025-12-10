import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Trash2, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Client, Design } from '../types';

export function ProductionRegister() {
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [ordersRes, clientsRes, designsRes] = await Promise.all([
        supabase
          .from('production_orders')
          .select(`
            *,
            clients(client_name),
            designs(design_code, design_name)
          `)
          .order('order_date', { ascending: false }),
        supabase.from('clients').select('*').order('client_name'),
        supabase.from('designs').select('*').order('design_code'),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (clientsRes.error) throw clientsRes.error;
      if (designsRes.error) throw designsRes.error;

      setOrders(ordersRes.data || []);
      setClients(clientsRes.data || []);
      setDesigns(designsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addNewOrder() {
    const newOrder = {
      order_no: `PO-${Date.now()}`,
      order_date: new Date().toISOString().split('T')[0],
      qty_ordered: 0,
      rate_per_piece: 0,
      status: 'Pending',
    };

    const { data, error } = await supabase
      .from('production_orders')
      .insert([newOrder])
      .select(`
        *,
        clients(client_name),
        designs(design_code, design_name)
      `)
      .single();

    if (error) {
      console.error('Error adding order:', error);
    } else if (data) {
      setOrders([data, ...orders]);
    }
  }

  async function updateOrder(id: string, field: string, value: string | number) {
    const { error } = await supabase
      .from('production_orders')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating order:', error);
    } else {
      setOrders(
        orders.map((o) => (o.id === id ? { ...o, [field]: value } : o))
      );
    }
  }

  async function deleteOrder(id: string) {
    if (!confirm('Are you sure you want to delete this production order?')) return;

    const { error } = await supabase.from('production_orders').delete().eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
    } else {
      setOrders(orders.filter((o) => o.id !== id));
    }
  }

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-800';
      case 'In Production':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clients?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.designs?.design_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-[#fefefe]">
      <div className="border-b-2 border-red-700 bg-amber-50 p-4">
        <h1 className="text-3xl font-bold text-red-800">Production Issue Register</h1>
      </div>

      <div className="p-4 bg-white border-b border-gray-300 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order no., client, or design..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Production">In Production</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={addNewOrder}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          New Order
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-amber-100 border-b-2 border-red-700">
            <tr>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Order No.</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-28">Date</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold">Client/Party</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Design Code</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold">Design Name</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-24">Lot/Batch</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-24">Qty Ordered</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-24">Rate/Pc</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-28">Exp. Delivery</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Material Issued</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-28">Status</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold">Remarks</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-yellow-50">
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.order_no}
                    onChange={(e) => updateOrder(order.id, 'order_no', e.target.value)}
                    onBlur={(e) => updateOrder(order.id, 'order_no', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="date"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.order_date}
                    onChange={(e) => updateOrder(order.id, 'order_date', e.target.value)}
                    onBlur={(e) => updateOrder(order.id, 'order_date', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <select
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.client_id || ''}
                    onChange={(e) => updateOrder(order.id, 'client_id', e.target.value)}
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.client_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <select
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.design_id || ''}
                    onChange={(e) => updateOrder(order.id, 'design_id', e.target.value)}
                  >
                    <option value="">Select Design</option>
                    {designs.map((design) => (
                      <option key={design.id} value={design.id}>
                        {design.design_code}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-2 py-1 text-sm">
                  {order.designs?.design_name || '-'}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.batch_lot_no || ''}
                    onChange={(e) => updateOrder(order.id, 'batch_lot_no', e.target.value)}
                    onBlur={(e) => updateOrder(order.id, 'batch_lot_no', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    className="w-full bg-transparent px-1 py-1 text-sm text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.qty_ordered}
                    onChange={(e) => updateOrder(order.id, 'qty_ordered', parseInt(e.target.value) || 0)}
                    onBlur={(e) => updateOrder(order.id, 'qty_ordered', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    className="w-full bg-transparent px-1 py-1 text-sm text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.rate_per_piece}
                    onChange={(e) => updateOrder(order.id, 'rate_per_piece', parseFloat(e.target.value) || 0)}
                    onBlur={(e) => updateOrder(order.id, 'rate_per_piece', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="date"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.expected_delivery_date || ''}
                    onChange={(e) => updateOrder(order.id, 'expected_delivery_date', e.target.value)}
                    onBlur={(e) => updateOrder(order.id, 'expected_delivery_date', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.grey_material_issued || ''}
                    onChange={(e) => updateOrder(order.id, 'grey_material_issued', e.target.value)}
                    onBlur={(e) => updateOrder(order.id, 'grey_material_issued', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <select
                    className={`w-full px-1 py-1 text-xs rounded ${getStatusBadgeClass(order.status)} focus:outline-none focus:ring-1 focus:ring-amber-500`}
                    value={order.status}
                    onChange={(e) => updateOrder(order.id, 'status', e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Production</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={order.remarks || ''}
                    onChange={(e) => updateOrder(order.id, 'remarks', e.target.value)}
                    onBlur={(e) => updateOrder(order.id, 'remarks', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex gap-1 justify-center">
                    <button className="p-1 hover:bg-blue-100 rounded" title="View Details">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-green-100 rounded" title="Generate QR">
                      <QrCode className="h-4 w-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
