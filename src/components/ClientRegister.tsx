import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Client } from '../types';

export function ClientRegister() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('sr_no', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addNewClient() {
    const newClient = {
      client_name: '',
      mobile: '',
      client_type: 'Retail',
      opening_balance: 0,
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([newClient])
      .select()
      .single();

    if (error) {
      console.error('Error adding client:', error);
    } else if (data) {
      setClients([data, ...clients]);
    }
  }

  async function updateClient(id: string, field: string, value: string | number) {
    const { error } = await supabase
      .from('clients')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating client:', error);
    } else {
      setClients(
        clients.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    }
  }

  async function deleteClient(id: string) {
    if (!confirm('Are you sure you want to delete this client?')) return;

    const { error } = await supabase.from('clients').delete().eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
    } else {
      setClients(clients.filter((c) => c.id !== id));
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.mobile?.includes(searchTerm);
    const matchesType = !filterType || client.client_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-[#fefefe]">
      <div className="border-b-2 border-red-700 bg-amber-50 p-4">
        <h1 className="text-3xl font-bold text-red-800">Client Register</h1>
      </div>

      <div className="p-4 bg-white border-b border-gray-300 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or mobile..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Retail">Retail</option>
          <option value="Wholesale">Wholesale</option>
          <option value="Dealer">Dealer</option>
          <option value="Other">Other</option>
        </select>
        <button
          onClick={addNewClient}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          New Client
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-amber-100 border-b-2 border-red-700">
            <tr>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-16">Sr No.</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold">Client Name</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Mobile</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Alt. Mobile</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">City/Area</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-24">Type</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">GST No.</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Opening Bal.</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold">Notes</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-yellow-50">
                <td className="border border-gray-300 px-2 py-1 text-center text-sm">{client.sr_no}</td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={client.client_name || ''}
                    onChange={(e) => updateClient(client.id, 'client_name', e.target.value)}
                    onBlur={(e) => updateClient(client.id, 'client_name', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={client.mobile || ''}
                    onChange={(e) => updateClient(client.id, 'mobile', e.target.value)}
                    onBlur={(e) => updateClient(client.id, 'mobile', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={client.alternate_mobile || ''}
                    onChange={(e) => updateClient(client.id, 'alternate_mobile', e.target.value)}
                    onBlur={(e) => updateClient(client.id, 'alternate_mobile', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={client.city_area || ''}
                    onChange={(e) => updateClient(client.id, 'city_area', e.target.value)}
                    onBlur={(e) => updateClient(client.id, 'city_area', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <select
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={client.client_type}
                    onChange={(e) => updateClient(client.id, 'client_type', e.target.value)}
                  >
                    <option>Retail</option>
                    <option>Wholesale</option>
                    <option>Dealer</option>
                    <option>Other</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={client.gst_no || ''}
                    onChange={(e) => updateClient(client.id, 'gst_no', e.target.value)}
                    onBlur={(e) => updateClient(client.id, 'gst_no', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    className="w-full bg-transparent px-1 py-1 text-sm text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={client.opening_balance}
                    onChange={(e) => updateClient(client.id, 'opening_balance', parseFloat(e.target.value) || 0)}
                    onBlur={(e) => updateClient(client.id, 'opening_balance', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={client.notes || ''}
                    onChange={(e) => updateClient(client.id, 'notes', e.target.value)}
                    onBlur={(e) => updateClient(client.id, 'notes', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex gap-1 justify-center">
                    <button className="p-1 hover:bg-blue-100 rounded">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
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
