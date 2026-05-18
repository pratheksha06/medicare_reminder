import { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const fetchDoctors = () => {
    api.get("/admin/doctors").then(r => setDoctors(r.data.data || [])).catch(() => {});
  };

  useEffect(() => { fetchDoctors(); }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("Doctor removed");
      fetchDoctors();
    } catch { toast.error("Failed to remove doctor"); }
  };

  const toggle = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-status`);
      fetchDoctors();
    } catch { toast.error("Failed to update status"); }
  };

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
        <p className="text-gray-500 text-sm">View and manage all registered doctors</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Doctor</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Phone</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">No doctors found</td></tr>
            ) : filtered.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                      {d.name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-gray-400">{d.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{d.phone || "—"}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggle(d.id)} className={d.active ? "badge-green cursor-pointer" : "badge-red cursor-pointer"}>
                    {d.active ? "active" : "inactive"}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(d.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={15} />
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
