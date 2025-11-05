import { FaTachometerAlt, FaBoxOpen, FaClipboardList } from "react-icons/fa";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#d4a373] text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <nav>
          <ul className="space-y-3">
            <li>
              <a 
                href="/admin/dashboard" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-[#b08968] transition"
              >
                <FaTachometerAlt className="mr-3" /> Dashboard
              </a>
            </li>
            <li>
              <a 
                href="/admin/products" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-[#b08968] transition"
              >
                <FaBoxOpen className="mr-3" /> Products
              </a>
            </li>
            <li>
              <a 
                href="/admin/orders" 
                className="flex items-center py-3 px-4 rounded-lg hover:bg-[#b08968] transition"
              >
                <FaClipboardList className="mr-3" /> Orders
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-white shadow-md rounded-lg">
        {children}
      </main>
    </div>
  );
}
