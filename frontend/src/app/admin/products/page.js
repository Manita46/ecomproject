'use client';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({ name: '', price: '', description: '', image: '', categoryId: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
    }
  };

  const handleSaveProduct = async () => {
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `http://localhost:5000/api/products/${editingProduct.id}`
      : "http://localhost:5000/api/products";

      const payload = {
        name: productData.name?.trim() ?? "",
        price: Number(productData.price ?? 0),
        description: productData.description ?? "",
        image: productData.image ?? "",
        categoryId: Number(productData.categoryId ?? 0),
      };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json(); 

    if (!response.ok) {
      console.error("Update failed:", json);
      alert(json?.error ?? "Update failed");
      return;
    }

      await fetchProducts(true);
      setShowForm(false);
      setEditingProduct(null);
      setProductData({ name: "", price: "", description: "", image: "", categoryId: "" });
    } catch (err) {
      console.error("❌ Failed to save product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
      }
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">📦 Manage Products</h1>

      <button
        className="flex items-center bg-[#d4a373] text-white py-2 px-6 rounded-lg hover:bg-[#b08968] mb-6 shadow-md transition"
        onClick={() => { setShowForm(true); setEditingProduct(null); setProductData({ name: '', price: '', description: '', image: '', categoryId: '' }); }}
      >
        <FaPlus className="mr-2" /> Add Product
      </button>

      <div className="overflow-x-auto max-h-[650px] overflow-y-auto border rounded-lg shadow-md">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#d4a373] text-white text-lg">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Description</th>
              <th className="p-4">Image</th>
              <th className="p-4">Category</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={`text-center ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                <td className="p-4 font-semibold">{product.id}</td>
                <td className="p-4">{product.name}</td>
                <td className="p-4 text-green-600 font-bold">${product.price}</td>
                <td className="p-4 text-gray-600">{product.description}</td>
                <td className="p-4 flex justify-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg shadow-md" />
                </td>
                <td className="p-4 text-gray-700">{product.categoryId}</td>
                <td className="p-4">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingProduct(product);
                      setProductData({
                        id: product.id,
                        name: product.name ?? "",
                        price: String(product.price ?? ""),
                        description: product.description ?? "",
                        image: product.image ?? "",
                        categoryId: String(product.categoryId ?? ""),
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800 transition mx-2"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition mx-2"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal Add/Edit Product */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-gray-800">
                <FaTimes size={20} />
              </button>
            </div>

            <input type="text" placeholder="Product Name" className="border p-2 mb-2 w-full"
              value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} />

            <input type="number" placeholder="Price" className="border p-2 mb-2 w-full"
              value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} />

            <input type="text" placeholder="Description" className="border p-2 mb-2 w-full"
              value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} />

            <input type="text" placeholder="Image URL" className="border p-2 mb-2 w-full"
              value={productData.image} onChange={(e) => setProductData({ ...productData, image: e.target.value })} />

            <input type="number" placeholder="Category ID" className="border p-2 mb-4 w-full"
              value={productData.categoryId} onChange={(e) => setProductData({ ...productData, categoryId: e.target.value })} />

            <div className="flex justify-end">
              <button onClick={handleSaveProduct} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                {editingProduct ? "Update" : "Save"}
              </button>
              <button onClick={() => setShowForm(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
