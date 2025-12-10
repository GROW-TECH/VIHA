import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Trash2, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Design } from '../types';

export function ProductRegister() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, []);

  async function fetchDesigns() {
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addNewDesign() {
    const newDesign = {
      design_code: `D-${Date.now()}`,
      design_name: '',
      saree_type: 'Cotton',
      fabric: '',
      default_rate: 0,
      default_mrp: 0,
      opening_stock: 0,
    };

    const { data, error } = await supabase
      .from('designs')
      .insert([newDesign])
      .select()
      .single();

    if (error) {
      console.error('Error adding design:', error);
    } else if (data) {
      setDesigns([data, ...designs]);
    }
  }

  async function updateDesign(id: string, field: string, value: string | number) {
    const { error } = await supabase
      .from('designs')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating design:', error);
    } else {
      setDesigns(
        designs.map((d) => (d.id === id ? { ...d, [field]: value } : d))
      );
    }
  }

  async function deleteDesign(id: string) {
    if (!confirm('Are you sure you want to delete this design?')) return;

    const { error } = await supabase.from('designs').delete().eq('id', id);

    if (error) {
      console.error('Error deleting design:', error);
    } else {
      setDesigns(designs.filter((d) => d.id !== id));
    }
  }

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch =
      design.design_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.design_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || design.saree_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-[#fefefe]">
      <div className="border-b-2 border-red-700 bg-amber-50 p-4">
        <h1 className="text-3xl font-bold text-red-800">Design & Product Register</h1>
      </div>

      <div className="p-4 bg-white border-b border-gray-300 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by design code or name..."
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
          <option value="Silk">Silk</option>
          <option value="Cotton">Cotton</option>
          <option value="Georgette">Georgette</option>
          <option value="Chiffon">Chiffon</option>
        </select>
        <button
          onClick={addNewDesign}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          New Design
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-amber-100 border-b-2 border-red-700">
            <tr>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Design Code</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold">Design Name</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-24">Type</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Fabric</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-32">Colour/Pattern</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-24">Rate</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-24">MRP</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-24">Opening Stock</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold">Notes</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-16">Photo</th>
              <th className="border border-gray-300 px-2 py-2 text-red-800 text-sm font-semibold w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDesigns.map((design) => (
              <tr key={design.id} className="hover:bg-yellow-50">
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.design_code}
                    onChange={(e) => updateDesign(design.id, 'design_code', e.target.value)}
                    onBlur={(e) => updateDesign(design.id, 'design_code', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.design_name}
                    onChange={(e) => updateDesign(design.id, 'design_name', e.target.value)}
                    onBlur={(e) => updateDesign(design.id, 'design_name', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <select
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.saree_type || ''}
                    onChange={(e) => updateDesign(design.id, 'saree_type', e.target.value)}
                  >
                    <option>Silk</option>
                    <option>Cotton</option>
                    <option>Georgette</option>
                    <option>Chiffon</option>
                    <option>Banarasi</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.fabric || ''}
                    onChange={(e) => updateDesign(design.id, 'fabric', e.target.value)}
                    onBlur={(e) => updateDesign(design.id, 'fabric', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.colour_pattern || ''}
                    onChange={(e) => updateDesign(design.id, 'colour_pattern', e.target.value)}
                    onBlur={(e) => updateDesign(design.id, 'colour_pattern', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    className="w-full bg-transparent px-1 py-1 text-sm text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.default_rate}
                    onChange={(e) => updateDesign(design.id, 'default_rate', parseFloat(e.target.value) || 0)}
                    onBlur={(e) => updateDesign(design.id, 'default_rate', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    className="w-full bg-transparent px-1 py-1 text-sm text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.default_mrp}
                    onChange={(e) => updateDesign(design.id, 'default_mrp', parseFloat(e.target.value) || 0)}
                    onBlur={(e) => updateDesign(design.id, 'default_mrp', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    className="w-full bg-transparent px-1 py-1 text-sm text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.opening_stock}
                    onChange={(e) => updateDesign(design.id, 'opening_stock', parseInt(e.target.value) || 0)}
                    onBlur={(e) => updateDesign(design.id, 'opening_stock', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-1 py-1 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={design.notes || ''}
                    onChange={(e) => updateDesign(design.id, 'notes', e.target.value)}
                    onBlur={(e) => updateDesign(design.id, 'notes', e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {design.photo_url ? (
                    <Image className="h-4 w-4 text-green-600 inline" />
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex gap-1 justify-center">
                    <button className="p-1 hover:bg-blue-100 rounded">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => deleteDesign(design.id)}
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
