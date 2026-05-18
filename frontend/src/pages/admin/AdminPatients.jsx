import { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPatients = () => {
    api.get("/admin/patients").then(r => setPatients(r.data.data || [])).catch(() => {});
  };

  useEffect(() => { fetchPatients(); }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("Patient removed");
      fetchPatients();
    } catch { toast.error("Failed to remove patient"); }
  };

  const toggle = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-status`);
      fetchPatients();
    } catch { toast.error("Failed to update status"); }
  };

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manage Patients</h1>
        <p className="text-gray-500 text-sm">View and manage all registered patients</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Patient</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Phone</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">No patients found</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {p.name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{p.phone || "—"}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggle(p.id)} className={p.active ? "badge-green cursor-pointer" : "badge-red cursor-pointer"}>
                    {p.active ? "active" : "inactive"}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
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
