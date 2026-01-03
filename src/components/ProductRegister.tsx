import { useState } from 'react';
import { Eye, Trash2, Plus, Search } from 'lucide-react';

export type ProductItem = {
  id: string;
  productName: string;
  quantityGrams: number;
  colorCode: string;
};

export default function ProductRegister() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addProduct = () => {
    const newProduct: ProductItem = {
      id: crypto.randomUUID(),
      productName: '',
      quantityGrams: 0,
      colorCode: '',
    };
    setProducts([newProduct, ...products]);
  };

  const updateProduct = (id: string, field: keyof ProductItem, value: string | number) => {
    setProducts(products.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const deleteProduct = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.colorCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#fefefe] p-6 max-w-7xl mx-auto">
      <div className="border-b-2 border-red-700 bg-amber-50 p-4">
        <h1 className="text-3xl font-bold text-red-800">Product Register</h1>
      </div>

      {/* Search + Add */}
      <div className="p-4 bg-white border-b border-gray-300 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by material name or color..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={addProduct}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mt-2">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-amber-100 border-b-2 border-red-700">
            <tr>
              <th className="border px-2 py-2 w-16 text-red-800">Sr</th>
              <th className="border px-2 py-2 text-red-800">Material Name</th>
              <th className="border px-2 py-2 text-red-800 w-32">Quantity</th>
              <th className="border px-2 py-2 text-red-800 w-32">Color Code</th>
              <th className="border px-2 py-2 text-red-800 w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, idx) => (
              <tr key={p.id} className="hover:bg-yellow-50">
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1">
                  <input
                    className="w-full bg-transparent px-1 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={p.productName}
                    onChange={e => updateProduct(p.id, 'productName', e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1 flex items-center gap-2">
                  <input
                    type="number"
                    className="w-20 bg-transparent px-1 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={p.quantityGrams}
                    onChange={e =>
                      updateProduct(p.id, 'quantityGrams', Math.floor(Number(e.target.value)))
                    }
                  />
                  <span>
                    {p.quantityGrams >= 1000
                      ? (p.quantityGrams / 1000).toFixed(2) + ' Kg'
                      : p.quantityGrams + ' g'}
                  </span>
                </td>
                <td className="border px-2 py-1">
                  <input
                    className="w-full bg-transparent px-1 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={p.colorCode}
                    onChange={e => updateProduct(p.id, 'colorCode', e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1 flex justify-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600 cursor-pointer" />
                  <Trash2
                    className="h-5 w-5 text-red-600 cursor-pointer"
                    onClick={() => deleteProduct(p.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
